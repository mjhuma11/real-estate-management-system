<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get featured properties with basic information
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
            WHERE p.featured = 1 AND p.status = 'available'
            ORDER BY p.created_at DESC
            LIMIT 6";
    
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll();
    
    // Count total featured properties
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM properties WHERE featured = 1 AND status = 'available'");
    $totalCount = $countStmt->fetch()['total'];
    
    echo json_encode([
        'success' => true,
        'total_featured' => $totalCount,
        'properties' => $properties
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error fetching featured properties: ' . $e->getMessage()
    ]);
}
?>
