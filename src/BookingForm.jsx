import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import { API_URL } from './config';
import { useToast } from './components/common/Toast';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();

  // Get URL parameters
  const propertyId = searchParams.get('property');
  const propertyTitle = searchParams.get('title');
  const propertyType = searchParams.get('type'); // 'For Sale' or 'For Rent'
  const bookingType = propertyType === 'For Sale' ? 'sale' : 'rent';

  const [property, setProperty] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    user_id: user?.id || '',
    agent_id: '',
    property_id: propertyId || '',
    booking_type: bookingType,
    booking_date: new Date().toISOString().split('T')[0],
    notes: '',
    
    // Sale specific fields
    total_property_price: '',
    booking_money_amount: '',
    installment_option: '',
    down_payment_details: '',
    registration_cost_responsibility: 'Buyer',
    handover_date: '',
    previous_ownership_info: '',
    developer_info: '',
    
    // Rent specific fields
    monthly_rent_amount: '',
    advance_deposit_amount: '',
    security_deposit_details: '',
    maintenance_responsibility: 'Tenant',
    utility_bills_responsibility: ''
    // Removed emergency_contact field since it doesn't exist in the database
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Check if user is a customer
    if (user && user.role !== 'customer') {
      alert('Only customers can make property bookings');
      navigate('/properties');
      return;
    }
    
    if (propertyId) {
      fetchPropertyDetails();
      // Try to fetch agents, but don't block the form if it fails
      fetchAgents().catch(() => {
        console.log('Agents API not available, form will work without agent selection');
      });
    }
  }, [propertyId, isAuthenticated, user, navigate]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/get-property.php?id=${propertyId}`);
      const data = await response.json();
      
      if (data.success) {
        setProperty(data.data);
        // Pre-fill price fields if available
        if (bookingType === 'sale' && data.data.price) {
          setFormData(prev => ({
            ...prev,
            total_property_price: data.data.price
          }));
        } else if (bookingType === 'rent' && data.data.monthly_rent) {
          setFormData(prev => ({
            ...prev,
            monthly_rent_amount: data.data.monthly_rent
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      showError('Failed to load property details');
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/get-agents.php`);
      const data = await response.json();
      
      if (data.success) {
        setAgents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Fallback: Set empty agents array so form still works
      setAgents([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on booking type
      const submitData = {
        user_id: user.id,
        agent_id: formData.agent_id || null,
        property_id: propertyId,
        booking_type: bookingType,
        booking_date: formData.booking_date,
        notes: formData.notes
      };

      if (bookingType === 'sale') {
        // Add sale-specific fields
        submitData.total_property_price = formData.total_property_price || null;
        submitData.booking_money_amount = formData.booking_money_amount || null;
        submitData.installment_option = formData.installment_option || null;
        submitData.down_payment_details = formData.down_payment_details || null;
        submitData.registration_cost_responsibility = formData.registration_cost_responsibility;
        submitData.handover_date = formData.handover_date || null;
        submitData.previous_ownership_info = formData.previous_ownership_info || null;
        submitData.developer_info = formData.developer_info || null;
      } else {
        // Add rent-specific fields
        submitData.monthly_rent_amount = formData.monthly_rent_amount || null;
        submitData.advance_deposit_amount = formData.advance_deposit_amount || null;
        submitData.security_deposit_details = formData.security_deposit_details || null;
        submitData.maintenance_responsibility = formData.maintenance_responsibility;
        submitData.utility_bills_responsibility = formData.utility_bills_responsibility || null;
        // Removed emergency_contact field since it doesn't exist in the database
      }

      const response = await fetch(`${API_URL}/create-booking.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      // Handle different HTTP status codes
      if (response.status === 500) {
        throw new Error('Server error (500). Please try again later or contact support.');
      }

      if (response.status === 404) {
        throw new Error('API endpoint not found (404). Please check the API URL.');
      }

      // Try to get response text first for debugging
      const responseText = await response.text();
      
      // Check if response is empty
      if (!responseText) {
        throw new Error(`Empty response from server (Status: ${response.status})`);
      }

      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Response Text:', responseText);
        console.error('Response Status:', response.status);
        console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`Invalid response format from server. Server returned: ${responseText.substring(0, 100)}...`);
      }

      if (result.success) {
        showSuccess(
          <div>
            {`${bookingType === 'sale' ? 'Sale' : 'Rent'} booking submitted successfully! `}
            <a href="/my-bookings" className="alert-link">View your bookings</a>
          </div>
        );
        // Redirect to admin dashboard after successful booking
        navigate('/admin');
      } else {
        throw new Error(result.message || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      showError(error.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="display-6 fw-bold mb-2">
                {bookingType === 'sale' ? 'Property Purchase Booking' : 'Property Rental Booking'}
              </h1>
              <p className="lead mb-0">
                {bookingType === 'sale' ? 'Complete your property purchase booking' : 'Complete your rental booking'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Info Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="fw-bold mb-2">{property.title}</h5>
                  <p className="text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {property.address}
                  </p>
                  <div className="d-flex gap-3">
                    {property.bedrooms && (
                      <small className="text-muted">
                        <i className="fas fa-bed me-1"></i>{property.bedrooms} Bed
                      </small>
                    )}
                    {property.bathrooms && (
                      <small className="text-muted">
                        <i className="fas fa-bath me-1"></i>{property.bathrooms} Bath
                      </small>
                    )}
                    {property.area && (
                      <small className="text-muted">
                        <i className="fas fa-ruler-combined me-1"></i>{property.area} sq ft
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <h4 className="text-primary fw-bold">
                    {bookingType === 'sale' 
                      ? (property.price ? `৳ ${new Intl.NumberFormat('en-BD').format(property.price)}` : 'Price on request')
                      : (property.monthly_rent ? `৳ ${new Intl.NumberFormat('en-BD').format(property.monthly_rent)}/month` : 'Rent on request')
                    }
                  </h4>
                  <span className={`badge ${bookingType === 'sale' ? 'bg-success' : 'bg-info'}`}>
                    {bookingType === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-5">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-clipboard-list me-2"></i>
                      {bookingType === 'sale' ? 'Sale Booking Details' : 'Rental Booking Details'}
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Common Fields */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label className="form-label">Preferred Agent</label>
                        <select
                          name="agent_id"
                          className="form-select"
                          value={formData.agent_id}
                          onChange={handleInputChange}
                        >
                          <option value="">Auto Assign Agent</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.username} - {agent.email}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Booking Date *</label>
                        <input
                          type="date"
                          name="booking_date"
                          className="form-control"
                          value={formData.booking_date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Sale Specific Fields */}
                    {bookingType === 'sale' && (
                      <>
                        <h6 className="fw-bold text-success mb-3">
                          <i className="fas fa-home me-2"></i>Purchase Details
                        </h6>
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Total Property Price *</label>
                            <input
                              type="number"
                              name="total_property_price"
                              className="form-control"
                              value={formData.total_property_price}
                              onChange={handleInputChange}
                              placeholder="Enter total price"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Booking Money Amount *</label>
                            <input
                              type="number"
                              name="booking_money_amount"
                              className="form-control"
                              value={formData.booking_money_amount}
                              onChange={handleInputChange}
                              placeholder="Enter booking amount"
                              required
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Installment Option</label>
                            <select
                              name="installment_option"
                              className="form-select"
                              value={formData.installment_option}
                              onChange={handleInputChange}
                            >
                              <option value="">Select Installment Plan</option>
                              <option value="3_months">3 Months</option>
                              <option value="6_months">6 Months</option>
                              <option value="12_months">12 Months</option>
                              <option value="24_months">24 Months</option>
                              <option value="custom">Custom Plan</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Down Payment Amount</label>
                            <input
                              type="number"
                              name="down_payment_details"
                              className="form-control"
                              value={formData.down_payment_details}
                              onChange={handleInputChange}
                              placeholder="Enter down payment"
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Registration Cost Responsibility</label>
                            <select
                              name="registration_cost_responsibility"
                              className="form-select"
                              value={formData.registration_cost_responsibility}
                              onChange={handleInputChange}
                            >
                              <option value="Buyer">Buyer</option>
                              <option value="Seller">Seller</option>
                              <option value="Shared">Shared</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Expected Handover Date</label>
                            <input
                              type="date"
                              name="handover_date"
                              className="form-control"
                              value={formData.handover_date}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Developer Information</label>
                            <textarea
                              name="developer_info"
                              className="form-control"
                              rows="2"
                              value={formData.developer_info}
                              onChange={handleInputChange}
                              placeholder="Enter developer details"
                            ></textarea>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Previous Ownership Information</label>
                          <textarea
                            name="previous_ownership_info"
                            className="form-control"
                            rows="2"
                            value={formData.previous_ownership_info}
                            onChange={handleInputChange}
                            placeholder="Enter previous ownership details if any"
                          ></textarea>
                        </div>
                      </>
                    )}

                    {/* Rent Specific Fields */}
                    {bookingType === 'rent' && (
                      <>
                        <h6 className="fw-bold text-info mb-3">
                          <i className="fas fa-key me-2"></i>Rental Details
                        </h6>
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Monthly Rent Amount *</label>
                            <input
                              type="number"
                              name="monthly_rent_amount"
                              className="form-control"
                              value={formData.monthly_rent_amount}
                              onChange={handleInputChange}
                              placeholder="Enter monthly rent"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Advance Deposit Amount *</label>
                            <input
                              type="number"
                              name="advance_deposit_amount"
                              className="form-control"
                              value={formData.advance_deposit_amount}
                              onChange={handleInputChange}
                              placeholder="Enter advance amount"
                              required
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Maintenance Responsibility</label>
                            <select
                              name="maintenance_responsibility"
                              className="form-select"
                              value={formData.maintenance_responsibility}
                              onChange={handleInputChange}
                            >
                              <option value="Tenant">Tenant</option>
                              <option value="Owner">Owner</option>
                              <option value="Shared">Shared</option>
                            </select>
                          </div>
                          {/* Removed Emergency Contact field since it doesn't exist in the database */}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Security Deposit Details</label>
                          <textarea
                            name="security_deposit_details"
                            className="form-control"
                            rows="2"
                            value={formData.security_deposit_details}
                            onChange={handleInputChange}
                            placeholder="Enter security deposit information"
                          ></textarea>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Utility Bills Responsibility</label>
                          <textarea
                            name="utility_bills_responsibility"
                            className="form-control"
                            rows="3"
                            value={formData.utility_bills_responsibility}
                            onChange={handleInputChange}
                            placeholder="Specify who pays for electricity, gas, water, internet, etc."
                          ></textarea>
                        </div>


                      </>
                    )}

                    {/* Common Notes Field */}
                    <div className="mb-3">
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Enter any additional information or special requirements"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="card sticky-top">
                  <div className="card-header">
                    <h6 className="mb-0">Booking Summary</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Property:</strong>
                      <p className="mb-1">{property.title}</p>
                      <small className="text-muted">{property.address}</small>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Booking Type:</strong>
                      <p className="mb-0">
                        <span className={`badge ${bookingType === 'sale' ? 'bg-success' : 'bg-info'}`}>
                          {bookingType === 'sale' ? 'Purchase' : 'Rental'}
                        </span>
                      </p>
                    </div>

                    <div className="mb-3">
                      <strong>Customer:</strong>
                      <p className="mb-0">{user?.username || user?.email}</p>
                    </div>

                    {bookingType === 'sale' && formData.total_property_price && (
                      <div className="mb-3">
                        <strong>Total Price:</strong>
                        <p className="mb-0 text-success fw-bold">
                          ৳ {new Intl.NumberFormat('en-BD').format(formData.total_property_price)}
                        </p>
                      </div>
                    )}

                    {bookingType === 'rent' && formData.monthly_rent_amount && (
                      <div className="mb-3">
                        <strong>Monthly Rent:</strong>
                        <p className="mb-0 text-info fw-bold">
                          ৳ {new Intl.NumberFormat('en-BD').format(formData.monthly_rent_amount)}/month
                        </p>
                      </div>
                    )}

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className={`btn btn-lg ${bookingType === 'sale' ? 'btn-success' : 'btn-info'}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Submit {bookingType === 'sale' ? 'Purchase' : 'Rental'} Booking
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BookingForm;