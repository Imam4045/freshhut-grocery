<?php
require_once '../config/db.php';

if (isset($_SESSION['user_id'])) {
    $pdo->prepare("UPDATE users SET remember_token = NULL WHERE id = ?")->execute([$_SESSION['user_id']]);
}
setcookie('remember_token', '', time() - 3600, '/');

$_SESSION = [];
session_destroy();
echo json_encode(['status' => 'success', 'message' => 'Logged out']);
?>
