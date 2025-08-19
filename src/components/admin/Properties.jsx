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
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    
    try {
      const response = await fetch(`${API_URL}update-property.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          status: newStatus 
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchProperties();
      } else {
        alert(data.error || 'Failed to update property status');
      }
    } catch (err) {
      console.error('Error updating property status:', err);
      alert('Failed to update property status. Please try again.');
    }
  };

  const handleFeaturedToggle = async (id, currentFeatured) => {
    const newFeatured = currentFeatured ? 0 : 1;
    
    try {
      const response = await fetch(`${API_URL}update-property.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          featured: newFeatured 
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchProperties();
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
      {properties.length > 0 && (
        <div className="card mb-3">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    if (window.confirm('Mark all visible properties as featured?')) {
                      properties.forEach(property => {
                        if (!property.featured) {
                          handleFeaturedToggle(property.id, property.featured);
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
                      properties.forEach(property => {
                        if (property.status !== 'available') {
                          handleStatusToggle(property.id, property.status);
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
              ) : properties.length > 0 ? (
                properties.map(property => (
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
                        onClick={() => handleStatusToggle(property.id, property.status)}
                        title="Click to toggle status"
                      >
                        {property.status === 'available' ? 'Available' : 'Sold/Rented'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${property.featured ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleFeaturedToggle(property.id, property.featured)}
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
                        <Link 
                          to={`/property/${property.id}`} 
                          className="btn btn-sm btn-outline-secondary"
                          title="View Property"
                          target="_blank"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
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
    </div>
  );
};

export default Properties;
