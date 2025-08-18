<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'netro-estate');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Set response content type
header("Content-Type: application/json");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // First, connect without specifying database
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
    $dbExists = $stmt->rowCount() > 0;
    
    if (!$dbExists) {
        // Create database
        $pdo->exec("CREATE DATABASE `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo json_encode([
            'success' => true,
            'message' => 'Database created successfully',
            'database' => DB_NAME
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Database already exists',
            'database' => DB_NAME
        ]);
    }
    
    // Now connect to the specific database
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    $usersTableExists = $stmt->rowCount() > 0;
    
    if (!$usersTableExists) {
        // Create users table
        $sql = "CREATE TABLE `users` (
            `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `username` varchar(50) NOT NULL,
            `email` varchar(100) NOT NULL,
            `password` varchar(255) NOT NULL,
            `role` enum('customer','agent','admin') NOT NULL DEFAULT 'customer',
            `email_verified_at` timestamp NULL DEFAULT NULL,
            `remember_token` varchar(100) DEFAULT NULL,
            `status` enum('active','inactive','suspended') DEFAULT 'active',
            `last_login_at` timestamp NULL DEFAULT NULL,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`id`),
            UNIQUE KEY `email` (`email`),
            KEY `idx_users_role` (`role`),
            KEY `idx_users_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $conn->exec($sql);
        
        // Insert default admin user
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['admin', 'admin@netro-realestate.com', $hashedPassword, 'admin']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Users table created and default admin user added',
            'admin_credentials' => [
                'email' => 'admin@netro-realestate.com',
                'password' => 'admin123'
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Users table already exists',
            'database' => DB_NAME
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database setup failed: ' . $e->getMessage(),
        'database' => DB_NAME
    ]);
}
?>
