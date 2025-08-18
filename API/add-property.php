<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        addProperty();
        break;
    case 'GET':
        getPropertyForm();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function addProperty() {
    global $conn;
    
    try {
        // Get the request data
        $input = file_get_contents('php://input');
        $requestData = json_decode($input, true);
        
        // Debug: Log the received data
        error_log("Received data: " . print_r($requestData, true));
        
        // Validate required fields
        if (!$requestData || !isset($requestData['title']) || !isset($requestData['type'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Title and type are required fields',
                'received_data' => $requestData
            ]);
            return;
        }
        
        // Prepare the data
        $title = trim($requestData['title']);
        $slug = createSlug($title);
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
        
        // Check if slug already exists
        $checkStmt = $conn->prepare("SELECT id FROM properties WHERE slug = :slug");
        $checkStmt->bindParam(':slug', $slug);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            // If slug exists, add a number to make it unique
            $counter = 1;
            $originalSlug = $slug;
            do {
                $slug = $originalSlug . '-' . $counter;
                $checkStmt->bindParam(':slug', $slug);
                $checkStmt->execute();
                $counter++;
            } while ($checkStmt->rowCount() > 0);
        }
        
        // Insert the property
        $sql = "INSERT INTO properties (
            title, slug, description, price, monthly_rent, type, property_type_id,
            category_id, location_id, address, bedrooms, bathrooms, area, area_unit,
            floor, total_floors, facing, parking, balcony, status, featured,
            agent_id, virtual_tour_url, video_url, created_by
        ) VALUES (
            :title, :slug, :description, :price, :monthly_rent, :type, :property_type_id,
            :category_id, :location_id, :address, :bedrooms, :bathrooms, :area, :area_unit,
            :floor, :total_floors, :facing, :parking, :balcony, :status, :featured,
            :agent_id, :virtual_tour_url, :video_url, :created_by
        )";
        
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':slug', $slug);
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
        $stmt->bindParam(':created_by', $created_by);
        
        if ($stmt->execute()) {
            $propertyId = $conn->lastInsertId();
            
            // Handle property features if provided
            if (isset($requestData['features']) && is_array($requestData['features'])) {
                foreach ($requestData['features'] as $featureId) {
                    $featureStmt = $conn->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
                    $featureStmt->execute([$propertyId, $featureId]);
                }
            }
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Property added successfully',
                'property_id' => $propertyId,
                'slug' => $slug
            ]);
        } else {
            throw new Exception('Failed to add property');
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error adding property: ' . $e->getMessage()
        ]);
    }
}

function getPropertyForm() {
    global $conn;
    
    try {
        // Get categories
        $categories = [];
        $stmt = $conn->query("SELECT id, name FROM categories WHERE status = 'active' ORDER BY name");
        $categories = $stmt->fetchAll();

        // Get locations
        $locations = [];
        $stmt = $conn->query("SELECT id, name, type FROM locations WHERE status = 'active' ORDER BY type, name");
        $locations = $stmt->fetchAll();

        // Get features
        $features = [];
        $stmt = $conn->query("SELECT id, name FROM features WHERE status = 'active' ORDER BY name");
        $features = $stmt->fetchAll();

        // Get agents
        $agents = [];
        $stmt = $conn->query("SELECT u.id, u.username, u.email FROM users u WHERE u.role = 'agent' AND u.status = 'active' ORDER BY u.username");
        $agents = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'locations' => $locations,
                'features' => $features,
                'agents' => $agents,
                'property_types' => [
                    ['id' => 1, 'name' => 'Apartment'],
                    ['id' => 2, 'name' => 'House'],
                    ['id' => 3, 'name' => 'Villa'],
                    ['id' => 4, 'name' => 'Commercial'],
                    ['id' => 5, 'name' => 'Land']
                ],
                'facing_options' => [
                    'North', 'South', 'East', 'West',
                    'North-East', 'North-West', 'South-East', 'South-West'
                ],
                'area_units' => ['sq_ft', 'sq_m', 'katha', 'bigha']
            ]
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error fetching form data: ' . $e->getMessage()
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
