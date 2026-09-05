<?php
/**
 * reset_once.php — ONE-TIME maintenance script.
 *
 * ⚠️ DESTRUCTIVE: this deletes EVERYTHING in the database — all products,
 * categories, users, carts, and orders. After running it, visiting any
 * page of the site will make db.php's runAutoSetup() rebuild the schema
 * and reseed it from the corrected data in config/db.php (real images,
 * correct prices).
 *
 * Visit this file once in your browser, confirm you see "Reset complete",
 * then DELETE this file from your project and redeploy.
 */

header('Content-Type: text/plain');

define('DB_HOST', getenv('DB_HOST') ?: 'mysql-138c0be4-imam220826-52d9.j.aivencloud.com');
define('DB_USER', getenv('DB_USER') ?: 'avnadmin');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'defaultdb');
define('DB_PORT', getenv('DB_PORT') ?: '18404');
define('DB_SSL_CA', __DIR__ . '/config/ca.pem');

// Require a confirmation query param so this can't be triggered by accident
// (e.g. a bot crawling the URL). Visit as: reset_once.php?confirm=yes
if (($_GET['confirm'] ?? '') !== 'yes') {
    die("Safety check: add ?confirm=yes to the URL to actually run this.\n" .
        "Example: reset_once.php?confirm=yes\n");
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    if (file_exists(DB_SSL_CA)) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = DB_SSL_CA;
    }
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

// Children first, but FK checks are off anyway so order doesn't strictly matter
$tables = ['order_items', 'cart', 'orders', 'products', 'categories', 'users'];

foreach ($tables as $table) {
    try {
        $pdo->exec("DROP TABLE IF EXISTS `$table`");
        echo "Dropped table: {$table}\n";
    } catch (PDOException $e) {
        echo "Could not drop {$table}: " . $e->getMessage() . "\n";
    }
}

$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "\nReset complete. All tables removed.\n";
echo "Now visit your site's homepage (or any page) once — db.php will detect\n";
echo "the missing 'users' table and automatically recreate + reseed everything\n";
echo "with the corrected data (real images, correct prices).\n";
echo "Then delete both reset_once.php AND fix_once.php from your project.\n";
