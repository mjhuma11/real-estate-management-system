import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import AuthContext from './contexts/AuthContext';
import EasyPaymentModal from './components/EasyPaymentModal';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated, isCustomer } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    saveInfo: false
  });
  // Removed tab state since we're using a single page layout
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Initialize selected items and user info
  useEffect(() => {
    setSelectedItems(cartItems.map(item => item.id));
    
    // Pre-fill user information if available
    if (user) {
      setBillingInfo(prev => ({
        ...prev,
        firstName: user.firstName || user.username || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [cartItems, user]);

  // Calculate totals for selected items
  const calculateTotals = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

    return selectedCartItems.reduce((totals, item) => {
      let amount = 0;
      if (item.booking_type === 'sale') {
        // Use booking money amount for immediate payment
        amount = parseFloat(item.booking_money_amount || 0);
      } else {
        amount = parseFloat(item.advance_deposit_amount || 0);
      }
      return {
        subtotal: totals.subtotal + amount,
        itemCount: totals.itemCount + 1
      };
    }, { subtotal: 0, itemCount: 0 });
  };

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle item selection
  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Handle billing info change
  const handleBillingInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }

    // Validate required fields
    if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email ||
      !billingInfo.phone || !billingInfo.address || !billingInfo.city ||
      !billingInfo.state || !billingInfo.zipCode) {
      alert('Please fill in all required billing information');
      return;
    }

    // Check if all selected items have completed booking forms
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const incompleteItems = selectedCartItems.filter(item => !item.bookingFormCompleted);
    
    if (incompleteItems.length > 0) {
      alert(`Please complete booking forms for ${incompleteItems.length} item(s) before checkout`);
      return;
    }

    // Show the Easy Payment Modal
    setShowPaymentModal(true);
  };

  // Prepare payment data for SSL Commerce
  const preparePaymentData = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const firstItem = selectedCartItems[0];

    return {
      // Customer information from billing form
      cus_name: `${billingInfo.firstName} ${billingInfo.lastName}`,
      cus_email: billingInfo.email,
      cus_phone: billingInfo.phone,
      cus_add1: billingInfo.address,
      cus_city: billingInfo.city,
      cus_state: billingInfo.state,
      cus_postcode: billingInfo.zipCode,
      cus_country: billingInfo.country,

      // Shipping information (same as customer)
      ship_name: `${billingInfo.firstName} ${billingInfo.lastName}`,
      ship_add1: billingInfo.address,
      ship_city: billingInfo.city,
      ship_state: billingInfo.state,
      ship_postcode: billingInfo.zipCode,
      ship_country: billingInfo.country,

      // Product information
      product_name: selectedCartItems.length > 1
        ? `${selectedCartItems.length} Property Bookings - NETRO Real Estate`
        : `${firstItem.property_title} - NETRO Real Estate`,
      product_category: 'Real Estate',
      product_profile: 'general',

      // Booking information
      payment_plan_id: `NETRO_${Date.now()}_${selectedCartItems.map(item => item.id).join('_')}`,
      booking_type: selectedCartItems.length > 1 ? 'mixed' : firstItem.booking_type,
      property_id: selectedCartItems.length > 1 ? 'multiple' : firstItem.property_id,
      user_id: user?.id || firstItem.user_id,

      // Cart information for tracking
      cart_items: selectedCartItems.map(item => ({
        id: item.id,
        property_id: item.property_id,
        property_title: item.property_title,
        booking_type: item.booking_type,
        amount: item.booking_type === 'sale' ? item.booking_money_amount : item.advance_deposit_amount
      })),
      total_items: selectedCartItems.length
    };
  };

  // Handle payment success
  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result);

    // Show success message
    setOrderPlaced(true);
    setShowPaymentModal(false);

    // Clear the cart
    clearCart();
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Authentication checks
  if (!isAuthenticated()) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-lock text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">Please Login</h2>
                <p className="text-muted mb-4">
                  You need to login to proceed with checkout.
                </p>
                <Link to="/login" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isCustomer()) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-user-times text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">Access Restricted</h2>
                <p className="text-muted mb-4">
                  Only customers can proceed with checkout.
                </p>
                <Link to="/properties" className="btn btn-primary">
                  <i className="fas fa-home me-2"></i>Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">
                  You need items in your cart to proceed with checkout.
                </p>
                <Link to="/properties" className="btn btn-primary">
                  <i className="fas fa-search me-2"></i>Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message after order placement
  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                <p className="text-muted mb-4">
                  Thank you for your booking. Your order has been placed successfully.
                  We will contact you shortly to confirm the details.
                </p>
                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                  <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    <i className="fas fa-list me-2"></i>New Booking
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => window.location.href = '/properties'}>
                    <i className="fas fa-home me-2"></i>Browse More Properties
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-6 fw-bold text-primary mb-4">
            <i className="fas fa-cash-register me-3"></i>Checkout
          </h1>
        </div>
      </div>

      <div className="row">
        {/* Left Side - Checkout Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Checkout Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handlePlaceOrder}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={billingInfo.email}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="2"
                    value={billingInfo.address}
                    onChange={handleBillingInfoChange}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={billingInfo.state}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Zip Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={billingInfo.zipCode}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingInfoChange}
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Nepal">Nepal</option>
                  </select>
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="saveInfo"
                    id="saveInfo"
                    checked={billingInfo.saveInfo}
                    onChange={handleBillingInfoChange}
                  />
                  <label className="form-check-label" htmlFor="saveInfo">
                    Save this information for next time
                  </label>
                </div>

                {/* Payment method selection removed as per user request */}

                {/* Card details section removed as per user request */}

                {/* SSLCommerz customer information section removed as per user request */}

                {/* Terms and conditions agreement removed as per user request */}

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    required
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the <a href="#" className="text-primary">Terms and Conditions</a> and <a href="#" className="text-primary">Privacy Policy</a>
                  </label>
                </div>

                <div className="d-flex justify-content-between">
                  <Link
                    to="/shopping-cart"
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-arrow-left me-2"></i>Back to Cart
                  </Link>
                  
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={processing || selectedItems.length === 0}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card me-2"></i>
                        Pay {formatCurrency(totals.subtotal)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Amount to Pay Now ({totals.itemCount} items)</span>
                <span className="fw-bold">{formatCurrency(totals.subtotal)}</span>
              </div>
              <small className="text-muted mb-2 d-block">
                Booking money for purchases and advance deposits for rentals
              </small>

              <div className="d-flex justify-content-between mb-2">
                <span>Service Fee</span>
                <span className="fw-bold">{formatCurrency(0)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span className="fw-bold">{formatCurrency(0)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total</h5>
                <h5 className="mb-0 text-primary">{formatCurrency(totals.subtotal)}</h5>
              </div>

              <p className="text-muted small mb-3">
                By placing this order, you agree to our Terms and Conditions and Privacy Policy.
              </p>

            </div>
          </div>
          {/* Selected Items Summary */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Cart Items ({cartItems.length})</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleSelectAll}
                >
                  {selectedItems.length === cartItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {cartItems.map(item => (
                <div key={item.id} className={`border-bottom p-3 ${selectedItems.includes(item.id) ? 'bg-light' : ''}`}>
                  <div className="d-flex align-items-center">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-1">{item.property_title}</h6>
                          <div className="d-flex gap-2 align-items-center">
                            <span className={`badge ${item.booking_type === 'sale' ? 'bg-success' : 'bg-info'}`}>
                              {item.booking_type === 'sale' ? 'Purchase' : 'Rental'}
                            </span>
                            {item.bookingFormCompleted ? (
                              <span className="badge bg-success">
                                <i className="fas fa-check me-1"></i>Form Complete
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                <i className="fas fa-exclamation-triangle me-1"></i>Form Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary">
                            {item.booking_type === 'sale'
                              ? formatCurrency(item.booking_money_amount || 0)
                              : formatCurrency(item.advance_deposit_amount || 0)}
                          </div>
                          <small className="text-muted">
                            {item.booking_type === 'sale' ? 'Booking Money' : 'Advance Deposit'}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Easy Payment Modal */}
      {showPaymentModal && (
        <EasyPaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          amount={totals.subtotal}
          currency="BDT"
          merchantName="NETRO Real Estate"
          paymentData={preparePaymentData()}
          onPaymentSubmit={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;