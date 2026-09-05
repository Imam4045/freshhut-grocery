<?php
require_once '../config/db.php';

$data     = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';
$remember =      $data['remember'] ?? false;

if (!$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password required']);
    exit();
}

// ── Fetch user ─────────────────────────────────────────────────
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
    exit();
}

// ── Start session ──────────────────────────────────────────────
$_SESSION['user_id']   = $user['id'];
$_SESSION['user_role'] = $user['role'];

// ── Remember me ───────────────────────────────────────────────
if ($remember) {
    $rawToken  = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $rawToken);
    $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?")->execute([$tokenHash, $user['id']]);
    setcookie('remember_token', $user['id'] . ':' . $rawToken, [
        'expires'  => time() + 60 * 60 * 24 * 30, // 30 days
        'path'     => '/',
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
} else {
    // Not checked — clear any old token so a stale cookie can't log back in
    $pdo->prepare("UPDATE users SET remember_token = NULL WHERE id = ?")->execute([$user['id']]);
    setcookie('remember_token', '', time() - 3600, '/');
}

echo json_encode([
    'status' => 'success',
    'user'   => [
        'id'      => (string)$user['id'],
        'name'    => $user['name'],
        'email'   => $user['email'],
        'phone'   => $user['phone']   ?? '',
        'address' => $user['address'] ?? '',
        'role'    => $user['role'],
    ]
]);
?>
