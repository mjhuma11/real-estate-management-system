import React from 'react';
import { useCart } from './contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, getCartCount, getPendingCount, getAcceptedCount, getRejectedCount } = useCart();

  const getStatusBadge = (adminStatus) => {
    switch (adminStatus) {
      case 'accepted':
        return <span className="badge bg-success">Accepted</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'waiting':
      default:
        return <span className="badge bg-warning">Waiting for Approval</span>;
    }
  };

  const getStatusIcon = (adminStatus) => {
    switch (adminStatus) {
      case 'accepted':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'rejected':
        return <i className="fas fa-times-circle text-danger"></i>;
      case 'waiting':
      default:
        return <i className="fas fa-clock text-warning"></i>;
    }
  };

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

  if (getCartCount() === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-muted mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">
                  You haven't booked any appointments yet. Browse our properties and schedule a viewing!
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
              <i className="fas fa-shopping-cart me-3"></i>My Appointments
            </h1>
            <div className="d-flex gap-3">
              <span className="badge bg-warning fs-6">
                <i className="fas fa-clock me-1"></i>Pending: {getPendingCount()}
              </span>
              <span className="badge bg-success fs-6">
                <i className="fas fa-check me-1"></i>Accepted: {getAcceptedCount()}
              </span>
              <span className="badge bg-danger fs-6">
                <i className="fas fa-times me-1"></i>Rejected: {getRejectedCount()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {cartItems.map((item) => (
          <div key={item.id} className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {getStatusIcon(item.adminStatus)}
                  <h5 className="mb-0 ms-2">{item.property_title}</h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {getStatusBadge(item.adminStatus)}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-outline-danger btn-sm"
                    title="Remove from cart"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-user me-2"></i>Contact Information
                    </h6>
                    <p className="mb-2">
                      <strong>Name:</strong> {item.name}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p className="mb-2">
                      <strong>Phone:</strong> {item.phone}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-calendar me-2"></i>Appointment Details
                    </h6>
                    <p className="mb-2">
                      <strong>Date:</strong> {formatDate(item.appointment_date)}
                    </p>
                    <p className="mb-2">
                      <strong>Time:</strong> {formatTime(item.appointment_time)}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong> {item.status}
                    </p>
                  </div>
                </div>
                {item.notes && (
                  <div className="mt-3">
                    <h6 className="text-primary mb-2">
                      <i className="fas fa-sticky-note me-2"></i>Notes
                    </h6>
                    <p className="text-muted">{item.notes}</p>
                  </div>
                )}
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Requested on: {formatDate(item.createdAt)}
                    {item.updatedAt && (
                      <span className="ms-3">
                        <i className="fas fa-edit me-1"></i>
                        Last updated: {formatDate(item.updatedAt)}
                      </span>
                    )}
                  </small>
                </div>
                {item.adminStatus === 'accepted' && (
                  <div className="mt-3">
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      <div>
                        <strong>Appointment Confirmed!</strong> We will contact you soon with further details.
                      </div>
                    </div>
                  </div>
                )}
                {item.adminStatus === 'rejected' && (
                  <div className="mt-3">
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-times-circle me-2"></i>
                      <div>
                        <strong>Appointment Declined.</strong> Please contact us for alternative arrangements.
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
            <i className="fas fa-plus me-2"></i>Book Another Appointment
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
