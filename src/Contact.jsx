const Contact = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
              <p className="lead">Get in touch with our expert team for all your real estate needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-map-marker-alt fa-2x text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Visit Our Office</h5>
                  <p className="text-muted mb-2">123 Business District</p>
                  <p className="text-muted mb-2">Gulshan-2, Dhaka-1212</p>
                  <p className="text-muted">Bangladesh</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-phone fa-2x text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Call Us</h5>
                  <p className="text-muted mb-2">+880-1234-567890</p>
                  <p className="text-muted mb-2">+880-9876-543210</p>
                  <p className="text-muted">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="fas fa-envelope fa-2x text-primary"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Email Us</h5>
                  <p className="text-muted mb-2">info@netro-realestate.com</p>
                  <p className="text-muted mb-2">sales@netro-realestate.com</p>
                  <p className="text-muted">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4">Send Us a Message</h3>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">First Name *</label>
                        <input type="text" className="form-control" id="firstName" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name *</label>
                        <input type="text" className="form-control" id="lastName" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input type="email" className="form-control" id="email" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" className="form-control" id="phone" />
                      </div>
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label">Subject *</label>
                        <select className="form-select" id="subject" required>
                          <option value="">Select a subject</option>
                          <option value="buying">Property Buying</option>
                          <option value="selling">Property Selling</option>
                          <option value="renting">Property Renting</option>
                          <option value="investment">Investment Consulting</option>
                          <option value="management">Property Management</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="message" className="form-label">Message *</label>
                        <textarea className="form-control" id="message" rows="5" placeholder="Tell us about your requirements..." required></textarea>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="newsletter" />
                          <label className="form-check-label" htmlFor="newsletter">
                            I would like to receive updates about new properties and market insights
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary btn-lg px-5">Send Message</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Office Hours</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Monday - Friday</span>
                      <span className="text-muted">9:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Saturday</span>
                      <span className="text-muted">10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between">
                      <span>Sunday</span>
                      <span className="text-muted">Closed</span>
                    </div>
                  </div>
                  
                  <h5 className="fw-bold mb-4">Follow Us</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="btn btn-outline-primary btn-sm">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary btn-sm">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary btn-sm">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="btn btn-outline-primary btn-sm">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Quick Contact</h5>
                  <p className="text-muted mb-3">Need immediate assistance? Call our hotline for instant support.</p>
                  <a href="tel:+8801234567890" className="btn btn-primary w-100 mb-2">
                    <i className="fas fa-phone me-2"></i>Call Now
                  </a>
                  <a href="https://wa.me/8801234567890" className="btn btn-success w-100">
                    <i className="fab fa-whatsapp me-2"></i>WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="fw-bold text-center mb-4">Find Us on Map</h3>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="bg-secondary d-flex align-items-center justify-content-center" style={{height: '400px'}}>
                    <div className="text-center">
                      <i className="fas fa-map-marked-alt fa-4x text-white mb-3"></i>
                      <h5 className="text-white">Interactive Map</h5>
                      <p className="text-white-50">123 Business District, Gulshan-2, Dhaka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h3 className="fw-bold">Frequently Asked Questions</h3>
              <p className="text-muted">Quick answers to common questions</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I schedule a property viewing?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can schedule a property viewing by calling us, filling out the contact form, or using our online booking system. Our team will coordinate with you to find a convenient time.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      What documents do I need for property purchase?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Required documents include valid ID, income proof, bank statements, and any existing property documents. Our legal team will guide you through the complete documentation process.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      Do you provide property management services?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes, we offer comprehensive property management services including tenant screening, rent collection, maintenance, and regular property inspections.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Contact;