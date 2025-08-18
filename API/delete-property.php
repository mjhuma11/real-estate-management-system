<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
            // Delete property features first
            $featureStmt = $conn->prepare("DELETE FROM property_features WHERE property_id = :property_id");
            $featureStmt->bindParam(':property_id', $id);
            $featureStmt->execute();
            
            // Delete property views
            $viewStmt = $conn->prepare("DELETE FROM property_views WHERE property_id = :property_id");
            $viewStmt->bindParam(':property_id', $id);
            $viewStmt->execute();
            
            // Delete user favorites
            $favoriteStmt = $conn->prepare("DELETE FROM user_favorites WHERE property_id = :property_id");
            $favoriteStmt->bindParam(':property_id', $id);
            $favoriteStmt->execute();
            
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
