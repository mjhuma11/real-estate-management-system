import React from 'react';

const PropertySearch = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearFilters,
  locations = [],
  propertyTypes = [],
  loading = false
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={filters.propertyType}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
            >
              <option value="">Property Type</option>
              {propertyTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
            >
              <option value="">Location</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="d-flex gap-2">
              <button
                className="btn flex-fill"
                style={{ backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' }}
                onClick={onSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>Search
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={onClearFilters}
                title="Clear filters"
                disabled={loading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;