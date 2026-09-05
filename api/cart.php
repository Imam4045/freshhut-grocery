<?php
require_once '../config/db.php';

// ── Auth guard ────────────────────────────────────────────────
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'login', 'message' => 'Please login to continue']);
    exit();
}
$userId = (int)$_SESSION['user_id'];

// ── Determine action ──────────────────────────────────────────
$action = $_GET['action'] ?? '';
$input  = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    if (!$action && isset($input['action'])) {
        $action = $input['action'];
    }
}

switch ($action) {

    // ── Cart item count ──────────────────────────────────────────
    case 'count':
        $stmt = $pdo->prepare(
            "SELECT COALESCE(SUM(quantity), 0) AS cnt FROM cart WHERE user_id = ?"
        );
        $stmt->execute([$userId]);
        echo json_encode(['count' => (int)$stmt->fetchColumn()]);
        break;

    // ── Get cart with product details ────────────────────────────
    case 'get':
        $stmt = $pdo->prepare("
            SELECT c.product_id, c.quantity,
                   p.name, p.price, p.stock, p.image
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY c.id DESC
        ");
        $stmt->execute([$userId]);
        $items = $stmt->fetchAll();

        // Cast IDs to string for JS compatibility
        $items = array_map(function($item) {
            $item['product_id'] = (string)$item['product_id'];
            return $item;
        }, $items);

        $total = array_sum(array_map(fn($i) => $i['price'] * $i['quantity'], $items));
        echo json_encode(['status' => 'success', 'items' => $items, 'total' => $total]);
        break;

    // ── Add item to cart ─────────────────────────────────────────
    case 'add':
        $productId = (int)($input['product_id'] ?? 0);
        if (!$productId) {
            echo json_encode(['status' => 'error', 'message' => 'Product ID required']); exit();
        }

        // Check product stock
        $stmt = $pdo->prepare("SELECT stock FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();

        if (!$product) {
            echo json_encode(['status' => 'error', 'message' => 'Product not found']); exit();
        }
        if ($product['stock'] <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Product is out of stock']); exit();
        }

        // Check existing cart entry
        $stmt = $pdo->prepare(
            "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?"
        );
        $stmt->execute([$userId, $productId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $newQty = $existing['quantity'] + 1;
            if ($newQty > $product['stock']) {
                echo json_encode(['status' => 'error', 'message' => 'Maximum stock reached']); exit();
            }
            $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?")
                ->execute([$newQty, $existing['id']]);
        } else {
            $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)")
                ->execute([$userId, $productId]);
        }

        echo json_encode(['status' => 'success', 'message' => 'Added to cart!']);
        break;

    // ── Update quantity ──────────────────────────────────────────
    case 'update':
        $productId = (int)($input['product_id'] ?? 0);
        $quantity  = (int)($input['quantity']   ?? 0);

        if ($quantity <= 0) {
            $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?")
                ->execute([$userId, $productId]);
        } else {
            $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?")
                ->execute([$quantity, $userId, $productId]);
        }
        echo json_encode(['status' => 'success']);
        break;

    // ── Remove item ──────────────────────────────────────────────
    case 'remove':
        $productId = (int)($input['product_id'] ?? 0);
        $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?")
            ->execute([$userId, $productId]);
        echo json_encode(['status' => 'success', 'message' => 'Item removed']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>
