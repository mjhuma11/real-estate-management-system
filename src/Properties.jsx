import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from './contexts/FavouritesContext';
import './styles/favourites.css';
import PropertyCard from './components/PropertyCard';
import PropertySearch from './components/PropertySearch';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useToast } from './components/common/Toast';


const Properties = () => {
  const { toggleFavourite, isFavourite } = useFavourites();
  
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    priceRange: '',
    bedrooms: '',
    saleType: ''
  });

  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      // Direct API calls to avoid import issues
      const API_BASE_URL = 'http://localhost/WDPF/React-project/real-estate-management-system/API';
      
      const [locationsResponse, propertyTypesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/locations.php?type=area`),
        fetch(`${API_BASE_URL}/property-types.php`)
      ]);

      const locationsData = await locationsResponse.json();
      const propertyTypesData = await propertyTypesResponse.json();

      setLocations(locationsData.data || []);
      setPropertyTypes(propertyTypesData.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load initial data');
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Build API filters
      const apiFilters = {};
      
      if (filters.propertyType) {
        apiFilters.property_type = filters.propertyType;
      }
      
      if (filters.location) {
        apiFilters.location = filters.location;
      }
      
      if (filters.saleType) {
        apiFilters.type = filters.saleType;
      }
      
      if (filters.bedrooms) {
        const bedroomCount = filters.bedrooms.replace(/[^\d]/g, '');
        if (bedroomCount) {
          apiFilters.bedrooms = bedroomCount;
        }
      }

      // Direct API call to avoid import issues
      const API_BASE_URL = 'http://localhost/WDPF/React-project/real-estate-management-system/API';
      const queryParams = new URLSearchParams();
      
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] !== '' && apiFilters[key] !== null && apiFilters[key] !== undefined) {
          queryParams.append(key, apiFilters[key]);
        }
      });

      const queryString = queryParams.toString();
      const apiResponse = await fetch(`${API_BASE_URL}/list-properties-simple.php${queryString ? `?${queryString}` : ''}`);
      const response = await apiResponse.json();
      
      setProperties(response.data || []);
      setPagination({
        total_items: response.pagination?.total_items || 0
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const allProperties = [
    {
      id: 1,
      title: "Luxury Apartment in Gulshan",
      location: "Gulshan-2, Dhaka",
      price: "৳ 2,50,00,000",
      type: "For Sale",
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: "1800 sq ft",
      featured: true,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      title: "Commercial Space in Motijheel",
      location: "Motijheel Commercial Area, Dhaka",
      price: "৳ 80,000/month",
      type: "For Rent",
      propertyType: "Commercial",
      bedrooms: null,
      bathrooms: 2,
      area: "2000 sq ft",
      featured: false,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      title: "Modern House in Dhanmondi",
      location: "Dhanmondi-15, Dhaka",
      price: "৳ 3,20,00,000",
      type: "For Sale",
      propertyType: "House",
      bedrooms: 4,
      bathrooms: 3,
      area: "2500 sq ft",
      featured: false,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      title: "Modern Office in Banani",
      location: "Banani, Dhaka",
      price: "৳ 1,20,000/month",
      type: "For Rent",
      propertyType: "Commercial",
      bedrooms: null,
      bathrooms: 2,
      area: "3000 sq ft",
      featured: false,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 5,
      title: "Duplex Villa in Uttara",
      location: "Uttara, Dhaka",
      price: "৳ 4,50,00,000",
      type: "For Sale",
      propertyType: "Villa",
      bedrooms: 5,
      bathrooms: 4,
      area: "3200 sq ft",
      featured: true,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 6,
      title: "Studio Apartment in Bashundhara",
      location: "Bashundhara, Dhaka",
      price: "৳ 25,000/month",
      type: "For Rent",
      propertyType: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: "600 sq ft",
      featured: false,
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  // Use properties from API instead of filtering locally
  const filteredProperties = properties;

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = () => {
    // The filtering is already happening via useMemo, but we can add additional logic here
    console.log('Search triggered with filters:', filters);
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      location: '',
      priceRange: '',
      bedrooms: '',
      saleType: ''
    });
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">Our Properties</h1>
              <p className="lead">Discover your perfect property from our extensive collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-lg-2 col-md-4">
                      <select
                        className="form-select"
                        value={filters.propertyType}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
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
                        onChange={(e) => handleFilterChange('location', e.target.value)}
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
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
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
                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
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
                        onChange={(e) => handleFilterChange('saleType', e.target.value)}
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
                          onClick={handleSearch}
                        >
                          <i className="fas fa-search me-2"></i>Search
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={clearFilters}
                          title="Clear filters"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-6">
              <h3 className="fw-bold">Available Properties</h3>
              <p className="text-muted">
                {loading ? 'Loading...' : (
                  <>
                    Showing {filteredProperties.length} properties
                    {pagination.total_items && ` of ${pagination.total_items} total`}
                    {Object.values(filters).some(filter => filter) && (
                      <span className="text-primary"> (filtered)</span>
                    )}
                  </>
                )}
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Sort By: Featured
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Price: Low to High</a></li>
                  <li><a className="dropdown-item" href="#">Price: High to Low</a></li>
                  <li><a className="dropdown-item" href="#">Newest First</a></li>
                  <li><a className="dropdown-item" href="#">Featured</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="text-danger">
                  <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                  <h4>Error Loading Properties</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={fetchProperties}>
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted">
                  <i className="fas fa-search fa-3x mb-3"></i>
                  <h4>No properties found</h4>
                  <p>Try adjusting your search filters to find more properties.</p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              filteredProperties.map(property => (
                <div key={property.id} className="col-lg-4 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={property.title}
                        className="img-fluid w-100"
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                        }}
                      />
                      <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'} position-absolute top-0 start-0 m-3`}>
                        {property.type}
                      </span>
                      {property.featured == 1 && (
                        <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                      )}
                      <div className="position-absolute bottom-0 end-0 m-3">
                        <button 
                          className={`btn btn-sm rounded-circle me-2 favourite-btn ${isFavourite(property.id) ? 'btn-danger text-white favourited' : 'btn-light'}`}
                          onClick={() => toggleFavourite(property)}
                          title={isFavourite(property.id) ? 'Remove from favourites' : 'Add to favourites'}
                        >
                          <i className={`fas fa-heart ${isFavourite(property.id) ? 'text-white' : 'text-muted'}`}></i>
                        </button>
                        <button className="btn btn-light btn-sm rounded-circle">
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{property.title}</h5>
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>{property.location_name || property.address}
                      </p>
                      <div className="row g-2 mb-3">
                        {property.bedrooms && (
                          <div className="col-4">
                            <small className="text-muted">
                              <i className="fas fa-bed me-1"></i>{property.bedrooms} bed
                            </small>
                          </div>
                        )}
                        <div className="col-4">
                          <small className="text-muted">
                            <i className="fas fa-bath me-1"></i>{property.bathrooms} bath
                          </small>
                        </div>
                        <div className="col-4">
                          <small className="text-muted">
                            <i className="fas fa-ruler-combined me-1"></i>{property.area} sq ft
                          </small>
                        </div>
                      </div>
                      <h6 className="text-primary fw-bold mb-3">
                        {property.price_formatted || `৳ ${new Intl.NumberFormat('en-BD').format(property.price)}`}
                      </h6>
                      <div className="d-grid gap-2">
                        <Link
                          to={`/property/${property.id}`}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#adff2f', borderColor: '#adff2f', color: '#000' }}
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/appointment?property=${property.id}&title=${encodeURIComponent(property.title)}&type=${property.type}`}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#adff2f', borderColor: '#adff2f', color: '#000' }}
                        >
                          <i className="fas fa-calendar-check me-1"></i>
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="row mt-5">
            <div className="col-12">
              <nav aria-label="Properties pagination">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1">Previous</a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="fw-bold mb-3">Can't Find What You're Looking For?</h3>
              <p className="lead mb-4">Let our experts help you find the perfect property that matches your needs</p>
              <button className="btn btn-light btn-lg px-5">Contact Our Team</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;