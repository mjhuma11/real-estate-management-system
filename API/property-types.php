<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAllPropertyTypes();
        break;
    case 'POST':
        addPropertyType();
        break;
    case 'PUT':
        updatePropertyType();
        break;
    case 'DELETE':
        deletePropertyType();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllPropertyTypes() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM property_types ORDER BY name";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $propertyTypes = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $propertyTypes]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function addPropertyType() {
    global $conn;
    
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!isset($data['name']) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Property type name is required']);
            return;
        }
        
        $name = trim($data['name']);
        $description = $data['description'] ?? null;
        
        // Check if property type already exists
        $checkStmt = $conn->prepare("SELECT id FROM property_types WHERE name = ?");
        $checkStmt->execute([$name]);
        
        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Property type already exists']);
            return;
        }
        
        $stmt = $conn->prepare("INSERT INTO property_types (name, description) VALUES (?, ?)");
        $result = $stmt->execute([$name, $description]);
        
        if ($result) {
            $propertyTypeId = $conn->lastInsertId();
            echo json_encode([
                'success' => true,
                'message' => 'Property type added successfully',
                'property_type_id' => $propertyTypeId
            ]);
        } else {
            throw new Exception('Failed to add property type');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function updatePropertyType() {
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
        $description = $data['description'] ?? null;
        
        // Check if property type exists
        $checkStmt = $conn->prepare("SELECT id FROM property_types WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Property type not found']);
            return;
        }
        
        $stmt = $conn->prepare("UPDATE property_types SET name = ?, description = ? WHERE id = ?");
        $result = $stmt->execute([$name, $description, $id]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Property type updated successfully']);
        } else {
            throw new Exception('Failed to update property type');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function deletePropertyType() {
    global $conn;
    
    try {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Property type ID is required']);
            return;
        }
        
        // Check if property type exists
        $checkStmt = $conn->prepare("SELECT id FROM property_types WHERE id = ?");
        $checkStmt->execute([$id]);
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Property type not found']);
            return;
        }
        
        $stmt = $conn->prepare("DELETE FROM property_types WHERE id = ?");
        $result = $stmt->execute([$id]);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Property type deleted successfully']);
        } else {
            throw new Exception('Failed to delete property type');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>