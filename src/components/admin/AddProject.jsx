import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ onClose, onProjectAdded }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    category: 'residential',
    images: [],
    amenities: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed_use', label: 'Mixed Use' },
    { value: 'infrastructure', label: 'Infrastructure' }
  ];

  const statuses = ['planning', 'ongoing', 'completed'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: 'Only image files are allowed'
        }));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: 'File size must be less than 5MB'
        }));
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      // Create FormData for API submission
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && value !== '') {
          formDataToSend.append(key, value);
        }
      });
      
      // Add images to FormData
      formData.images.forEach((file, index) => {
        formDataToSend.append('images[]', file);
      });

      // In a real app, this would make an API call
      // For now, we'll just create a mock project object
      const newProject = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Call the parent component's handler
      onProjectAdded(newProject);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        general: 'Failed to add project. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'planning',
      start_date: '',
      end_date: '',
      category: 'residential',
      images: [],
      amenities: []
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal fade show d-block" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Project</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form ref={formRef} onSubmit={handleSubmit}>
              {errors.general && (
                <div className="alert alert-danger mb-3">
                  {errors.general}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select 
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`} 
                  name="category" 
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="invalid-feedback">{errors.category}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.location ? 'is-invalid' : ''}`} 
                  name="location" 
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select 
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`} 
                  name="status" 
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className={`form-control ${errors.start_date ? 'is-invalid' : ''}`} 
                  name="start_date" 
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
                {errors.start_date && (
                  <div className="invalid-feedback">{errors.start_date}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className={`form-control ${errors.end_date ? 'is-invalid' : ''}`} 
                  name="end_date" 
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
                {errors.end_date && (
                  <div className="invalid-feedback">{errors.end_date}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                  name="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Project Images</label>
                <input 
                  type="file" 
                  className="form-control"
                  name="images"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
                {errors.images && (
                  <div className="invalid-feedback d-block">{errors.images}</div>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="mb-1 d-flex align-items-center">
                        <span className="me-2">{file.name}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger"
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

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
