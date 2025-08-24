import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config.jsx';

const PropertiesManagement = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, property: null });
    const [viewModal, setViewModal] = useState({ show: false, property: null });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching properties from:', `${API_URL}list-properties-simple.php`);
            const response = await fetch(`${API_URL}list-properties-simple.php`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Properties API response:', data);
            
            if (data.success) {
                setProperties(data.data || []);
            } else {
                setError(data.error || 'Failed to fetch properties');
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Error fetching properties: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (propertyId) => {
        try {
            console.log('Deleting property ID:', propertyId);
            
            const response = await fetch(`${API_URL}delete-property.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: propertyId })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Delete API response:', data);
            
            if (data.success) {
                setProperties(properties.filter(p => p.id !== propertyId));
                setDeleteModal({ show: false, property: null });
                alert('Property deleted successfully!');
            } else {
                alert('Error deleting property: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Error deleting property:', err);
            alert('Error deleting property: ' + err.message);
        }
    };

    const toggleFeatured = async (propertyId, currentFeatured) => {
        try {
            const property = properties.find(p => p.id === propertyId);
            if (!property) {
                alert('Property not found');
                return;
            }

            const response = await fetch(`${API_URL}update-property.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: propertyId,
                    title: property.title,
                    type: property.type,
                    status: property.status,
                    description: property.description,
                    price: property.price,
                    monthly_rent: property.monthly_rent,
                    propertyType: property.property_type_id,
                    address: property.address,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                    area_unit: property.area_unit,
                    floor: property.floor,
                    total_floors: property.total_floors,
                    facing: property.facing,
                    parking: property.parking,
                    balcony: property.balcony,
                    featured: currentFeatured ? 0 : 1,
                    created_by: property.created_by
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
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            console.log('View button clicked for property:', property.id);
                                                            setViewModal({ show: true, property });
                                                        }}
                                                        title="View Details"
                                                        style={{ outline: 'none', boxShadow: 'none' }}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            console.log('Delete button clicked for property:', property.id);
                                                            setDeleteModal({ show: true, property });
                                                        }}
                                                        title="Delete"
                                                        style={{ outline: 'none', boxShadow: 'none' }}
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

            {/* View Property Modal */}
            {viewModal.show && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" onClick={() => setViewModal({ show: false, property: null })}>
                    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Property Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setViewModal({ show: false, property: null })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {viewModal.property && (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Basic Information</h6>
                                            <table className="table table-sm">
                                                <tbody>
                                                    <tr><td><strong>Title:</strong></td><td>{viewModal.property.title}</td></tr>
                                                    <tr><td><strong>Type:</strong></td><td><span className={`badge ${viewModal.property.type === 'For Sale' ? 'bg-success' : 'bg-info'}`}>{viewModal.property.type}</span></td></tr>
                                                    <tr><td><strong>Property Type:</strong></td><td>{viewModal.property.property_type || 'N/A'}</td></tr>
                                                    <tr><td><strong>Status:</strong></td><td><span className={`badge ${
                                                        viewModal.property.status === 'available' ? 'bg-success' :
                                                        viewModal.property.status === 'pending' ? 'bg-warning' :
                                                        viewModal.property.status === 'sold' ? 'bg-danger' :
                                                        'bg-secondary'
                                                    }`}>{viewModal.property.status}</span></td></tr>
                                                    <tr><td><strong>Featured:</strong></td><td>{viewModal.property.featured ? '⭐ Yes' : 'No'}</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Property Details</h6>
                                            <table className="table table-sm">
                                                <tbody>
                                                    <tr><td><strong>Price:</strong></td><td>{viewModal.property.type === 'For Sale' ? formatPrice(viewModal.property.price) : formatPrice(viewModal.property.monthly_rent) + '/month'}</td></tr>
                                                    <tr><td><strong>Bedrooms:</strong></td><td>{viewModal.property.bedrooms || 'N/A'}</td></tr>
                                                    <tr><td><strong>Bathrooms:</strong></td><td>{viewModal.property.bathrooms || 'N/A'}</td></tr>
                                                    <tr><td><strong>Area:</strong></td><td>{viewModal.property.area ? `${viewModal.property.area} ${viewModal.property.area_unit}` : 'N/A'}</td></tr>
                                                    <tr><td><strong>Floor:</strong></td><td>{viewModal.property.floor ? `${viewModal.property.floor}${viewModal.property.total_floors ? ` of ${viewModal.property.total_floors}` : ''}` : 'N/A'}</td></tr>
                                                    <tr><td><strong>Facing:</strong></td><td>{viewModal.property.facing || 'N/A'}</td></tr>
                                                    <tr><td><strong>Parking:</strong></td><td>{viewModal.property.parking || 0} spaces</td></tr>
                                                    <tr><td><strong>Balcony:</strong></td><td>{viewModal.property.balcony || 0}</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-12">
                                            <h6 className="fw-bold">Location & Description</h6>
                                            <p><strong>Address:</strong> {viewModal.property.address || 'N/A'}</p>
                                            {viewModal.property.description && (
                                                <div>
                                                    <strong>Description:</strong>
                                                    <p className="mt-2">{viewModal.property.description}</p>
                                                </div>
                                            )}
                                            {viewModal.property.image && (
                                                <div>
                                                    <strong>Property Image:</strong>
                                                    <div className="mt-2">
                                                        <img 
                                                            src={viewModal.property.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                                            alt={viewModal.property.title}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <Link 
                                    to={`/admin/properties/edit/${viewModal.property?.id}`}
                                    className="btn btn-primary"
                                    onClick={() => setViewModal({ show: false, property: null })}
                                >
                                    <i className="fas fa-edit me-2"></i>Edit Property
                                </Link>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setViewModal({ show: false, property: null })}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" onClick={() => setDeleteModal({ show: false, property: null })}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
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
                </div>
            )}
        </div>
    );
};

export default PropertiesManagement;
