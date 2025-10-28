import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './contexts/CartContext';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCartAfterBooking } = useCart();
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get payment result from location state or URL parameters
    const result = location.state?.paymentResult || JSON.parse(localStorage.getItem('paymentResult') || '{}');
    
    if (Object.keys(result).length > 0) {
      setPaymentResult(result);
      localStorage.removeItem('paymentResult'); // Clean up
    } else {
      // Try to get from URL parameters
      const params = new URLSearchParams(location.search);
      const transactionId = params.get('tran_id');
      
      if (transactionId) {
        fetchPaymentDetails(transactionId);
      } else {
        setError('No payment information found');
      }
    }
    
    // Clear cart after successful booking
    clearCartAfterBooking();
    
    setLoading(false);
  }, [location, clearCartAfterBooking]);

  const fetchPaymentDetails = async (transactionId) => {
    try {
      // In a real implementation, you would fetch the payment details from your API
      // For now, we'll just show a generic success message
      setPaymentResult({
        transaction_id: transactionId,
        amount: 0,
        payment_method: 'SSLCommerz',
        property_title: 'Property Booking',
        customer_name: 'Customer',
        customer_email: 'customer@example.com',
        booking_confirmed: true
      });
    } catch (err) {
      setError('Failed to fetch payment details');
    }
  };

  const handleNewBooking = () => {
    navigate('/properties');
  };

  const handleViewBookings = () => {
    navigate('/user-bookings');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Processing your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-primary" onClick={() => navigate('/properties')}>
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-success text-white text-center py-4">
              <i className="fas fa-check-circle fa-3x mb-3"></i>
              <h2 className="mb-0">Booking Confirmed!</h2>
              <p className="mb-0">Your property booking has been successfully processed</p>
            </div>
            
            <div className="card-body p-5">
              {paymentResult && (
                <>
                  {/* Payment Receipt */}
                  <div className="receipt-section mb-5">
                    <h4 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-receipt me-2"></i>Payment Receipt
                    </h4>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Transaction ID:</strong></p>
                        <p className="text-muted">{paymentResult.transaction_id || 'N/A'}</p>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <p className="mb-1"><strong>Amount Paid:</strong></p>
                        <p className="text-success h5">
                          ৳{parseFloat(paymentResult.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Payment Method:</strong></p>
                        <p className="text-muted">
                          {paymentResult.payment_method?.replace('_', ' ').toUpperCase() || 'N/A'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Date:</strong></p>
                        <p className="text-muted">
                          {paymentResult.payment_date ? new Date(paymentResult.payment_date).toLocaleDateString() : new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="property-section mb-5">
                    <h4 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-home me-2"></i>Property Information
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-8">
                        <h5>{paymentResult.property_title || 'Property Booking'}</h5>
                        <p className="text-muted">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {paymentResult.property_address || 'Address not available'}
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <span className="badge bg-success fs-6">CONFIRMED</span>
                      </div>
                    </div>
                    
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Customer:</strong></p>
                        <p className="text-muted">{paymentResult.customer_name || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Email:</strong></p>
                        <p className="text-muted">{paymentResult.customer_email || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {paymentResult.appointment_id && (
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Appointment ID:</strong></p>
                          <p className="text-muted">#{paymentResult.appointment_id}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Status:</strong></p>
                          <p className="text-success">Confirmed</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Next Steps */}
                  <div className="next-steps-section">
                    <h4 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-list-check me-2"></i>What's Next?
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <i className="fas fa-calendar-check fa-2x text-primary mb-2"></i>
                          <h6>Appointment Confirmation</h6>
                          <p className="small text-muted">
                            Our team will contact you to schedule a property viewing
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <i className="fas fa-file-contract fa-2x text-primary mb-2"></i>
                          <h6>Documentation</h6>
                          <p className="small text-muted">
                            Prepare necessary documents for the booking process
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="text-center p-3 bg-light rounded">
                          <i className="fas fa-handshake fa-2x text-primary mb-2"></i>
                          <h6>Finalization</h6>
                          <p className="small text-muted">
                            Complete the remaining payment and finalize the deal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={handleNewBooking}
                >
                  <i className="fas fa-search me-2"></i>Browse More Properties
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg px-4"
                  onClick={handleViewBookings}
                >
                  <i className="fas fa-list me-2"></i>View My Bookings
                </button>
              </div>
            </div>
            
            <div className="card-footer text-center text-muted py-3">
              <small>
                <i className="fas fa-info-circle me-1"></i>
                A confirmation email has been sent to your registered email address
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;