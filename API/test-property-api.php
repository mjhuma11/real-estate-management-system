<?php
require_once 'config.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Property API Test</h2>";

// Test 1: Check if database connection works
echo "<h3>Test 1: Database Connection</h3>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM properties");
    $result = $stmt->fetch();
    echo "✅ Database connection successful. Total properties: " . $result['count'] . "<br>";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
    exit;
}

// Test 2: Check if categories table exists and has data
echo "<h3>Test 2: Categories Table</h3>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM categories");
    $result = $stmt->fetch();
    echo "✅ Categories table exists. Total categories: " . $result['count'] . "<br>";
    
    if ($result['count'] > 0) {
        $stmt = $conn->query("SELECT id, name FROM categories LIMIT 3");
        $categories = $stmt->fetchAll();
        echo "Sample categories: ";
        foreach ($categories as $cat) {
            echo $cat['name'] . " (ID: " . $cat['id'] . "), ";
        }
        echo "<br>";
    }
} catch (Exception $e) {
    echo "❌ Categories table error: " . $e->getMessage() . "<br>";
}

// Test 3: Check if locations table exists and has data
echo "<h3>Test 3: Locations Table</h3>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM locations");
    $result = $stmt->fetch();
    echo "✅ Locations table exists. Total locations: " . $result['count'] . "<br>";
    
    if ($result['count'] > 0) {
        $stmt = $conn->query("SELECT id, name, type FROM locations LIMIT 3");
        $locations = $stmt->fetchAll();
        echo "Sample locations: ";
        foreach ($locations as $loc) {
            echo $loc['name'] . " (" . $loc['type'] . "), ";
        }
        echo "<br>";
    }
} catch (Exception $e) {
    echo "❌ Locations table error: " . $e->getMessage() . "<br>";
}

// Test 4: Check if features table exists and has data
echo "<h3>Test 4: Features Table</h3>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM features");
    $result = $stmt->fetch();
    echo "✅ Features table exists. Total features: " . $result['count'] . "<br>";
} catch (Exception $e) {
    echo "❌ Features table error: " . $e->getMessage() . "<br>";
}

// Test 5: Check if users table exists and has agents
echo "<h3>Test 5: Users Table (Agents)</h3>";
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'agent'");
    $result = $stmt->fetch();
    echo "✅ Users table exists. Total agents: " . $result['count'] . "<br>";
} catch (Exception $e) {
    echo "❌ Users table error: " . $e->getMessage() . "<br>";
}

// Test 6: Test GET request to add-property.php
echo "<h3>Test 6: GET Request to add-property.php</h3>";
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/WDPF/React-project/real-estate-management-system/API/add-property.php");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: " . $httpCode . "<br>";
    echo "Response: " . $response . "<br>";
    
    $data = json_decode($response, true);
    if ($data && isset($data['success'])) {
        echo "✅ GET request successful<br>";
    } else {
        echo "❌ GET request failed<br>";
    }
} catch (Exception $e) {
    echo "❌ GET request error: " . $e->getMessage() . "<br>";
}

// Test 7: Test POST request to add-property.php
echo "<h3>Test 7: POST Request to add-property.php</h3>";
try {
    $testData = [
        'title' => 'Test Property ' . date('Y-m-d H:i:s'),
        'type' => 'For Sale',
        'price' => 5000000,
        'description' => 'This is a test property',
        'bedrooms' => 3,
        'bathrooms' => 2,
        'area' => 1200,
        'area_unit' => 'sq_ft',
        'status' => 'available',
        'featured' => 0
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/WDPF/React-project/real-estate-management-system/API/add-property.php");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: " . $httpCode . "<br>";
    echo "Response: " . $response . "<br>";
    
    $data = json_decode($response, true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "✅ POST request successful. Property ID: " . $data['property_id'] . "<br>";
    } else {
        echo "❌ POST request failed: " . ($data['error'] ?? 'Unknown error') . "<br>";
    }
} catch (Exception $e) {
    echo "❌ POST request error: " . $e->getMessage() . "<br>";
}

echo "<h3>Test Complete</h3>";
echo "<p>Check the results above to identify any issues with the Property API.</p>";
?>
