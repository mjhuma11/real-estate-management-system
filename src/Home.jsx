
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
 
  useEffect(() => {
    AOS.init();
  }, []);
  
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
              <h2 className="display-4 fw-bold mb-4">Find Your Dream Property with NETRO Real Estate</h2>
              <p className="lead mb-4">Discover premium residential and commercial properties in prime locations. Your perfect home or investment opportunity awaits.</p>
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
            <div className="col-lg-4 col-md-6"data-aos="fade-right"
     data-aos-offset="2000"
     data-aos-easing="ease-in-sine">
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
            <div className="col-lg-4 col-md-6"data-aos="fade-up"
     data-aos-offset="500"
     data-aos-easing="ease-in-sine">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/urban-building (2).jpg" 
              alt="Commercial Space" 
              className="img-fluid w-100" 
              style={{height: '250px', objectFit: 'cover'}}
            />
                  <span className="badge bg-success position-absolute top-0 start-0 m-3">For Rent</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Commercial Space in Motijheel</h5>
                  <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Motijheel, Dhaka</p>
                  <p className="card-text">Prime commercial space perfect for offices and retail businesses.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold mb-0">৳ 80,000/month</h6>
                    <small className="text-muted">2000 sq ft</small>
                  </div>
                </div>
              </div>
            </div>
            
             <div className="col-lg-4 col-md-6"data-aos="fade-left"
     data-aos-offset="500"
     data-aos-easing="ease-in-sine">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/urban-building (3).jpg" 
              alt="Luxury Apartment" 
              className="img-fluid w-100" 
              style={{height: '250px', objectFit: 'cover'}}
            />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-3">For Sale</span>
                  <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Netro Garden Residency</h5>
                  <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Gulshan, Dhaka</p>
                  <p className="card-text">Modern 3-bedroom apartment with premium amenities and city views.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold mb-0">৳ 2,50,00,000</h6>
                    <small className="text-muted">3 bed • 2 bath</small>
                  </div>
                </div>
              </div>
            </div>
             <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/banner-1.jpg" 
              alt="Luxury Apartment" 
              className="img-fluid w-100" 
              style={{height: '250px', objectFit: 'cover'}}
            />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-3">For Sale</span>
                  <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Modern Apartment in Uttara</h5>
                  <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Gulshan, Dhaka</p>
                  <p className="card-text">Modern 3-bedroom apartment with premium amenities and city views.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold mb-0">৳ 2,50,00,000</h6>
                    <small className="text-muted">3 bed • 2 bath</small>
                  </div>
                </div>
              </div>
            </div>
             <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/img.jpg" 
              alt="Luxury Apartment" 
              className="img-fluid w-100" 
              style={{height: '250px', objectFit: 'cover'}}
            />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-3">For Sale</span>
                  <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Duplex Villa in Uttara</h5>
                  <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Gulshan, Dhaka</p>
                  <p className="card-text">Modern 3-bedroom apartment with premium amenities and city views.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold mb-0">৳ 2,50,00,000</h6>
                    <small className="text-muted">3 bed • 2 bath</small>
                  </div>
                </div>
              </div>
            </div>
             <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/img2.jpg" 
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
             <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="/images/img3.jpg"  
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
             <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                          <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
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
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                        <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Family House" 
              className="img-fluid w-100" 
              style={{height: '250px', objectFit: 'cover'}}
            />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-3">For Sale</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Family House in Dhanmondi</h5>
                  <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-2"></i>Dhanmondi, Dhaka</p>
                  <p className="card-text">Spacious family home with garden and modern facilities.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold mb-0">৳ 3,20,00,000</h6>
                    <small className="text-muted">4 bed • 3 bath</small>
                  </div>
                </div>
              </div>
            </div>
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