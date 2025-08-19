<?php
// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Creating Sample Data</h2>";
    
    // Create locations table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) DEFAULT 'area',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create property_types table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS property_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Insert sample locations
    $locations = [
        ['Gulshan', 'area'],
        ['Dhanmondi', 'area'],
        ['Uttara', 'area'],
        ['Banani', 'area'],
        ['Bashundhara', 'area'],
        ['Motijheel', 'area'],
        ['Wari', 'area'],
        ['Mirpur', 'area']
    ];
    
    $stmt = $conn->prepare("INSERT IGNORE INTO locations (name, type) VALUES (?, ?)");
    foreach ($locations as $location) {
        $stmt->execute($location);
    }
    
    // Insert sample property types
    $propertyTypes = [
        ['Apartment', 'Modern apartment units'],
        ['House', 'Independent houses'],
        ['Villa', 'Luxury villas'],
        ['Commercial', 'Commercial properties'],
        ['Office', 'Office spaces'],
        ['Shop', 'Retail shops'],
        ['Land', 'Empty land plots']
    ];
    
    $stmt = $conn->prepare("INSERT IGNORE INTO property_types (name, description) VALUES (?, ?)");
    foreach ($propertyTypes as $type) {
        $stmt->execute($type);
    }
    
    echo "<p style='color: green;'>✅ Sample data created successfully!</p>";
    echo "<p>Locations: " . count($locations) . " entries</p>";
    echo "<p>Property Types: " . count($propertyTypes) . " entries</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>