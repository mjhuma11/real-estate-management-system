<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        updateProperty();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function updateProperty() {
    global $conn;
    
    try {
        // Get the request data
        $requestData = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!$requestData || !isset($requestData['id']) || !isset($requestData['title']) || !isset($requestData['type'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID, title and type are required fields'
            ]);
            return;
        }
        
        $id = $requestData['id'];
        
        // Check if property exists
        $checkStmt = $conn->prepare("SELECT id FROM properties WHERE id = :id");
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
        
        // Prepare the data
        $title = trim($requestData['title']);
        $description = $requestData['description'] ?? null;
        $price = $requestData['price'] ?? null;
        $monthly_rent = $requestData['monthly_rent'] ?? null;
        $type = $requestData['type']; // 'For Sale' or 'For Rent'
        $property_type_id = $requestData['property_type_id'] ?? null;
        $category_id = $requestData['category_id'] ?? null;
        $location_id = $requestData['location_id'] ?? null;
        $address = $requestData['address'] ?? null;
        $bedrooms = $requestData['bedrooms'] ?? null;
        $bathrooms = $requestData['bathrooms'] ?? null;
        $area = $requestData['area'] ?? null;
        $area_unit = $requestData['area_unit'] ?? 'sq_ft';
        $floor = $requestData['floor'] ?? null;
        $total_floors = $requestData['total_floors'] ?? null;
        $facing = $requestData['facing'] ?? null;
        $parking = $requestData['parking'] ?? 0;
        $balcony = $requestData['balcony'] ?? 0;
        $status = $requestData['status'] ?? 'available';
        $featured = $requestData['featured'] ?? 0;
        $agent_id = $requestData['agent_id'] ?? null;
        $virtual_tour_url = $requestData['virtual_tour_url'] ?? null;
        $video_url = $requestData['video_url'] ?? null;
        
        // Validate type
        if (!in_array($type, ['For Sale', 'For Rent'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Type must be either "For Sale" or "For Rent"'
            ]);
            return;
        }
        
        // Update the property
        $sql = "UPDATE properties SET 
                title = :title,
                description = :description,
                price = :price,
                monthly_rent = :monthly_rent,
                type = :type,
                property_type_id = :property_type_id,
                category_id = :category_id,
                location_id = :location_id,
                address = :address,
                bedrooms = :bedrooms,
                bathrooms = :bathrooms,
                area = :area,
                area_unit = :area_unit,
                floor = :floor,
                total_floors = :total_floors,
                facing = :facing,
                parking = :parking,
                balcony = :balcony,
                status = :status,
                featured = :featured,
                agent_id = :agent_id,
                virtual_tour_url = :virtual_tour_url,
                video_url = :video_url,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':monthly_rent', $monthly_rent);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':property_type_id', $property_type_id);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':location_id', $location_id);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':bedrooms', $bedrooms);
        $stmt->bindParam(':bathrooms', $bathrooms);
        $stmt->bindParam(':area', $area);
        $stmt->bindParam(':area_unit', $area_unit);
        $stmt->bindParam(':floor', $floor);
        $stmt->bindParam(':total_floors', $total_floors);
        $stmt->bindParam(':facing', $facing);
        $stmt->bindParam(':parking', $parking);
        $stmt->bindParam(':balcony', $balcony);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':featured', $featured);
        $stmt->bindParam(':agent_id', $agent_id);
        $stmt->bindParam(':virtual_tour_url', $virtual_tour_url);
        $stmt->bindParam(':video_url', $video_url);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Property updated successfully',
                'property_id' => $id
            ]);
        } else {
            throw new Exception('Failed to update property');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error updating property: ' . $e->getMessage()
        ]);
    }
}
?>
