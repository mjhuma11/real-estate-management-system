import React from 'react';

const BookingSuccess = ({ paymentResult, paymentDetails, onClose }) => {
  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Create a simple receipt content
    const receiptContent = `
      NETRO ESTATE - PAYMENT RECEIPT
      ================================
      
      Receipt No: ${paymentResult.receipt_number}
      Date: ${new Date(paymentResult.payment_date).toLocaleString()}
      
      PROPERTY DETAILS:
      Property: ${paymentResult.property_title}
      Customer: ${paymentResult.customer_name}
      Email: ${paymentResult.customer_email}
      
      PAYMENT DETAILS:
      Amount: ৳${paymentResult.amount.toLocaleString()}
      Method: ${paymentResult.payment_method.replace('_', ' ').toUpperCase()}
      Type: ${paymentResult.transaction_type.replace('_', ' ').toUpperCase()}
      
      Status: COMPLETED
      
      Thank you for your payment!
      
      ================================
      Netro Estate Management System
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentResult.receipt_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="booking-success-overlay">
      <div className="booking-success-modal">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your payment has been processed successfully</p>
        </div>

        <div className="success-content">
          {/* Payment Summary */}
          <div className="payment-receipt">
            <h3>📄 Payment Receipt</h3>
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Receipt Number:</span>
                <strong>{paymentResult.receipt_number}</strong>
              </div>
              <div className="receipt-row">
                <span>Transaction ID:</span>
                <strong>{paymentResult.transaction_id}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Date:</span>
                <strong>{new Date(paymentResult.payment_date).toLocaleString()}</strong>
              </div>
              <div className="receipt-row">
                <span>Amount Paid:</span>
                <strong className="amount">৳{paymentResult.amount.toLocaleString()}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <strong>{paymentResult.payment_method.replace('_', ' ').toUpperCase()}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment Type:</span>
                <strong>{paymentResult.transaction_type.replace('_', ' ').toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="property-details">
            <h3>🏠 Property Information</h3>
            <div className="property-info">
              <h4>{paymentResult.property_title}</h4>
              <p><strong>Customer:</strong> {paymentResult.customer_name}</p>
              <p><strong>Email:</strong> {paymentResult.customer_email}</p>
              <p><strong>Booking Status:</strong> 
                <span className="status-confirmed">CONFIRMED</span>
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>📋 What's Next?</h3>
            <div className="steps-list">
              {paymentDetails.plan.booking_type === 'sale' ? (
                <>
                  <div className="step-item">
                    <span className="step-number">1</span>
                    <div className="step-content">
                      <strong>Documentation Process</strong>
                      <p>Our team will contact you within 24 hours to begin the property documentation process.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <strong>Installment Schedule</strong>
                      <p>Your installment schedule has been created. You'll receive payment reminders before each due date.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">3</span>
                    <div className="step-content">
                      <strong>Property Handover</strong>
                      <p>Final handover will be scheduled after completion of all payments and documentation.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="step-item">
                    <span className="step-number">1</span>
                    <div className="step-content">
                      <strong>Lease Agreement</strong>
                      <p>We'll prepare your lease agreement and schedule a signing appointment.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <strong>Property Inspection</strong>
                      <p>Schedule a property inspection before moving in to document the current condition.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-number">3</span>
                    <div className="step-content">
                      <strong>Monthly Rent</strong>
                      <p>Your monthly rent schedule is active. First rent payment is due next month.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={handlePrintReceipt} className="btn btn-secondary">
            🖨️ Print Receipt
          </button>
          <button onClick={handleDownloadReceipt} className="btn btn-secondary">
            📥 Download Receipt
          </button>
          <button onClick={onClose} className="btn btn-primary">
            ✅ Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;