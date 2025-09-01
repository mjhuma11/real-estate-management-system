import { Link } from "react-router-dom";

const Projects = ({ type }) => {
  const allProjects = [
    {
      id: 1,
      name: "Netro Heights",
      location: "Gulshan, Dhaka",
      type: "Residential",
      status: "Completed",
      units: 48,
      floors: 12,
      completion: "2023",
      description: "Luxury residential complex with modern amenities and premium finishes."
    },
    {
      id: 2,
      name: "Netro Business Center",
      location: "Motijheel, Dhaka",
      type: "Commercial",
      status: "Ongoing",
      units: 120,
      floors: 20,
      completion: "2025",
      description: "State-of-the-art commercial complex designed for modern businesses."
    },
    {
      id: 3,
      name: "Netro Garden Residency",
      location: "Dhanmondi, Dhaka",
      type: "Residential",
      status: "Completed",
      units: 36,
      floors: 9,
      completion: "2022",
      description: "Family-friendly residential project with green spaces and recreational facilities."
    },
    {
      id: 4,
      name: "Netro Plaza",
      location: "Banani, Dhaka",
      type: "Mixed Use",
      status: "Planning",
      units: 80,
      floors: 15,
      completion: "2026",
      description: "Mixed-use development combining residential, commercial, and retail spaces."
    },
    {
      id: 5,
      name: "Netro Sky Tower",
      location: "Uttara, Dhaka",
      type: "Residential",
      status: "Ongoing",
      units: 64,
      floors: 16,
      completion: "2024",
      description: "Modern high-rise residential tower with panoramic city views."
    },
    {
      id: 6,
      name: "Netro Trade Center",
      location: "Tejgaon, Dhaka",
      type: "Commercial",
      status: "Planning",
      units: 200,
      floors: 25,
      completion: "2027",
      description: "Premium commercial hub for international businesses and trade."
    }
  ];

  // Filter projects based on type
  const getFilteredProjects = () => {
    if (!type) return allProjects; // Show all projects if no type specified
    
    const statusMap = {
      'completed': 'Completed',
      'ongoing': 'Ongoing', 
      'upcoming': 'Planning'
    };
    
    return allProjects.filter(project => project.status === statusMap[type]);
  };

  const projects = getFilteredProjects();

  // Get page title and description based on type
  const getPageInfo = () => {
    switch(type) {
      case 'completed':
        return {
          title: 'Completed Projects',
          description: 'Explore our successfully delivered projects that showcase our commitment to quality'
        };
      case 'ongoing':
        return {
          title: 'Ongoing Projects', 
          description: 'Current developments in progress with expected completion dates'
        };
      case 'upcoming':
        return {
          title: 'Upcoming Projects',
          description: 'Future developments in planning and design phase'
        };
      default:
        return {
          title: 'Our Projects',
          description: 'Building the future of Bangladesh\'s real estate landscape'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div>
      {/* Hero Section */}
      <section className="text-white py-1" style={{ backgroundColor: '#7ADAA5' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">{pageInfo.title}</h1>
              <p className="lead">{pageInfo.description}</p>
              {type && (
                <div className="mt-3">
                  <span className="badge bg-light fs-6 px-3 py-2" style={{ color: '#6bc20e' }}>
                    {projects.length} {type.charAt(0).toUpperCase() + type.slice(1)} Project{projects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center flex-wrap gap-2">
                <Link to="/projects" className={`btn ${!type ? '' : ''}`} style={!type ? { backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' } : { borderColor: '#6bc20e', color: '#6bc20e', backgroundColor: 'transparent' }}>
                  All Projects
                </Link>
                <Link to="/projects/completed" className={`btn ${type === 'completed' ? '' : ''}`} style={type === 'completed' ? { backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' } : { borderColor: '#6bc20e', color: '#6bc20e', backgroundColor: 'transparent' }}>
                  Completed
                </Link>
                <Link to="/projects/ongoing" className={`btn ${type === 'ongoing' ? '' : ''}`} style={type === 'ongoing' ? { backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' } : { borderColor: '#6bc20e', color: '#6bc20e', backgroundColor: 'transparent' }}>
                  Ongoing
                </Link>
                <Link to="/projects/upcoming" className={`btn ${type === 'upcoming' ? '' : ''}`} style={type === 'upcoming' ? { backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' } : { borderColor: '#6bc20e', color: '#6bc20e', backgroundColor: 'transparent' }}>
                  Upcoming
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Development Portfolio</h2>
              <p className="lead text-muted">Explore our {type ? type : 'completed and ongoing'} projects that showcase our commitment to quality and innovation</p>
            </div>
          </div>

          {/* Project Stats */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="fas fa-building fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h3 className="fw-bold" style={{ color: '#6bc20e' }}>25+</h3>
                  <p className="text-muted mb-0">Projects Completed</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="fas fa-home fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h3 className="fw-bold" style={{ color: '#6bc20e' }}>1000+</h3>
                  <p className="text-muted mb-0">Units Delivered</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="fas fa-users fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h3 className="fw-bold" style={{ color: '#6bc20e' }}>500+</h3>
                  <p className="text-muted mb-0">Happy Families</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="fas fa-map-marker-alt fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h3 className="fw-bold" style={{ color: '#6bc20e' }}>10+</h3>
                  <p className="text-muted mb-0">Prime Locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          {projects.length > 0 ? (
            <div className="row g-4">
              {projects.map(project => (
              <div key={project.id} className="col-lg-6">
                <div className="card h-100 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-5">
                      <div className="bg-secondary h-100 position-relative" style={{minHeight: '300px', background: 'linear-gradient(45deg, #6c757d, #495057)'}}>
                        <span className={`badge position-absolute top-0 start-0 m-3 ${
                          project.status === 'Completed' ? 'bg-success' : 
                          project.status === 'Ongoing' ? 'bg-warning' : 'bg-info'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="card-body p-4">
                        <h4 className="card-title fw-bold mb-2">{project.name}</h4>
                        <p className="text-muted mb-3">
                          <i className="fas fa-map-marker-alt me-2"></i>{project.location}
                        </p>
                        <p className="card-text mb-3">{project.description}</p>
                        
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <small className="text-muted d-block">Type</small>
                            <strong>{project.type}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Units</small>
                            <strong>{project.units}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Floors</small>
                            <strong>{project.floors}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Completion</small>
                            <strong>{project.completion}</strong>
                          </div>
                        </div>
                        
                        <Link to={`/project/${project.id}`} className="btn" style={{ backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' }}>View Details</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="row">
              <div className="col-12 text-center py-5">
                <i className="fas fa-building fa-4x text-muted mb-4"></i>
                <h4 className="text-muted mb-3">No {type} projects found</h4>
                <p className="text-muted">Check back later for updates on our {type} projects.</p>
                <Link to="/projects" className="btn" style={{ backgroundColor: '#6bc20e', borderColor: '#6bc20e', color: 'white' }}>View All Projects</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Project Types */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Project Categories</h2>
              <p className="lead text-muted">We specialize in diverse types of real estate developments</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="fas fa-home fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h4 className="fw-bold mb-3">Residential</h4>
                  <p className="text-muted">Luxury apartments, family homes, and residential complexes designed for modern living.</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Luxury Apartments</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Family Homes</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Duplex Villas</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Studio Units</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="fas fa-building fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h4 className="fw-bold mb-3">Commercial</h4>
                  <p className="text-muted">Modern office spaces, retail centers, and commercial complexes for businesses.</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Office Buildings</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Retail Spaces</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Business Centers</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Co-working Spaces</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="fas fa-city fa-3x mb-3" style={{ color: '#6bc20e' }}></i>
                  <h4 className="fw-bold mb-3">Mixed Use</h4>
                  <p className="text-muted">Integrated developments combining residential, commercial, and recreational facilities.</p>
                  <ul className="list-unstyled text-start">
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Mixed Complexes</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Shopping Malls</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Entertainment Centers</li>
                    <li><i className="fas fa-check me-2" style={{ color: '#6bc20e' }}></i>Lifestyle Hubs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Our Development Process</h2>
              <p className="lead text-muted">From concept to completion, we follow a systematic approach</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-search"></i>
                </div>
              </div>
              <h6 className="fw-bold">Research</h6>
              <small className="text-muted">Market analysis and site selection</small>
            </div>
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-drafting-compass"></i>
                </div>
              </div>
              <h6 className="fw-bold">Design</h6>
              <small className="text-muted">Architectural planning and design</small>
            </div>
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-file-contract"></i>
                </div>
              </div>
              <h6 className="fw-bold">Approval</h6>
              <small className="text-muted">Legal approvals and permits</small>
            </div>
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-hard-hat"></i>
                </div>
              </div>
              <h6 className="fw-bold">Construction</h6>
              <small className="text-muted">Quality construction and monitoring</small>
            </div>
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-clipboard-check"></i>
                </div>
              </div>
              <h6 className="fw-bold">Quality Check</h6>
              <small className="text-muted">Inspection and quality assurance</small>
            </div>
            <div className="col-lg-2 col-md-4 col-6 text-center">
              <div className="mb-3">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', backgroundColor: '#6bc20e'}}>
                  <i className="fas fa-key"></i>
                </div>
              </div>
              <h6 className="fw-bold">Handover</h6>
              <small className="text-muted">Project completion and delivery</small>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-white" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="fw-bold mb-3">Interested in Our Projects?</h3>
              <p className="lead mb-4">Get in touch to learn more about our current and upcoming developments</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light btn-lg px-5">View Brochure</button>
                <button className="btn btn-outline-light btn-lg px-5">Schedule Visit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;