import React, { useState, useEffect } from 'react';

const Appointment = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    booking_type: '',
    status: '',
    page: 1
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/get-bookings.php?${queryParams}`);
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

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-booking-status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchBookings();
        alert(`Booking ${status} successfully!`);
      } else {
        alert('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking status');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={fetchBookings}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Bookings Management</h2>
            <button className="btn btn-primary" onClick={fetchBookings}>
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Booking Type</label>
                  <select
                    className="form-select"
                    value={filters.booking_type}
                    onChange={(e) => handleFilterChange('booking_type', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="sale">Sale Bookings</option>
                    <option value="rent">Rent Bookings</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setFilters({ booking_type: '', status: '', page: 1 })}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No bookings found</h4>
              <p className="text-muted">Property bookings will appear here when customers submit booking requests.</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Property</th>
                        <th>Amount</th>
                        <th>Booking Date</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>
                            <span className={`badge ${booking.booking_type_class}`}>
                              {booking.booking_type === 'sale' ? 'Sale' : 'Rent'}
                            </span>
                          </td>
                          <td>
                            <div>
                              <strong>{booking.customer_name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{booking.customer_email}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{booking.property_title || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">{booking.property_address}</small>
                            </div>
                          </td>
                          <td>
                            {booking.booking_type === 'sale' ? (
                              <div>
                                <strong>{booking.total_property_price_formatted || 'N/A'}</strong>
                                <br />
                                <small className="text-muted">
                                  Booking: {booking.booking_money_amount_formatted || 'N/A'}
                                </small>
                              </div>
                            ) : (
                              <div>
                                <strong>{booking.monthly_rent_amount_formatted || 'N/A'}/mo</strong>
                                <br />
                                <small className="text-muted">
                                  Advance: {booking.advance_deposit_amount_formatted || 'N/A'}
                                </small>
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{booking.booking_date_formatted || 'N/A'}</strong>
                          </td>
                          <td>
                            <span className={`badge ${booking.status_class}`}>
                              {booking.status || 'Unknown'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {booking.created_at_formatted || 'N/A'}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    className="btn btn-success"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    title="Confirm Booking"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                    title="Cancel Booking"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  className="btn btn-info"
                                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                                  title="Mark as Completed"
                                >
                                  <i className="fas fa-check-double"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => viewBookingDetails(booking)}
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <span className={`badge ${selectedBooking.booking_type_class} me-2`}>
                    {selectedBooking.booking_type === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                  Booking Details #{selectedBooking.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Customer Information</h6>
                    <p><strong>Name:</strong> {selectedBooking.customer_name}</p>
                    <p><strong>Email:</strong> {selectedBooking.customer_email}</p>
                    {selectedBooking.customer_phone && (
                      <p><strong>Phone:</strong> {selectedBooking.customer_phone}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Property Information</h6>
                    <p><strong>Title:</strong> {selectedBooking.property_title}</p>
                    <p><strong>Address:</strong> {selectedBooking.property_address}</p>
                    <p><strong>Type:</strong> {selectedBooking.property_type}</p>
                  </div>
                </div>

                {selectedBooking.booking_type === 'sale' ? (
                  <div className="mt-4">
                    <h6 className="fw-bold text-success">Sale Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Total Price:</strong> {selectedBooking.total_property_price_formatted}</p>
                        <p><strong>Booking Money:</strong> {selectedBooking.booking_money_amount_formatted}</p>
                        <p><strong>Down Payment:</strong> {selectedBooking.down_payment_details_formatted || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Installment:</strong> {selectedBooking.installment_option || 'N/A'}</p>
                        <p><strong>Registration Cost:</strong> {selectedBooking.registration_cost_responsibility || 'N/A'}</p>
                        <p><strong>Handover Date:</strong> {selectedBooking.handover_date_formatted || 'N/A'}</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="mt-4">
                    <h6 className="fw-bold text-info">Rental Details</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Monthly Rent:</strong> {selectedBooking.monthly_rent_amount_formatted}</p>
                        <p><strong>Advance Deposit:</strong> {selectedBooking.advance_deposit_amount_formatted}</p>
                        <p><strong>Maintenance:</strong> {selectedBooking.maintenance_responsibility || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Emergency Contact:</strong> {selectedBooking.emergency_contact || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedBooking.security_deposit_details && (
                      <p><strong>Security Deposit:</strong> {selectedBooking.security_deposit_details}</p>
                    )}
                    {selectedBooking.utility_bills_responsibility && (
                      <p><strong>Utility Bills:</strong> {selectedBooking.utility_bills_responsibility}</p>
                    )}
                  </div>
                )}

                {selectedBooking.notes && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Notes</h6>
                    <p>{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;