import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProperties();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : ''
      });

      const response = await fetch(`${API_URL}list-properties-simple.php?${params}`);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        console.error('Response text:', responseText);
        throw new Error('Server returned invalid JSON response');
      }

      if (data.success) {
        setProperties(data.data || []);
        setTotalProperties(data.pagination?.total_items || 0);
        setTotalPages(data.pagination?.total_pages || 1);
      } else {
        setError(data.error || 'Failed to fetch properties');
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.address && property.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (property.location_name && property.location_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || property.type === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`${API_URL}delete-property.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the properties list
          fetchProperties();
          alert('Property deleted successfully!');
        } else {
          alert(data.error || 'Failed to delete property');
        }
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus, title) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    
    if (!window.confirm(`Change status of "${title}" to ${newStatus}?`)) {
      return;
    }
    
    try {
      const property = properties.find(p => p.id === id);
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
          id: id,
          title: property.title,
          type: property.type,
          status: newStatus,
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
          featured: property.featured ? 1 : 0,
          created_by: property.created_by
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the property in the local state for immediate feedback
        setProperties(prevProperties => 
          prevProperties.map(prop => 
            prop.id === id 
              ? { ...prop, status: newStatus }
              : prop
          )
        );
        console.log('Status updated successfully');
      } else {
        alert(data.error || 'Failed to update property status');
      }
    } catch (err) {
      console.error('Error updating property status:', err);
      alert('Failed to update property status. Please try again.');
    }
  };

  const handleFeaturedToggle = async (id, currentFeatured, title) => {
    const newFeatured = currentFeatured ? 0 : 1;
    
    try {
      const property = properties.find(p => p.id === id);
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
          id: id,
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
          featured: newFeatured,
          created_by: property.created_by
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the property in the local state for immediate feedback
        setProperties(prevProperties => 
          prevProperties.map(prop => 
            prop.id === id 
              ? { ...prop, featured: newFeatured }
              : prop
          )
        );
        
        // Trigger the featured-updated event for Home.jsx
        window.dispatchEvent(new CustomEvent('featured-updated'));
        localStorage.setItem('featuredUpdated', Date.now().toString());
        console.log('Featured status updated successfully');
      } else {
        alert(data.error || 'Failed to update featured status');
      }
    } catch (err) {
      console.error('Error updating featured status:', err);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProperties();
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedProperty(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Property Management</h1>
          <p className="text-muted mb-0">
            {loading ? 'Loading...' : `${totalProperties} total properties`}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={fetchProperties}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-2"></i>Refresh
          </button>
          <Link to="/admin/properties/new" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add New Property
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchProperties}
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100" 
                onClick={handleReset}
                disabled={loading}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {filteredProperties.length > 0 && (
        <div className="card mb-3">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    if (window.confirm('Mark all visible properties as featured?')) {
                      filteredProperties.forEach(property => {
                        if (!property.featured) {
                          handleFeaturedToggle(property.id, property.featured, property.title);
                        }
                      });
                    }
                  }}
                >
                  <i className="fas fa-star me-1"></i>
                  Bulk Feature
                </button>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => {
                    if (window.confirm('Mark all visible properties as available?')) {
                      filteredProperties.forEach(property => {
                        if (property.status !== 'available') {
                          handleStatusToggle(property.id, property.status, property.title);
                        }
                      });
                    }
                  }}
                >
                  <i className="fas fa-check me-1"></i>
                  Bulk Available
                </button>
              </div>
              <div className="text-muted small">
                Bulk actions apply to current page only
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Price</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading properties...</p>
                  </td>
                </tr>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <tr key={property.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/60x45?text=No+Image'} 
                          alt={property.title} 
                          style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                          className="me-3"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x45?text=No+Image';
                          }}
                        />
                        <div>
                          <h6 className="mb-0">{property.title}</h6>
                          <small className="text-muted">{property.property_type || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{property.address || 'N/A'}</div>
                        <small className="text-muted">{property.location_name || ''}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-${property.type === 'For Sale' ? 'success' : 'info'}`}>
                        {property.type}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${property.status === 'available' ? 'btn-success' : 'btn-warning'}`}
                        onClick={() => handleStatusToggle(property.id, property.status, property.title)}
                        title="Click to toggle status"
                      >
                        {property.status === 'available' ? 'Available' : 'Sold/Rented'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${property.featured ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleFeaturedToggle(property.id, property.featured, property.title)}
                        title="Click to toggle featured status"
                      >
                        <i className={`fas fa-star ${property.featured ? '' : 'text-muted'}`}></i>
                      </button>
                    </td>
                    <td>
                      <div>
                        <strong>৳ {new Intl.NumberFormat('en-BD').format(property.price || 0)}</strong>
                        {property.monthly_rent && (
                          <div><small className="text-muted">Rent: ৳ {new Intl.NumberFormat('en-BD').format(property.monthly_rent)}/month</small></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link 
                          to={`/admin/properties/edit/${property.id}`} 
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Property"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(property.id, property.title)}
                          title="Delete Property"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleViewProperty(property)}
                          title="View Property Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`)}
                          title="Copy Link"
                        >
                          <i className="fas fa-link"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <p className="mb-0">No properties found</p>
                      {(searchTerm || statusFilter !== 'all') && (
                        <button className="btn btn-sm btn-outline-primary mt-2" onClick={handleReset}>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProperties)} of {totalProperties} properties
              </div>
              <nav>
                <ul className="pagination justify-content-center mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Property View Modal */}
      {showViewModal && selectedProperty && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeViewModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Property Details</h5>
                <button type="button" className="btn-close" onClick={closeViewModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                      <img 
                        src={selectedProperty.images[0]} 
                        alt={selectedProperty.title}
                        className="img-fluid rounded mb-3"
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center rounded mb-3" style={{ height: '250px' }}>
                        <div className="text-center text-muted">
                          <i className="fas fa-image fa-3x mb-2"></i>
                          <p>No Image Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4 className="mb-3">{selectedProperty.title}</h4>
                    <div className="mb-2">
                      <strong>Type:</strong> 
                      <span className={`badge ms-2 bg-${selectedProperty.type === 'For Sale' ? 'success' : 'info'}`}>
                        {selectedProperty.type}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Property Type:</strong> {selectedProperty.property_type || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <span className={`badge ms-2 bg-${selectedProperty.status === 'available' ? 'success' : 'warning'}`}>
                        {selectedProperty.status === 'available' ? 'Available' : 'Sold/Rented'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>Featured:</strong> 
                      {selectedProperty.featured ? (
                        <span className="badge bg-warning ms-2">
                          <i className="fas fa-star me-1"></i>Featured
                        </span>
                      ) : (
                        <span className="text-muted ms-2">No</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <strong>Price:</strong> ৳ {new Intl.NumberFormat('en-BD').format(selectedProperty.price || 0)}
                    </div>
                    {selectedProperty.monthly_rent && (
                      <div className="mb-2">
                        <strong>Monthly Rent:</strong> ৳ {new Intl.NumberFormat('en-BD').format(selectedProperty.monthly_rent)}/month
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Location:</strong> {selectedProperty.address || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center p-2 bg-light rounded">
                      <i className="fas fa-bed text-primary mb-1"></i>
                      <div><strong>{selectedProperty.bedrooms || 0}</strong></div>
                      <small className="text-muted">Bedrooms</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 bg-light rounded">
                      <i className="fas fa-bath text-primary mb-1"></i>
                      <div><strong>{selectedProperty.bathrooms || 0}</strong></div>
                      <small className="text-muted">Bathrooms</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 bg-light rounded">
                      <i className="fas fa-ruler-combined text-primary mb-1"></i>
                      <div><strong>{selectedProperty.area || 0}</strong></div>
                      <small className="text-muted">Sq Ft</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center p-2 bg-light rounded">
                      <i className="fas fa-car text-primary mb-1"></i>
                      <div><strong>{selectedProperty.parking || 0}</strong></div>
                      <small className="text-muted">Parking</small>
                    </div>
                  </div>
                </div>
                
                {selectedProperty.description && (
                  <div className="mt-3">
                    <h6>Description:</h6>
                    <p className="text-muted">{selectedProperty.description}</p>
                  </div>
                )}
                
                <div className="mt-3">
                  <div className="row">
                    {selectedProperty.floor && (
                      <div className="col-md-6">
                        <strong>Floor:</strong> {selectedProperty.floor}
                        {selectedProperty.total_floors && ` of ${selectedProperty.total_floors}`}
                      </div>
                    )}
                    {selectedProperty.facing && (
                      <div className="col-md-6">
                        <strong>Facing:</strong> {selectedProperty.facing}
                      </div>
                    )}
                    {selectedProperty.balcony > 0 && (
                      <div className="col-md-6">
                        <strong>Balconies:</strong> {selectedProperty.balcony}
                      </div>
                    )}
                    <div className="col-md-6">
                      <strong>Created:</strong> {selectedProperty.created_at ? new Date(selectedProperty.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link 
                  to={`/admin/properties/edit/${selectedProperty.id}`} 
                  className="btn btn-primary"
                  onClick={closeViewModal}
                >
                  <i className="fas fa-edit me-2"></i>Edit Property
                </Link>
                <Link 
                  to={`/property/${selectedProperty.id}`} 
                  className="btn btn-outline-secondary"
                  target="_blank"
                >
                  <i className="fas fa-external-link-alt me-2"></i>View Public Page
                </Link>
                <button type="button" className="btn btn-secondary" onClick={closeViewModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
