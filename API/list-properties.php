<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get all properties with basic information
    $sql = "SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.price,
                p.monthly_rent,
                p.type,
                p.bedrooms,
                p.bathrooms,
                p.area,
                p.area_unit,
                p.floor,
                p.total_floors,
                p.facing,
                p.parking,
                p.balcony,
                p.status,
                p.featured,
                p.views,
                p.address,
                p.created_at,
                c.name as category_name,
                l.name as location_name,
                u.username as agent_name
            FROM properties p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            LEFT JOIN users u ON p.agent_id = u.id
            ORDER BY p.created_at DESC";
    
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll();
    
    // Count total properties
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM properties");
    $totalCount = $countStmt->fetch()['total'];
    
    echo json_encode([
        'success' => true,
        'total_properties' => $totalCount,
        'properties' => $properties
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error fetching properties: ' . $e->getMessage()
    ]);
}
?>
