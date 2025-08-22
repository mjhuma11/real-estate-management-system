import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFavourites } from './contexts/FavouritesContext';
import './styles/favourites.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const { toggleFavourite, isFavourite } = useFavourites();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [similarProperties, setSimilarProperties] = useState([]);

  // Load property details from API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError('');
        const API_BASE_URL = 'http://localhost/WDPF/React-project/real-estate-management-system/API';
        const res = await fetch(`${API_BASE_URL}/get-property.php?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.message || 'Failed to load property');
        }
        setProperty(json.data);
        // Optionally fetch similar properties later
        setSimilarProperties([]);
      } catch (e) {
        console.error('Failed to load property', e);
        setError('Unable to load property details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
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
          <h2>{error ? 'Error' : 'Property Not Found'}</h2>
          <p>{error || "The property you're looking for doesn't exist."}</p>
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
            <div className="col-lg-6">
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

              {/* Details moved to right column */}

              {/* LEFT COLUMN: Location Map Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>Location & Map
                  </h4>
                  <p className="text-muted mb-3">
                    <strong>Address:</strong> {property.location_name || property.address}
                  </p>

                  {/* Interactive Map Container */}
                  <div className="map-container mb-3" style={{ height: '400px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    {/* Working Google Maps Embed - No API key required */}
                    <iframe
                      src={`https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent((property.location_name || property.address || 'Dhaka') + ', Bangladesh')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
                          onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent((property.location_name || property.address || 'Dhaka') + ', Bangladesh')}`, '_blank')}
                        >
                          <i className="fab fa-google"></i>
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          title="Get Directions"
                          onClick={() => window.open(`https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent((property.location_name || property.address || 'Dhaka') + ', Bangladesh')}`, '_blank')}
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

            {/* RIGHT column: Details */}
            <div className="col-lg-6">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h2 className="fw-bold mb-0">{property.title}</h2>
                    <div className="d-flex align-items-center gap-2">
                      <Link
                        to={`/appointment?property=${property.id}&title=${encodeURIComponent(property.title)}&type=${property.type}`}
                        className="btn btn-success"
                      >
                        <i className="fas fa-calendar-check me-2"></i>
                        Book Now
                      </Link>
                      <button 
                        className={`btn btn-lg rounded-circle favourite-btn ${isFavourite(property.id) ? 'btn-danger text-white favourited' : 'btn-outline-danger'}`}
                        onClick={() => toggleFavourite(property)}
                        title={isFavourite(property.id) ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <i className={`fas fa-heart ${isFavourite(property.id) ? 'text-white' : ''}`}></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-muted mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>{property.location_name || property.address}
                  </p>
                  <div className="mb-4 d-flex align-items-center gap-2">
                    <h3 className="fw-bold text-primary mb-0">{property.price_formatted || (property.monthly_rent ? `৳ ${new Intl.NumberFormat('en-BD').format(property.monthly_rent)}/month` : (property.price ? `৳ ${new Intl.NumberFormat('en-BD').format(property.price)}` : 'Price on request'))}</h3>
                    <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'}`}>
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="badge bg-warning">Featured</span>
                    )}
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Property Type</small>
                        <strong>{property.property_type || 'N/A'}</strong>
                      </div>
                    </div>
                    {property.bedrooms && (
                      <div className="col-md-4 col-6">
                        <div className="border rounded p-3 text-center">
                          <small className="text-muted d-block">Bedrooms</small>
                          <strong>{property.bedrooms}</strong>
                        </div>
                      </div>
                    )}
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Bathrooms</small>
                        <strong>{property.bathrooms}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Area</small>
                        <strong>{property.area_formatted || property.area || '—'}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Year Built</small>
                        <strong>{property.year_built || '—'}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Parking</small>
                        <strong>{property.parking} spaces</strong>
                      </div>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Floor</small>
                        <strong>{property.floor}</strong>
                      </div>
                    </div>
                    <div className="col-md-4 col-6">
                      <div className="border rounded p-3 text-center">
                        <small className="text-muted d-block">Facing</small>
                        <strong>{property.facing}</strong>
                      </div>
                    </div>
                  </div>

                  <h4 className="fw-bold mb-3">Description</h4>
                  <p className="mb-4">{property.description || '—'}</p>

                  {Array.isArray(property.features) && property.features.length > 0 && (
                    <>
                      <h4 className="fw-bold mb-3">Features</h4>
                      <div className="row">
                        {property.features.map((feature, index) => (
                          <div key={index} className="col-md-6 mb-2">
                            <i className="fas fa-check text-primary me-2"></i>{feature}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
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