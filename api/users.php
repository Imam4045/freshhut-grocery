<?php
require_once '../config/db.php';

if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

$action = $_GET['action'] ?? '';

switch ($action) {

    case 'list':
        $stmt = $pdo->query("
            SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.created_at,
                   COUNT(o.id) AS order_count,
                   COALESCE(SUM(o.total_amount),0) AS total_spent
            FROM users u
            LEFT JOIN orders o ON o.user_id = u.id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        ");
        echo json_encode(['status' => 'success', 'users' => $stmt->fetchAll()]);
        break;

    case 'update_role':
        $input  = json_decode(file_get_contents('php://input'), true) ?? [];
        $id     = (int)($input['id'] ?? 0);
        $role   = $input['role'] ?? 'customer';
        if (!in_array($role, ['admin', 'customer'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid role']);
            exit();
        }
        $pdo->prepare("UPDATE users SET role=? WHERE id=?")->execute([$role, $id]);
        echo json_encode(['status' => 'success']);
        break;

    case 'delete':
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id    = (int)($input['id'] ?? 0);
        if ($id === (int)$_SESSION['user_id']) {
            echo json_encode(['status' => 'error', 'message' => 'Cannot delete yourself']);
            exit();
        }
        $pdo->prepare("DELETE FROM users WHERE id=?")->execute([$id]);
        echo json_encode(['status' => 'success']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Unknown action']);
}
