
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

// Get input data (from POST or JSON)
$input_data = [];
if (!empty($_POST)) {
    $input_data = $_POST;
} else {
    $json_input = json_decode(file_get_contents('php://input'), true);
    $input_data = $json_input ?? [];
}

// Load configuration
$config = include(__DIR__ . '/config.php');

$post_data = array();
$post_data['store_id'] = STORE_ID;
$post_data['store_passwd'] = STORE_PASSWORD;
$post_data['total_amount'] = $input_data['amount'] ?? "50";
$post_data['currency'] = "BDT";
$post_data['tran_id'] = "NETRO_" . time() . "_" . uniqid();

// Use proper URLs from config
$post_data['success_url'] = PROJECT_PATH . '/' . $config['success_url'];
$post_data['fail_url'] = PROJECT_PATH . '/' . $config['failed_url'];
$post_data['cancel_url'] = PROJECT_PATH . '/' . $config['cancel_url'];

# CUSTOMER INFORMATION
$post_data['cus_name'] = $input_data['cus_name'] ?? "Customer Name";
$post_data['cus_email'] = $input_data['cus_email'] ?? "customer@email.com";
$post_data['cus_add1'] = $input_data['cus_add1'] ?? "Dhaka";
$post_data['cus_add2'] = $input_data['cus_add2'] ?? "Dhaka";
$post_data['cus_city'] = $input_data['cus_city'] ?? "Dhaka";
$post_data['cus_state'] = $input_data['cus_state'] ?? "Dhaka";
$post_data['cus_postcode'] = $input_data['cus_postcode'] ?? "1000";
$post_data['cus_country'] = $input_data['cus_country'] ?? "Bangladesh";
$post_data['cus_phone'] = $input_data['cus_phone'] ?? '01700000000';
$post_data['cus_fax'] = $input_data['cus_fax'] ?? "";

# SHIPMENT INFORMATION
$post_data['ship_name'] = $input_data['ship_name'] ?? "NETRO Real Estate";
$post_data['ship_add1'] = $input_data['ship_add1'] ?? "Dhaka";
$post_data['ship_add2'] = $input_data['ship_add2'] ?? "Dhaka";
$post_data['ship_city'] = $input_data['ship_city'] ?? "Dhaka";
$post_data['ship_state'] = $input_data['ship_state'] ?? "Dhaka";
$post_data['ship_postcode'] = $input_data['ship_postcode'] ?? "1000";
$post_data['ship_country'] = $input_data['ship_country'] ?? "Bangladesh";

# PRODUCT INFORMATION
$post_data['product_name'] = $input_data['product_name'] ?? "Real Estate Property";
$post_data['product_category'] = $input_data['product_category'] ?? "Real Estate";
$post_data['product_profile'] = $input_data['product_profile'] ?? "general";

# OPTIONAL PARAMETERS - Store booking information
$post_data['value_a'] = $input_data['payment_plan_id'] ?? ""; // Payment Plan ID
$post_data['value_b'] = $input_data['booking_type'] ?? ""; // Sale or Rent
$post_data['value_c'] = $input_data['property_id'] ?? ""; // Property ID
$post_data['value_d'] = $input_data['user_id'] ?? ""; // User ID

# EMI STATUS
$post_data['emi_option'] = $input_data['emi_option'] ?? "0";

# SHIPPING METHOD
$post_data['shipping_method'] = "NO";
$post_data['num_of_item'] = "1";

# CART PARAMETERS (Optional)
if (isset($input_data['cart']) && !empty($input_data['cart'])) {
    $post_data['cart'] = json_encode($input_data['cart']);
}

# PRICING BREAKDOWN (Optional)
$post_data['product_amount'] = $input_data['product_amount'] ?? $post_data['total_amount'];
$post_data['vat'] = $input_data['vat'] ?? "0";
$post_data['discount_amount'] = $input_data['discount_amount'] ?? "0";
$post_data['convenience_fee'] = $input_data['convenience_fee'] ?? "0";


//$post_data['allowed_bin'] = "3,4";
//$post_data['allowed_bin'] = "470661";
//$post_data['allowed_bin'] = "470661,376947";


# REQUEST SEND TO SSLCOMMERZ
$direct_api_url = $config['apiDomain'] . $config['apiUrl']['make_payment'];

try {
    // Save transaction to database before sending to SSL Commerce
    $save_sql = "INSERT INTO payment_transactions (
        payment_plan_id, user_id, property_id, transaction_type, 
        amount, payment_method, transaction_id, payment_status, 
        payment_date, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)";

    $save_stmt = $conn->prepare($save_sql);
    $save_stmt->execute([
        $post_data['value_a'] ?? null, // payment_plan_id
        $post_data['value_d'] ?? null, // user_id
        $post_data['value_c'] ?? null, // property_id
        'online_payment',
        $post_data['total_amount'],
        'sslcommerz',
        $post_data['tran_id'],
        date('Y-m-d H:i:s'),
        'SSL Commerce Easy Checkout Payment'
    ]);

    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $direct_api_url);
    curl_setopt($handle, CURLOPT_TIMEOUT, 30);
    curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
    curl_setopt($handle, CURLOPT_POST, 1);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

    // SSL verification based on environment
    if (IS_SANDBOX || $config['connect_from_localhost']) {
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, FALSE);
    } else {
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, TRUE);
        curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 2);
    }

    $content = curl_exec($handle);
    $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($handle);

    if ($code == 200 && !curl_errno($handle)) {
        curl_close($handle);
        $sslcommerzResponse = $content;
    } else {
        curl_close($handle);

        // Log the error
        error_log("SSL Commerce API Error: HTTP Code: $code, cURL Error: $curl_error");

        echo json_encode([
            'status' => 'fail',
            'data' => null,
            'message' => 'Failed to connect with SSL Commerce API. Please try again.'
        ]);
        exit;
    }
} catch (Exception $e) {
    error_log("Easy Checkout Error: " . $e->getMessage());
    echo json_encode([
        'status' => 'fail',
        'data' => null,
        'message' => 'Payment initialization failed: ' . $e->getMessage()
    ]);
    exit;
}

# PARSE THE JSON RESPONSE
$sslcz = json_decode($sslcommerzResponse, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'fail',
        'data' => null,
        'message' => 'Invalid response from SSL Commerce API'
    ]);
    exit;
}

if (isset($sslcz['GatewayPageURL']) && $sslcz['GatewayPageURL'] != "") {
    // Success - return gateway URL for redirection
    echo json_encode([
        'status' => 'success',
        'data' => $sslcz['GatewayPageURL'],
        'logo' => $sslcz['storeLogo'] ?? '',
        'transaction_id' => $post_data['tran_id'],
        'amount' => $post_data['total_amount'],
        'currency' => $post_data['currency']
    ]);
} else {
    // Failed - return error message
    $error_message = "Payment gateway initialization failed";

    if (isset($sslcz['failedreason'])) {
        if (strpos($sslcz['failedreason'], 'Store Credential') !== false) {
            $error_message = "SSL Commerce configuration error. Please check store credentials.";
        } else {
            $error_message = $sslcz['failedreason'];
        }
    }

    echo json_encode([
        'status' => 'fail',
        'data' => null,
        'message' => $error_message,
        'debug_info' => IS_SANDBOX ? $sslcz : null // Only show debug info in sandbox
    ]);
}
?>
                            		