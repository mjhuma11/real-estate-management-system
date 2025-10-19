<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'log-activity.php';

try {
    // Check if activities table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'activities'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        // Create activities table
        $createTableSQL = "
        CREATE TABLE `activities` (
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
            KEY `idx_created_at` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        $conn->exec($createTableSQL);
        
        // Add foreign key constraint if users table exists
        try {
            $conn->exec("ALTER TABLE activities ADD CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL");
        } catch (Exception $e) {
            // Foreign key constraint failed, continue without it
        }
    }
    
    // Check if we have any activities
    $stmt = $conn->query("SELECT COUNT(*) as count FROM activities");
    $activityCount = $stmt->fetch()['count'];
    
    $activitiesAdded = 0;
    
    if ($activityCount == 0) {
        // Add some initial activities based on existing data
        
        // Get recent properties and create activities for them
        $stmt = $conn->query("SELECT id, title, created_at, created_by FROM properties ORDER BY created_at DESC LIMIT 5");
        $properties = $stmt->fetchAll();
        
        foreach ($properties as $property) {
            logActivityWithStyle(
                ActivityTypes::PROPERTY_ADDED,
                'Property Added',
                'added new property "' . $property['title'] . '"',
                [
                    'user_id' => $property['created_by'],
                    'user_name' => 'Admin',
                    'entity_type' => 'property',
                    'entity_id' => $property['id'],
                    'details' => [
                        'property_title' => $property['title']
                    ]
                ]
            );
            
            // Update the created_at to match the property's creation time
            $conn->prepare("UPDATE activities SET created_at = ? WHERE entity_type = 'property' AND entity_id = ? ORDER BY id DESC LIMIT 1")
                 ->execute([$property['created_at'], $property['id']]);
            
            $activitiesAdded++;
        }
        
        // Get recent users and create activities for them
        $stmt = $conn->query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5");
        $users = $stmt->fetchAll();
        
        foreach ($users as $user) {
            logActivityWithStyle(
                ActivityTypes::USER_REGISTERED,
                'User Registration',
                'registered as a new ' . $user['role'],
                [
                    'user_id' => $user['id'],
                    'user_name' => $user['username'],
                    'entity_type' => 'user',
                    'entity_id' => $user['id'],
                    'details' => [
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ]
            );
            
            // Update the created_at to match the user's registration time
            $conn->prepare("UPDATE activities SET created_at = ? WHERE entity_type = 'user' AND entity_id = ? ORDER BY id DESC LIMIT 1")
                 ->execute([$user['created_at'], $user['id']]);
            
            $activitiesAdded++;
        }
        
        // Get recent projects and create activities for them
        $stmt = $conn->query("SELECT id, name, created_at FROM projects ORDER BY created_at DESC LIMIT 3");
        $projects = $stmt->fetchAll();
        
        foreach ($projects as $project) {
            logActivityWithStyle(
                ActivityTypes::PROJECT_ADDED,
                'Project Added',
                'added new project "' . $project['name'] . '"',
                [
                    'user_id' => null,
                    'user_name' => 'Admin',
                    'entity_type' => 'project',
                    'entity_id' => $project['id'],
                    'details' => [
                        'project_name' => $project['name']
                    ]
                ]
            );
            
            // Update the created_at to match the project's creation time
            $conn->prepare("UPDATE activities SET created_at = ? WHERE entity_type = 'project' AND entity_id = ? ORDER BY id DESC LIMIT 1")
                 ->execute([$project['created_at'], $project['id']]);
            
            $activitiesAdded++;
        }
        
        // Add a system initialization activity
        logActivityWithStyle(
            'system_initialized',
            'System Initialized',
            'initialized activity tracking system',
            [
                'user_id' => null,
                'user_name' => 'System',
                'icon' => 'fa-cogs',
                'color' => 'text-success',
                'details' => [
                    'activities_created' => $activitiesAdded,
                    'table_created' => !$tableExists
                ]
            ]
        );
        $activitiesAdded++;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Activities system initialized successfully',
        'table_existed' => $tableExists,
        'activities_added' => $activitiesAdded,
        'total_activities' => $activityCount + $activitiesAdded
    ]);

} catch (Exception $e) {
    error_log("Error initializing activities: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to initialize activities system: ' . $e->getMessage()
    ]);
}
?>