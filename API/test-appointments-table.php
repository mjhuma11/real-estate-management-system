<?php
// Test appointments table connection and structure
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Database connection
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Test if appointments table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'appointments'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            'success' => false,
            'message' => 'Appointments table does not exist'
        ]);
        exit;
    }
    
    // Get table structure
    $stmt = $conn->query("DESCRIBE appointments");
    $columns = $stmt->fetchAll();
    
    // Test inserting a sample record
    $stmt = $conn->prepare("INSERT INTO appointments (
        user_id, property_id, booking_type, booking_date, status, created_at
    ) VALUES (?, ?, ?, ?, ?, NOW())");
    
    $testInsert = $stmt->execute([1, 1, 'sale', '2025-10-10', 'pending']);
    
    if ($testInsert) {
        $insertId = $conn->lastInsertId();
        // Delete test record
        $conn->prepare("DELETE FROM appointments WHERE id = ?")->execute([$insertId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Appointments table is working correctly',
            'columns' => $columns,
            'test_insert' => true
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to insert test record',
            'columns' => $columns
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>