<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAllLocations();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllLocations() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM locations WHERE status = 'active' ORDER BY type, name";
        
        if(isset($_GET['type']) && !empty($_GET['type'])) {
            $sql = "SELECT * FROM locations WHERE status = 'active' AND type = ? ORDER BY name";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$_GET['type']]);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
        }
        
        $locations = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $locations]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>