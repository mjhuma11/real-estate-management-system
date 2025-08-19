const PropertySearch = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearFilters,
  locations = [],
  propertyTypes = []
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-lg-2 col-md-4">
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
          <div className="col-lg-2 col-md-4">
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
          <div className="col-lg-2 col-md-4">
            <select
              className="form-select"
              value={filters.priceRange}
              onChange={(e) => onFilterChange('priceRange', e.target.value)}
            >
              <option value="">Price Range</option>
              <option value="Under ৳50,000">Under ৳50,000</option>
              <option value="৳50,000 - ৳1,00,000">৳50,000 - ৳1,00,000</option>
              <option value="৳1,00,000 - ৳2,00,000">৳1,00,000 - ৳2,00,000</option>
              <option value="Above ৳2,00,000">Above ৳2,00,000</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-4">
            <select
              className="form-select"
              value={filters.bedrooms}
              onChange={(e) => onFilterChange('bedrooms', e.target.value)}
            >
              <option value="">Bedrooms</option>
              <option value="1 Bedroom">1 Bedroom</option>
              <option value="2 Bedrooms">2 Bedrooms</option>
              <option value="3 Bedrooms">3 Bedrooms</option>
              <option value="4+ Bedrooms">4+ Bedrooms</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-4">
            <select
              className="form-select"
              value={filters.saleType}
              onChange={(e) => onFilterChange('saleType', e.target.value)}
            >
              <option value="">For Sale/Rent</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-4">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-fill"
                onClick={onSearch}
              >
                <i className="fas fa-search me-2"></i>Search
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={onClearFilters}
                title="Clear filters"
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