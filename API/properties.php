<?php
require_once 'config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            getPropertyById($_GET['id']);
        } else {
            getAllProperties();
        }
        break;
    case 'POST':
        createProperty();
        break;
    case 'PUT':
        updateProperty();
        break;
    case 'DELETE':
        deleteProperty();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllProperties() {
    global $conn;
    
    try {
        // Build query with filters
        $sql = "SELECT p.*, pt.name as property_type_name, l.name as location_name, c.name as category_name,
                       GROUP_CONCAT(DISTINCT pi.image_url) as images,
                       GROUP_CONCAT(DISTINCT a.name) as amenities
                FROM properties p
                LEFT JOIN property_types pt ON p.property_type_id = pt.id
                LEFT JOIN locations l ON p.location_id = l.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN property_images pi ON p.id = pi.property_id
                LEFT JOIN property_amenities pa ON p.id = pa.property_id
                LEFT JOIN amenities a ON pa.amenity_id = a.id
                WHERE p.status = 'available'";
        
        // Add filters
        $params = [];
        
        if(isset($_GET['type']) && !empty($_GET['type'])) {
            $sql .= " AND p.type = ?";
            $params[] = $_GET['type'];
        }
        
        if(isset($_GET['property_type']) && !empty($_GET['property_type'])) {
            $sql .= " AND pt.name = ?";
            $params[] = $_GET['property_type'];
        }
        
        if(isset($_GET['location']) && !empty($_GET['location'])) {
            $sql .= " AND l.name LIKE ?";
            $params[] = '%' . $_GET['location'] . '%';
        }
        
        if(isset($_GET['min_price']) && !empty($_GET['min_price'])) {
            $sql .= " AND p.price >= ?";
            $params[] = $_GET['min_price'];
        }
        
        if(isset($_GET['max_price']) && !empty($_GET['max_price'])) {
            $sql .= " AND p.price <= ?";
            $params[] = $_GET['max_price'];
        }
        
        if(isset($_GET['bedrooms']) && !empty($_GET['bedrooms'])) {
            $sql .= " AND p.bedrooms = ?";
            $params[] = $_GET['bedrooms'];
        }
        
        if(isset($_GET['featured']) && $_GET['featured'] == '1') {
            $sql .= " AND p.featured = 1";
        }
        
        $sql .= " GROUP BY p.id ORDER BY p.featured DESC, p.created_at DESC";
        
        // Add pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
        $offset = ($page - 1) * $limit;
        
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $properties = $stmt->fetchAll();
        
        // Format the data
        foreach($properties as &$property) {
            $property['images'] = $property['images'] ? explode(',', $property['images']) : [];
            $property['amenities'] = $property['amenities'] ? explode(',', $property['amenities']) : [];
            $property['price_formatted'] = '৳ ' . number_format($property['price']);
        }
        
        // Get total count for pagination
        $countSql = "SELECT COUNT(DISTINCT p.id) as total FROM properties p
                     LEFT JOIN property_types pt ON p.property_type_id = pt.id
                     LEFT JOIN locations l ON p.location_id = l.id
                     WHERE p.status = 'available'";
        
        $countParams = [];
        if(isset($_GET['type']) && !empty($_GET['type'])) {
            $countSql .= " AND p.type = ?";
            $countParams[] = $_GET['type'];
        }
        
        $countStmt = $conn->prepare($countSql);
        $countStmt->execute($countParams);
        $total = $countStmt->fetch()['total'];
        
        echo json_encode([
            'success' => true,
            'data' => $properties,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total,
                'items_per_page' => $limit
            ]
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getPropertyById($id) {
    global $conn;
    
    try {
        $sql = "SELECT p.*, pt.name as property_type_name, l.name as location_name, c.name as category_name,
                       u.name as agent_name, u.phone as agent_phone, u.email as agent_email
                FROM properties p
                LEFT JOIN property_types pt ON p.property_type_id = pt.id
                LEFT JOIN locations l ON p.location_id = l.id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.agent_id = u.id
                WHERE p.id = ? AND p.status = 'available'";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $property = $stmt->fetch();
        
        if(!$property) {
            http_response_code(404);
            echo json_encode(['error' => 'Property not found']);
            return;
        }
        
        // Get images
        $imagesSql = "SELECT * FROM property_images WHERE property_id = ? ORDER BY sort_order";
        $imagesStmt = $conn->prepare($imagesSql);
        $imagesStmt->execute([$id]);
        $property['images'] = $imagesStmt->fetchAll();
        
        // Get amenities
        $amenitiesSql = "SELECT a.* FROM amenities a 
                        JOIN property_amenities pa ON a.id = pa.amenity_id 
                        WHERE pa.property_id = ?";
        $amenitiesStmt = $conn->prepare($amenitiesSql);
        $amenitiesStmt->execute([$id]);
        $property['amenities'] = $amenitiesStmt->fetchAll();
        
        // Get features
        $featuresSql = "SELECT f.* FROM features f 
                       JOIN property_features pf ON f.id = pf.feature_id 
                       WHERE pf.property_id = ?";
        $featuresStmt = $conn->prepare($featuresSql);
        $featuresStmt->execute([$id]);
        $property['features'] = $featuresStmt->fetchAll();
        
        // Update view count
        $updateViewsSql = "UPDATE properties SET views = views + 1 WHERE id = ?";
        $updateViewsStmt = $conn->prepare($updateViewsSql);
        $updateViewsStmt->execute([$id]);
        
        $property['price_formatted'] = '৳ ' . number_format($property['price']);
        
        echo json_encode(['success' => true, 'data' => $property]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createProperty() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO properties (title, slug, description, price, monthly_rent, type, 
                property_type_id, category_id, location_id, address, bedrooms, bathrooms, 
                area, floor, total_floors, facing, parking, balcony, featured, agent_id, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $slug = generateSlug($input['title']);
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([
            $input['title'],
            $slug,
            $input['description'],
            $input['price'],
            $input['monthly_rent'] ?? null,
            $input['type'],
            $input['property_type_id'],
            $input['category_id'],
            $input['location_id'],
            $input['address'],
            $input['bedrooms'],
            $input['bathrooms'],
            $input['area'],
            $input['floor'],
            $input['total_floors'],
            $input['facing'],
            $input['parking'] ?? 0,
            $input['balcony'] ?? 0,
            $input['featured'] ?? 0,
            $input['agent_id'],
            $input['created_by']
        ]);
        
        if($result) {
            $propertyId = $conn->lastInsertId();
            echo json_encode(['success' => true, 'id' => $propertyId, 'message' => 'Property created successfully']);
        } else {
            throw new Exception('Failed to create property');
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating property: ' . $e->getMessage()]);
    }
}

function generateSlug($title) {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    return trim($slug, '-');
}

function updateProperty() {
    // Implementation for updating property
    echo json_encode(['message' => 'Update property endpoint']);
}

function deleteProperty() {
    // Implementation for deleting property
    echo json_encode(['message' => 'Delete property endpoint']);
}
?>