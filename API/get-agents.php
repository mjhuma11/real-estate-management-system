<?php
// Start output buffering to prevent any unwanted output
ob_start();

// Set CORS headers first - moved to a function for consistency
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
}

// Set CORS headers immediately
setCORSHeaders();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean(); // Clear buffer
    exit(0);
}

// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
error_reporting(0); // Turn off all error reporting

// Database connection
try {
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    ob_end_flush(); // Send output
    exit;
}

try {
    // Check if users table exists first
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() == 0) {
        // If users table doesn't exist, return empty array
        echo json_encode([
            'success' => true,
            'data' => [],
            'count' => 0,
            'message' => 'Users table not found'
        ]);
        ob_end_flush(); // Send output
        exit;
    }

    // Check what columns exist in users table
    $stmt = $conn->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Build query based on available columns
    $selectFields = ['id'];
    if (in_array('username', $columns)) $selectFields[] = 'username';
    if (in_array('email', $columns)) $selectFields[] = 'email';
    if (in_array('full_name', $columns)) $selectFields[] = 'full_name';
    if (in_array('role', $columns)) $selectFields[] = 'role';

    $sql = "SELECT " . implode(', ', $selectFields) . " FROM users";

    // Add WHERE clause if role column exists
    if (in_array('role', $columns)) {
        $sql .= " WHERE role IN ('agent', 'admin')";
    }

    $sql .= " ORDER BY " . (in_array('username', $columns) ? 'username' : 'id') . " ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $agents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data
    foreach ($agents as &$agent) {
        $agent['display_name'] = isset($agent['full_name']) && $agent['full_name']
            ? $agent['full_name']
            : (isset($agent['username']) ? $agent['username'] : 'User ' . $agent['id']);
        $agent['role_badge'] = isset($agent['role']) && $agent['role'] === 'admin' ? 'Admin' : 'Agent';
    }

    echo json_encode([
        'success' => true,
        'data' => $agents,
        'count' => count($agents),
        'available_columns' => $columns
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch agents',
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} finally {
    // Close connection
    $conn = null;
    ob_end_flush(); // Send output
}
?>