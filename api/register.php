<?php
require_once '../config/db.php';

$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';
$phone    = trim($data['phone']    ?? '');
$address  = trim($data['address']  ?? '');

// ── Validation ─────────────────────────────────────────────────
if (!$name || !$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Name, email and password are required']);
    exit();
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit();
}
if (strlen($password) < 6) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters']);
    exit();
}

// ── Check duplicate email ──────────────────────────────────────
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
    exit();
}

// ── Insert user ────────────────────────────────────────────────
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt   = $pdo->prepare(
    "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'customer')"
);
$stmt->execute([$name, $email, $hashed, $phone, $address]);

echo json_encode(['status' => 'success', 'message' => 'Account created successfully! You can now login.']);
?>
