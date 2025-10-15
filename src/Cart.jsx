import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import { API_URL } from './config';

const Cart = () => {
  const { user, isAuthenticated, isCustomer } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-bookings.php?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success">Confirmed</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>;
      case 'completed':
        return <span className="badge bg-info">Completed</span>;
      case 'pending':
      default:
        return <span className="badge bg-warning">Pending</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'cancelled':
        return <i className="fas fa-times-circle text-danger"></i>;
      case 'completed':
        return <i className="fas fa-check-double text-info"></i>;
      case 'pending':
      default:
        return <i className="fas fa-clock text-warning"></i>;
    }
  };

  const getBookingCounts = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.status === 'completed').length
    };
  };

  const counts = getBookingCounts();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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
                  You need to login to view your bookings.
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
                  Only customers can access the bookings feature.
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

  if (counts.total === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-calendar-times text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">No Bookings Yet</h2>
                <p className="text-muted mb-4">
                  You haven't made any property bookings yet. Browse our properties and make your first booking!
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/properties" className="btn btn-primary">
                    <i className="fas fa-search me-2"></i>Browse Properties
                  </Link>
                  <Link to="/shopping-cart" className="btn btn-success">
                    <i className="fas fa-shopping-cart me-2"></i>View Shopping Cart
                  </Link>
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-6 fw-bold text-primary">
              <i className="fas fa-clipboard-list me-3"></i>My Bookings
            </h1>
            <div className="d-flex gap-3">
              <span className="badge bg-warning fs-6">
                <i className="fas fa-clock me-1"></i>Pending: {counts.pending}
              </span>
              <span className="badge bg-success fs-6">
                <i className="fas fa-check me-1"></i>Confirmed: {counts.confirmed}
              </span>
              <span className="badge bg-info fs-6">
                <i className="fas fa-check-double me-1"></i>Completed: {counts.completed}
              </span>
              <span className="badge bg-danger fs-6">
                <i className="fas fa-times me-1"></i>Cancelled: {counts.cancelled}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle fa-2x me-3"></i>
              <div>
                <h5 className="mb-1">This page shows your confirmed bookings</h5>
                <p className="mb-0">
                  To view properties you've added to your shopping cart, visit the 
                  <Link to="/shopping-cart" className="alert-link ms-1">Shopping Cart</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.id} className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {getStatusIcon(booking.status)}
                  <h5 className="mb-0 ms-2">{booking.property_title}</h5>
                  <span className={`badge ms-2 ${booking.booking_type_class}`}>
                    {booking.booking_type === 'sale' ? 'Purchase' : 'Rental'}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-home me-2"></i>Property Information
                    </h6>
                    <p className="mb-2">
                      <strong>Property:</strong> {booking.property_title}
                    </p>
                    <p className="mb-2">
                      <strong>Address:</strong> {booking.property_address}
                    </p>
                    <p className="mb-2">
                      <strong>Type:</strong> {booking.property_type}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-calendar me-2"></i>Booking Details
                    </h6>
                    <p className="mb-2">
                      <strong>Booking Date:</strong> {booking.booking_date_formatted}
                    </p>
                    <p className="mb-2">
                      <strong>Type:</strong> {booking.booking_type === 'sale' ? 'Purchase Booking' : 'Rental Booking'}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong> {booking.status}
                    </p>
                  </div>
                </div>

                {/* Sale/Rent specific details */}
                {booking.booking_type === 'sale' ? (
                  <div className="mt-3">
                    <h6 className="text-success mb-2">
                      <i className="fas fa-money-bill-wave me-2"></i>Purchase Details
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Total Price:</strong> {booking.total_property_price_formatted}</p>
                        <p className="mb-1"><strong>Booking Money:</strong> {booking.booking_money_amount_formatted}</p>
                      </div>
                      <div className="col-md-6">
                        {booking.down_payment_details_formatted && (
                          <p className="mb-1"><strong>Down Payment:</strong> {booking.down_payment_details_formatted}</p>
                        )}
                        {booking.handover_date_formatted && (
                          <p className="mb-1"><strong>Handover Date:</strong> {booking.handover_date_formatted}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <h6 className="text-info mb-2">
                      <i className="fas fa-key me-2"></i>Rental Details
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Monthly Rent:</strong> {booking.monthly_rent_amount_formatted}</p>
                        <p className="mb-1"><strong>Advance Deposit:</strong> {booking.advance_deposit_amount_formatted}</p>
                      </div>
                      <div className="col-md-6">
                        {booking.maintenance_responsibility && (
                          <p className="mb-1"><strong>Maintenance:</strong> {booking.maintenance_responsibility}</p>
                        )}
                        {booking.emergency_contact && (
                          <p className="mb-1"><strong>Emergency Contact:</strong> {booking.emergency_contact}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="mt-3">
                    <h6 className="text-primary mb-2">
                      <i className="fas fa-sticky-note me-2"></i>Notes
                    </h6>
                    <p className="text-muted">{booking.notes}</p>
                  </div>
                )}

                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Submitted on: {booking.created_at_formatted}
                    {booking.updated_at && (
                      <span className="ms-3">
                        <i className="fas fa-edit me-1"></i>
                        Last updated: {formatDate(booking.updated_at)}
                      </span>
                    )}
                  </small>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="mt-3">
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      <div>
                        <strong>Booking Confirmed!</strong> We will contact you soon with further details.
                      </div>
                    </div>
                  </div>
                )}
                {booking.status === 'cancelled' && (
                  <div className="mt-3">
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-times-circle me-2"></i>
                      <div>
                        <strong>Booking Cancelled.</strong> Please contact us for alternative arrangements.
                      </div>
                    </div>
                  </div>
                )}
                {booking.status === 'completed' && (
                  <div className="mt-3">
                    <div className="alert alert-info d-flex align-items-center" role="alert">
                      <i className="fas fa-check-double me-2"></i>
                      <div>
                        <strong>Booking Completed!</strong> Thank you for choosing NETRO Real Estate.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-12 text-center">
          <Link to="/properties" className="btn btn-primary me-3">
            <i className="fas fa-plus me-2"></i>Make Another Booking
          </Link>
          <Link to="/shopping-cart" className="btn btn-success me-3">
            <i className="fas fa-shopping-cart me-2"></i>View Shopping Cart
          </Link>
          <Link to="/contact" className="btn btn-outline-primary">
            <i className="fas fa-phone me-2"></i>Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;