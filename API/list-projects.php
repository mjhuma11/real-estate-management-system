<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get all projects with basic information
    $sql = "SELECT 
                p.id,
                p.name,
                p.slug,
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                p.completion_percentage,
                p.total_units,
                p.available_units,
                p.min_price,
                p.max_price,
                p.land_area,
                p.built_area,
                p.total_floors,
                p.featured,
                p.brochure_url,
                p.address,
                p.created_at,
                c.name as category_name,
                l.name as location_name,
                u.username as developer_name
            FROM projects p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            LEFT JOIN users u ON p.developer_id = u.id
            ORDER BY p.created_at DESC";
    
    $stmt = $conn->query($sql);
    $projects = $stmt->fetchAll();
    
    // Count total projects
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM projects");
    $totalCount = $countStmt->fetch()['total'];
    
    echo json_encode([
        'success' => true,
        'total_projects' => $totalCount,
        'projects' => $projects
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error fetching projects: ' . $e->getMessage()
    ]);
}
?>
