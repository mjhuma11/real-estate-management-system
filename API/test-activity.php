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
    // Create a test activity
    $testActivities = [
        [
            'type' => ActivityTypes::PROPERTY_ADDED,
            'title' => 'Test Property Added',
            'message' => 'added test property "Sample Apartment"',
            'options' => [
                'user_name' => 'Test Admin',
                'entity_type' => 'property',
                'entity_id' => 999,
                'details' => [
                    'property_title' => 'Sample Apartment',
                    'property_type' => 'For Sale',
                    'price' => '5000000'
                ]
            ]
        ],
        [
            'type' => ActivityTypes::USER_REGISTERED,
            'title' => 'Test User Registration',
            'message' => 'registered as a new customer',
            'options' => [
                'user_name' => 'Test User',
                'entity_type' => 'user',
                'entity_id' => 999,
                'details' => [
                    'email' => 'test@example.com',
                    'role' => 'customer'
                ]
            ]
        ],
        [
            'type' => ActivityTypes::BOOKING_CREATED,
            'title' => 'Test Booking Created',
            'message' => 'created a booking for "Sample Property"',
            'options' => [
                'user_name' => 'Test Customer',
                'entity_type' => 'booking',
                'entity_id' => 999,
                'details' => [
                    'property_title' => 'Sample Property',
                    'booking_amount' => '100000 BDT'
                ]
            ]
        ]
    ];
    
    $created = 0;
    foreach ($testActivities as $activity) {
        if (logActivityWithStyle($activity['type'], $activity['title'], $activity['message'], $activity['options'])) {
            $created++;
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Test activities created successfully',
        'activities_created' => $created,
        'total_test_activities' => count($testActivities)
    ]);

} catch (Exception $e) {
    error_log("Error creating test activities: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Failed to create test activities: ' . $e->getMessage()
    ]);
}
?>