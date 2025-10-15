import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import AuthContext from './contexts/AuthContext';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, isCustomer } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Navigate to the new checkout page
    navigate('/checkout');
  };

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
                  You haven't added any properties to your cart yet. Browse our properties and add them to your cart!
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

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-6 fw-bold text-primary">
              <i className="fas fa-shopping-cart me-3"></i>Shopping Cart
            </h1>
            <div className="d-flex gap-2">
              <span className="badge bg-primary fs-6">
                <i className="fas fa-box me-1"></i>{cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}
              </span>
              <span className="badge bg-success fs-6">
                <i className="fas fa-tag me-1"></i>{formatCurrency(totals.subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Cart Items - Left Side */}
        <div className="col-lg-8">
          {/* Incomplete Booking Forms */}
          {cartItems.some(item => !item.bookingFormCompleted) && (
            <div className="card shadow-sm border-warning mb-4">
              <div className="card-header bg-warning bg-opacity-10">
                <h6 className="mb-0 text-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Complete Booking Forms to Proceed
                </h6>
              </div>
              <div className="card-body p-0">
                {cartItems.filter(item => !item.bookingFormCompleted).map((item) => (
                  <div key={item.id} className="border-bottom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{item.property_title}</h6>
                        <div className="d-flex gap-2 align-items-center">
                          <span className={`badge ${item.booking_type === 'sale' ? 'bg-success' : 'bg-info'}`}>
                            {item.booking_type === 'sale' ? 'Purchase' : 'Rental'}
                          </span>
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-exclamation-triangle me-1"></i>Form Pending
                          </span>
                        </div>
                      </div>
                      <button
                        className={`btn btn-sm ${item.booking_type === 'sale' ? 'btn-primary' : 'btn-success'}`}
                        onClick={() => handleBookingForm(item)}
                        title="Complete booking form"
                      >
                        <i className="fas fa-calendar-check me-1"></i>
                        {item.booking_type === 'sale' ? 'Purchase Booking' : 'Rental Booking'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <i className="fas fa-trash me-1"></i>Clear Cart
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {cartItems.map((item) => (
                <div key={item.id} className="border-bottom p-4">
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="mb-1">{item.property_title}</h5>
                        <div className="d-flex flex-column gap-1">
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
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>{item.property_address}
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Booking Date:</strong> {formatDate(item.booking_date)}
                          </p>
                        </div>
                        <div className="col-md-6">
                          {item.booking_type === 'sale' ? (
                            <div>
                              <p className="mb-1">
                                <strong>Total Price:</strong> {formatCurrency(item.total_property_price || 0)}
                              </p>
                              {item.booking_money_amount && (
                                <p className="mb-1">
                                  <strong>Booking Money:</strong> <span className="text-primary fw-bold">{formatCurrency(item.booking_money_amount)}</span>
                                </p>
                              )}
                              {item.down_payment_details && (
                                <p className="mb-1">
                                  <strong>Down Payment:</strong> <span className="text-warning">{formatCurrency(item.down_payment_details)}</span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p className="mb-1">
                                <strong>Monthly Rent:</strong> {formatCurrency(item.monthly_rent_amount || 0)}
                              </p>
                              <p className="mb-1">
                                <strong>Advance:</strong> {formatCurrency(item.advance_deposit_amount || 0)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
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

        {/* Order Summary - Right Side */}
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
                Includes booking money for purchases and advance deposits for rentals
              </small>
              <div className="d-flex justify-content-between mb-2">
                <span>Service Fee</span>
                <span className="fw-bold">{formatCurrency(0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
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
  );
};

export default ShoppingCart;