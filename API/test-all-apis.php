<?php
// Simple test for all APIs
header('Content-Type: text/html');

echo "<h2>Testing All APIs</h2>";

$apis = [
    'Properties' => 'list-properties-simple.php',
    'Locations' => 'locations-simple.php',
    'Property Types' => 'property-types-simple.php'
];

foreach ($apis as $name => $endpoint) {
    echo "<h3>Testing $name API</h3>";
    
    $url = "http://localhost/WDPF/React-project/real-estate-management-system/API/$endpoint";
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    echo "<p>HTTP Code: $httpCode</p>";
    
    if ($error) {
        echo "<p style='color: red;'>cURL Error: $error</p>";
    } else {
        $decoded = json_decode($response, true);
        if ($decoded && $decoded['success']) {
            echo "<p style='color: green;'>✅ $name API is working!</p>";
            echo "<p>Found " . count($decoded['data']) . " items</p>";
        } else {
            echo "<p style='color: red;'>❌ $name API failed</p>";
            echo "<pre>" . htmlspecialchars($response) . "</pre>";
        }
    }
    
    echo "<hr>";
}
?>