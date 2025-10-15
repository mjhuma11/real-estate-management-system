import React, { useState } from 'react';

const PaymentForm = ({ paymentDetails, onPaymentSuccess, onPaymentError }) => {
  const [formData, setFormData] = useState({
    amount: paymentDetails?.initial_payment_required || 0,
    payment_method: '',
    transaction_type: paymentDetails?.plan?.booking_type === 'sale' ? 'down_payment' : 'advance_deposit',
    payment_reference: '',
    bank_name: '',
    account_number: '',
    cheque_number: '',
    mobile_banking_service: '',
    mobile_number: '',
    notes: ''
  });
  
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const paymentData = {
        ...formData,
        payment_plan_id: paymentDetails.plan.id
      };

      const response = await fetch('API/process-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        onPaymentSuccess(result.data);
      } else {
        onPaymentError(result.error || 'Payment processing failed');
      }
    } catch (error) {
      onPaymentError('Network error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const { plan } = paymentDetails;

  return (
    <div className="payment-form-container">
      {/* Property Summary */}
      <div className="property-summary">
        <h3>🏠 {plan.property_title}</h3>
        <p className="property-address">{plan.address}</p>
        <div className="booking-info">
          <span className="booking-type">
            {plan.booking_type === 'sale' ? '🏡 Purchase' : '🏠 Rental'}
          </span>
          <span className="booking-date">
            📅 {new Date(plan.booking_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="payment-summary">
        <h4>💰 Payment Required</h4>
        <div className="amount-display">
          <span className="currency">৳</span>
          <span className="amount">{paymentDetails.initial_payment_required.toLocaleString()}</span>
        </div>
        <p className="payment-description">{paymentDetails.payment_description}</p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount (৳)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="payment_method">Payment Method</label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Method</option>
              <option value="cash">💵 Cash</option>
              <option value="bank_transfer">🏦 Bank Transfer</option>
              <option value="cheque">📝 Cheque</option>
              <option value="online">💳 Online Payment</option>
              <option value="mobile_banking">📱 Mobile Banking</option>
            </select>
          </div>
        </div>

        {/* Conditional Fields Based on Payment Method */}
        {formData.payment_method === 'bank_transfer' && (
          <div className="conditional-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bank_name">Bank Name</label>
                <input
                  type="text"
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Dutch Bangla Bank"
                />
              </div>
              <div className="form-group">
                <label htmlFor="account_number">Account Number</label>
                <input
                  type="text"
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="Account number"
                />
              </div>
            </div>
          </div>
        )}

        {formData.payment_method === 'cheque' && (
          <div className="conditional-fields">
            <div className="form-group">
              <label htmlFor="cheque_number">Cheque Number</label>
              <input
                type="text"
                id="cheque_number"
                name="cheque_number"
                value={formData.cheque_number}
                onChange={handleInputChange}
                placeholder="Cheque number"
              />
            </div>
          </div>
        )}

        {formData.payment_method === 'mobile_banking' && (
          <div className="conditional-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile_banking_service">Service</label>
                <select
                  id="mobile_banking_service"
                  name="mobile_banking_service"
                  value={formData.mobile_banking_service}
                  onChange={handleInputChange}
                >
                  <option value="">Select Service</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="upay">Upay</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="mobile_number">Mobile Number</label>
                <input
                  type="text"
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  placeholder="+880-XXXXXXXXX"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="payment_reference">Transaction Reference (Optional)</label>
          <input
            type="text"
            id="payment_reference"
            name="payment_reference"
            value={formData.payment_reference}
            onChange={handleInputChange}
            placeholder="Transaction ID or reference number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder="Any additional notes..."
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={processing}
        >
          {processing ? (
            <>
              <span className="spinner-small"></span>
              Processing Payment...
            </>
          ) : (
            <>
              💳 Complete Payment - ৳{formData.amount.toLocaleString()}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;