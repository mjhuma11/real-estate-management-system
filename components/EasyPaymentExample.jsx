import React, { useState } from 'react';
import EasyPaymentModal from './EasyPaymentModal';

const EasyPaymentExample = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(150000);
  const [merchantName, setMerchantName] = useState('Demo');

  // Sample payment data that would come from your booking system
  const samplePaymentData = {
    cus_name: "John Doe",
    cus_email: "john.doe@email.com",
    cus_phone: "01700000000",
    cus_add1: "Dhaka, Bangladesh",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    product_name: "Luxury Apartment in Gulshan",
    product_category: "Real Estate",
    product_profile: "general",
    payment_plan_id: 1,
    booking_type: "sale",
    property_id: 17,
    user_id: 1,
    ship_name: "John Doe",
    ship_add1: "Dhaka, Bangladesh",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh"
  };

  const handlePaymentSubmit = (result) => {
    console.log('Payment result:', result);
    if (result.status === 'success') {
      alert('Payment initiated successfully! Redirecting to SSL Commerce...');
    } else {
      alert('Payment failed: ' + result.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD').format(amount);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-credit-card me-2"></i>
                SSL Commerce Easy Payment Demo
              </h4>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="fw-bold">Property Booking Payment</h5>
                  <p className="text-muted">Luxury Apartment in Gulshan</p>
                  <div className="mb-3">
                    <span className="badge bg-success">For Sale</span>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <div className="payment-summary">
                    <div className="text-muted">Total Amount</div>
                    <div className="h3 text-primary fw-bold">
                      ৳{formatCurrency(paymentAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Options */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Payment Amount (৳)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                    min="1"
                    step="1000"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Merchant Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Enter merchant name"
                  />
                </div>
              </div>

              {/* Customer Information Display */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Customer Information</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {samplePaymentData.cus_name}</p>
                      <p><strong>Email:</strong> {samplePaymentData.cus_email}</p>
                      <p><strong>Phone:</strong> {samplePaymentData.cus_phone}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {samplePaymentData.cus_add1}</p>
                      <p><strong>Property:</strong> {samplePaymentData.product_name}</p>
                      <p><strong>Booking Type:</strong> {samplePaymentData.booking_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Pay ৳{formatCurrency(paymentAmount)} with SSL Commerce
                </button>
              </div>

              {/* Instructions */}
              <div className="alert alert-info mt-4">
                <h6 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  Test Instructions
                </h6>
                <ul className="mb-0">
                  <li><strong>Test Card Numbers:</strong> Use 4111111111111111 (Visa) or 5555555555554444 (Mastercard)</li>
                  <li><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</li>
                  <li><strong>CVV:</strong> Any 3-4 digit number (e.g., 123)</li>
                  <li><strong>Card Holder:</strong> Any name</li>
                  <li><strong>Environment:</strong> This is using SSL Commerce sandbox mode</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="fw-bold text-success mb-3">
                <i className="fas fa-check-circle me-2"></i>
                Payment Modal Features
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>SSL Commerce Integration</li>
                    <li><i className="fas fa-check text-success me-2"></i>Card Number Formatting</li>
                    <li><i className="fas fa-check text-success me-2"></i>Real-time Validation</li>
                    <li><i className="fas fa-check text-success me-2"></i>Multiple Payment Methods</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Responsive Design</li>
                    <li><i className="fas fa-check text-success me-2"></i>Error Handling</li>
                    <li><i className="fas fa-check text-success me-2"></i>Loading States</li>
                    <li><i className="fas fa-check text-success me-2"></i>Accessibility Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Easy Payment Modal */}
      {showPaymentModal && (
        <EasyPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={paymentAmount}
          currency="BDT"
          merchantName={merchantName}
          paymentData={samplePaymentData}
          onPaymentSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default EasyPaymentExample;