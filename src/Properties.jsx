import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useFavourites } from './contexts/FavouritesContext';
import AuthContext from './contexts/AuthContext';
import './styles/favourites.css';
import PropertySearch from './components/PropertySearch';
import PropertyCard from './components/PropertyCard';

const Properties = () => {
  const { toggleFavourite, isFavourite } = useFavourites();
  const { isAuthenticated, isCustomer } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    propertyType: '',
    location: ''
  });

  const [sortBy, setSortBy] = useState('featured');

  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch data on component mount and handle URL parameters
  useEffect(() => {
    fetchInitialData();

    // Handle URL search parameters from Home page
    const urlPropertyType = searchParams.get('property_type');
    const urlLocation = searchParams.get('location');

    if (urlPropertyType || urlLocation) {
      setFilters(prev => ({
        ...prev,
        propertyType: urlPropertyType || '',
        location: urlLocation || ''
      }));
    }
  }, [searchParams]);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      // Use environment variable or fallback
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API';

      const [locationsResponse, propertyTypesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/locations.php`),
        fetch(`${API_BASE_URL}/property-types.php`)
      ]);

      const locationsData = await locationsResponse.json();
      const propertyTypesData = await propertyTypesResponse.json();

      if (locationsData.success) {
        setLocations(locationsData.data || []);
      }
      if (propertyTypesData.success) {
        setPropertyTypes(propertyTypesData.data || []);
      }
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



      // Use environment variable or fallback
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API';
      const queryParams = new URLSearchParams();

      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] !== '' && apiFilters[key] !== null && apiFilters[key] !== undefined) {
          queryParams.append(key, apiFilters[key]);
        }
      });

      const queryString = queryParams.toString();
      const apiUrl = `${API_BASE_URL}/list-properties-simple.php${queryString ? `?${queryString}` : ''}`;

      const apiResponse = await fetch(apiUrl);

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const response = await apiResponse.json();

      if (!response.success) {
        throw new Error(response.error || 'API returned unsuccessful response');
      }

      setProperties(response.data || []);
      setPagination({
        total_items: response.pagination?.total_items || 0
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      console.error('Full error details:', err);
      setError(`Failed to load properties: ${err.message}`);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort properties based on selected sort option
  const sortedProperties = React.useMemo(() => {
    if (!properties.length) return [];

    const sorted = [...properties];

    switch (sortBy) {
      case 'price_low_high':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || a.monthly_rent || 0);
          const priceB = parseFloat(b.price || b.monthly_rent || 0);
          return priceA - priceB;
        });

      case 'price_high_low':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || a.monthly_rent || 0);
          const priceB = parseFloat(b.price || b.monthly_rent || 0);
          return priceB - priceA;
        });

      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      case 'featured':
      default:
        return sorted.sort((a, b) => {
          // Featured properties first, then by creation date
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
    }
  }, [properties, sortBy]);

  // Use sorted properties
  const filteredProperties = sortedProperties;

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

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price_low_high':
        return 'Price: Low to High';
      case 'price_high_low':
        return 'Price: High to Low';
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'featured':
      default:
        return 'Featured';
    }
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      location: ''
    });
  };

  // Handle authentication for customer-only actions
  const handleFavouriteClick = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can add properties to favourites');
      return;
    }
    toggleFavourite(property);
  };

  const handleBookingClick = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can book properties');
      return;
    }
    navigate(`/booking?property=${property.id}&title=${encodeURIComponent(property.title)}&type=${property.type}`);
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="text-white py-3" style={{ backgroundColor: '#7ADAA5' }}>
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
              <PropertySearch
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClearFilters={clearFilters}
                locations={locations}
                propertyTypes={propertyTypes}
                loading={loading}
              />
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
                      <span style={{ color: '#6bc20e' }}> (filtered)</span>
                    )}
                  </>
                )}
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Sort By: {getSortLabel()}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className={`dropdown-item ${sortBy === 'featured' ? 'active' : ''}`}
                      onClick={() => handleSortChange('featured')}
                    >
                      Featured
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${sortBy === 'price_low_high' ? 'active' : ''}`}
                      onClick={() => handleSortChange('price_low_high')}
                    >
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${sortBy === 'price_high_low' ? 'active' : ''}`}
                      onClick={() => handleSortChange('price_high_low')}
                    >
                      Price: High to Low
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${sortBy === 'newest' ? 'active' : ''}`}
                      onClick={() => handleSortChange('newest')}
                    >
                      Newest First
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${sortBy === 'oldest' ? 'active' : ''}`}
                      onClick={() => handleSortChange('oldest')}
                    >
                      Oldest First
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="col-lg-4 col-md-6">
                <PropertyCard property={property} />
              </div>
            ))}
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
  
    </div>
  );
};

export default Properties;