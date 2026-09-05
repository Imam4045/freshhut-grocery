<?php
require_once '../config/db.php';

$action = $_GET['action'] ?? '';

switch ($action) {

    // ── List categories ──────────────────────────────────────────
    case 'categories':
        $stmt = $pdo->query("SELECT c.id, c.name, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id, c.name ORDER BY c.name");
        $cats = rowsToArray($stmt->fetchAll());
        echo json_encode(['status' => 'success', 'categories' => $cats]);
        break;

    // ── List / search products ───────────────────────────────────
    case 'list':
        $cat    = $_GET['cat']    ?? '0';
        $search = trim($_GET['search'] ?? '');

        $sql    = "SELECT p.id, p.name, p.price, p.stock, p.description,
                          p.image, p.category_id, c.name AS category
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   WHERE 1=1";
        $params = [];

        if ($cat && $cat !== '0') {
            $sql     .= " AND p.category_id = ?";
            $params[] = (int)$cat;
        }
        if ($search !== '') {
            $sql     .= " AND (p.name LIKE ? OR p.description LIKE ?)";
            $like     = "%$search%";
            $params[] = $like;
            $params[] = $like;
        }
        $sql .= " ORDER BY p.id DESC";

        $limit = (int)($_GET['limit'] ?? 0);
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['status' => 'success', 'products' => rowsToArray($stmt->fetchAll())]);
        break;

    // ── Get single product by id ─────────────────────────────────
    case 'get':
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) { echo json_encode(['status'=>'error','message'=>'Invalid id']); break; }
        $stmt = $pdo->prepare("SELECT p.id, p.name, p.price, p.stock, p.description,
                                      p.image, p.category_id, c.name AS category
                               FROM products p
                               LEFT JOIN categories c ON p.category_id = c.id
                               WHERE p.id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) { echo json_encode(['status'=>'error','message'=>'Not found']); break; }
        $product = rowsToArray([$row])[0];
        echo json_encode(['status' => 'success', 'product' => $product]);
        break;

    // ── Add product (admin only) ─────────────────────────────────
    case 'add':
        adminOnly();
        $name  = trim($_POST['name']        ?? '');
        $catId = (int)($_POST['category_id'] ?? 0);
        $price = (float)($_POST['price']     ?? 0);
        $stock = (int)($_POST['stock']       ?? 0);
        $desc  = trim($_POST['description']  ?? '');
        $image = 'default.jpg';

        if (!$name || !$catId || $price <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Name, category and price are required']);
            exit();
        }
        if (isset($_FILES['image']) && $_FILES['image']['tmp_name']) {
            $image = uploadImage();
        }

        $stmt = $pdo->prepare(
            "INSERT INTO products (name, category_id, price, stock, description, image) VALUES (?,?,?,?,?,?)"
        );
        $stmt->execute([$name, $catId, $price, $stock, $desc, $image]);
        echo json_encode(['status' => 'success', 'message' => 'Product added successfully']);
        break;

    // ── Update product (admin only) ──────────────────────────────
    case 'update':
        adminOnly();
        $id    = (int)($_POST['id']           ?? 0);
        $name  = trim($_POST['name']          ?? '');
        $catId = (int)($_POST['category_id']  ?? 0);
        $price = (float)($_POST['price']      ?? 0);
        $stock = (int)($_POST['stock']        ?? 0);
        $desc  = trim($_POST['description']   ?? '');
        $image = $_POST['existing_image']     ?? 'default.jpg';

        if (!$id || !$name || !$catId || $price <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid product data']);
            exit();
        }
        if (isset($_FILES['image']) && $_FILES['image']['tmp_name']) {
            $image = uploadImage();
        }

        $stmt = $pdo->prepare(
            "UPDATE products SET name=?, category_id=?, price=?, stock=?, description=?, image=? WHERE id=?"
        );
        $stmt->execute([$name, $catId, $price, $stock, $desc, $image, $id]);
        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
        break;

    // ── Delete product (admin only) ──────────────────────────────
    case 'delete':
        adminOnly();
        $id   = (int)($_GET['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Product deleted']);
        break;


    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}

// ── Helpers ──────────────────────────────────────────────────────
function adminOnly() {
    if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'admin') {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit();
    }
}

function uploadImage() {
    $uploadDir = '../uploads/products/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $file    = $_FILES['image'];
    $ext     = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($ext, $allowed) || $file['error'] !== UPLOAD_ERR_OK) {
        return 'default.jpg';
    }
    $filename = uniqid('prod_', true) . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
        return $filename;
    }
    return 'default.jpg';
}
?>
