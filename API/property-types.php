<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAllPropertyTypes();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllPropertyTypes() {
    global $conn;
    
    try {
        $sql = "SELECT pt.*, c.name as category_name 
                FROM property_types pt
                LEFT JOIN categories c ON pt.category_id = c.id
                WHERE pt.status = 'active' 
                ORDER BY c.name, pt.name";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $propertyTypes = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $propertyTypes]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>