import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHotel } from "./context/HotelContext";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, isAuthenticated, currentUser, addBooking } = useHotel();
  
  const room = rooms.find(r => r.id === parseInt(id));
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h2>Room not found</h2>
        <p>The room you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/rooms')}>
          Back to Rooms
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = checkOut - checkIn;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * room.price;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to make a booking');
      navigate('/login');
      return;
    }

    if (calculateNights() <= 0) {
      alert('Please select valid check-in and check-out dates');
      return;
    }

    setIsSubmitting(true);

    const booking = {
      id: Date.now(),
      userId: currentUser.id,
      roomId: room.id,
      roomName: room.name,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: parseInt(bookingData.guests),
      nights: calculateNights(),
      totalAmount: calculateTotal(),
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };

    try {
      addBooking(booking);
      alert('Booking confirmed successfully!');
      navigate('/bookings');
    } catch (error) {
      alert('Error creating booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Room Images */}
        <div className="col-lg-8">
          <div className="mb-4">
            <img 
              src={room.images[0]} 
              alt={room.name}
              className="img-fluid rounded shadow"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>

          {/* Room Details */}
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title">{room.name}</h1>
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Type:</strong> {room.type}
                </div>
                <div className="col-md-3">
                  <strong>Size:</strong> {room.size}m²
                </div>
                <div className="col-md-3">
                  <strong>Capacity:</strong> {room.capacity} guests
                </div>
                <div className="col-md-3">
                  <strong>Price:</strong> <span className="text-primary fw-bold">${room.price}/night</span>
                </div>
              </div>
              <p className="card-text">{room.description}</p>
            </div>
          </div>

          {/* Facilities */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Room Facilities</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {room.facilities.map(facility => (
                  <div key={facility} className="col-md-6 mb-2">
                    <span className="badge bg-primary me-2">✓</span>
                    {facility}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header">
              <h5 className="mb-0">Book This Room</h5>
            </div>
            <div className="card-body">
              {!room.available ? (
                <div className="alert alert-warning">
                  This room is currently unavailable for booking.
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <h4 className="text-primary">${room.price} <small className="text-muted">per night</small></h4>
                  </div>

                  {!showBookingForm ? (
                    <button 
                      className="btn btn-primary w-100 btn-lg"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </button>
                  ) : (
                    <form onSubmit={handleBookingSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Check-in Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="checkIn"
                          value={bookingData.checkIn}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Check-out Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="checkOut"
                          value={bookingData.checkOut}
                          onChange={handleInputChange}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Number of Guests</label>
                        <select
                          className="form-select"
                          name="guests"
                          value={bookingData.guests}
                          onChange={handleInputChange}
                          required
                        >
                          {[...Array(room.capacity)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} Guest{i > 0 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {calculateNights() > 0 && (
                        <div className="mb-3 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between">
                            <span>${room.price} × {calculateNights()} nights</span>
                            <span>${calculateTotal()}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                          </div>
                        </div>
                      )}

                      <div className="d-grid gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isSubmitting || calculateNights() <= 0}
                        >
                          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setShowBookingForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {!isAuthenticated && (
                    <div className="mt-3">
                      <small className="text-muted">
                        <a href="/login">Login</a> or <a href="/register">register</a> to book this room.
                      </small>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;