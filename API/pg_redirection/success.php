<?php
######
# THIS FILE IS ONLY AN EXAMPLE. PLEASE MODIFY AS REQUIRED.
# Contributors: 
#       Md. Rakibul Islam <rakibul.islam@sslwireless.com>
#       Prabal Mallick <prabal.mallick@sslwireless.com>
######

error_reporting(0);
ini_set('display_errors', 0);

// Process the payment success and confirm the appointment
require_once(__DIR__ . "/../lib/SslCommerzNotification.php");
require_once(__DIR__ . "/../db_connection.php");
require_once(__DIR__ . "/../OrderTransaction.php");

use SslCommerz\SslCommerzNotification;

$sslc = new SslCommerzNotification();
$tran_id = $_POST['tran_id'];
$amount =  $_POST['amount'];
$currency =  $_POST['currency'];

$ot = new OrderTransaction();
$sql = $ot->getRecordQuery($tran_id);
$result = $conn_integration->query($sql);
$row = $result->fetch_array(MYSQLI_ASSOC);

if ($row['status'] == 'Pending' || $row['status'] == 'Processing') {
    $validated = $sslc->orderValidate($_POST, $tran_id, $amount, $currency);

    if ($validated) {
        $sql = $ot->updateTransactionQuery($tran_id, 'Processing');

        if ($conn_integration->query($sql) === TRUE) {
            // Get additional data from SSLCommerz value fields
            $payment_plan_id = $_POST['value_a'] ?? '';
            $booking_type = $_POST['value_b'] ?? '';
            $property_id = $_POST['value_c'] ?? '';
            $user_id = $_POST['value_d'] ?? '';
            
            // If we have the required data, process the appointment
            if (!empty($payment_plan_id) && !empty($user_id) && !empty($property_id)) {
                // Update the payment transaction to mark it as completed
                $update_transaction_sql = "UPDATE payment_transactions SET payment_status = 'completed' WHERE transaction_id = ?";
                $update_transaction_stmt = $conn_integration->prepare($update_transaction_sql);
                $update_transaction_stmt->execute([$tran_id]);
                
                // Update appointment status to confirmed
                $update_appointment_sql = "UPDATE appointments SET status = 'confirmed' WHERE id = (SELECT appointment_id FROM payment_plans WHERE id = ?)";
                $update_appointment_stmt = $conn_integration->prepare($update_appointment_sql);
                $update_appointment_stmt->execute([$payment_plan_id]);
                
                // Set a flag in localStorage to indicate that the cart should be cleared
                // Redirect to the React payment success page with transaction data
                $redirect_url = "http://localhost:5173/booking-success?" . http_build_query($_POST);
                header("Location: " . $redirect_url);
                exit();
            } else {
                // Redirect with error if we can't process the booking
                $redirect_url = "http://localhost:5173/booking-success?error=partial_success&message=Payment successful but booking could not be processed completely";
                header("Location: " . $redirect_url);
                exit();
            }
        } else {
            // Redirect with error if we can't update the transaction
            $redirect_url = "http://localhost:5173/booking-success?error=update_failed&message=Error updating record";
            header("Location: " . $redirect_url);
            exit();
        }
    } else {
        // Redirect with error if payment validation failed
        $redirect_url = "http://localhost:5173/booking-success?error=validation_failed&message=Payment was not valid";
        header("Location: " . $redirect_url);
        exit();
    }
} else {
    // Redirect with error if status is invalid
    $redirect_url = "http://localhost:5173/booking-success?error=invalid_status&message=Invalid payment information";
    header("Location: " . $redirect_url);
    exit();
}
?>