import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesData } from '../../data/database';

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    status: 'available',
    category: 'residential',
    amenities: [],
    images: [],
    features: []
  });

  const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'plot', label: 'Plot' },
    { value: 'office', label: 'Office Space' },
    { value: 'shop', label: 'Shop' }
  ];

  const statuses = ['available', 'sold', 'rented'];

  const amenities = [
    'Air Conditioning',
    'Balcony',
    'Gym',
    'Swimming Pool',
    'Parking',
    'Security',
    'Garden',
    'Furnished',
    'High Speed Internet'
  ];

  const features = [
    'Modern Kitchen',
    'Spacious Living Room',
    'Natural Light',
    'Central Location',
    'Pet Friendly',
    'Energy Efficient',
    'Smart Home Features'
  ];

  // Load existing property data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const existingProperty = propertiesData[id];
      if (existingProperty) {
        setFormData({
          title: existingProperty.title || '',
          description: existingProperty.description || '',
          price: existingProperty.price || existingProperty.monthlyRent || '',
          type: existingProperty.propertyType || 'apartment',
          bedrooms: existingProperty.bedrooms || '',
          bathrooms: existingProperty.bathrooms || '',
          area: existingProperty.area || '',
          location: existingProperty.location || '',
          status: existingProperty.type === 'For Sale' ? 'available' : 'rented',
          category: existingProperty.category || 'residential',
          amenities: existingProperty.amenities || [],
          images: [], // Reset images for edit mode
          features: existingProperty.features || []
        });
      }
    }
  }, [isEditMode, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter(item => item !== value)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              data.append(`${key}[]`, item);
            });
          } else {
            data.append(key, value);
          }
        }
      });
      formData.images.forEach((file, index) => {
        data.append('images[]', file);
      });

      const url = isEditMode ? `/api/properties/${id}` : '/api/properties';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: data
      });

      if (response.ok) {
        navigate('/admin/properties');
      } else {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'add'} property`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} property. Please try again.`);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">{isEditMode ? 'Edit Property' : 'Add New Property'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Property Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    name="category" 
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Property Type</label>
                  <select 
                    className="form-select" 
                    name="type" 
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bedrooms</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="bedrooms" 
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bathrooms</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="bathrooms" 
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Area (sq ft)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="area" 
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select" 
                      name="status" 
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Amenities</label>
                  <div className="row">
                    {amenities.map(amenity => (
                      <div key={amenity} className="col-md-4 mb-2">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="amenities" 
                            value={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label">{amenity}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Features</label>
                  <div className="row">
                    {features.map(feature => (
                      <div key={feature} className="col-md-4 mb-2">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="features" 
                            value={feature}
                            checked={formData.features.includes(feature)}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label">{feature}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Property Images</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    name="images"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2">
                      {formData.images.map((file, index) => (
                        <div key={index} className="mb-1">
                          <span>{file.name}</span>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger ms-2"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/properties')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update Property' : 'Save Property'}
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

export default AddProperty;
