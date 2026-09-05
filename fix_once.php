<?php
/**
 * fix_once.php — ONE-TIME maintenance script.
 * Visit this file once in your browser (e.g. https://yoursite.onrender.com/fix_once.php)
 * to patch the products already sitting in your Aiven database with the
 * correct real image filenames and the corrected Beef price.
 *
 * ⚠️ DELETE THIS FILE (or remove it from your repo and redeploy) once you've
 * run it successfully. Leaving it live means anyone who finds the URL can
 * re-run it — harmless here since it's idempotent, but it's good hygiene
 * to not leave maintenance scripts on a public site.
 */

header('Content-Type: text/plain');

define('DB_HOST', getenv('DB_HOST') ?: 'mysql-138c0be4-imam220826-52d9.j.aivencloud.com');
define('DB_USER', getenv('DB_USER') ?: 'avnadmin');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'defaultdb');
define('DB_PORT', getenv('DB_PORT') ?: '18404');
define('DB_SSL_CA', __DIR__ . '/config/ca.pem');

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

// [name => [image filename, price-or-null]]
$fixes = [
    'Yogurt (400g)'        => ['prod_69e71de61a7997.06003742.jpeg', null],
    'Mineral Water (2L)'   => ['prod_69e71924998614.63243403.jpeg', null],
    'Green Tea (25 bags)'  => ['prod_69e71be433e6b8.20152549.jpeg', null],
    'Potato Chips (100g)'  => ['prod_69e719f8647510.01744592.jpeg', null],
    'Mixed Nuts (200g)'    => ['prod_69e738f261ea54.41411868.jpeg', null],
    'Chicken (1kg)'        => ['prod_69e7397ec496b2.91489391.jpeg', null],
    'Beef (1kg)'           => ['prod_69e73b3fe92557.06240149.jpeg', 850.00],
    'Brown Rice (1kg)'     => ['prod_69e73d8b0d7fa4.22641328.jpeg', null],
    'Cooking Oil (2L)'     => ['prod_69e740ad9e8487.33473068.jpeg', null],
];

$updated = 0;
foreach ($fixes as $name => [$image, $price]) {
    if ($price !== null) {
        $stmt = $pdo->prepare("UPDATE products SET image = ?, price = ? WHERE name = ?");
        $ok = $stmt->execute([$image, $price, $name]);
    } else {
        $stmt = $pdo->prepare("UPDATE products SET image = ? WHERE name = ?");
        $ok = $stmt->execute([$image, $name]);
    }
    $rows = $stmt->rowCount();
    echo ($ok ? "OK  " : "FAIL") . " — {$name}: {$rows} row(s) updated\n";
    $updated += $rows;
}

echo "\nDone. {$updated} row(s) touched.\n";
echo "Now hard-refresh your site (Ctrl+Shift+R) to see the real images.\n";
echo "Remember to delete this file from your project afterward.\n";
