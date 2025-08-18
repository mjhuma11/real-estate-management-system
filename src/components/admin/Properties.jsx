import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesData } from '../../data/database';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // In a real app, this would be an API call
    setProperties(Object.values(propertiesData));
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || property.type === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      // In a real app, this would be an API call
      const updatedProperties = properties.filter(property => property.id !== id);
      setProperties(updatedProperties);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Property Management</h1>
        <Link to="/admin/properties/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add New Property
        </Link>
      </div>

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
              <button className="btn btn-outline-secondary w-100" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

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
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <tr key={property.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={property.images[0]} 
                          alt={property.title} 
                          style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-0">{property.title}</h6>
                          <small className="text-muted">{property.propertyType}</small>
                        </div>
                      </div>
                    </td>
                    <td>{property.location}</td>
                    <td>{property.propertyType}</td>
                    <td>
                      <span className={`badge bg-${property.type === 'For Sale' ? 'success' : 'info'} bg-opacity-10 text-${property.type === 'For Sale' ? 'success' : 'info'}`}>
                        {property.type}
                      </span>
                    </td>
                    <td>{property.price || property.monthlyRent}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/admin/properties/edit/${property.id}`} className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(property.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <Link to={`/property/${property.id}`} className="btn btn-sm btn-outline-secondary">
                          <i className="fas fa-eye"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-3x mb-3"></i>
                      <p className="mb-0">No properties found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredProperties.length > 0 && (
          <div className="card-footer bg-white">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                </li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
