import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        monthly_rent: '',
        type: 'For Sale',
        property_type_id: '',
        category_id: '',
        location_id: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        area_unit: 'sq_ft',
        floor: '',
        total_floors: '',
        facing: '',
        parking: 0,
        balcony: 0,
        status: 'available',
        featured: 0,
        agent_id: ''
    });
    
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    const [formOptions, setFormOptions] = useState({
        categories: [],
        locations: [],
        features: [],
        agents: [],
        property_types: []
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchFormOptions();
        if (isEditing) {
            fetchProperty();
        }
    }, [id]);

    const fetchFormOptions = async () => {
        try {
            const response = await fetch(`${config.API_URL}add-property.php`);
            const data = await response.json();
            
            if (data.success) {
                setFormOptions(data.data);
            }
        } catch (err) {
            console.error('Error fetching form options:', err);
        }
    };

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.API_URL}get-property.php?id=${id}`);
            const data = await response.json();
            
            if (data.success) {
                setFormData(data.property);
            } else {
                setError(data.error || 'Failed to fetch property');
            }
        } catch (err) {
            setError('Error fetching property: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const url = isEditing 
                ? `${config.API_URL}update-property.php`
                : `${config.API_URL}add-property.php`;
            
            const requestBody = {
                ...formData,
                id: isEditing ? id : undefined
            };
            
            console.log('Sending data:', requestBody);
            
            const formData = new FormData();
            
            // Append all form data
            Object.keys(requestBody).forEach(key => {
                formData.append(key, requestBody[key]);
            });
            
            // Append image if selected
            if (image) {
                formData.append('image', image);
            }
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                setError('Invalid response from server: ' + responseText);
                return;
            }
            
            if (data.success) {
                setSuccess(isEditing ? 'Property updated successfully!' : 'Property added successfully!');
                if (!isEditing) {
                    // Reset form after successful add
                    setTimeout(() => {
                        setFormData({
                            title: '',
                            description: '',
                            price: '',
                            monthly_rent: '',
                            type: 'For Sale',
                            property_type_id: '',
                            category_id: '',
                            location_id: '',
                            address: '',
                            bedrooms: '',
                            bathrooms: '',
                            area: '',
                            area_unit: 'sq_ft',
                            floor: '',
                            total_floors: '',
                            facing: '',
                            parking: 0,
                            balcony: 0,
                            status: 'available',
                            featured: 0,
                            agent_id: '',
                            virtual_tour_url: '',
                            video_url: ''
                        });
                        setSuccess(null);
                    }, 2000);
                } else {
                    // Redirect to properties list after successful edit
                    setTimeout(() => {
                        navigate('/admin/properties');
                    }, 2000);
                }
            } else {
                setError(data.error || 'Failed to save property');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error saving property: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button 
                        type="button" 
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/admin/properties')}
                    >
                        <i className="fas fa-arrow-left me-2"></i>Back to Properties
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Property Information</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Basic Information</h5>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="title" className="form-label">Property Title *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="title" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="image" className="form-label">Property Image *</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="image" 
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!isEditing}
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                            className="img-thumbnail"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Pricing</h5>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="price" className="form-label">Price (BDT)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="price" 
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 8500000"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="monthly_rent" className="form-label">Monthly Rent (BDT)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="monthly_rent" 
                                    name="monthly_rent"
                                    value={formData.monthly_rent}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 50000"
                                />
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Property Details</h5>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="bedrooms" 
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="bathrooms" 
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="area" className="form-label">Area</label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="area" 
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                    <select 
                                        className="form-select" 
                                        id="area_unit" 
                                        name="area_unit"
                                        value={formData.area_unit}
                                        onChange={handleInputChange}
                                        style={{ maxWidth: '100px' }}
                                    >
                                        <option value="sq_ft">sq ft</option>
                                        <option value="sq_m">sq m</option>
                                        <option value="katha">katha</option>
                                        <option value="bigha">bigha</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Category, Location, and Agent Selection */}
                            <div className="col-md-4 mb-3">
                                <label htmlFor="category_id" className="form-label">Category *</label>
                                <select 
                                    className="form-select" 
                                    id="category_id" 
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {formOptions.categories && formOptions.categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <label htmlFor="location_id" className="form-label">Location *</label>
                                <select 
                                    className="form-select" 
                                    id="location_id" 
                                    name="location_id"
                                    value={formData.location_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {formOptions.locations && formOptions.locations.map(location => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <label htmlFor="agent_id" className="form-label">Agent</label>
                                <select 
                                    className="form-select" 
                                    id="agent_id" 
                                    name="agent_id"
                                    value={formData.agent_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Agent (Optional)</option>
                                    {formOptions.agents && formOptions.agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <label htmlFor="floor" className="form-label">Floor</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="floor" 
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="total_floors" className="form-label">Total Floors</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="total_floors" 
                                    name="total_floors"
                                    value={formData.total_floors}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="facing" className="form-label">Facing</label>
                                <select 
                                    className="form-select" 
                                    id="facing" 
                                    name="facing"
                                    value={formData.facing}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Facing</option>
                                    <option value="North">North</option>
                                    <option value="South">South</option>
                                    <option value="East">East</option>
                                    <option value="West">West</option>
                                    <option value="North-East">North-East</option>
                                    <option value="North-West">North-West</option>
                                    <option value="South-East">South-East</option>
                                    <option value="South-West">South-West</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="parking" className="form-label">Parking Spaces</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="parking" 
                                    name="parking"
                                    value={formData.parking}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="balcony" className="form-label">Balcony</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="balcony" 
                                    name="balcony"
                                    value={formData.balcony}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Location</h5>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="location_id" className="form-label">Location</label>
                                <select 
                                    className="form-select" 
                                    id="location_id" 
                                    name="location_id"
                                    value={formData.location_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Location</option>
                                    {formOptions.locations.map(location => (
                                        <option key={location.id} value={location.id}>
                                            {location.name} ({location.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="category_id" className="form-label">Category</label>
                                <select 
                                    className="form-select" 
                                    id="category_id" 
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {formOptions.categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea 
                                    className="form-control" 
                                    id="address" 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Additional Options</h5>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="featured" 
                                        name="featured"
                                        checked={formData.featured === 1}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="featured">
                                        Featured Property
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select 
                                    className="form-select" 
                                    id="status" 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="available">Available</option>
                                    <option value="pending">Pending</option>
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="agent_id" className="form-label">Agent</label>
                                <select 
                                    className="form-select" 
                                    id="agent_id" 
                                    name="agent_id"
                                    value={formData.agent_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Agent</option>
                                    {formOptions.agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.username} ({agent.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Image Upload</h5>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="image" className="form-label">Image</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="image" 
                                    name="image"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="row">
                            <div className="col-12">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            {isEditing ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            {isEditing ? 'Update Property' : 'Add Property'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PropertyForm;
