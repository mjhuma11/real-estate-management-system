<?php
// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
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
        if (!$requestData || !isset($requestData['id'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Property ID is required',
                'received_data' => $requestData
            ]);
            return;
        }
        
        $id = $requestData['id'];
        
        // Check if property exists
        $checkStmt = $conn->prepare("SELECT * FROM properties WHERE id = ?");
        $checkStmt->execute([$id]);
        if ($checkStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Property not found']);
            return;
        }
        
        // Get existing property data
        $existingData = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        // Define allowed fields and their default values
        $allowedFields = [
            'title' => $existingData['title'],
            'slug' => $existingData['slug'],
            'description' => $existingData['description'],
            'price' => $existingData['price'],
            'monthly_rent' => $existingData['monthly_rent'],
            'type' => $existingData['type'],
            'property_type_id' => $existingData['property_type_id'],
            'bedrooms' => $existingData['bedrooms'],
            'bathrooms' => $existingData['bathrooms'],
            'area' => $existingData['area'],
            'area_unit' => $existingData['area_unit'] ?? 'sq_ft',
            'address' => $existingData['address'],
            'status' => $existingData['status'] ?? 'available',
            'featured' => $existingData['featured'] ?? 0,
            'floor' => $existingData['floor'],
            'total_floors' => $existingData['total_floors'],
            'facing' => $existingData['facing'],
            'parking' => $existingData['parking'] ?? 0,
            'balcony' => $existingData['balcony'] ?? 0,
            'image' => $existingData['image']
        ];
        
        // Update with new values from request
        foreach ($allowedFields as $field => $defaultValue) {
            if (array_key_exists($field, $requestData)) {
                $allowedFields[$field] = $requestData[$field] !== null ? $requestData[$field] : $defaultValue;
            }
        }
        
        // Validate type
        if (!in_array($allowedFields['type'], ['For Sale', 'For Rent'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Type must be either "For Sale" or "For Rent"'
            ]);
            return;
        }
        
        // Handle slug uniqueness
        $slug = $allowedFields['slug'];
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
            $allowedFields['slug'] = $slug;
        }
        
        // Prepare the update query
        $updateFields = [];
        $params = [];
        
        foreach ($allowedFields as $field => $value) {
            $updateFields[] = "$field = ?";
            $params[] = $value !== null ? $value : null;
        }
        
        // Add ID to params for WHERE clause
        $params[] = $id;
        
        // Build and execute the query
        $sql = "UPDATE properties SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute($params);
        
        if ($result) {
            // Image is already stored in the properties table via the image field
            // No additional database operations needed for image linking
            
            // Handle property amenities if provided
            if (isset($requestData['amenities']) && is_array($requestData['amenities'])) {
                // Delete existing amenities
                $deleteStmt = $conn->prepare("DELETE FROM property_amenities WHERE property_id = ?");
                $deleteStmt->execute([$id]);
                
                // Insert new amenities
                foreach ($requestData['amenities'] as $amenityId) {
                    $amenityStmt = $conn->prepare("INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?)");
                    $amenityStmt->execute([$id, $amenityId]);
                }
            }
            
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
