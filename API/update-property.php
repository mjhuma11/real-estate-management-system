<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
    case 'PUT':
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
        $input = file_get_contents('php://input');
        $requestData = json_decode($input, true);
        
        // Debug: Log the received data
        error_log("Update received data: " . print_r($requestData, true));
        
        // Validate required fields
        if (!$requestData || !isset($requestData['id']) || !isset($requestData['title']) || !isset($requestData['type'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID, title and type are required fields',
                'received_data' => $requestData
            ]);
            return;
        }
        
        $id = $requestData['id'];
        
        // Check if property exists
        $checkStmt = $conn->prepare("SELECT id FROM properties WHERE id = ?");
        $checkStmt->execute([$id]);
        
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
        $slug = isset($requestData['slug']) && !empty($requestData['slug']) ? $requestData['slug'] : createSlug($title);
        $description = $requestData['description'] ?? null;
        $price = $requestData['price'] ?? null;
        $monthly_rent = $requestData['monthly_rent'] ?? null;
        $type = $requestData['type']; // 'For Sale' or 'For Rent'
        $propertyType = $requestData['propertyType'] ?? null;
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
        $created_by = $requestData['created_by'] ?? null;
        
        // Validate type
        if (!in_array($type, ['For Sale', 'For Rent'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Type must be either "For Sale" or "For Rent"'
            ]);
            return;
        }
        
        // Check if slug already exists for other properties
        $checkSlugStmt = $conn->prepare("SELECT id FROM properties WHERE slug = ? AND id != ?");
        $checkSlugStmt->execute([$slug, $id]);
        
        if ($checkSlugStmt->rowCount() > 0) {
            // If slug exists, add a number to make it unique
            $counter = 1;
            $originalSlug = $slug;
            do {
                $slug = $originalSlug . '-' . $counter;
                $checkSlugStmt->execute([$slug, $id]);
                $counter++;
            } while ($checkSlugStmt->rowCount() > 0);
        }
        
        // Handle image update
        $image = $requestData['image'] ?? null;
        
        // Update the property
        $sql = "UPDATE properties SET 
            title = ?, slug = ?, description = ?, price = ?, monthly_rent = ?, type = ?, 
            property_type_id = ?, address = ?, bedrooms = ?, bathrooms = ?, area = ?, 
            area_unit = ?, floor = ?, total_floors = ?, facing = ?, parking = ?, 
            balcony = ?, status = ?, featured = ?, created_by = ?, image = ?, updated_at = NOW()
            WHERE id = ?";
        
        $stmt = $conn->prepare($sql);
        
        $result = $stmt->execute([
            $title, $slug, $description, $price, $monthly_rent, $type,
            $propertyType, $address, $bedrooms, $bathrooms, $area,
            $area_unit, $floor, $total_floors, $facing, $parking,
            $balcony, $status, $featured, $created_by, $image, $id
        ]);
        
        if ($result) {
            // Image is already stored in the properties table via the image field
            // No additional database operations needed for image linking
            
            // Handle property features if provided
            if (isset($requestData['features']) && is_array($requestData['features'])) {
                // Delete existing features
                $deleteStmt = $conn->prepare("DELETE FROM property_features WHERE property_id = ?");
                $deleteStmt->execute([$id]);
                
                // Insert new features
                foreach ($requestData['features'] as $featureId) {
                    $featureStmt = $conn->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
                    $featureStmt->execute([$id, $featureId]);
                }
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Property updated successfully',
                'property_id' => $id,
                'slug' => $slug
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

function createSlug($string) {
    // Convert to lowercase
    $string = strtolower($string);
    
    // Replace spaces with hyphens
    $string = preg_replace('/\s+/', '-', $string);
    
    // Remove special characters
    $string = preg_replace('/[^a-z0-9\-]/', '', $string);
    
    // Remove multiple hyphens
    $string = preg_replace('/-+/', '-', $string);
    
    // Remove leading and trailing hyphens
    $string = trim($string, '-');
    
    return $string;
}
?>
