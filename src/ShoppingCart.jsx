import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import AuthContext from './contexts/AuthContext';

const ShoppingCart = () => {
  const { cartItems, removeFromCart } = useCart();
  const { isAuthenticated, isCustomer } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if we need to show a success message after payment
  useEffect(() => {
    const clearCartFlag = localStorage.getItem('clearCartAfterPayment');
    if (clearCartFlag === 'true') {
      setShowSuccessMessage(true);
      // Remove the flag after showing the message
      setTimeout(() => {
        setShowSuccessMessage(false);
        localStorage.removeItem('clearCartAfterPayment');
      }, 5000);
    }
  }, []);

  // Handle booking form navigation
  const handleBookingForm = (item) => {
    const bookingParams = new URLSearchParams({
      property: item.property_id,
      title: item.property_title,
      type: item.booking_type === 'sale' ? 'For Sale' : 'For Rent',
      cartItemId: item.id // Pass cart item ID to link back
    });
    navigate(`/booking?${bookingParams.toString()}`);
  };

  // Calculate totals
  const calculateTotals = () => {
    return cartItems.reduce((totals, item) => {
      let amount = 0;
      if (item.booking_type === 'sale') {
        // For sale items, use booking money amount (what needs to be paid now)
        amount = parseFloat(item.booking_money_amount || 0);
      } else {
        // For rent items, use advance deposit amount
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Authentication check
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
                  You need to login to view your shopping cart.
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
                  Only customers can access the shopping cart.
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

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-6 fw-bold text-primary mb-4">
            <i className="fas fa-shopping-cart me-3"></i>Shopping Cart
          </h1>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              <strong>Payment Successful!</strong> Your booking has been confirmed and your cart has been cleared.
              <button type="button" className="btn-close" onClick={() => setShowSuccessMessage(false)}></button>
            </div>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">
                  You don't have any properties in your cart yet.
                </p>
                <Link to="/properties" className="btn btn-primary">
                  <i className="fas fa-search me-2"></i>Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Left Side - Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
                <button className="btn btn-sm btn-outline-danger" onClick={() => {
                  if (window.confirm('Are you sure you want to clear your entire cart?')) {
                    // We'll implement clear cart functionality in the context
                  }
                }}>
                  <i className="fas fa-trash me-1"></i>Clear Cart
                </button>
              </div>
              <div className="card-body p-0">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-bottom p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-1">{item.property_title}</h5>
                          <div className="d-flex gap-2">
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
                        <p className="text-muted small mb-2">{item.property_address}</p>
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            {item.booking_type === 'sale' ? (
                              <div>
                                <div className="d-flex gap-3">
                                  <div>
                                    <small className="text-muted">Total Price</small>
                                    <div className="fw-bold">{formatCurrency(item.total_property_price || 0)}</div>
                                  </div>
                                  <div>
                                    <small className="text-muted">Booking Money</small>
                                    <div className="fw-bold text-primary">{formatCurrency(item.booking_money_amount || 0)}</div>
                                  </div>
                                </div>
                                {item.installment_option && (
                                  <div className="mt-2">
                                    <small className="text-muted">Installment Option</small>
                                    <div className="fw-bold">{item.installment_option.replace('_', ' ')}</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className="d-flex gap-3">
                                  <div>
                                    <small className="text-muted">Monthly Rent</small>
                                    <div className="fw-bold">{formatCurrency(item.monthly_rent_amount || 0)}</div>
                                  </div>
                                  <div>
                                    <small className="text-muted">Advance Deposit</small>
                                    <div className="fw-bold text-primary">{formatCurrency(item.advance_deposit_amount || 0)}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-end">
                            <div className="fw-bold text-primary mb-2">
                              {item.booking_type === 'sale'
                                ? formatCurrency(item.booking_money_amount || 0)
                                : formatCurrency(item.advance_deposit_amount || 0)}
                            </div>
                            {item.booking_type === 'sale' && (
                              <small className="text-muted">
                                (Booking Money)
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex flex-column align-items-end ms-3">
                        {!item.bookingFormCompleted && (
                          <button
                            className="btn btn-primary btn-sm mb-2"
                            onClick={() => handleBookingForm(item)}
                          >
                            <i className="fas fa-edit me-1"></i>Complete Form
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Added: {formatDate(item.createdAt)}
                    </small>
                  </div>
                ))}
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
                  <span>Subtotal ({totals.itemCount} items)</span>
                  <span className="fw-bold">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Service Fee</span>
                  <span className="fw-bold">{formatCurrency(0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span className="fw-bold">{formatCurrency(0)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="mb-0">Total</h5>
                  <h5 className="mb-0 text-primary">{formatCurrency(totals.subtotal)}</h5>
                </div>
                {/* Checkout Button */}
                {(() => {
                  const hasIncompleteBookings = cartItems.some(item => !item.bookingFormCompleted);
                  const canCheckout = cartItems.length > 0 && !hasIncompleteBookings;

                  if (canCheckout) {
                    return (
                      <Link
                        className="btn btn-success btn-lg w-100 mb-3"
                        to="/checkout"
                      >
                        <i className="fas fa-cash-register me-2"></i>Proceed to Checkout
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        className="btn btn-success btn-lg w-100 mb-3"
                        disabled
                        title={hasIncompleteBookings ? "Complete all booking forms first" : "Cart is empty"}
                      >
                        <i className="fas fa-cash-register me-2"></i>
                        {hasIncompleteBookings ? "Complete Booking Forms" : "Proceed to Checkout"}
                      </button>
                    );
                  }
                })()}
                <Link to="/properties" className="btn btn-outline-primary btn-lg w-100">
                  <i className="fas fa-plus me-2"></i>Continue Shopping
                </Link>
              </div>
            </div>



            {/* Responsive Checkout Button for Mobile */}
            <div className="d-lg-none fixed-bottom bg-white border-top p-3 shadow-lg">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">Total: {formatCurrency(totals.subtotal)}</div>
                  <div className="small text-muted">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</div>
                </div>
                {(() => {
                  const hasIncompleteBookings = cartItems.some(item => !item.bookingFormCompleted);
                  const canCheckout = cartItems.length > 0 && !hasIncompleteBookings;

                  if (canCheckout) {
                    return (
                      <Link
                        className="btn btn-success btn-lg"
                        to="/checkout"
                      >
                        <i className="fas fa-cash-register me-2"></i>Checkout
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        className="btn btn-success btn-lg"
                        disabled
                      >
                        <i className="fas fa-cash-register me-2"></i>
                        {hasIncompleteBookings ? "Complete Forms" : "Checkout"}
                      </button>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;