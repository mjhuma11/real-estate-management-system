import React, { useState, useEffect } from 'react';
import config from '../../data/database.js';

const PropertyTypeManagement = () => {
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPropertyType, setEditingPropertyType] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPropertyTypes();
    }, []);

    const fetchPropertyTypes = async () => {
        try {
            const response = await fetch(`${config.API_URL}/property-types.php`);
            const data = await response.json();
            if (data.success) {
                setPropertyTypes(data.data);
            }
        } catch (error) {
            console.error('Error fetching property types:', error);
            setError('Failed to fetch property types');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = `${config.API_URL}/property-types.php`;
            const method = editingPropertyType ? 'PUT' : 'POST';
            const payload = editingPropertyType 
                ? { ...formData, id: editingPropertyType.id }
                : formData;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (data.success) {
                await fetchPropertyTypes();
                handleCloseModal();
            } else {
                setError(data.error || 'Failed to save property type');
            }
        } catch (error) {
            console.error('Error saving property type:', error);
            setError('Failed to save property type');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (propertyType) => {
        setEditingPropertyType(propertyType);
        setFormData({
            name: propertyType.name,
            description: propertyType.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property type?')) {
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/property-types.php?id=${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                await fetchPropertyTypes();
            } else {
                setError(data.error || 'Failed to delete property type');
            }
        } catch (error) {
            console.error('Error deleting property type:', error);
            setError('Failed to delete property type');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPropertyType(null);
        setFormData({ name: '', description: '' });
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Property Type Management</h5>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add Property Type
                            </button>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Created At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propertyTypes.map(propertyType => (
                                            <tr key={propertyType.id}>
                                                <td>{propertyType.id}</td>
                                                <td>{propertyType.name}</td>
                                                <td>{propertyType.description || 'No description'}</td>
                                                <td>{new Date(propertyType.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleEdit(propertyType)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(propertyType.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingPropertyType ? 'Edit Property Type' : 'Add New Property Type'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Property Type Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter property type name"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Enter description (optional)"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            editingPropertyType ? 'Update Property Type' : 'Add Property Type'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default PropertyTypeManagement;
