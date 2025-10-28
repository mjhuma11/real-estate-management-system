import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorData, setErrorData] = useState(null);

  useEffect(() => {
    // Get error data from URL parameters
    const params = new URLSearchParams(location.search);
    const errorInfo = {};
    
    for (const [key, value] of params.entries()) {
      errorInfo[key] = value;
    }
    
    setErrorData(errorInfo);
  }, [location]);

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleBrowseProperties = () => {
    navigate('/properties');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-danger text-white text-center py-4">
              <i className="fas fa-times-circle fa-3x mb-3"></i>
              <h2 className="mb-0">Payment Failed</h2>
              <p className="mb-0">Your payment could not be processed</p>
            </div>
            
            <div className="card-body p-5">
              <div className="alert alert-warning mb-4">
                <h5 className="alert-heading">
                  <i className="fas fa-exclamation-triangle me-2"></i>Payment Not Completed
                </h5>
                <p className="mb-0">
                  Your property booking payment was not successful. No charges have been made to your account.
                </p>
              </div>

              {errorData && (
                <div className="payment-details mb-4">
                  <h5 className="border-bottom pb-2 mb-3">Payment Information</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Transaction ID:</strong></p>
                      <p className="text-muted">{errorData.tran_id || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Amount:</strong></p>
                      <p className="text-muted">
                        {errorData.amount ? `৳${parseFloat(errorData.amount).toLocaleString()}` : 'N/A'} {errorData.currency || ''}
                      </p>
                    </div>
                  </div>
                  
                  {errorData.error && (
                    <div className="mb-3">
                      <p className="mb-1"><strong>Error Message:</strong></p>
                      <p className="text-danger">{errorData.error}</p>
                    </div>
                  )}
                  
                  {errorData.card_issuer && (
                    <div className="mb-3">
                      <p className="mb-1"><strong>Payment Method:</strong></p>
                      <p className="text-muted">{errorData.card_issuer}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="instructions mb-4">
                <h5 className="border-bottom pb-2 mb-3">What You Can Do</h5>
                <ul>
                  <li>Check your payment details and try again</li>
                  <li>Ensure you have sufficient funds in your account</li>
                  <li>Try a different payment method</li>
                  <li>Contact your bank if the issue persists</li>
                </ul>
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={handleRetry}
                >
                  <i className="fas fa-redo me-2"></i>Retry Payment
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg px-4"
                  onClick={handleBrowseProperties}
                >
                  <i className="fas fa-search me-2"></i>Browse Properties
                </button>
              </div>
            </div>
            
            <div className="card-footer text-center text-muted py-3">
              <small>
                <i className="fas fa-headset me-1"></i>
                Need help? Contact our support team at support@netro-estate.com
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;