<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAllLocations();
        break;
    case 'POST':
        addLocation();
        break;
    case 'PUT':
        updateLocation();
        break;
    case 'DELETE':
        deleteLocation();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllLocations() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM locations ORDER BY type, name";
        
        if(isset($_GET['type']) && !empty($_GET['type'])) {
            $sql = "SELECT * FROM locations WHERE type = ? ORDER BY name";
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

function addLocation() {
    global $conn;
    
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!isset($data['name']) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Location name is required']);
            return;
        }
        
        $name = trim($data['name']);
        $type = $data['type'] ?? 'area';
        
        // Check if location already exists
        $checkStmt = $conn->prepare("SELECT id FROM locations WHERE name = ? AND type = ?");
        $checkStmt->execute([$name, $type]);
        
        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Location already exists']);
            return;
        }
        
        $stmt = $conn->prepare("INSERT INTO locations (name, type) VALUES (?, ?)");
        $result = $stmt->execute([$name, $type]);
        
        if ($result) {
            $locationId = $conn->lastInsertId();
            echo json_encode([
                'success' => true,
                'message' => 'Location added successfully',
                'location_id' => $locationId
            ]);
        } else {
            throw new Exception('Failed to add location');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function updateLocation() {
    global $conn;
    
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!isset($data['id']) || !isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID and name are required']);
            return;
        }
        
        $id = $data['id'];
        $name = trim($data['name']);
        $type = $data['type'] ?? 'area';
        
        // Check if location exists
        $checkStmt = $conn->prepare("SELECT id FROM locations WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Location not found']);
            return;
        }
        
        $stmt = $conn->prepare("UPDATE locations SET name = ?, type = ? WHERE id = ?");
        $result = $stmt->execute([$name, $type, $id]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Location updated successfully']);
        } else {
            throw new Exception('Failed to update location');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function deleteLocation() {
    global $conn;
    
    try {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Location ID is required']);
            return;
        }
        
        // Check if location exists
        $checkStmt = $conn->prepare("SELECT id FROM locations WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Location not found']);
            return;
        }
        
        $stmt = $conn->prepare("DELETE FROM locations WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Location deleted successfully']);
        } else {
            throw new Exception('Failed to delete location');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>