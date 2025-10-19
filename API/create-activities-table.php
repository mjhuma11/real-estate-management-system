<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    // Create activities table
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS `activities` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `type` varchar(50) NOT NULL,
        `user_id` int(10) UNSIGNED DEFAULT NULL,
        `user_name` varchar(255) DEFAULT NULL,
        `title` varchar(255) NOT NULL,
        `message` text NOT NULL,
        `icon` varchar(50) DEFAULT 'fa-info-circle',
        `color` varchar(50) DEFAULT 'text-primary',
        `entity_type` varchar(50) DEFAULT NULL,
        `entity_id` int(11) DEFAULT NULL,
        `details` json DEFAULT NULL,
        `ip_address` varchar(45) DEFAULT NULL,
        `user_agent` text DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        KEY `idx_type` (`type`),
        KEY `idx_user_id` (`user_id`),
        KEY `idx_entity` (`entity_type`, `entity_id`),
        KEY `idx_created_at` (`created_at`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $conn->exec($createTableSQL);
    
    // Insert some sample activities based on existing data
    $sampleActivities = [];
    
    // Get recent properties
    $stmt = $conn->query("SELECT id, title, created_at, created_by FROM properties ORDER BY created_at DESC LIMIT 3");
    $recentProperties = $stmt->fetchAll();
    
    foreach ($recentProperties as $property) {
        $sampleActivities[] = [
            'type' => 'property_added',
            'user_id' => $property['created_by'],
            'user_name' => 'Admin',
            'title' => 'Property Added',
            'message' => 'added new property "' . $property['title'] . '"',
            'icon' => 'fa-home',
            'color' => 'text-primary',
            'entity_type' => 'property',
            'entity_id' => $property['id'],
            'created_at' => $property['created_at']
        ];
    }
    
    // Get recent users
    $stmt = $conn->query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 3");
    $recentUsers = $stmt->fetchAll();
    
    foreach ($recentUsers as $user) {
        $sampleActivities[] = [
            'type' => 'user_registered',
            'user_id' => $user['id'],
            'user_name' => $user['username'],
            'title' => 'User Registration',
            'message' => 'registered as a new ' . $user['role'],
            'icon' => 'fa-user-plus',
            'color' => 'text-info',
            'entity_type' => 'user',
            'entity_id' => $user['id'],
            'created_at' => $user['created_at']
        ];
    }
    
    // Get recent projects
    $stmt = $conn->query("SELECT id, name, created_at FROM projects ORDER BY created_at DESC LIMIT 2");
    $recentProjects = $stmt->fetchAll();
    
    foreach ($recentProjects as $project) {
        $sampleActivities[] = [
            'type' => 'project_added',
            'user_id' => null,
            'user_name' => 'Admin',
            'title' => 'Project Added',
            'message' => 'added new project "' . $project['name'] . '"',
            'icon' => 'fa-building',
            'color' => 'text-success',
            'entity_type' => 'project',
            'entity_id' => $project['id'],
            'created_at' => $project['created_at']
        ];
    }
    
    // Insert sample activities
    if (!empty($sampleActivities)) {
        $insertSQL = "INSERT INTO activities (type, user_id, user_name, title, message, icon, color, entity_type, entity_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertSQL);
        
        foreach ($sampleActivities as $activity) {
            $stmt->execute([
                $activity['type'],
                $activity['user_id'],
                $activity['user_name'],
                $activity['title'],
                $activity['message'],
                $activity['icon'],
                $activity['color'],
                $activity['entity_type'],
                $activity['entity_id'],
                $activity['created_at']
            ]);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Activities table created successfully',
        'sample_activities_added' => count($sampleActivities)
    ]);

} catch (Exception $e) {
    error_log("Error creating activities table: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create activities table: ' . $e->getMessage()
    ]);
}
?>