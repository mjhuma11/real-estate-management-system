<?php
// Full test of booking functionality
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Database connection
    $conn = new PDO("mysql:host=localhost;dbname=netro-estate", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Check if required tables exist
    $tables = ['appointments', 'users', 'properties'];
    $missingTables = [];
    
    foreach ($tables as $table) {
        $stmt = $conn->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() == 0) {
            $missingTables[] = $table;
        }
    }
    
    if (!empty($missingTables)) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing required tables: ' . implode(', ', $missingTables)
        ]);
        exit;
    }
    
    // Test inserting a sample booking
    $sql = "INSERT INTO appointments (
        user_id, property_id, booking_type, booking_date, status, created_at
    ) VALUES (?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([1, 1, 'sale', '2025-10-10', 'pending']);
    
    if ($result) {
        $insertId = $conn->lastInsertId();
        // Delete test record
        $conn->prepare("DELETE FROM appointments WHERE id = ?")->execute([$insertId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Full booking test successful',
            'database_connection' => 'OK',
            'table_structure' => 'OK',
            'insert_test' => 'OK'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to insert test record'
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'General error: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>