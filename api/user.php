<?php
require_once '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'login']);
    exit();
}

$userId = (int)$_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

/* ── GET: fetch profile ─────────────────────────────────────── */
if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT id, name, email, phone, address FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    echo json_encode(['status' => 'success', 'user' => $stmt->fetch()]);
    exit();
}

/* ── POST: update profile ───────────────────────────────────── */
if ($method === 'POST') {
    $input  = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? 'update';

    if ($action === 'update') {
        $name    = trim($input['name']    ?? '');
        $phone   = trim($input['phone']   ?? '');
        $address = trim($input['address'] ?? '');

        if (!$name) {
            echo json_encode(['status' => 'error', 'message' => 'Name is required']);
            exit();
        }

        $stmt = $pdo->prepare("UPDATE users SET name=?, phone=?, address=? WHERE id=?");
        $stmt->execute([$name, $phone, $address, $userId]);
        echo json_encode(['status' => 'success', 'message' => 'Profile updated']);
        exit();
    }

    echo json_encode(['status' => 'error', 'message' => 'Unknown action']);
    exit();
}
