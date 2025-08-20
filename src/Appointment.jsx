import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import config from './config';

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const propertyId = searchParams.get('property');
  const propertyTitle = searchParams.get('title');

  const [formData, setFormData] = useState({
    user_id: null,
    agent_id: 1, // Default agent ID
    property_id: propertyId || '',
    project_id: null,
    name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    status: 'scheduled',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!propertyId) {
      navigate('/properties');
    }
  }, [propertyId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required';
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Appointment time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/book-appointment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setFormData({
          user_id: null,
          agent_id: 1,
          property_id: propertyId || '',
          project_id: null,
          name: '',
          email: '',
          phone: '',
          appointment_date: '',
          appointment_time: '',
          status: 'scheduled',
          notes: ''
        });
      } else {
        alert(result.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Appointment Booked!</h2>
                <p className="text-muted mb-4">
                  Your appointment request has been submitted successfully. We will contact you soon to confirm the details.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn btn-outline-primary"
                  >
                    Book Another
                  </button>
                  <button
                    onClick={() => navigate('/properties')}
                    className="btn btn-primary"
                  >
                    Back to Properties
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
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Book Appointment
              </h2>
              {propertyTitle && (
                <p className="mb-0 mt-2 opacity-75">
                  For: {decodeURIComponent(propertyTitle)}
                </p>
              )}
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="appointment_date" className="form-label">
                      Appointment Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.appointment_date ? 'is-invalid' : ''}`}
                      id="appointment_date"
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleInputChange}
                      min={getTomorrowDate()}
                    />
                    {errors.appointment_date && <div className="invalid-feedback">{errors.appointment_date}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="appointment_time" className="form-label">
                      Appointment Time <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.appointment_time ? 'is-invalid' : ''}`}
                      id="appointment_time"
                      name="appointment_time"
                      value={formData.appointment_time}
                      onChange={handleInputChange}
                    >
                      <option value="">Select time</option>
                      <option value="09:00:00">9:00 AM</option>
                      <option value="10:00:00">10:00 AM</option>
                      <option value="11:00:00">11:00 AM</option>
                      <option value="12:00:00">12:00 PM</option>
                      <option value="14:00:00">2:00 PM</option>
                      <option value="15:00:00">3:00 PM</option>
                      <option value="16:00:00">4:00 PM</option>
                      <option value="17:00:00">5:00 PM</option>
                    </select>
                    {errors.appointment_time && <div className="invalid-feedback">{errors.appointment_time}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions..."
                  ></textarea>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/properties')}
                    className="btn btn-outline-secondary flex-fill"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-fill"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Booking...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-check me-2"></i>
                        Book Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
