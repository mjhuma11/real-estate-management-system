<?php
// Debug script for booking issues
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // Test database connection
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Test if appointments table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'appointments'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            'success' => false,
            'message' => 'Appointments table does not exist',
            'debug' => 'Table check failed'
        ]);
        exit;
    }
    
    // Get table structure
    $stmt = $conn->query("DESCRIBE appointments");
    $columns = $stmt->fetchAll();
    
    // Test a simple query
    $stmt = $conn->query("SELECT COUNT(*) as count FROM appointments");
    $result = $stmt->fetch();
    
    echo json_encode([
        'success' => true,
        'message' => 'Database and appointments table are working',
        'table_exists' => true,
        'record_count' => $result['count'],
        'columns' => array_column($columns, 'Field')
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage(),
        'error_type' => 'database_error'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'General error',
        'error' => $e->getMessage(),
        'error_type' => 'general_error'
    ]);
}
?>