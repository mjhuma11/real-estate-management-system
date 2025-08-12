import { useState, useMemo } from 'react';
import { Link } from "react-router-dom";


const Properties = () => {
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    priceRange: '',
    bedrooms: '',
    saleType: ''
  });

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

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'Property Type') {
        if (property.propertyType !== filters.propertyType) return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'Location') {
        if (!property.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange !== 'Price Range') {
        const price = property.price.replace(/[৳,]/g, '').replace('/month', '');
        const numPrice = parseInt(price);

        switch (filters.priceRange) {
          case 'Under ৳50,000':
            if (numPrice >= 50000) return false;
            break;
          case '৳50,000 - ৳1,00,000':
            if (numPrice < 50000 || numPrice > 100000) return false;
            break;
          case '৳1,00,000 - ৳2,00,000':
            if (numPrice < 100000 || numPrice > 200000) return false;
            break;
          case 'Above ৳2,00,000':
            if (numPrice <= 200000) return false;
            break;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'Bedrooms') {
        const bedroomCount = property.bedrooms;
        switch (filters.bedrooms) {
          case '1 Bedroom':
            if (bedroomCount !== 1) return false;
            break;
          case '2 Bedrooms':
            if (bedroomCount !== 2) return false;
            break;
          case '3 Bedrooms':
            if (bedroomCount !== 3) return false;
            break;
          case '4+ Bedrooms':
            if (bedroomCount < 4) return false;
            break;
        }
      }

      // Sale type filter
      if (filters.saleType && filters.saleType !== 'For Sale/Rent') {
        if (property.type !== filters.saleType) return false;
      }

      return true;
    });
  }, [allProperties, filters]);

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
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Villa">Villa</option>
                      </select>
                    </div>
                    <div className="col-lg-2 col-md-4">
                      <select
                        className="form-select"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                      >
                        <option value="">Location</option>
                        <option value="Gulshan">Gulshan</option>
                        <option value="Dhanmondi">Dhanmondi</option>
                        <option value="Banani">Banani</option>
                        <option value="Uttara">Uttara</option>
                        <option value="Motijheel">Motijheel</option>
                        <option value="Bashundhara">Bashundhara</option>
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
                Showing {filteredProperties.length} of {allProperties.length} properties
                {Object.values(filters).some(filter => filter) && (
                  <span className="text-primary"> (filtered)</span>
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
            {filteredProperties.length === 0 ? (
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
                        src={property.image}
                        alt={property.title}
                        className="img-fluid w-100"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'} position-absolute top-0 start-0 m-3`}>
                        {property.type}
                      </span>
                      {property.featured && (
                        <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                      )}
                      <div className="position-absolute bottom-0 end-0 m-3">
                        <button className="btn btn-light btn-sm rounded-circle me-2">
                          <i className="fas fa-heart"></i>
                        </button>
                        <button className="btn btn-light btn-sm rounded-circle">
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{property.title}</h5>
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>{property.location}
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
                            <i className="fas fa-ruler-combined me-1"></i>{property.area}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold mb-0">{property.price}</h6>
                        <Link
                          to={`/property/${property.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
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