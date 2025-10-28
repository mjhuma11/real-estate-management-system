import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './contexts/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearCartAfterPayment } = useCart();

  useEffect(() => {
    // Clear the cart after payment
    clearCartAfterPayment();
    
    // Show a success message
    alert('Payment successful! Your booking has been confirmed and your cart has been cleared.');
    
    // Redirect to the home page after a delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    
    // Clean up the timer
    return () => clearTimeout(timer);
  }, [navigate, clearCartAfterPayment]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <i className="fas fa-check-circle text-success mb-4" style={{ fontSize: '4rem' }}></i>
              <h2 className="text-success mb-3">Payment Successful!</h2>
              <p className="text-muted mb-4">
                Your booking has been confirmed and your cart has been cleared.
                You will be redirected to the home page shortly.
              </p>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Redirecting...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;