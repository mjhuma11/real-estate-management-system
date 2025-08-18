<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getProperty();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getProperty() {
    global $conn;
    
    try {
        // Get property ID from query parameters
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Property ID is required'
            ]);
            return;
        }
        
        // Get property with related data
        $sql = "SELECT 
                    p.*,
                    c.name as category_name,
                    l.name as location_name,
                    u.username as agent_name,
                    u.email as agent_email
                FROM properties p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN locations l ON p.location_id = l.id
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE p.id = :id";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Property not found'
            ]);
            return;
        }
        
        $property = $stmt->fetch();
        
        // Get property features
        $featureSql = "SELECT f.id, f.name, f.icon
                       FROM property_features pf
                       JOIN features f ON pf.feature_id = f.id
                       WHERE pf.property_id = :property_id";
        
        $featureStmt = $conn->prepare($featureSql);
        $featureStmt->bindParam(':property_id', $id);
        $featureStmt->execute();
        $features = $featureStmt->fetchAll();
        
        $property['features'] = $features;
        
        echo json_encode([
            'success' => true,
            'property' => $property
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error fetching property: ' . $e->getMessage()
        ]);
    }
}
?>
