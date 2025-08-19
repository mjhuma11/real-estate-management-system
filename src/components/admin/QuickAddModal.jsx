import React, { useState } from 'react';
import config from '../../config';

const QuickAddModal = ({ type, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: 'area',
        parent_id: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'name' && { slug: generateSlug(value) })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = type === 'category' 
                ? `${config.API_URL}add-category.php`
                : `${config.API_URL}add-location.php`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    type: 'area',
                    parent_id: null
                });
                onSuccess(data.message);
                onClose();
            } else {
                setError(data.message || `Failed to add ${type}`);
            }
        } catch (err) {
            setError(`Error adding ${type}: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            type: 'area',
            parent_id: null
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Add New {type === 'category' ? 'Category' : 'Location'}
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    {type === 'category' ? 'Category' : 'Location'} Name *
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={type === 'category' ? 'e.g., Residential' : 'e.g., Gulshan'}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="slug" className="form-label">Slug *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    placeholder={type === 'category' ? 'residential' : 'gulshan'}
                                />
                                <div className="form-text">URL-friendly version of the name</div>
                            </div>

                            {type === 'location' && (
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Location Type *</label>
                                    <select
                                        className="form-select"
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="area">Area</option>
                                        <option value="upazila">Upazila</option>
                                        <option value="district">District</option>
                                        <option value="division">Division</option>
                                    </select>
                                </div>
                            )}

                            {type === 'category' && (
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Brief description of the category"
                                    ></textarea>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus me-2"></i>
                                        Add {type === 'category' ? 'Category' : 'Location'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuickAddModal;
