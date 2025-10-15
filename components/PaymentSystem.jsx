import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';
import BookingSuccess from './BookingSuccess';

const PaymentSystem = ({ paymentPlanId, onClose }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (paymentPlanId) {
      fetchPaymentDetails();
    }
  }, [paymentPlanId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`API/get-payment-details.php?plan_id=${paymentPlanId}`);
      const result = await response.json();
      
      if (result.success) {
        setPaymentDetails(result);
      } else {
        setError(result.error || 'Failed to load payment details');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result);
    setPaymentComplete(true);
  };

  const handlePaymentError = (error) => {
    setError(error);
  };

  if (loading) {
    return (
      <div className="payment-system-overlay">
        <div className="payment-system-modal">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-system-overlay">
        <div className="payment-system-modal">
          <div className="error-container">
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentComplete && paymentResult) {
    return (
      <BookingSuccess 
        paymentResult={paymentResult}
        paymentDetails={paymentDetails}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="payment-system-overlay">
      <div className="payment-system-modal">
        <div className="payment-header">
          <h2>💳 Complete Your Payment</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <PaymentForm
          paymentDetails={paymentDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default PaymentSystem;