<?php
// Simple test for properties API
header('Content-Type: text/html');

echo "<h2>Testing Properties API</h2>";

// Test the simple API
$url = 'http://localhost/WDPF/React-project/real-estate-management-system/API/list-properties-simple.php';
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "<h3>Response:</h3>";
echo "<p>HTTP Code: $httpCode</p>";

if ($error) {
    echo "<p style='color: red;'>cURL Error: $error</p>";
}

echo "<p>Raw Response:</p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

if ($response) {
    $decoded = json_decode($response, true);
    if ($decoded) {
        echo "<p>Decoded JSON:</p>";
        echo "<pre>" . json_encode($decoded, JSON_PRETTY_PRINT) . "</pre>";
        
        if ($decoded['success']) {
            echo "<p style='color: green;'>✅ API is working correctly!</p>";
            echo "<p>Found " . count($decoded['data']) . " properties</p>";
        } else {
            echo "<p style='color: red;'>❌ API returned error: " . $decoded['error'] . "</p>";
        }
    } else {
        echo "<p style='color: red;'>Failed to decode JSON. JSON Error: " . json_last_error_msg() . "</p>";
    }
}
?>