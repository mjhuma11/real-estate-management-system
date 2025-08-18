<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Sample property data
$sampleProperty = [
    'title' => 'Modern 3-Bedroom Apartment in Gulshan',
    'description' => 'Beautiful modern apartment with stunning city views. Located in the heart of Gulshan, this property offers luxury living with all modern amenities.',
    'price' => 8500000, // 85 lakh BDT
    'monthly_rent' => null,
    'type' => 'For Sale',
    'property_type_id' => 1, // Apartment
    'category_id' => 1, // Residential
    'location_id' => 1, // Gulshan
    'address' => 'House #123, Road #12, Gulshan-2, Dhaka',
    'bedrooms' => 3,
    'bathrooms' => 2,
    'area' => 1200,
    'area_unit' => 'sq_ft',
    'floor' => 8,
    'total_floors' => 12,
    'facing' => 'South-East',
    'parking' => 1,
    'balcony' => 2,
    'status' => 'available',
    'featured' => 1,
    'agent_id' => null,
    'virtual_tour_url' => 'https://example.com/virtual-tour',
    'video_url' => 'https://example.com/property-video',
    'created_by' => 1,
    'features' => [1, 2, 3, 4] // Modern Kitchen, Spacious Living Room, Natural Light, Central Location
];

try {
    // Create slug
    function createSlug($string) {
        $string = strtolower($string);
        $string = preg_replace('/\s+/', '-', $string);
        $string = preg_replace('/[^a-z0-9\-]/', '', $string);
        $string = preg_replace('/-+/', '-', $string);
        return trim($string, '-');
    }
    
    $slug = createSlug($sampleProperty['title']);
    
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
    
    $stmt->bindParam(':title', $sampleProperty['title']);
    $stmt->bindParam(':slug', $slug);
    $stmt->bindParam(':description', $sampleProperty['description']);
    $stmt->bindParam(':price', $sampleProperty['price']);
    $stmt->bindParam(':monthly_rent', $sampleProperty['monthly_rent']);
    $stmt->bindParam(':type', $sampleProperty['type']);
    $stmt->bindParam(':property_type_id', $sampleProperty['property_type_id']);
    $stmt->bindParam(':category_id', $sampleProperty['category_id']);
    $stmt->bindParam(':location_id', $sampleProperty['location_id']);
    $stmt->bindParam(':address', $sampleProperty['address']);
    $stmt->bindParam(':bedrooms', $sampleProperty['bedrooms']);
    $stmt->bindParam(':bathrooms', $sampleProperty['bathrooms']);
    $stmt->bindParam(':area', $sampleProperty['area']);
    $stmt->bindParam(':area_unit', $sampleProperty['area_unit']);
    $stmt->bindParam(':floor', $sampleProperty['floor']);
    $stmt->bindParam(':total_floors', $sampleProperty['total_floors']);
    $stmt->bindParam(':facing', $sampleProperty['facing']);
    $stmt->bindParam(':parking', $sampleProperty['parking']);
    $stmt->bindParam(':balcony', $sampleProperty['balcony']);
    $stmt->bindParam(':status', $sampleProperty['status']);
    $stmt->bindParam(':featured', $sampleProperty['featured']);
    $stmt->bindParam(':agent_id', $sampleProperty['agent_id']);
    $stmt->bindParam(':virtual_tour_url', $sampleProperty['virtual_tour_url']);
    $stmt->bindParam(':video_url', $sampleProperty['video_url']);
    $stmt->bindParam(':created_by', $sampleProperty['created_by']);
    
    if ($stmt->execute()) {
        $propertyId = $conn->lastInsertId();
        
        // Add property features
        foreach ($sampleProperty['features'] as $featureId) {
            $featureStmt = $conn->prepare("INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)");
            $featureStmt->execute([$propertyId, $featureId]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Sample property added successfully',
            'property_id' => $propertyId,
            'slug' => $slug,
            'property_data' => $sampleProperty
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
?>
