import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';

const Appointment = () => {
  // State for API data
  const [users, setUsers] = useState({});
  const [agents, setAgents] = useState({});
  const [properties, setProperties] = useState({});
  const [isLoading, setIsLoading] = useState({
    users: true,
    agents: true,
    properties: true
  });
  const [error, setError] = useState(null);

  // State management
  const [bookingType, setBookingType] = useState('rent');
  const [formData, setFormData] = useState({
    user_id: '',
    agent_id: '',
    property_id: '',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
    // Sale fields
    total_property_price: '',
    booking_money_amount: '',
    installment_option: '',
    down_payment_details: '',
    bank_loan_info: '',
    registration_cost_responsibility: '',
    handover_date: '',
    nominee_details: '',
    previous_ownership_info: '',
    developer_info: '',
    // Rent fields
    monthly_rent_amount: '',
    advance_deposit_amount: '',
    security_deposit_details: '',
    maintenance_responsibility: '',
    utility_bills_responsibility: '',
    family_members_count: '',
    employees_count: '',
    emergency_contact: ''
  });

  // Auto-filled details state
  const [userDetails, setUserDetails] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-fill user details
  useEffect(() => {
    if (formData.user_id && users[formData.user_id]) {
      setUserDetails(users[formData.user_id]);
    } else {
      setUserDetails(null);
    }
  }, [formData.user_id, users]);

  // Auto-fill agent details
  useEffect(() => {
    if (formData.agent_id && agents[formData.agent_id]) {
      setAgentDetails(agents[formData.agent_id]);
    } else {
      setAgentDetails(null);
    }
  }, [formData.agent_id, agents]);

  // Auto-fill property details and update form data
  useEffect(() => {
    if (formData.property_id && properties[formData.property_id]) {
      const property = properties[formData.property_id];
      setPropertyDetails(property);
      
      // Update form data with property details
      setFormData(prev => ({
        ...prev,
        property_id: property.id,
        monthly_rent_amount: property.monthly_rent || '',
        total_property_price: property.sale_price || '',
        property_title: property.title,
        property_type: property.type
      }));
    } else {
      setPropertyDetails(null);
      // Clear property-related fields when no property is selected
      setFormData(prev => ({
        ...prev,
        monthly_rent_amount: '',
        total_property_price: '',
        property_title: '',
        property_type: ''
      }));
    }
  }, [formData.property_id, properties]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const usersRes = await axios.get('/api/users');
        // const agentsRes = await axios.get('/api/agents');
        // const propertiesRes = await axios.get('/api/properties');
        
        // setUsers(usersRes.data);
        // setAgents(agentsRes.data);
        // setProperties(propertiesRes.data);
        
        setIsLoading({
          users: false,
          agents: false,
          properties: false
        });
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
        setIsLoading({
          users: false,
          agents: false,
          properties: false
        });
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      booking_type: bookingType,
      user_details: userDetails,
      agent_details: agentDetails,
      property_details: propertyDetails
    };

    // TODO: Replace with actual API call
    console.log('Submitting appointment:', submissionData);
    alert('Appointment submitted successfully!');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-5 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-8 text-center">
          <h1 className="text-4xl font-light mb-3">Property Appointment</h1>
          <p className="text-lg opacity-90">Complete the form to schedule your property viewing</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit}>
            {/* Booking Type Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Booking Type <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    bookingType === 'rent'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => setBookingType('rent')}
                >
                  <div className="text-center">
                    <div className="font-bold">Rent</div>
                    <div className="text-sm opacity-80">Monthly rental</div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    bookingType === 'sale'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => setBookingType('sale')}
                >
                  <div className="text-center">
                    <div className="font-bold">Sale</div>
                    <div className="text-sm opacity-80">Property purchase</div>
                  </div>
                </button>
              </div>
            </div>
            

            {/* Basic Information */}
            <div className="border-b-2 border-gray-200 pb-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">User <span className="text-red-500">*</span></label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                    required
                    disabled={isLoading.users}
                  >
                    <option value="">Select User</option>
                    {isLoading.users ? (
                      <option>Loading users...</option>
                    ) : (
                      Object.entries(users).map(([id, user]) => (
                        <option key={id} value={id}>{user.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Agent</label>
                  <select
                    name="agent_id"
                    value={formData.agent_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                    disabled={isLoading.agents}
                  >
                    <option value="">Select Agent (Optional)</option>
                    {isLoading.agents ? (
                      <option>Loading agents...</option>
                    ) : (
                      Object.entries(agents).map(([id, agent]) => (
                        <option key={id} value={id}>{agent.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Booking Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* User Details Auto-fill */}
              {userDetails && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">User Name</label>
                      <input
                        type="text"
                        value={userDetails.name}
                        readOnly
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Phone</label>
                      <input
                        type="text"
                        value={userDetails.phone}
                        readOnly
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Email</label>
                      <input
                        type="email"
                        value={userDetails.email}
                        readOnly
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Details Auto-fill */}
              {agentDetails && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3">Agent Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Agent Name</label>
                      <input
                        type="text"
                        value={agentDetails.name}
                        readOnly
                        className="w-full p-2 bg-blue-100 border border-blue-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Phone</label>
                      <input
                        type="text"
                        value={agentDetails.phone}
                        readOnly
                        className="w-full p-2 bg-blue-100 border border-blue-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Email</label>
                      <input
                        type="email"
                        value={agentDetails.email}
                        readOnly
                        className="w-full p-2 bg-blue-100 border border-blue-200 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Property Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Details</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property_id">
                  Select Property <span className="text-red-500">*</span>
                </label>
                <select
                  id="property_id"
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  disabled={isLoading.properties}
                >
                  <option value="">-- Select a property --</option>
                  {isLoading.properties ? (
                    <option>Loading properties...</option>
                  ) : (
                    Object.entries(properties).map(([id, property]) => (
                      <option key={id} value={id}>
                        {property.title} - {property.type} ({property.area} sqft, {property.bedrooms} BR)
                      </option>
                    ))
                  )}
                </select>
                
                {propertyDetails && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{propertyDetails.title}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {propertyDetails.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Area:</span> {propertyDetails.area} sqft
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Bedrooms:</span> {propertyDetails.bedrooms}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Bathrooms:</span> {propertyDetails.bathrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Floor:</span> {propertyDetails.floor}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Availability:</span> {propertyDetails.availability}
                        </p>
                        <p className="text-sm font-semibold mt-2">
                          {bookingType === 'rent' 
                            ? `৳${propertyDetails.monthly_rent?.toLocaleString()}/month` 
                            : `৳${propertyDetails.sale_price?.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span> {propertyDetails.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Property-specific fields */}
              {bookingType === 'rent' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Monthly Rent (৳)</label>
                    <input
                      type="number"
                      name="monthly_rent_amount"
                      value={formData.monthly_rent_amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Advance Deposit (৳)</label>
                    <input
                      type="number"
                      name="advance_deposit_amount"
                      value={formData.advance_deposit_amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Total Price (৳)</label>
                    <input
                      type="number"
                      name="total_property_price"
                      value={formData.total_property_price}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">Booking Money (৳)</label>
                    <input
                      type="number"
                      name="booking_money_amount"
                      value={formData.booking_money_amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="border-t-2 border-gray-200 pt-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Additional Information</h2>
              
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Any additional notes or special requirements..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading.users || isLoading.agents || isLoading.properties}
            >
              {isLoading.users || isLoading.agents || isLoading.properties ? 'Loading...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
