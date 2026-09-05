<?php
require_once '../config/db.php';

// ── Auth guard ────────────────────────────────────────────────
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'login', 'message' => 'Please login to continue']);
    exit();
}
$userId   = (int)$_SESSION['user_id'];
$userRole = $_SESSION['user_role'] ?? 'customer';
$action   = $_GET['action'] ?? '';

switch ($action) {

    // ── Place order ──────────────────────────────────────────────
    case 'place':
        $input           = json_decode(file_get_contents('php://input'), true) ?? [];
        $address         = trim($input['address'] ?? '');
        $payment         = trim($input['payment'] ?? 'Cash on Delivery');
        $discountCode    = strtoupper(trim($input['discount_code'] ?? ''));
        $discountAmount  = (float)($input['discount_amount'] ?? 0);

        // Validate discount code server-side
        $validCodes = ['FRESH10' => 10];
        if ($discountCode && !isset($validCodes[$discountCode])) {
            $discountCode   = '';
            $discountAmount = 0;
        }

        if (!$address) {
            echo json_encode(['status' => 'error', 'message' => 'Delivery address is required']);
            exit();
        }

        // Get cart items
        $stmt = $pdo->prepare("
            SELECT c.product_id, c.quantity, p.price, p.stock, p.name
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        ");
        $stmt->execute([$userId]);
        $cartItems = $stmt->fetchAll();

        if (!$cartItems) {
            echo json_encode(['status' => 'error', 'message' => 'Your cart is empty']);
            exit();
        }

        // Verify stock for all items
        foreach ($cartItems as $item) {
            if ($item['quantity'] > $item['stock']) {
                echo json_encode([
                    'status'  => 'error',
                    'message' => "'{$item['name']}' only has {$item['stock']} units available"
                ]);
                exit();
            }
        }

        // Calculate total
        $subtotal = array_sum(array_map(fn($i) => $i['price'] * $i['quantity'], $cartItems));
        // Apply validated discount (cap discount at subtotal to avoid negative totals)
        if ($discountCode && isset($validCodes[$discountCode])) {
            $maxDiscount    = $subtotal * ($validCodes[$discountCode] / 100);
            $discountAmount = min((float)$discountAmount, $maxDiscount);
        } else {
            $discountAmount = 0;
        }
        $deliveryFee = $subtotal >= 500 ? 0 : 60;
        $total       = max(0, $subtotal + $deliveryFee - $discountAmount);

        // Begin transaction
        $pdo->beginTransaction();
        try {
            // Insert order
            $stmt = $pdo->prepare(
                "INSERT INTO orders (user_id, total_amount, delivery_address, payment_method, status, created_at)
                 VALUES (?, ?, ?, ?, 'Pending', NOW())"
            );
            $stmt->execute([$userId, $total, $address, $payment]);
            $orderId = (int)$pdo->lastInsertId();

            // Insert order items & reduce stock
            $itemStmt  = $pdo->prepare(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
            );
            $stockStmt = $pdo->prepare(
                "UPDATE products SET stock = stock - ? WHERE id = ?"
            );
            foreach ($cartItems as $item) {
                $itemStmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);
                $stockStmt->execute([$item['quantity'], $item['product_id']]);
            }

            // Clear cart
            $pdo->prepare("DELETE FROM cart WHERE user_id = ?")->execute([$userId]);

            $pdo->commit();
            echo json_encode(['status' => 'success', 'order_id' => (string)$orderId]);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Failed to place order: ' . $e->getMessage()]);
        }
        break;

    // ── My orders (customer) ─────────────────────────────────────
    case 'my_orders':
        $stmt = $pdo->prepare("
            SELECT o.id, o.total_amount, o.status, o.payment_method,
                   o.delivery_address, o.created_at, u.name AS customer
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll();

        // Attach items with product image + category
        $itemStmt2 = $pdo->prepare("
            SELECT oi.quantity, oi.price, p.name AS product_name, p.image,
                   c.name AS category
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE oi.order_id = ?
        ");
        $orders = array_map(function($o) use ($itemStmt2) {
            $itemStmt2->execute([$o['id']]);
            $o['items'] = $itemStmt2->fetchAll();
            $o['id']    = (string)$o['id'];
            return $o;
        }, $orders);

        echo json_encode(['status' => 'success', 'orders' => $orders]);
        break;

    // ── Order detail ─────────────────────────────────────────────
    case 'detail':
        $id = (int)($_GET['id'] ?? 0);

        // Customers can only see their own orders; admins see all
        $sql    = "SELECT o.*, u.name AS customer FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?";
        $params = [$id];
        if ($userRole !== 'admin') {
            $sql    .= " AND o.user_id = ?";
            $params[] = $userId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if (!$order) {
            echo json_encode(['status' => 'error', 'message' => 'Order not found']);
            exit();
        }
        $order['id'] = (string)$order['id'];

        // Order items
        $stmt = $pdo->prepare("
            SELECT oi.quantity, oi.price, p.name, p.image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$id]);
        $items = $stmt->fetchAll();

        echo json_encode(['status' => 'success', 'order' => $order, 'items' => $items]);
        break;

    // ── All orders (admin only) ──────────────────────────────────
    case 'all_orders':
        if ($userRole !== 'admin') {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']); exit();
        }
        $stmt = $pdo->query("
            SELECT o.id, o.total_amount, o.status, o.payment_method,
                   o.delivery_address, o.created_at,
                   u.name AS customer, u.email AS customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll();

        // Attach items to each order with full product detail
        $itemStmt = $pdo->prepare("
            SELECT oi.quantity, oi.price, p.name AS product_name, p.image,
                   c.name AS category
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE oi.order_id = ?
        ");
        $orders = array_map(function($o) use ($itemStmt) {
            $itemStmt->execute([$o['id']]);
            $o['items'] = $itemStmt->fetchAll();
            $o['id']    = (string)$o['id'];
            return $o;
        }, $orders);

        echo json_encode(['status' => 'success', 'orders' => $orders]);
        break;

    // ── Update order status (admin only) ─────────────────────────
    case 'update_status':
        if ($userRole !== 'admin') {
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']); exit();
        }
        $input   = json_decode(file_get_contents('php://input'), true) ?? [];
        $orderId = (int)($input['order_id'] ?? 0);
        $status  = $input['status'] ?? '';

        $valid = ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!in_array($status, $valid)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid status']); exit();
        }

        $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?")
            ->execute([$status, $orderId]);

        echo json_encode(['status' => 'success', 'message' => 'Order status updated']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>
