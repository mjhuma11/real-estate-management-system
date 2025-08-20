<?php
// Check properties table structure
header('Content-Type: text/html');

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Properties Table Structure</h2>";
    
    $stmt = $conn->query("DESCRIBE properties");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($columns as $column) {
        $highlight = '';
        if (in_array($column['Field'], ['area', 'locations_id', 'location'])) {
            $highlight = 'background: yellow;';
        }
        echo "<tr style='{$highlight}'>";
        echo "<td>{$column['Field']}</td>";
        echo "<td>{$column['Type']}</td>";
        echo "<td>{$column['Null']}</td>";
        echo "<td>{$column['Key']}</td>";
        echo "<td>{$column['Default']}</td>";
        echo "<td>{$column['Extra']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h3>Sample Data:</h3>";
    $stmt = $conn->query("SELECT * FROM properties LIMIT 2");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($properties)) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%; font-size: 12px;'>";
        echo "<tr>";
        foreach (array_keys($properties[0]) as $key) {
            echo "<th>{$key}</th>";
        }
        echo "</tr>";
        
        foreach ($properties as $property) {
            echo "<tr>";
            foreach ($property as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>