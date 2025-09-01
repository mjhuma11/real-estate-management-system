const Services = () => {
  const services = [
    {
      icon: "fas fa-home",
      title: "Property Sales",
      description: "Expert assistance in buying and selling residential and commercial properties with market-leading expertise.",
      features: ["Market Analysis", "Property Valuation", "Legal Documentation", "Negotiation Support"]
    },
    {
      icon: "fas fa-key",
      title: "Property Rental",
      description: "Comprehensive rental services for landlords and tenants, ensuring smooth and hassle-free transactions.",
      features: ["Tenant Screening", "Rent Collection", "Property Maintenance", "Legal Compliance"]
    },
    {
      icon: "fas fa-tools",
      title: "Property Management",
      description: "Full-service property management solutions to maximize your investment returns and minimize hassles.",
      features: ["24/7 Maintenance", "Financial Reporting", "Tenant Relations", "Property Inspections"]
    },
    {
      icon: "fas fa-chart-line",
      title: "Investment Consulting",
      description: "Strategic investment advice to help you make informed decisions in the real estate market.",
      features: ["Market Research", "ROI Analysis", "Portfolio Planning", "Risk Assessment"]
    },
    {
      icon: "fas fa-calculator",
      title: "Property Valuation",
      description: "Professional property valuation services for accurate market pricing and investment decisions.",
      features: ["Market Comparison", "Professional Reports", "Bank Approved", "Quick Turnaround"]
    },
    {
      icon: "fas fa-file-contract",
      title: "Legal Services",
      description: "Complete legal support for all your real estate transactions and documentation needs.",
      features: ["Contract Review", "Title Verification", "Registration Support", "Legal Compliance"]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="text-white py-2" style={{ backgroundColor: '#7ADAA5' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">Our Services</h1>
              <p className="lead">Comprehensive real estate solutions tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">What We Offer</h2>
              <p className="lead text-muted">From buying and selling to management and consulting, we provide end-to-end real estate services</p>
            </div>
          </div>
          <div className="row g-4">
            {services.map((service, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6bc20e20' }}>
                        <i className={`${service.icon} fa-2x`} style={{ color: '#6bc20e' }}></i>
                      </div>
                      <h4 className="fw-bold">{service.title}</h4>
                    </div>
                    <p className="text-muted mb-4">{service.description}</p>
                    <ul className="list-unstyled">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="mb-2">
                          <i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-center mt-4">
                      <button className="btn" style={{ borderColor: '#6bc20e', color: '#6bc20e', backgroundColor: 'transparent' }}>Learn More</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Our Process</h2>
              <p className="lead text-muted">Simple, transparent, and efficient - here's how we work</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="position-relative">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6bc20e' }}>
                  <span className="fw-bold fs-3">1</span>
                </div>
                <h5 className="fw-bold mb-3">Consultation</h5>
                <p className="text-muted">We understand your needs and requirements through detailed consultation</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="position-relative">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6bc20e' }}>
                  <span className="fw-bold fs-3">2</span>
                </div>
                <h5 className="fw-bold mb-3">Research</h5>
                <p className="text-muted">Our experts conduct thorough market research and property analysis</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="position-relative">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6bc20e' }}>
                  <span className="fw-bold fs-3">3</span>
                </div>
                <h5 className="fw-bold mb-3">Execution</h5>
                <p className="text-muted">We execute the plan with precision and keep you informed throughout</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="position-relative">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6bc20e' }}>
                  <span className="fw-bold fs-3">4</span>
                </div>
                <h5 className="fw-bold mb-3">Support</h5>
                <p className="text-muted">Ongoing support and assistance even after the transaction is complete</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Why Choose Our Services?</h2>
              <div className="row g-4">
                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-award fa-2x" style={{ color: '#6bc20e' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold">15+ Years Experience</h5>
                      <p className="text-muted">Extensive experience in Bangladesh's real estate market with proven track record.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-users fa-2x" style={{ color: '#6bc20e' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold">Expert Team</h5>
                      <p className="text-muted">Qualified professionals with deep knowledge of local market conditions.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-handshake fa-2x" style={{ color: '#6bc20e' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold">Personalized Service</h5>
                      <p className="text-muted">Tailored solutions that match your specific needs and budget requirements.</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-clock fa-2x" style={{ color: '#6bc20e' }}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold">24/7 Support</h5>
                      <p className="text-muted">Round-the-clock customer support for all your real estate needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-light rounded-3 p-5" style={{ height: '500px' }}>
                <div className="h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <i className="fas fa-handshake fa-5x mb-4" style={{ color: '#6bc20e' }}></i>
                    <h4 className="fw-bold">Professional Service</h4>
                    <p className="text-muted">Committed to excellence in every transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-2 text-black" style={{ backgroundColor: '#F1F0E4' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="fw-bold mb-3">Ready to Get Started?</h3>
              <p className="lead mb-4">Contact us today to discuss your real estate needs and discover how we can help</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light btn-lg px-5">Get Free Consultation</button>
                <button className="btn btn-outline-light btn-lg px-5">Call Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;