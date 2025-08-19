<?php
// Simple test for register.php
header('Content-Type: text/html');

echo "<h2>Testing Register API</h2>";

// Test data
$testData = [
    'username' => 'testuser' . time(),
    'email' => 'test' . time() . '@example.com',
    'password' => 'password123'
];

echo "<p>Testing with data:</p>";
echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";

// Make the API call
$url = 'http://localhost/xampp/htdocs/WDPF/React-project/real-estate-management-system/API/register.php';
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);
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
    } else {
        echo "<p style='color: red;'>Failed to decode JSON. JSON Error: " . json_last_error_msg() . "</p>";
    }
}
?>