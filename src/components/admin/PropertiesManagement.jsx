import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';

const PropertiesManagement = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, property: null });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.API_URL}list-properties-simple.php`);
            const data = await response.json();
            
            if (data.success) {
                setProperties(data.data || []);
            } else {
                setError(data.error || 'Failed to fetch properties');
            }
        } catch (err) {
            setError('Error fetching properties: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId) => {
        try {
            const response = await fetch(`${config.API_URL}delete-property.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: propertyId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProperties(properties.filter(p => p.id !== propertyId));
                setDeleteModal({ show: false, property: null });
            } else {
                alert('Error deleting property: ' + data.error);
            }
        } catch (err) {
            alert('Error deleting property: ' + err.message);
        }
    };

    const toggleFeatured = async (propertyId, currentFeatured) => {
        try {
            const response = await fetch(`${config.API_URL}update-property.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: propertyId, 
                    featured: currentFeatured ? 0 : 1 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProperties(properties.map(p => 
                    p.id === propertyId 
                        ? { ...p, featured: currentFeatured ? 0 : 1 }
                        : p
                ));
            } else {
                alert('Error updating property: ' + data.error);
            }
        } catch (err) {
            alert('Error updating property: ' + err.message);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN').format(price) + ' BDT';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
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
                <h1 className="h2">Properties Management</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <Link to="/admin/properties/add" className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>Add New Property
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">All Properties ({properties.length})</h6>
                </div>
                <div className="card-body">
                    {properties.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="fas fa-home fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No properties found</h5>
                            <p className="text-muted">Start by adding your first property</p>
                            <Link to="/admin/properties/add" className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>Add Property
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((property) => (
                                        <tr key={property.id}>
                                            <td>{property.id}</td>
                                            <td>
                                                <div>
                                                    <strong>{property.title}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {property.bedrooms} bed, {property.bathrooms} bath
                                                        {property.area && ` • ${property.area} ${property.area_unit}`}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${property.type === 'For Sale' ? 'bg-success' : 'bg-info'}`}>
                                                    {property.type}
                                                </span>
                                            </td>
                                            <td>
                                                {property.type === 'For Sale' 
                                                    ? formatPrice(property.price)
                                                    : formatPrice(property.monthly_rent) + '/month'
                                                }
                                            </td>
                                            <td>{property.location_name || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    property.status === 'available' ? 'bg-success' :
                                                    property.status === 'pending' ? 'bg-warning' :
                                                    property.status === 'sold' ? 'bg-danger' :
                                                    'bg-secondary'
                                                }`}>
                                                    {property.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${property.featured ? 'btn-warning' : 'btn-outline-warning'}`}
                                                    onClick={() => toggleFeatured(property.id, property.featured)}
                                                    title={property.featured ? 'Remove from featured' : 'Mark as featured'}
                                                >
                                                    <i className={`fas fa-star ${property.featured ? 'text-white' : ''}`}></i>
                                                </button>
                                            </td>
                                            <td>{formatDate(property.created_at)}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <Link 
                                                        to={`/admin/properties/edit/${property.id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <Link 
                                                        to={`/property/${property.slug}`}
                                                        className="btn btn-sm btn-outline-info"
                                                        title="View"
                                                        target="_blank"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => setDeleteModal({ show: true, property })}
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setDeleteModal({ show: false, property: null })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the property "<strong>{deleteModal.property.title}</strong>"?</p>
                                <p className="text-danger">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setDeleteModal({ show: false, property: null })}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={() => handleDelete(deleteModal.property.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            )}
        </div>
    );
};

export default PropertiesManagement;
