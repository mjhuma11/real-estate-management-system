import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const { id } = useParams();

  // Extended project data with detailed specifications
  const projectsData = {
    1: {
      id: 1,
      name: "Netro Heights",
      subtitle: "A melody for senses",
      location: "Gulshan, Dhaka",
      type: "Residential",
      status: "Ongoing",
      progress: 64.4,
      units: 66,
      floors: "B2+B1+G+14",
      completion: "February 2024",
      parking: 132,
      description: "A lively structure, full of exclusivity. An Edifice that encourages you to live your life in the moment. Where memories are carved as existence sees. Edison Desdemona is a home where your senses find peace.",
      tourLink: "For Apartment Tour- click here",
      specifications: {
        orientation: 'North Facing "Pedestrian Entry at South"',
        frontRoad: "50 Feet (South Side Road: 30 ft)",
        landSize: "40 katha",
        apartmentSize: "2705 - 3475 SQFT, Penthouse: 5915 - 6540 SQFT",
        numberOfApartments: 66,
        numberOfParking: 132,
        numberOfFloors: "B2+B1+G+14",
        handoverDate: "February 2024"
      },
      amenities: [
        "Swimming Pool",
        "Gymnasium",
        "Children's Play Area",
        "Community Hall",
        "24/7 Security",
        "Power Backup",
        "Elevator Service",
        "Landscaped Garden"
      ],
      images: [
        "/images/project-1.jpg",
        "/images/project-2.jpg",
        "/images/project-3.jpg"
      ]
    },
    2: {
      id: 2,
      name: "NETRO BUSINESS CENTER",
      subtitle: "Modern Commercial Excellence",
      location: "Motijheel Commercial Area, Dhaka",
      type: "Commercial",
      status: "Ongoing",
      progress: 45.2,
      units: 120,
      floors: "B1+G+20",
      completion: "December 2025",
      parking: 200,
      description: "State-of-the-art commercial complex designed for modern businesses with premium office spaces and retail outlets.",
      tourLink: "For Office Tour- click here",
      specifications: {
        orientation: 'East Facing "Main Entry at North"',
        frontRoad: "80 Feet (Main Road)",
        landSize: "60 katha",
        apartmentSize: "1200 - 2500 SQFT per unit",
        numberOfApartments: 120,
        numberOfParking: 200,
        numberOfFloors: "B1+G+20",
        handoverDate: "December 2025"
      },
      amenities: [
        "High-speed Elevators",
        "Central Air Conditioning",
        "24/7 Security",
        "Power Backup",
        "Conference Rooms",
        "Food Court",
        "ATM Booth",
        "Parking Facility"
      ],
      images: [
        "/images/commercial-1.jpg",
        "/images/commercial-2.jpg"
      ]
    }
  };

  const project = projectsData[id];

  if (!project) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Project Not Found</h2>
          <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  const imageList = ["/images/urban-building (1).jpg", "/images/urban-building (2).jpg", "/images/urban-building (3).jpg"];

  const openFullImage = () => {
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showFullImage) {
        switch (e.key) {
          case 'Escape':
            closeFullImage();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFullImage]);

  return (
    <div>
      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/projects" className="text-primary text-decoration-none">Projects</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/projects/${project.status.toLowerCase()}`} className="text-primary text-decoration-none">
                  {project.status}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">{project.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Column - Images */}
            <div className="col-lg-6">
              <div className="sticky-top" style={{ top: '20px' }}>
                {/* Main Image */}
                <div className="mb-3 position-relative">
                  <img
                    src={project.images[selectedImage] || imageList[selectedImage]}
                    alt={project.name}
                    className="img-fluid w-100 rounded shadow cursor-pointer"
                    style={{ height: '400px', objectFit: 'cover' }}
                    onClick={openFullImage}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <button
                      className="btn btn-dark btn-sm rounded-circle"
                      onClick={openFullImage}
                      title="View Full Size"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>

                {/* Image Thumbnails */}
                <div className="row g-2 mb-4">
                  {imageList.map((img, index) => (
                    <div key={index} className="col-4">
                      <img
                        src={img}
                        alt={`${project.name} ${index + 1}`}
                        className={`img-fluid w-100 rounded cursor-pointer image-thumbnail ${selectedImage === index ? 'border border-primary border-3' : ''}`}
                        style={{ height: '100px', objectFit: 'cover' }}
                        onClick={() => setSelectedImage(index)}
                      />
                    </div>
                  ))}
                </div>

                {/* Location Map Section */}
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h4 className="fw-bold mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>Location & Map
                    </h4>
                    <p className="text-muted mb-3">
                      <strong>Address:</strong> {project.location}
                    </p>

                    {/* Interactive Map Container */}
                    <div className="map-container mb-3" style={{ height: '400px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                      {/* Working Google Maps Embed - No API key required */}
                      <iframe
                        src={`https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent(project.location + ', Bangladesh')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '8px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${project.location}`}
                      ></iframe>

                      {/* Map Overlay with Property Info */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="bg-white p-2 rounded shadow-sm" style={{ fontSize: '12px' }}>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-map-marker-alt text-danger me-1"></i>
                            <strong>{project.location}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Map Controls */}
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <div className="btn-group-vertical" role="group">
                          <button
                            className="btn btn-light btn-sm"
                            title="View in Google Maps"
                            onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(project.location + ', Bangladesh')}`, '_blank')}
                          >
                            <i className="fab fa-google"></i>
                          </button>
                          <button
                            className="btn btn-light btn-sm"
                            title="Get Directions"
                            onClick={() => window.open(`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(project.location + ', Bangladesh')}`, '_blank')}
                          >
                            <i className="fas fa-directions"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-hospital text-info me-2"></i>
                          <small><strong>Nearby Hospital:</strong> Square Hospital (2.5 km)</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-graduation-cap text-success me-2"></i>
                          <small><strong>Schools:</strong> Scholastica School (1.8 km)</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-shopping-cart text-warning me-2"></i>
                          <small><strong>Shopping:</strong> Jamuna Future Park (3.2 km)</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-bus text-primary me-2"></i>
                          <small><strong>Public Transport:</strong> Bus Stop (0.3 km)</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-utensils text-danger me-2"></i>
                          <small><strong>Restaurants:</strong> Multiple options nearby</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-gas-pump text-secondary me-2"></i>
                          <small><strong>Gas Station:</strong> Padma Oil (0.8 km)</small>
                        </div>
                      </div>
                    </div>

                    {/* Distance Calculator */}
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-route text-primary me-2"></i>Calculate Distance
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-8">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Enter destination address..."
                          />
                        </div>
                        <div className="col-md-4">
                          <button className="btn btn-primary btn-sm w-100">
                            <i className="fas fa-search me-1"></i>Calculate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Project Details */}
            <div className="col-lg-6">
              {/* Project Header */}
              <div className="mb-4">
                <h1 className="display-4 fw-bold text-dark mb-2">{project.name}</h1>
                <p className="lead text-muted mb-3">{project.subtitle}</p>
                <div className="bg-primary text-white px-3 py-2 d-inline-block mb-4">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {project.location}
                </div>
              </div>

              {/* Project Progress */}
              <div className="mb-5">
                <h2 className="display-6 fw-bold text-primary mb-4">PROJECT PROGRESS</h2>
                <div className="progress-container mb-4">
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${project.progress}%` }}
                      aria-valuenow={project.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div
                    className="progress-marker"
                    style={{ left: `${project.progress}%` }}
                  >
                    {project.progress}%
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <small className="text-muted d-block">Project Start</small>
                    <strong>0%</strong>
                  </div>
                  <div>
                    <small className="text-muted d-block">Successfully Completed</small>
                    <strong>100%</strong>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="mb-5">
                <div className="mb-3">
                  <span className="bg-primary text-white px-3 py-2 fw-bold">Overview</span>
                </div>
                <p className="lead mb-3">{project.description}</p>
                <p className="text-primary fw-semibold mb-3">{project.tourLink}</p>

                {/* Quick Info */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">Quick Info</h5>
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted d-block">Status</small>
                        <span className={`badge ${project.status === 'Completed' ? 'bg-success' :
                          project.status === 'Ongoing' ? 'bg-warning' : 'bg-info'
                          }`}>
                          {project.status}
                        </span>
                      </div>
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
                      <div className="col-12">
                        <small className="text-muted d-block">Completion</small>
                        <strong>{project.completion}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-5">
                <h2 className="display-6 fw-bold text-primary mb-4">SPECIFICATION</h2>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Orientation:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.orientation}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Front Road:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.frontRoad}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Land Size:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.landSize}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Apartment Size:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.apartmentSize}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Number of Apartments:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.numberOfApartments}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Number of Parking:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.numberOfParking}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Number of Floors:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.numberOfFloors}</span>
                  </div>
                </div>
                <div className="specification-row">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="text-muted">Handover Date:</strong>
                    <span className="text-end flex-grow-1 ms-3">{project.specifications.handoverDate}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-5">
                <h2 className="display-6 fw-bold text-primary mb-4">Amenities & Features</h2>
                <div className="row g-3">
                  {project.amenities.map((amenity, index) => (
                    <div key={index} className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-check-circle text-primary me-3"></i>
                        <span>{amenity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-5">
                <div className="d-flex flex-wrap gap-3">
                  <button className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-download me-2"></i>
                    Download Brochure
                  </button>
                  <button className="btn btn-primary btn-lg">
                    <i className="fas fa-phone me-2"></i>
                    Call Now
                  </button>
                  <button className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-calendar me-2"></i>
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Page Image Modal */}
      {showFullImage && (
        <div className="image-modal-overlay" onClick={closeFullImage}>
          <div className="image-modal-container">
            <button
              className="image-modal-close"
              onClick={closeFullImage}
            >
              <i className="fas fa-times"></i>
            </button>

            <button
              className="image-modal-nav image-modal-prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <button
              className="image-modal-nav image-modal-next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <img
              src={project.images[selectedImage] || imageList[selectedImage]}
              alt={project.name}
              className="image-modal-img"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="image-modal-info">
              <h5 className="text-white mb-2">{project.name}</h5>
              <p className="text-white-50 mb-0">Image {selectedImage + 1} of {imageList.length}</p>
            </div>

            <div className="image-modal-thumbnails">
              {imageList.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`image-modal-thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/8801234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float text-decoration-none"
      >
        <i className="fab fa-whatsapp fa-2x"></i>
      </a>
    </div>
  );
};

export default ProjectDetail;