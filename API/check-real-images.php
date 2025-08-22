<?php
header('Content-Type: text/html');

// Database connection
$host = 'localhost';
$dbname = 'netro-estate';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Database Image Check</h2>";
    
    // Check what's in the database
    $sql = "SELECT id, title, image FROM properties ORDER BY id DESC";
    $stmt = $conn->query($sql);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<p><strong>Total properties found:</strong> " . count($properties) . "</p>";
    
    $propertiesWithImages = 0;
    $workingImages = 0;
    
    foreach($properties as $property) {
        echo "<div style='border: 1px solid #ccc; margin: 10px; padding: 10px;'>";
        echo "<h3>Property ID: {$property['id']} - {$property['title']}</h3>";
        echo "<p><strong>Image field:</strong> " . ($property['image'] ? $property['image'] : 'NULL/Empty') . "</p>";
        
        if (!empty($property['image'])) {
            $propertiesWithImages++;
            $filePath = __DIR__ . '/../uploads/properties/' . $property['image'];
            $fileExists = file_exists($filePath);
            
            echo "<p><strong>File exists:</strong> " . ($fileExists ? 'YES' : 'NO') . "</p>";
            echo "<p><strong>File path:</strong> {$filePath}</p>";
            
            if ($fileExists) {
                $workingImages++;
                $imageUrl = "http://localhost/WDPF/React-project/real-estate-management-system/uploads/properties/" . $property['image'];
                echo "<p><strong>Image URL:</strong> <a href='{$imageUrl}' target='_blank'>{$imageUrl}</a></p>";
                echo "<img src='{$imageUrl}' style='max-width: 200px; max-height: 150px;' />";
            } else {
                echo "<p style='color: red;'>Image file missing!</p>";
            }
        } else {
            echo "<p style='color: orange;'>No image in database</p>";
        }
        echo "</div>";
    }
    
    echo "<h3>Summary:</h3>";
    echo "<p>Properties with image field: {$propertiesWithImages}</p>";
    echo "<p>Properties with working image files: {$workingImages}</p>";
    
    // Check uploads directory
    $uploadsDir = __DIR__ . '/../uploads/properties/';
    echo "<h3>Uploads Directory Check:</h3>";
    echo "<p><strong>Directory:</strong> {$uploadsDir}</p>";
    echo "<p><strong>Directory exists:</strong> " . (is_dir($uploadsDir) ? 'YES' : 'NO') . "</p>";
    
    if (is_dir($uploadsDir)) {
        $files = scandir($uploadsDir);
        $imageFiles = array_filter($files, function($file) {
            return !in_array($file, ['.', '..', 'thumbnails']) && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file);
        });
        echo "<p><strong>Image files found:</strong> " . count($imageFiles) . "</p>";
        if (count($imageFiles) > 0) {
            echo "<ul>";
            foreach($imageFiles as $file) {
                echo "<li>{$file}</li>";
            }
            echo "</ul>";
        }
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}
?>
