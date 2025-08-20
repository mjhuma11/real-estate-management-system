<?php
// Script to fix properties data structure
header('Content-Type: text/html');

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Properties Data Structure Analysis</h2>";
    
    // Check current properties data
    $stmt = $conn->query("SELECT id, title, locations_id, address FROM properties WHERE locations_id IS NOT NULL");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Current Properties Data:</h3>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Title</th><th>locations_id</th><th>Address</th><th>Analysis</th></tr>";
    
    foreach ($properties as $property) {
        $analysis = '';
        if ($property['locations_id'] > 100) {
            $analysis = "Looks like AREA value (should be in separate area field)";
        } elseif ($property['locations_id'] <= 8) {
            $analysis = "Looks like valid LOCATION ID";
        } else {
            $analysis = "Unclear - could be area or location";
        }
        
        echo "<tr>";
        echo "<td>{$property['id']}</td>";
        echo "<td>{$property['title']}</td>";
        echo "<td>{$property['locations_id']}</td>";
        echo "<td>{$property['address']}</td>";
        echo "<td style='color: " . ($property['locations_id'] > 100 ? 'red' : 'green') . ";'>{$analysis}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Check locations table
    echo "<h3>Available Locations:</h3>";
    $stmt = $conn->query("SELECT id, name, type FROM locations ORDER BY id");
    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Name</th><th>Type</th></tr>";
    foreach ($locations as $location) {
        echo "<tr><td>{$location['id']}</td><td>{$location['name']}</td><td>{$location['type']}</td></tr>";
    }
    echo "</table>";
    
    echo "<h3>Recommendations:</h3>";
    echo "<ul>";
    echo "<li><strong>Add 'area' field</strong> to properties table to store area values</li>";
    echo "<li><strong>Use 'locations_id'</strong> to properly reference location IDs (1-8)</li>";
    echo "<li><strong>Current data</strong> has area values in locations_id field - needs migration</li>";
    echo "</ul>";
    
    echo "<h3>Suggested SQL to fix structure:</h3>";
    echo "<pre>";
    echo "-- Add area field to properties table\n";
    echo "ALTER TABLE properties ADD COLUMN area DECIMAL(10,2) AFTER bathrooms;\n\n";
    echo "-- Migrate area data from locations_id to area field\n";
    echo "UPDATE properties SET area = locations_id WHERE locations_id > 100;\n\n";
    echo "-- Set locations_id to NULL where it was storing area values\n";
    echo "UPDATE properties SET locations_id = NULL WHERE area IS NOT NULL;\n\n";
    echo "-- You can then manually set proper location IDs based on address\n";
    echo "-- For example:\n";
    echo "-- UPDATE properties SET locations_id = 1 WHERE address LIKE '%Gulshan%';\n";
    echo "-- UPDATE properties SET locations_id = 2 WHERE address LIKE '%Dhanmondi%';\n";
    echo "</pre>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>