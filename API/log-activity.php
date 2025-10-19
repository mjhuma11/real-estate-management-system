<?php
// Activity logging helper function
function logActivity($type, $title, $message, $options = []) {
    global $conn;
    
    try {
        // Default options
        $defaults = [
            'user_id' => null,
            'user_name' => 'System',
            'icon' => 'fa-info-circle',
            'color' => 'text-primary',
            'entity_type' => null,
            'entity_id' => null,
            'details' => null
        ];
        
        $options = array_merge($defaults, $options);
        
        // Get IP address and user agent
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        
        // Prepare details as JSON
        $detailsJson = null;
        if ($options['details'] && is_array($options['details'])) {
            $detailsJson = json_encode($options['details']);
        }
        
        $sql = "INSERT INTO activities (
            type, user_id, user_name, title, message, icon, color, 
            entity_type, entity_id, details, ip_address, user_agent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $type,
            $options['user_id'],
            $options['user_name'],
            $title,
            $message,
            $options['icon'],
            $options['color'],
            $options['entity_type'],
            $options['entity_id'],
            $detailsJson,
            $ipAddress,
            $userAgent
        ]);
        
        return true;
        
    } catch (Exception $e) {
        error_log("Failed to log activity: " . $e->getMessage());
        return false;
    }
}

// Activity type constants for consistency
class ActivityTypes {
    const PROPERTY_ADDED = 'property_added';
    const PROPERTY_UPDATED = 'property_updated';
    const PROPERTY_DELETED = 'property_deleted';
    const PROPERTY_FEATURED = 'property_featured';
    const PROPERTY_STATUS_CHANGED = 'property_status_changed';
    
    const PROJECT_ADDED = 'project_added';
    const PROJECT_UPDATED = 'project_updated';
    const PROJECT_DELETED = 'project_deleted';
    const PROJECT_STATUS_CHANGED = 'project_status_changed';
    
    const USER_REGISTERED = 'user_registered';
    const USER_LOGIN = 'user_login';
    const USER_STATUS_CHANGED = 'user_status_changed';
    const USER_DELETED = 'user_deleted';
    const USER_PROFILE_UPDATED = 'user_profile_updated';
    
    const BOOKING_CREATED = 'booking_created';
    const BOOKING_CONFIRMED = 'booking_confirmed';
    const BOOKING_CANCELLED = 'booking_cancelled';
    const BOOKING_COMPLETED = 'booking_completed';
    
    const APPOINTMENT_CREATED = 'appointment_created';
    const APPOINTMENT_CONFIRMED = 'appointment_confirmed';
    const APPOINTMENT_CANCELLED = 'appointment_cancelled';
    
    const SYSTEM_BACKUP = 'system_backup';
    const SYSTEM_MAINTENANCE = 'system_maintenance';
}

// Icon and color mappings for different activity types
function getActivityStyle($type) {
    $styles = [
        ActivityTypes::PROPERTY_ADDED => ['icon' => 'fa-home', 'color' => 'text-primary'],
        ActivityTypes::PROPERTY_UPDATED => ['icon' => 'fa-edit', 'color' => 'text-info'],
        ActivityTypes::PROPERTY_DELETED => ['icon' => 'fa-trash', 'color' => 'text-danger'],
        ActivityTypes::PROPERTY_FEATURED => ['icon' => 'fa-star', 'color' => 'text-warning'],
        ActivityTypes::PROPERTY_STATUS_CHANGED => ['icon' => 'fa-exchange-alt', 'color' => 'text-secondary'],
        
        ActivityTypes::PROJECT_ADDED => ['icon' => 'fa-building', 'color' => 'text-success'],
        ActivityTypes::PROJECT_UPDATED => ['icon' => 'fa-edit', 'color' => 'text-info'],
        ActivityTypes::PROJECT_DELETED => ['icon' => 'fa-trash', 'color' => 'text-danger'],
        ActivityTypes::PROJECT_STATUS_CHANGED => ['icon' => 'fa-tasks', 'color' => 'text-secondary'],
        
        ActivityTypes::USER_REGISTERED => ['icon' => 'fa-user-plus', 'color' => 'text-info'],
        ActivityTypes::USER_LOGIN => ['icon' => 'fa-sign-in-alt', 'color' => 'text-success'],
        ActivityTypes::USER_STATUS_CHANGED => ['icon' => 'fa-user-cog', 'color' => 'text-warning'],
        ActivityTypes::USER_DELETED => ['icon' => 'fa-user-times', 'color' => 'text-danger'],
        ActivityTypes::USER_PROFILE_UPDATED => ['icon' => 'fa-user-edit', 'color' => 'text-info'],
        
        ActivityTypes::BOOKING_CREATED => ['icon' => 'fa-calendar-plus', 'color' => 'text-success'],
        ActivityTypes::BOOKING_CONFIRMED => ['icon' => 'fa-calendar-check', 'color' => 'text-success'],
        ActivityTypes::BOOKING_CANCELLED => ['icon' => 'fa-calendar-times', 'color' => 'text-danger'],
        ActivityTypes::BOOKING_COMPLETED => ['icon' => 'fa-check-circle', 'color' => 'text-success'],
        
        ActivityTypes::APPOINTMENT_CREATED => ['icon' => 'fa-calendar-alt', 'color' => 'text-primary'],
        ActivityTypes::APPOINTMENT_CONFIRMED => ['icon' => 'fa-handshake', 'color' => 'text-success'],
        ActivityTypes::APPOINTMENT_CANCELLED => ['icon' => 'fa-ban', 'color' => 'text-danger'],
        
        ActivityTypes::SYSTEM_BACKUP => ['icon' => 'fa-database', 'color' => 'text-secondary'],
        ActivityTypes::SYSTEM_MAINTENANCE => ['icon' => 'fa-tools', 'color' => 'text-warning'],
    ];
    
    return $styles[$type] ?? ['icon' => 'fa-info-circle', 'color' => 'text-primary'];
}

// Convenience function to log activity with automatic styling
function logActivityWithStyle($type, $title, $message, $options = []) {
    $style = getActivityStyle($type);
    $options = array_merge($style, $options);
    return logActivity($type, $title, $message, $options);
}
?>