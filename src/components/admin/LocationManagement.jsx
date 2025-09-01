import React, { useState, useEffect } from 'react';
import config from '../../data/database.js';

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'area'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch(`${config.API_URL}/locations.php`);
            const data = await response.json();
            if (data.success) {
                setLocations(data.data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setError('Failed to fetch locations');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = editingLocation 
                ? `${config.API_URL}/locations.php`
                : `${config.API_URL}/locations.php`;
            
            const method = editingLocation ? 'PUT' : 'POST';
            const payload = editingLocation 
                ? { ...formData, id: editingLocation.id }
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
                await fetchLocations();
                handleCloseModal();
            } else {
                setError(data.error || 'Failed to save location');
            }
        } catch (error) {
            console.error('Error saving location:', error);
            setError('Failed to save location');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            type: location.type
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) {
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/locations.php?id=${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                await fetchLocations();
            } else {
                setError(data.error || 'Failed to delete location');
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            setError('Failed to delete location');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingLocation(null);
        setFormData({ name: '', type: 'area' });
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
                            <h5 className="mb-0">Location Management</h5>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add Location
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
                                            <th>Type</th>
                                            <th>Created At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations.map(location => (
                                            <tr key={location.id}>
                                                <td>{location.id}</td>
                                                <td>{location.name}</td>
                                                <td>
                                                    <span className={`badge ${location.type === 'area' ? 'bg-primary' : 'bg-secondary'}`}>
                                                        {location.type}
                                                    </span>
                                                </td>
                                                <td>{new Date(location.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleEdit(location)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(location.id)}
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
                                    {editingLocation ? 'Edit Location' : 'Add New Location'}
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
                                        <label htmlFor="name" className="form-label">Location Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter location name"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">Type</label>
                                        <select
                                            className="form-select"
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="area">Area</option>
                                            <option value="city">City</option>
                                            <option value="district">District</option>
                                            <option value="location">Location</option>
                                        </select>
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
                                            editingLocation ? 'Update Location' : 'Add Location'
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

export default LocationManagement;
