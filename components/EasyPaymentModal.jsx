import React, { useState, useEffect } from 'react';
import './EasyPaymentModal.css';

const EasyPaymentModal = ({ 
  isOpen, 
  onClose, 
  amount = 150000, 
  currency = 'BDT',
  merchantName = 'Demo',
  paymentData = {},
  onPaymentSubmit 
}) => {
  const [activeTab, setActiveTab] = useState('CARDS');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        saveCard: false
      });
      setErrors({});
      setActiveTab('CARDS');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      processedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (processedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      processedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (processedValue.length > 5) return;
    }

    // Format CVV
    if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 4) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Card holder name validation
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const paymentPayload = {
        ...paymentData,
        amount: amount,
        currency: currency,
        card_number: formData.cardNumber.replace(/\s/g, ''),
        expiry_date: formData.expiryDate,
        cvv: formData.cvv,
        card_holder_name: formData.cardHolderName,
        save_card: formData.saveCard
      };

      // Call the easycheckout API
      const response = await fetch('API/easycheckout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Redirect to SSL Commerce gateway
        window.location.href = result.data;
      } else {
        throw new Error(result.message || 'Payment failed');
      }

      if (onPaymentSubmit) {
        onPaymentSubmit(result);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'other';
  };

  if (!isOpen) return null;

  return (
    <div className="easy-payment-overlay">
      <div className="easy-payment-modal">
        {/* Header */}
        <div className="payment-header">
          <div className="merchant-logo">
            <div className="demo-logo">
              <i className="fas fa-mouse-pointer"></i>
              <span>DEMO</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Merchant Name */}
        <div className="merchant-name">
          <h2>{merchantName}</h2>
        </div>

        {/* Navigation Icons */}
        <div className="nav-icons">
          <div className="nav-icon">
            <i className="fas fa-headset"></i>
            <span>Support</span>
          </div>
          <div className="nav-icon">
            <i className="fas fa-question-circle"></i>
            <span>FAQ</span>
          </div>
          <div className="nav-icon">
            <i className="fas fa-gift"></i>
            <span>Offers</span>
            <span className="notification-badge">3</span>
          </div>
          <div className="nav-icon">
            <i className="fas fa-user"></i>
            <span>Login</span>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="payment-tabs">
          <button 
            className={`tab-btn ${activeTab === 'CARDS' ? 'active' : ''}`}
            onClick={() => setActiveTab('CARDS')}
          >
            CARDS
          </button>
          <button 
            className={`tab-btn ${activeTab === 'MOBILE_BANKING' ? 'active' : ''}`}
            onClick={() => setActiveTab('MOBILE_BANKING')}
          >
            MOBILE BANKING
          </button>
          <button 
            className={`tab-btn ${activeTab === 'NET_BANKING' ? 'active' : ''}`}
            onClick={() => setActiveTab('NET_BANKING')}
          >
            NET BANKING
          </button>
        </div>

        {/* Payment Content */}
        <div className="payment-content">
          {activeTab === 'CARDS' && (
            <div className="cards-section">
              {/* Card Types */}
              <div className="card-types">
                <div className="card-type visa">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8dGV4dCB4PSI1IiB5PSIxNiIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPlZJU0E8L3RleHQ+Cjwvc3ZnPgo=" alt="Visa" />
                </div>
                <div className="card-type mastercard">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTIiIHI9IjYiIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+Cg==" alt="Mastercard" />
                </div>
                <div className="card-type amex">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNkZDRiIvPgo8dGV4dCB4PSI4IiB5PSIxNiIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCI+QU1FWDwvdGV4dD4KPC9zdmc+Cg==" alt="Amex" />
                </div>
                <span className="other-cards">Other Cards</span>
              </div>

              {/* Card Form */}
              <div className="card-form">
                {/* Card Number */}
                <div className="form-group">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Enter Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                    maxLength="19"
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                {/* Test Card Info */}
                <div className="test-card-info">
                  First digit is 37 or 4 or 5 and rest digits are 1
                </div>

                {/* Expiry and CVV */}
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                      maxLength="5"
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>
                  <div className="form-group">
                    <div className="cvv-input-wrapper">
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVC/CVV"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`form-input ${errors.cvv ? 'error' : ''}`}
                        maxLength="4"
                      />
                      <div className="cvv-icon">
                        <i className="fas fa-credit-card"></i>
                      </div>
                    </div>
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>

                {/* Card Holder Name */}
                <div className="form-group">
                  <input
                    type="text"
                    name="cardHolderName"
                    placeholder="Card Holder Name"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.cardHolderName ? 'error' : ''}`}
                  />
                  {errors.cardHolderName && <span className="error-text">{errors.cardHolderName}</span>}
                </div>

                {/* Save Card Checkbox */}
                <div className="save-card-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Save card & remember me
                    <i className="fas fa-question-circle help-icon"></i>
                  </label>
                  <div className="terms-text">
                    By checking this box you agree to the <a href="#" className="terms-link">Terms of Service</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MOBILE_BANKING' && (
            <div className="mobile-banking-section">
              <div className="coming-soon">
                <i className="fas fa-mobile-alt fa-3x mb-3"></i>
                <h4>Mobile Banking</h4>
                <p>bKash, Nagad, Rocket, and other mobile banking options will be available here.</p>
              </div>
            </div>
          )}

          {activeTab === 'NET_BANKING' && (
            <div className="net-banking-section">
              <div className="coming-soon">
                <i className="fas fa-university fa-3x mb-3"></i>
                <h4>Net Banking</h4>
                <p>Internet banking options from various banks will be available here.</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Button */}
        <div className="payment-footer">
          <button 
            className="pay-button"
            onClick={handlePayment}
            disabled={isProcessing || activeTab !== 'CARDS'}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-hand-pointer"></i>
                PAY {amount.toLocaleString()} {currency}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EasyPaymentModal;