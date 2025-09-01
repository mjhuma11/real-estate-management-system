<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAllAmenities();
        break;
    case 'POST':
        createAmenity();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}

function getAllAmenities() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM amenities WHERE status = 'active' ORDER BY category, name";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $amenities = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $amenities
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function createAmenity() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO amenities (name, icon, category) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([
            $input['name'],
            $input['icon'] ?? 'fas fa-check',
            $input['category'] ?? 'general'
        ]);
        
        if($result) {
            $amenityId = $conn->lastInsertId();
            echo json_encode([
                'success' => true,
                'id' => $amenityId,
                'message' => 'Amenity created successfully'
            ]);
        } else {
            throw new Exception('Failed to create amenity');
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error creating amenity: ' . $e->getMessage()
        ]);
    }
}
?>