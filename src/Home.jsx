
import { Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { propertiesAPI } from './services/api';
import AuthContext from './contexts/AuthContext';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    AOS.init();
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API/'}featured-properties.php`);
      const data = await response.json();
      
      if (data.success) {
        setFeaturedProperties(data.properties || []);
      } else {
        console.error('Error fetching featured properties:', data.error);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div>
      {/* Hero Section */}
             <section 
        className="text-white py-5" 
        style={{
          minHeight: '70vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold mb-4">
                {isAuthenticated() ? `Welcome back, ${user?.username || user?.email}!` : 'Find Your Dream Property with NETRO Real Estate'}
              </h2>
              <p className="lead mb-4">
                {isAuthenticated() 
                  ? 'Continue exploring our premium properties and find your perfect match.'
                  : 'Discover premium residential and commercial properties in prime locations. Your perfect home or investment opportunity awaits.'
                }
              </p>
              <div className="d-flex gap-3">
                {/* <button className="btn btn-light btn-lg px-4">Browse Properties</button> */}
                <Link to="/properties" className="btn btn-light btn-lg px-4">Browse Properties</Link>
                {/* <button className="btn btn-outline-light btn-lg px-4">Contact Us</button> */}
                <Link to="/contact" className="btn btn-outline-light btn-lg px-4">Contact Us</Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 rounded-3 p-4">
                <h4 className="mb-3">Quick Property Search</h4>
                <div className="row g-2">
                  <div className="col-md-6">
                    <select className="form-select">
                      <option>Property Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select className="form-select">
                      <option>Location</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Min Price" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Max Price" />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-warning w-100 fw-semibold">Search Properties</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
     

      {/* Featured Properties */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
             <div data-aos="flip-left"
     data-aos-easing="ease-out-cubic"
     data-aos-duration="2000">
<h2 className="display-5 fw-bold mb-3">Featured Properties</h2></div> 
              <p className="lead text-muted">Discover our handpicked selection of premium properties</p>
            </div>
          </div>
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading featured properties...</p>
              </div>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.slice(0, 6).map((property, index) => (
                <div key={property.id} className={`col-lg-4 col-md-6 ${index === 0 ? 'data-aos="fade-right" data-aos-offset="2000" data-aos-easing="ease-in-sine"' : index === 1 ? 'data-aos="fade-up" data-aos-offset="500" data-aos-easing="ease-in-sine"' : 'data-aos="fade-left" data-aos-offset="500" data-aos-easing="ease-in-sine"'}`}>
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img 
                        src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"} 
                        alt={property.title} 
                        className="img-fluid w-100" 
                        style={{height: '250px', objectFit: 'cover'}}
                      />
                      <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'} position-absolute top-0 start-0 m-3`}>
                        {property.type}
                      </span>
                      <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{property.title}</h5>
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {property.location_name || property.address}
                      </p>
                      <p className="card-text">{property.description ? property.description.substring(0, 80) + '...' : 'Modern property with premium amenities.'}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold mb-0">
                          {property.type === 'For Sale' 
                            ? (property.price ? `৳ ${new Intl.NumberFormat('en-IN').format(property.price)}` : 'Price on request')
                            : (property.monthly_rent ? `৳ ${new Intl.NumberFormat('en-IN').format(property.monthly_rent)}/month` : 'Rent on request')
                          }
                        </h6>
                        <small className="text-muted">
                          {property.bedrooms ? `${property.bedrooms} bed` : ''} 
                          {property.bedrooms && property.bathrooms ? ' • ' : ''}
                          {property.bathrooms ? `${property.bathrooms} bath` : ''}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to original hardcoded properties if no featured properties from database
              <div className="col-lg-4 col-md-6" data-aos="fade-right" data-aos-offset="2000" data-aos-easing="ease-in-sine">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img 
                      src="/images/urban-building (1).jpg" 
                      alt="Luxury Apartment" 
                      className="img-fluid w-100" 
                      style={{height: '250px', objectFit: 'cover'}}
                    />
                    <span className="badge bg-primary position-absolute top-0 start-0 m-3">For Sale</span>
                    <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Luxury Apartment in Gulshan</h5>
                    <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Gulshan, Dhaka</p>
                    <p className="card-text">Modern 3-bedroom apartment with premium amenities and city views.</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold mb-0">৳ 2,50,00,000</h6>
                      <small className="text-muted">3 bed • 2 bath</small>
                    </div>
                  </div>
                </div>
              </div>

            )}
          </div>

          <div className="text-center mt-5">
            <Link to="/Properties" className="btn btn-primary btn-lg px-5">View All Properties</Link>
           
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold">500+</h2>
              <p className="lead">Properties Sold</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold">1000+</h2>
              <p className="lead">Happy Clients</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold">15+</h2>
              <p className="lead">Years Experience</p>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h2 className="display-4 fw-bold">50+</h2>
              <p className="lead">Expert Agents</p>
            </div>
          </div>
        </div>
      </section>
       <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h4 className="display-5 fw-bold mb-3">Why Choose NETRO Real Estate?</h4>
              <p className="lead text-muted">We provide exceptional service and expertise in the real estate market</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-home fa-2x text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">Premium Properties</h5>
                <p className="text-muted">Carefully curated selection of high-quality residential and commercial properties in prime locations.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">Expert Team</h5>
                <p className="text-muted">Professional real estate agents with years of experience and deep market knowledge.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                  <i className="fas fa-handshake fa-2x text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">Trusted Service</h5>
                <p className="text-muted">Transparent processes, honest pricing, and dedicated customer support throughout your journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-4">Ready to Find Your Dream Property?</h2>
              <p className="lead text-muted mb-4">Contact our expert team today and let us help you find the perfect property</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-primary btn-lg px-5">Get Started</button>
                <button className="btn btn-outline-primary btn-lg px-5">Schedule Consultation</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;