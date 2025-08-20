import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        price: '',
        monthly_rent: '',
        type: 'For Sale',
        property_type_id: '',
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
        views: 0,
        image: '',
        created_by: ''
    });
    
    const [locations, setLocations] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchInitialData();
        if (isEditing) {
            fetchProperty();
        }
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const API_BASE_URL = 'http://localhost/WDPF/React-project/real-estate-management-system/API';
            
            const [locationsResponse, propertyTypesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/locations.php`),
                fetch(`${API_BASE_URL}/property-types.php`)
            ]);

            const locationsData = await locationsResponse.json();
            const propertyTypesData = await propertyTypesResponse.json();

            setLocations(locationsData.data || []);
            setPropertyTypes(propertyTypesData.data || []);
        } catch (err) {
            console.error('Error fetching initial data:', err);
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
        let processedValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: processedValue
            };
            
            // Auto-generate slug from title
            if (name === 'title') {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            
            return updated;
        });
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
            let imageUrl = formData.image;
            
            if (image) {
                try {
                    const imageFormData = new FormData();
                    imageFormData.append('image', image);
                    imageFormData.append('type', 'properties');
                    
                    const imageResponse = await fetch(`${config.API_URL}upload-image.php`, {
                        method: 'POST',
                        body: imageFormData
                    });
                    
                    const imageResult = await imageResponse.json();
                    
                    if (imageResult.success) {
                        imageUrl = imageResult.data.url;
                    } else {
                        throw new Error(imageResult.error || 'Failed to upload image');
                    }
                } catch (imageError) {
                    console.error('Image upload error:', imageError);
                    setError(`Failed to upload image: ${imageError.message}`);
                    return;
                }
            }
            
            const url = isEditing 
                ? `${config.API_URL}update-property.php`
                : `${config.API_URL}add-property.php`;
            
            const requestBody = {
                ...formData,
                image: imageUrl,
                id: isEditing ? id : undefined
            };
            
            Object.keys(requestBody).forEach(key => {
                if (requestBody[key] === '' || requestBody[key] === null) {
                    requestBody[key] = null;
                }
            });
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }
            
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response text:', responseText);
                setError('Invalid response from server. Please check the console for details.');
                return;
            }
            
            if (data.success) {
                setSuccess(isEditing ? 'Property updated successfully!' : 'Property added successfully!');
                if (!isEditing) {
                    setTimeout(() => {
                        setFormData({
                            title: '',
                            slug: '',
                            description: '',
                            price: '',
                            monthly_rent: '',
                            type: 'For Sale',
                            property_type_id: '',
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
                            views: 0,
                            image: '',
                            created_by: ''
                        });
                        setImage(null);
                        setImagePreview('');
                        setSuccess(null);
                    }, 2000);
                } else {
                    setTimeout(() => {
                        navigate('/admin/properties');
                    }, 2000);
                }
            } else {
                setError(data.error || 'Failed to save property');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Error saving property: ${err.message}`);
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
                                    value={formData.title || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="slug" className="form-label">Slug</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="slug" 
                                    name="slug"
                                    value={formData.slug || ''}
                                    onChange={handleInputChange}
                                    placeholder="Auto-generated from title"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="type" className="form-label">Type *</label>
                                <select 
                                    className="form-select" 
                                    id="type" 
                                    name="type"
                                    value={formData.type || 'For Sale'}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="For Sale">For Sale</option>
                                    <option value="For Rent">For Rent</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="property_type_id" className="form-label">Property Type</label>
                                <select 
                                    className="form-select" 
                                    id="property_type_id" 
                                    name="property_type_id"
                                    value={formData.property_type_id || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Property Type</option>
                                    {propertyTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea 
                                    className="form-control" 
                                    id="description" 
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Enter property description..."
                                ></textarea>
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="image" className="form-label">Property Image</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    id="image" 
                                    name="image"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                />
                                <small className="text-muted">
                                    Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
                                </small>
                                {imagePreview && (
                                    <div className="mt-3">
                                        <div className="d-flex align-items-start gap-3">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                                className="img-thumbnail"
                                            />
                                            <div>
                                                <p className="mb-1"><strong>Selected Image:</strong></p>
                                                <p className="mb-1">Name: {image?.name}</p>
                                                <p className="mb-1">Size: {image ? (image.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => {
                                                        setImage(null);
                                                        setImagePreview('');
                                                        document.getElementById('image').value = '';
                                                    }}
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {formData.image && !imagePreview && (
                                    <div className="mt-2">
                                        <p className="mb-1"><strong>Current Image:</strong></p>
                                        <img 
                                            src={`${config.API_URL.replace('/API/', '/')}${formData.image}`} 
                                            alt="Current" 
                                            style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                            className="img-thumbnail"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
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
                                <label htmlFor="price" className="form-label">Price</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="form-control" 
                                    id="price" 
                                    name="price"
                                    value={formData.price || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2500000.00"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="monthly_rent" className="form-label">Monthly Rent</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="form-control" 
                                    id="monthly_rent" 
                                    name="monthly_rent"
                                    value={formData.monthly_rent || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 50000.00"
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
                                    value={formData.bedrooms || ''}
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
                                    value={formData.bathrooms || ''}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="area" className="form-label">Area</label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="form-control" 
                                        id="area" 
                                        name="area"
                                        value={formData.area || ''}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="e.g., 1200.50"
                                    />
                                    <select 
                                        className="form-select" 
                                        id="area_unit" 
                                        name="area_unit"
                                        value={formData.area_unit || 'sq_ft'}
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
                            
                            <div className="col-md-4 mb-3">
                                <label htmlFor="floor" className="form-label">Floor</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="floor" 
                                    name="floor"
                                    value={formData.floor || ''}
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
                                    value={formData.total_floors || ''}
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
                                    value={formData.facing || ''}
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
                                    value={formData.parking || 0}
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
                                    value={formData.balcony || 0}
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
                                <label htmlFor="location_reference" className="form-label">Location Reference</label>
                                <select 
                                    className="form-select" 
                                    id="location_reference" 
                                    name="location_reference"
                                    onChange={(e) => {
                                        // Auto-fill address with selected location
                                        const selectedLocation = locations.find(loc => loc.id == e.target.value);
                                        if (selectedLocation && !formData.address) {
                                            setFormData(prev => ({
                                                ...prev,
                                                address: selectedLocation.name + ', Dhaka'
                                            }));
                                        }
                                    }}
                                >
                                    <option value="">Select Location (Optional)</option>
                                    {locations.map(location => (
                                        <option key={location.id} value={location.id}>{location.name}</option>
                                    ))}
                                </select>
                                <small className="text-muted">This will help auto-fill the address field</small>
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="address" className="form-label">Full Address *</label>
                                <textarea 
                                    className="form-control" 
                                    id="address" 
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Enter full address..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Agent & Additional Info */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Agent & Additional Info</h5>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="agent_id" className="form-label">Agent ID</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="agent_id" 
                                    name="agent_id"
                                    value={formData.agent_id || ''}
                                    onChange={handleInputChange}
                                    placeholder="Agent user ID"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="views" className="form-label">Views</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="views" 
                                    name="views"
                                    value={formData.views || 0}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="Number of views"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="created_by" className="form-label">Created By</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    id="created_by" 
                                    name="created_by"
                                    value={formData.created_by}
                                    onChange={handleInputChange}
                                    placeholder="User ID who created"
                                />
                            </div>

                        </div>

                        {/* Status & Options */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="text-primary mb-3">Status & Options</h5>
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
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="form-check mt-4">
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