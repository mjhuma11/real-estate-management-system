<?php
// Migration script to add area field to properties table
header('Content-Type: text/html');

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Database Migration: Add Area Field</h2>";
    
    // Check if area column already exists
    $stmt = $conn->query("SHOW COLUMNS FROM properties LIKE 'area'");
    $areaExists = $stmt->rowCount() > 0;
    
    if ($areaExists) {
        echo "<p style='color: green;'>✅ Area column already exists!</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Area column does not exist. Adding it...</p>";
        
        // Add area column after bathrooms
        $conn->exec("ALTER TABLE properties ADD COLUMN area DECIMAL(10,2) AFTER bathrooms");
        echo "<p style='color: green;'>✅ Area column added successfully!</p>";
    }
    
    // Check current data structure
    echo "<h3>Current Properties Data:</h3>";
    $stmt = $conn->query("SELECT id, title, locations_id, area, address FROM properties LIMIT 5");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Title</th><th>locations_id</th><th>area</th><th>Address</th><th>Action Needed</th></tr>";
    
    $needsMigration = false;
    foreach ($properties as $property) {
        $actionNeeded = '';
        if ($property['locations_id'] > 100 && empty($property['area'])) {
            $actionNeeded = "Migrate locations_id ({$property['locations_id']}) to area field";
            $needsMigration = true;
        } elseif (!empty($property['area'])) {
            $actionNeeded = "✅ Area field populated";
        } else {
            $actionNeeded = "No area data";
        }
        
        echo "<tr>";
        echo "<td>{$property['id']}</td>";
        echo "<td>{$property['title']}</td>";
        echo "<td>{$property['locations_id']}</td>";
        echo "<td>{$property['area']}</td>";
        echo "<td>{$property['address']}</td>";
        echo "<td style='color: " . ($needsMigration ? 'red' : 'green') . ";'>{$actionNeeded}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    if ($needsMigration) {
        echo "<h3>Data Migration Required:</h3>";
        echo "<p>Some properties have area values stored in locations_id field. Would you like to migrate them?</p>";
        echo "<form method='POST'>";
        echo "<button type='submit' name='migrate' value='1' style='background: orange; color: white; padding: 10px 20px; border: none; cursor: pointer;'>Migrate Data</button>";
        echo "</form>";
        
        if (isset($_POST['migrate'])) {
            echo "<h4>Migrating Data...</h4>";
            
            // Migrate area data from locations_id to area field
            $migrateStmt = $conn->prepare("UPDATE properties SET area = locations_id WHERE locations_id > 100 AND (area IS NULL OR area = 0)");
            $migrateStmt->execute();
            $migratedCount = $migrateStmt->rowCount();
            
            // Set locations_id to NULL where it was storing area values
            $nullifyStmt = $conn->prepare("UPDATE properties SET locations_id = NULL WHERE locations_id > 100");
            $nullifyStmt->execute();
            $nullifiedCount = $nullifyStmt->rowCount();
            
            echo "<p style='color: green;'>✅ Migrated {$migratedCount} properties</p>";
            echo "<p style='color: green;'>✅ Cleared {$nullifiedCount} invalid location IDs</p>";
            echo "<p><a href='{$_SERVER['PHP_SELF']}'>Refresh to see updated data</a></p>";
        }
    } else {
        echo "<p style='color: green;'>✅ No data migration needed!</p>";
    }
    
    echo "<h3>Database Structure:</h3>";
    $stmt = $conn->query("DESCRIBE properties");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    foreach ($columns as $column) {
        $highlight = ($column['Field'] == 'area' || $column['Field'] == 'locations_id') ? 'background: yellow;' : '';
        echo "<tr style='{$highlight}'>";
        echo "<td>{$column['Field']}</td>";
        echo "<td>{$column['Type']}</td>";
        echo "<td>{$column['Null']}</td>";
        echo "<td>{$column['Key']}</td>";
        echo "<td>{$column['Default']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>