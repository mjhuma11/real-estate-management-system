import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState([]);

  // Mock property database
  const propertiesData = {
    '1': {
      id: '1',
      title: 'Luxury Apartment in Gulshan',
      location: 'Gulshan-2, Dhaka',
      price: '৳ 2,50,00,000',
      monthlyRent: null,
      type: 'For Sale',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1800 sq ft',
      yearBuilt: 2020,
      parking: 2,
      floor: '8th Floor',
      totalFloors: 12,
      facing: 'South',
      description: 'This luxurious apartment offers modern living in the heart of Gulshan. Features include premium finishes, spacious rooms, and stunning city views. Perfect for families looking for comfort and convenience.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Elevator',
        'Swimming Pool',
        'Gym & Fitness Center',
        'CCTV Surveillance',
        'Generator Backup',
        'Rooftop Garden',
        'Children\'s Play Area'
      ],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Ahmed Rahman',
        phone: '+880 1234 567890',
        email: 'ahmed@realestate.com'
      },
      featured: true
    },
    '2': {
      id: '2',
      title: 'Commercial Space in Motijheel',
      location: 'Motijheel Commercial Area, Dhaka',
      price: '৳ 80,000/month',
      monthlyRent: '৳ 80,000',
      type: 'For Rent',
      propertyType: 'Commercial',
      bedrooms: null,
      bathrooms: 2,
      area: '2000 sq ft',
      yearBuilt: 2018,
      parking: 3,
      floor: '5th Floor',
      totalFloors: 10,
      facing: 'East',
      description: 'Prime commercial space in the business district of Motijheel. Ideal for offices, showrooms, or retail businesses. High visibility location with excellent connectivity.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Elevator',
        'CCTV Surveillance',
        'Generator Backup',
        'Central AC',
        'High-Speed Internet Ready',
        'Reception Area'
      ],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Fatima Khan',
        phone: '+880 1234 567891',
        email: 'fatima@realestate.com'
      },
      featured: false
    },
    '3': {
      id: '3',
      title: 'Modern House in Dhanmondi',
      location: 'Dhanmondi-15, Dhaka',
      price: '৳ 3,20,00,000',
      monthlyRent: null,
      type: 'For Sale',
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 3,
      area: '2500 sq ft',
      yearBuilt: 2021,
      parking: 2,
      floor: 'Ground + 2 Floors',
      totalFloors: 3,
      facing: 'North',
      description: 'Beautiful modern house in the prestigious Dhanmondi area. Features contemporary design, spacious rooms, and a private garden. Perfect for large families seeking luxury and privacy.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Swimming Pool',
        'Gym',
        'CCTV Surveillance',
        'Generator Backup',
        'Private Garden',
        'Rooftop Terrace',
        'Servant Quarter'
      ],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Mohammad Ali',
        phone: '+880 1234 567892',
        email: 'ali@realestate.com'
      },
      featured: false
    },
    '4': {
      id: '3',
      title: 'Modern House in Dhanmondi',
      location: 'Dhanmondi-15, Dhaka',
      price: '৳ 3,20,00,000',
      monthlyRent: null,
      type: 'For Sale',
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 3,
      area: '2500 sq ft',
      yearBuilt: 2021,
      parking: 2,
      floor: 'Ground + 2 Floors',
      totalFloors: 3,
      facing: 'North',
      description: 'Beautiful modern house in the prestigious Dhanmondi area. Features contemporary design, spacious rooms, and a private garden. Perfect for large families seeking luxury and privacy.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Swimming Pool',
        'Gym',
        'CCTV Surveillance',
        'Generator Backup',
        'Private Garden',
        'Rooftop Terrace',
        'Servant Quarter'
      ],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Mohammad Ali',
        phone: '+880 1234 567892',
        email: 'ali@realestate.com'
      },
      featured: false
    },
    '5': {
      id: '1',
      title: 'Luxury Apartment in Gulshan',
      location: 'Gulshan-2, Dhaka',
      price: '৳ 2,50,00,000',
      monthlyRent: null,
      type: 'For Sale',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: '1800 sq ft',
      yearBuilt: 2020,
      parking: 2,
      floor: '8th Floor',
      totalFloors: 12,
      facing: 'South',
      description: 'This luxurious apartment offers modern living in the heart of Gulshan. Features include premium finishes, spacious rooms, and stunning city views. Perfect for families looking for comfort and convenience.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Elevator',
        'Swimming Pool',
        'Gym & Fitness Center',
        'CCTV Surveillance',
        'Generator Backup',
        'Rooftop Garden',
        'Children\'s Play Area'
      ],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Ahmed Rahman',
        phone: '+880 1234 567890',
        email: 'ahmed@realestate.com'
      },
      featured: true
    },
    '6': {
      id: '2',
      title: 'Commercial Space in Motijheel',
      location: 'Motijheel Commercial Area, Dhaka',
      price: '৳ 80,000/month',
      monthlyRent: '৳ 80,000',
      type: 'For Rent',
      propertyType: 'Commercial',
      bedrooms: null,
      bathrooms: 2,
      area: '2000 sq ft',
      yearBuilt: 2018,
      parking: 3,
      floor: '5th Floor',
      totalFloors: 10,
      facing: 'East',
      description: 'Prime commercial space in the business district of Motijheel. Ideal for offices, showrooms, or retail businesses. High visibility location with excellent connectivity.',
      features: [
        '24/7 Security',
        'Parking Space',
        'Elevator',
        'CCTV Surveillance',
        'Generator Backup',
        'Central AC',
        'High-Speed Internet Ready',
        'Reception Area'
      ],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
      ],
      agent: {
        name: 'Fatima Khan',
        phone: '+880 1234 567891',
        email: 'fatima@realestate.com'
      },
      featured: false
    },
  };

  // Simulate API call
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const propertyData = propertiesData[id];
      if (propertyData) {
        setProperty(propertyData);

        // Get similar properties (exclude current property)
        const similar = Object.values(propertiesData)
          .filter(p => p.id !== id && p.propertyType === propertyData.propertyType)
          .slice(0, 3);
        setSimilarProperties(similar);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist.</p>
          <a href="/properties" className="btn btn-primary">Back to Properties</a>
        </div>
      </div>
    );
  }

  return (
    <div className="property-details">
      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><a href="/properties">Properties</a></li>
                  <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Property Main Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="mb-4">
                <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-indicators">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#propertyCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner rounded-3">
                    {property.images.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          src={image}
                          className="d-block w-100"
                          alt={`${property.title} - Image ${index + 1}`}
                          style={{ height: '500px', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>

              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h2 className="fw-bold mb-3">{property.title}</h2>
                  <p className="text-muted mb-4">
                    <i className="fas fa-map-marker-alt me-2"></i>{property.location}
                  </p>

                  <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Property Type</small>
                        <strong>{property.propertyType}</strong>
                      </div>
                    </div>
                    {property.bedrooms && (
                      <div className="col-md-3 col-6">
                        <div className="border rounded p-3 text-center">
                          <small className="text-muted d-block">Bedrooms</small>
                          <strong>{property.bedrooms}</strong>
                        </div>
                      </div>
                    )}
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Bathrooms</small>
                        <strong>{property.bathrooms}</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Area</small>
                        <strong>{property.area}</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Year Built</small>
                        <strong>{property.yearBuilt}</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Parking</small>
                        <strong>{property.parking} spaces</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Floor</small>
                        <strong>{property.floor}</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Facing</small>
                        <strong>{property.facing}</strong>
                      </div>
                    </div>
                  </div>

                  <h4 className="fw-bold mb-3">Description</h4>
                  <p className="mb-4">{property.description}</p>

                  <h4 className="fw-bold mb-3">Features</h4>
                  <div className="row">
                    {property.features.map((feature, index) => (
                      <div key={index} className="col-md-4 mb-2">
                        <i className="fas fa-check text-primary me-2"></i>{feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Map Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>Location & Map
                  </h4>
                  <p className="text-muted mb-3">
                    <strong>Address:</strong> {property.location}
                  </p>

                  {/* Interactive Map Container */}
                  <div className="map-container mb-3" style={{ height: '400px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    {/* Working Google Maps Embed - No API key required */}
                    <iframe
                      src={`https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent(property.location + ', Bangladesh')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${property.location}`}
                    ></iframe>

                    {/* Map Overlay with Property Info */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <div className="bg-white p-2 rounded shadow-sm" style={{ fontSize: '12px' }}>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-map-marker-alt text-danger me-1"></i>
                          <strong>{property.location}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Map Controls */}
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <div className="btn-group-vertical" role="group">
                        <button
                          className="btn btn-light btn-sm"
                          title="View in Google Maps"
                          onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(property.location + ', Bangladesh')}`, '_blank')}
                        >
                          <i className="fab fa-google"></i>
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          title="Get Directions"
                          onClick={() => window.open(`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location + ', Bangladesh')}`, '_blank')}
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

            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-body">
                  <h3 className="fw-bold mb-3 text-primary">{property.price}</h3>
                  <p className="mb-4">
                    <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'} me-2`}>
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="badge bg-warning">Featured</span>
                    )}
                  </p>

                  <form className="mb-4">
                    <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Your Name" />
                    </div>
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Your Email" />
                    </div>
                    <div className="mb-3">
                      <input type="tel" className="form-control" placeholder="Your Phone" />
                    </div>
                    <div className="mb-3">
                      <textarea className="form-control" rows="3" placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Request Details</button>
                  </form>

                  <div className="text-center border-top pt-3">
                    <h6 className="fw-bold mb-2">Property Agent</h6>
                    <p className="mb-1">{property.agent.name}</p>
                    <p className="mb-2 text-muted">{property.agent.email}</p>
                    <h5 className="fw-bold text-primary">{property.agent.phone}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h3 className="fw-bold">Similar Properties</h3>
            </div>
          </div>
          <div className="row g-4">
            {similarProperties.length > 0 ? (
              similarProperties.map((similarProperty) => (
                <div key={similarProperty.id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={similarProperty.images[0]}
                        alt={similarProperty.title}
                        className="img-fluid w-100"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <span className={`badge ${similarProperty.type === 'For Sale' ? 'bg-primary' : 'bg-success'} position-absolute top-0 start-0 m-2`}>
                        {similarProperty.type}
                      </span>
                      {similarProperty.featured && (
                        <span className="badge bg-warning position-absolute top-0 end-0 m-2">Featured</span>
                      )}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{similarProperty.title}</h5>
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>{similarProperty.location}
                      </p>
                      <div className="mb-2">
                        {similarProperty.bedrooms && (
                          <small className="text-muted me-3">
                            <i className="fas fa-bed me-1"></i>{similarProperty.bedrooms} beds
                          </small>
                        )}
                        <small className="text-muted me-3">
                          <i className="fas fa-bath me-1"></i>{similarProperty.bathrooms} baths
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-ruler-combined me-1"></i>{similarProperty.area}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-primary fw-bold mb-0">{similarProperty.price}</h6>
                        <a href={`/property/${similarProperty.id}`} className="btn btn-outline-primary btn-sm">View</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No similar properties found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;