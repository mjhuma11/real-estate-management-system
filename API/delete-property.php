<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        deleteProperty();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function deleteProperty() {
    global $conn;
    
    try {
        // Get the request data
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!$requestData || !isset($requestData['id'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Property ID is required'
            ]);
            return;
        }
        
        $id = $requestData['id'];
        
        // Check if property exists
        $checkStmt = $conn->prepare("SELECT id, title FROM properties WHERE id = :id");
        $checkStmt->bindParam(':id', $id);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Property not found'
            ]);
            return;
        }
        
        $property = $checkStmt->fetch();
        
        // Start transaction
        $conn->beginTransaction();
        
        try {
            // Delete related records first (if they exist)
            try {
                $amenityStmt = $conn->prepare("DELETE FROM property_amenities WHERE property_id = :property_id");
                $amenityStmt->bindParam(':property_id', $id);
                $amenityStmt->execute();
            } catch (Exception $e) {
                // Table might not exist, continue
            }
            
            try {
                $imageStmt = $conn->prepare("DELETE FROM property_images WHERE property_id = :property_id");
                $imageStmt->bindParam(':property_id', $id);
                $imageStmt->execute();
            } catch (Exception $e) {
                // Table might not exist, continue
            }
            
            // Delete the property
            $deleteStmt = $conn->prepare("DELETE FROM properties WHERE id = :id");
            $deleteStmt->bindParam(':id', $id);
            $deleteStmt->execute();
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Property "' . $property['title'] . '" deleted successfully',
                'property_id' => $id
            ]);
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            throw $e;
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error deleting property: ' . $e->getMessage()
        ]);
    }
}
?>
