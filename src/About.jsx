const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-white py-2" style={{ backgroundColor: '#7ADAA5' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">About NETRO Real Estate Ltd</h1>
              <p className="lead">Your trusted partner in real estate since 2009</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Our Story</h2>
              <p className="lead mb-4">NETRO Real Estate Ltd has been a leading name in Bangladesh's real estate industry for over 15 years. We started with a simple mission: to help people find their perfect home and make smart property investments.</p>
              <p className="mb-4">Today, we are proud to have facilitated over 500 successful property transactions, helping more than 1000 families and businesses find their ideal spaces. Our commitment to excellence, transparency, and customer satisfaction has made us one of the most trusted real estate companies in the country.</p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-2" style={{ color: '#6bc20e' }}></i>
                    <span>Licensed & Certified</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-2" style={{ color: '#6bc20e' }}></i>
                    <span>15+ Years Experience</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-2" style={{ color: '#6bc20e' }}></i>
                    <span>Expert Team</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-2" style={{ color: '#6bc20e' }}></i>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-light rounded-3 p-4" style={{height: '400px'}}>
                <div className="h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <i className="fas fa-building fa-5x mb-3" style={{ color: '#6bc20e' }}></i>
                    <h5>Modern Office Building</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <i className="fas fa-bullseye fa-3x" style={{ color: '#6bc20e' }}></i>
                  </div>
                  <h3 className="text-center fw-bold mb-4">Our Mission</h3>
                  <p className="text-center">To provide exceptional real estate services that exceed our clients' expectations while maintaining the highest standards of professionalism, integrity, and customer satisfaction.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <i className="fas fa-eye fa-3x" style={{ color: '#6bc20e' }}></i>
                  </div>
                  <h3 className="text-center fw-bold mb-4">Our Vision</h3>
                  <p className="text-center">To be the most trusted and innovative real estate company in Bangladesh, setting new standards in property services and helping shape the future of urban development.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Meet Our Expert Team</h2>
              <p className="lead text-muted">Dedicated professionals committed to your success</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px', backgroundColor: '#6bc20e20'}}>
                    <i className="fas fa-user fa-3x" style={{ color: '#6bc20e' }}></i>
                  </div>
                  <h5 className="fw-bold">Mr. Rahman Ahmed</h5>
                  <p className="mb-2" style={{ color: '#6bc20e' }}>CEO & Founder</p>
                  <p className="text-muted small">15+ years in real estate development and investment consulting.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px', backgroundColor: '#6bc20e20'}}>
                    <i className="fas fa-user fa-3x" style={{ color: '#6bc20e' }}></i>
                  </div>
                  <h5 className="fw-bold">Ms. Fatima Khan</h5>
                  <p className="mb-2" style={{ color: '#6bc20e' }}>Head of Sales</p>
                  <p className="text-muted small">Expert in residential properties with 12+ years experience.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px', backgroundColor: '#6bc20e20'}}>
                    <i className="fas fa-user fa-3x" style={{ color: '#6bc20e' }}></i>
                  </div>
                  <h5 className="fw-bold">Mr. Karim Hassan</h5>
                  <p className="mb-2" style={{ color: '#6bc20e' }}>Commercial Director</p>
                  <p className="text-muted small">Specializes in commercial real estate and investment properties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-4 text-black" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Our Core Values</h2>
              <p className="lead">The principles that guide everything we do</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <i className="fas fa-shield-alt fa-3x mb-3"></i>
              <h5 className="fw-bold mb-3">Integrity</h5>
              <p>Honest, transparent dealings in every transaction</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <i className="fas fa-star fa-3x mb-3"></i>
              <h5 className="fw-bold mb-3">Excellence</h5>
              <p>Delivering superior service and exceeding expectations</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <i className="fas fa-lightbulb fa-3x mb-3"></i>
              <h5 className="fw-bold mb-3">Innovation</h5>
              <p>Embracing new technologies and modern solutions</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <i className="fas fa-heart fa-3x mb-3"></i>
              <h5 className="fw-bold mb-3">Care</h5>
              <p>Putting our clients' needs and satisfaction first</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;