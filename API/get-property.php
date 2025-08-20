<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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
                    pt.name as property_type_name,
                    u.username as agent_name,
                    u.email as agent_email
                FROM properties p
                LEFT JOIN property_types pt ON p.property_type_id = pt.id
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
        
        // Get property amenities (if amenities table exists)
        try {
            $amenitySql = "SELECT a.id, a.name
                           FROM property_amenities pa
                           JOIN amenities a ON pa.amenity_id = a.id
                           WHERE pa.property_id = :property_id";
            
            $amenityStmt = $conn->prepare($amenitySql);
            $amenityStmt->bindParam(':property_id', $id);
            $amenityStmt->execute();
            $amenities = $amenityStmt->fetchAll();
            
            $property['amenities'] = $amenities;
        } catch (Exception $e) {
            // If amenities table doesn't exist, set empty array
            $property['amenities'] = [];
        }
        
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
