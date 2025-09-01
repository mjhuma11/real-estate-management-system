<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

try {
    // Get the request data
    $input = file_get_contents('php://input');
    if (empty($input)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No data received'
        ]);
        exit;
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON data'
        ]);
        exit;
    }

    // Validate required fields
    if (empty($data['title']) || empty($data['type'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Title and type are required'
        ]);
        exit;
    }

    // Prepare SQL statement with all fields
    $sql = "INSERT INTO properties (
        title, slug, description, price, monthly_rent, type, property_type_id,
        address, bedrooms, bathrooms, area, area_unit,
        floor, total_floors, facing, parking, balcony, status, featured,
        agent_id, views, image, created_by
    ) VALUES (
        :title, :slug, :description, :price, :monthly_rent, :type, :property_type_id,
        :address, :bedrooms, :bathrooms, :area, :area_unit,
        :floor, :total_floors, :facing, :parking, :balcony, :status, :featured,
        :agent_id, :views, :image, :created_by
    )";

    $stmt = $conn->prepare($sql);

    // Bind parameters with default values for missing keys
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':slug', $data['slug']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':price', $data['price']);
    $stmt->bindParam(':monthly_rent', $data['monthly_rent']);
    $stmt->bindParam(':type', $data['type']);
    $stmt->bindParam(':property_type_id', $data['property_type_id']);
    $stmt->bindParam(':address', $data['address']);
    $stmt->bindParam(':bedrooms', $data['bedrooms']);
    $stmt->bindParam(':bathrooms', $data['bathrooms']);
    $stmt->bindParam(':area', $data['area']);
    $stmt->bindParam(':area_unit', $data['area_unit']);
    $stmt->bindParam(':floor', $data['floor']);
    $stmt->bindParam(':total_floors', $data['total_floors']);
    $stmt->bindParam(':facing', $data['facing']);
    $stmt->bindParam(':parking', $data['parking']);
    $stmt->bindParam(':balcony', $data['balcony']);
    $stmt->bindParam(':status', $data['status']);
    $stmt->bindParam(':featured', $data['featured']);
    $stmt->bindParam(':agent_id', $data['agent_id']);
    $stmt->bindParam(':views', $data['views']);
    $stmt->bindParam(':image', $data['image']);
    $stmt->bindParam(':created_by', $data['created_by']);


    if ($stmt->execute()) {
        $propertyId = $conn->lastInsertId();
        
        // Handle amenities
        if (!empty($data['amenities']) && is_array($data['amenities'])) {
            $amenityStmt = $conn->prepare("INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?)");
            foreach ($data['amenities'] as $amenityId) {
                $amenityStmt->execute([$propertyId, $amenityId]);
            }
        }
        
        // Handle features
        if (!empty($data['features']) && is_array($data['features'])) {
            $featureStmt = $conn->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
            foreach ($data['features'] as $featureId) {
                $featureStmt->execute([$propertyId, $featureId]);
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Property added successfully',
            'property_id' => $propertyId
        ]);
    } else {
        throw new Exception('Failed to add property');
    }

} catch (PDOException $e) {
    error_log('Add Property Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred',
        'debug' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log('Add Property Exception: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>