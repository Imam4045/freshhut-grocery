<?php
// ═══════════════════════════════════════════════════════════════
//  FreshHut — MySQL Database Connection + Auto Setup
//  ▸ Automatically creates the DB, tables, and seeds all data
//    on first run — no manual steps required on any computer.
//  ▸ Safe for shared/free hosting: if the DB user isn't allowed
//    to CREATE DATABASE, that step is skipped instead of crashing.
// ═══════════════════════════════════════════════════════════════

if (session_status() === PHP_SESSION_NONE) {
    // Keep session alive for 8 hours of inactivity
    ini_set('session.gc_maxlifetime', 28800);
    session_set_cookie_params([
        'lifetime' => 28800,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

header("Content-Type: application/json");

// Allow credentials (session cookies) — wildcard '*' cannot be used with credentials.
// Reflect the request origin back if it is localhost/127.0.0.1 (covers all XAMPP ports).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit();
}

// ── Database Settings (Aiven MySQL — requires SSL) ──────────
// These read from environment variables (set in Render's dashboard,
// NOT written here) so this file is safe to commit to a public repo.
// The second argument to getenv() below is a local fallback for testing.
define('DB_HOST', getenv('DB_HOST') ?: 'mysql-138c0be4-imam220826-52d9.j.aivencloud.com');
define('DB_USER', getenv('DB_USER') ?: 'avnadmin');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'defaultdb');
define('DB_PORT', getenv('DB_PORT') ?: '18404');
// Path to Aiven's CA certificate — download it from the Aiven console
// (Get Started → Secure connection → download the CA certificate)
// and save it as config/ca.pem alongside this file. This file itself
// contains no secrets, so it's fine to commit to a public repo too.
define('DB_SSL_CA', __DIR__ . '/ca.pem');

// ── Auto Setup: runs only if 'users' table doesn't exist ──────
function runAutoSetup($host, $user, $pass, $db) {
    $dsn = "mysql:host=$host;port=" . DB_PORT . ";charset=utf8mb4";
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    if (defined('DB_SSL_CA') && file_exists(DB_SSL_CA)) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = DB_SSL_CA;
    }
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Try to create the database. On shared/free hosting the DB user
    // often isn't allowed to CREATE DATABASE — that's normal, since the
    // host already created one for you. Just skip it instead of failing.
    try {
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    } catch (PDOException $e) {
        // No permission to create databases — ignore and continue.
    }
    $pdo->exec("USE `$db`");

    // Check if already set up — skip table creation if tables exist,
    // but still make sure remember_token exists (auto-migrate older DBs).
    $tables = $pdo->query("SHOW TABLES LIKE 'users'")->fetchAll();
    if (!empty($tables)) {
        $col = $pdo->query("SHOW COLUMNS FROM users LIKE 'remember_token'")->fetchAll();
        if (empty($col)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN remember_token VARCHAR(64) DEFAULT NULL");
        }
        return;
    }

    // ── Create: users ─────────────────────────────────────────
    $pdo->exec("
        CREATE TABLE users (
            id             INT AUTO_INCREMENT PRIMARY KEY,
            name           VARCHAR(100)  NOT NULL,
            email          VARCHAR(150)  NOT NULL UNIQUE,
            password       VARCHAR(255)  NOT NULL,
            phone          VARCHAR(20)   DEFAULT '',
            address        TEXT,
            role           ENUM('customer','admin') DEFAULT 'customer',
            remember_token VARCHAR(64)   DEFAULT NULL,
            created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    ");

    // ── Create: categories ────────────────────────────────────
    $pdo->exec("
        CREATE TABLE categories (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(100) NOT NULL,
            created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB
    ");

    // ── Create: products ──────────────────────────────────────
    $pdo->exec("
        CREATE TABLE products (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(200)   NOT NULL,
            category_id INT            NOT NULL,
            price       DECIMAL(10,2)  NOT NULL DEFAULT 0,
            stock       INT            NOT NULL DEFAULT 0,
            description TEXT,
            image       VARCHAR(255)   DEFAULT 'default.jpg',
            created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    // ── Create: cart ──────────────────────────────────────────
    $pdo->exec("
        CREATE TABLE cart (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            user_id    INT NOT NULL,
            product_id INT NOT NULL,
            quantity   INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_cart (user_id, product_id),
            FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    // ── Create: orders ────────────────────────────────────────
    $pdo->exec("
        CREATE TABLE orders (
            id               INT AUTO_INCREMENT PRIMARY KEY,
            user_id          INT            NOT NULL,
            total_amount     DECIMAL(10,2)  NOT NULL DEFAULT 0,
            delivery_address TEXT           NOT NULL,
            payment_method   VARCHAR(50)    DEFAULT 'Cash on Delivery',
            status           ENUM('Pending','Confirmed','Processing','Out for Delivery','Delivered','Cancelled')
                             DEFAULT 'Pending',
            created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    // ── Create: order_items ───────────────────────────────────
    $pdo->exec("
        CREATE TABLE order_items (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            order_id   INT            NOT NULL,
            product_id INT            NOT NULL,
            quantity   INT            NOT NULL DEFAULT 1,
            price      DECIMAL(10,2)  NOT NULL,
            FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    ");

    // ── Seed: Admin user ──────────────────────────────────────
    $pdo->prepare(
        "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'admin')"
    )->execute(['Admin', 'admin@freshhut.com', password_hash('FreshHut_Admin_2026!', PASSWORD_DEFAULT), '01700000000', 'Dhaka, Bangladesh']);

    // ── Seed: Sample customer ─────────────────────────────────
    $pdo->prepare(
        "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'customer')"
    )->execute(['Rahim Ahmed', 'customer@test.com', password_hash('customer123', PASSWORD_DEFAULT), '01800000000', 'Mirpur, Dhaka']);

    // ── Seed: Categories (all 8) ──────────────────────────────
    $categories = [
        'Vegetables', 'Fruits', 'Dairy', 'Bakery',
        'Beverages', 'Snacks', 'Meats', 'Health & Organic'
    ];
    $catIds  = [];
    $catStmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    foreach ($categories as $cat) {
        $catStmt->execute([$cat]);
        $catIds[$cat] = (int)$pdo->lastInsertId();
    }

    // ── Seed: Products (all 24) ───────────────────────────────
    $products = [
        // Vegetables
        ['Fresh Tomatoes',       'Vegetables',       30,  100, 'Farm fresh red tomatoes picked daily'],
        ['Green Spinach (250g)', 'Vegetables',       20,  80,  'Organic farm fresh spinach'],
        ['Carrot (500g)',        'Vegetables',       35,  70,  'Fresh orange carrots, great for juicing'],
        ['Potato (1kg)',         'Vegetables',       45,  120, 'Fresh potatoes, multipurpose vegetable'],
        ['Onion (1kg)',          'Vegetables',       55,  90,  'Fresh red onions, essential cooking ingredient'],
        // Fruits
        ['Banana Bunch',         'Fruits',           60,  50,  'Fresh ripe bananas, naturally sweet'],
        ['Red Apple (1kg)',      'Fruits',           150, 40,  'Crispy imported red apples'],
        ['Mango (1kg)',          'Fruits',           120, 35,  'Sweet Rajshahi mangoes, seasonal special'],
        ['Orange (1kg)',         'Fruits',           110, 45,  'Juicy fresh oranges, rich in vitamin C'],
        // Dairy
        ['Fresh Milk (1L)',      'Dairy',            90,  60,  'Pure fresh cow milk, delivered daily'],
        ['Cheese Slice (200g)', 'Dairy',            120, 30,  'Processed cheese slices for sandwiches'],
        ['Yogurt (400g)',        'Dairy',            55,  45,  'Creamy plain yogurt'],
        ['Butter (200g)',        'Dairy',            95,  35,  'Fresh unsalted butter'],
        // Bakery
        ['Whole Wheat Bread',   'Bakery',           55,  45,  'Freshly baked whole wheat bread'],
        ['Croissant (4 pcs)',   'Bakery',           80,  25,  'Buttery flaky croissants, baked fresh'],
        // Beverages
        ['Orange Juice (1L)',   'Beverages',        110, 55,  'Freshly squeezed orange juice, no added sugar'],
        ['Mineral Water (2L)',  'Beverages',        25,  120, 'Pure mineral water'],
        ['Green Tea (25 bags)', 'Beverages',        85,  60,  'Premium green tea bags'],
        // Snacks
        ['Potato Chips (100g)', 'Snacks',           40,  90,  'Crispy lightly salted potato chips'],
        ['Mixed Nuts (200g)',   'Snacks',           180, 30,  'Assorted premium roasted nuts'],
        // Meats
        ['Chicken (1kg)',       'Meats',            220, 50,  'Fresh whole chicken, cleaned and ready to cook'],
        ['Beef (1kg)',          'Meats',            380, 40,  "Fresh cow's beef, tender cuts for cooking"],
        // Health & Organic
        ['Brown Rice (1kg)',    'Health & Organic', 95,  60,  'Whole grain brown rice, rich in fiber and nutrients'],
        ['Cooking Oil (2L)',    'Health & Organic', 390, 75,  'Pure healthy cooking oil, ideal for everyday cooking'],
    ];

    $prodStmt = $pdo->prepare(
        "INSERT INTO products (name, category_id, price, stock, description, image) VALUES (?,?,?,?,?,?)"
    );
    foreach ($products as [$name, $cat, $price, $stock, $desc]) {
        $prodStmt->execute([$name, $catIds[$cat], $price, $stock, $desc, 'default.jpg']);
    }
}

// ── Run auto setup silently before connecting ──────────────────
try {
    runAutoSetup(DB_HOST, DB_USER, DB_PASS, DB_NAME);
} catch (PDOException $e) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Auto setup failed: ' . $e->getMessage() . ' — Make sure MySQL is running in XAMPP!'
    ]);
    exit();
}

// ── Main connection ────────────────────────────────────────────
try {
    $mainOptions = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    if (defined('DB_SSL_CA') && file_exists(DB_SSL_CA)) {
        $mainOptions[PDO::MYSQL_ATTR_SSL_CA] = DB_SSL_CA;
    }
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        $mainOptions
    );
} catch (PDOException $e) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'DB connection failed: ' . $e->getMessage()
    ]);
    exit();
}

// ── Remember-me auto-login ────────────────────────────────────
// If there's no active session but a valid remember-me cookie exists,
// log the user back in automatically and rotate the token for security.
if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_token'])) {
    $parts = explode(':', $_COOKIE['remember_token'], 2);
    if (count($parts) === 2) {
        $uid       = (int)$parts[0];
        $rawToken  = $parts[1];
        $tokenHash = hash('sha256', $rawToken);

        $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ? AND remember_token = ?");
        $stmt->execute([$uid, $tokenHash]);
        $row = $stmt->fetch();

        if ($row) {
            $_SESSION['user_id']   = $row['id'];
            $_SESSION['user_role'] = $row['role'];

            // Rotate the token on every auto-login (limits damage if a cookie is ever stolen)
            $newRawToken  = bin2hex(random_bytes(32));
            $newTokenHash = hash('sha256', $newRawToken);
            $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?")->execute([$newTokenHash, $row['id']]);
            setcookie('remember_token', $row['id'] . ':' . $newRawToken, [
                'expires'  => time() + 60 * 60 * 24 * 30,
                'path'     => '/',
                'secure'   => true,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
        } else {
            // Stale or tampered cookie — clear it
            setcookie('remember_token', '', time() - 3600, '/');
        }
    }
}

// ── Helper: return all IDs as strings (JS uses .slice() on them)
function rowToArray($row) {
    if (!$row) return null;
    if (isset($row['id']))          $row['id']          = (string)$row['id'];
    if (isset($row['product_id']))  $row['product_id']  = (string)$row['product_id'];
    if (isset($row['category_id'])) $row['category_id'] = (string)$row['category_id'];
    if (isset($row['order_id']))    $row['order_id']    = (string)$row['order_id'];
    return $row;
}

function rowsToArray($rows) {
    return array_map('rowToArray', $rows);
}
?>
