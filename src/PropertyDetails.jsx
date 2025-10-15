import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFavourites } from './contexts/FavouritesContext';
import { useCart } from './contexts/CartContext';
import AuthContext from './contexts/AuthContext';
import './styles/favourites.css';
import './styles/property-details.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { addToCart, getCartCount } = useCart();
  const { isAuthenticated, isCustomer } = useContext(AuthContext);
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
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API';
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

  // Handle authentication for customer-only actions
  const handleFavouriteClick = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can add properties to favourites');
      return;
    }
    toggleFavourite(property);
  };

  const handleBookingClick = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can book properties');
      return;
    }
    navigate(`/booking?property=${property.id}&title=${encodeURIComponent(property.title)}&type=${property.type}`);
  };

  const handleAddToCart = (property) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isCustomer()) {
      alert('Only customers can add properties to cart');
      return;
    }

    // Create cart item data
    const cartItemData = {
      property_id: property.id,
      property_title: property.title,
      property_address: property.location_name || property.address,
      booking_type: property.type === 'For Sale' ? 'sale' : 'rent',
      booking_date: new Date().toISOString().split('T')[0],
      total_property_price: property.price || 0,
      monthly_rent_amount: property.monthly_rent || 0,
      down_payment_details: property.type === 'For Sale' ? Math.round((property.price || 0) * 1) : 0, // 20% down payment
      advance_deposit_amount: property.type === 'For Rent' ? (property.monthly_rent || 0) * 2 : 0, // 2 months advance
      booking_money_amount: property.type === 'For Sale' ? Math.round((property.price || 0) * 1) : 0, // 10% booking money
      user_id: 1 // This should come from auth context
    };

    const itemId = addToCart(cartItemData);
    alert(`Property added to cart! Cart now has ${getCartCount()} items.`);
    console.log('🛒 Added to cart:', cartItemData, 'Item ID:', itemId);
  };

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
          <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
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
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/properties">Properties</Link></li>
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
                    {property.images && property.images.map((_, index) => (
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
                    {property.images && property.images.length > 0 ? (
                      property.images.map((image, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                          <img
                            src={image}
                            className="d-block w-100"
                            alt={`${property.title} - Image ${index + 1}`}
                            style={{ height: '500px', objectFit: 'cover' }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="carousel-item active">
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: '500px' }}
                        >
                          <div className="text-center text-muted">
                            <i className="fas fa-image fa-4x mb-3"></i>
                            <p className="mb-0">No Images Available</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {property.images && property.images.length > 1 && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Property Specifications */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Property Specifications</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {property.bedrooms && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-bed text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Bedrooms</div>
                        <div className="fw-medium">{property.bedrooms}</div>
                      </div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-bath text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Bathrooms</div>
                        <div className="fw-medium">{property.bathrooms}</div>
                      </div>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-ruler-combined text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Area</div>
                        <div className="fw-medium">{property.area_formatted || property.area}</div>
                      </div>
                    </div>
                  </div>
                )}
                {property.property_type && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-building text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Property Type</div>
                        <div className="fw-medium">{property.property_type}</div>
                      </div>
                    </div>
                  </div>
                )}
                {property.floor && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-layer-group text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Floor</div>
                        <div className="fw-medium">{property.floor}</div>
                      </div>
                    </div>
                  </div>
                )}
                {property.facing && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light p-2 rounded me-3">
                        <i className="fas fa-compass text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">Facing</div>
                        <div className="fw-medium">{property.facing}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> 
              {/* Property Description Section */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">
                    <i className="fas fa-info-circle me-2 text-primary"></i>Property Description
                  </h4>
                  <p className="mb-0 text-muted" style={{ lineHeight: '1.6' }}>
                    {property.description || 'No description available for this property.'}
                  </p>
                </div>
              </div>

              {/* Amenities Section */}
              {property.amenities_list && property.amenities_list.length > 0 && (
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h4 className="fw-bold mb-4">
                      <i className="fas fa-star me-2 text-warning"></i>Amenities
                    </h4>
                    <div className="row g-3">
                      {property.amenities_list.map((amenity, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                          <div className="amenity-item d-flex align-items-center p-3 rounded-3 h-100">
                            <div className="me-3">
                              <i className="fas fa-check-circle fa-lg"></i>
                            </div>
                            <div>
                              <span className="fw-semibold text-dark">{amenity.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
               {/* Location Map Section */}
              <div className="card mb-4 shadow-sm" style={{ height: '200px', }}>
                <div className="card-body">
                  <h4 className="fw-bold mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>Location
                  </h4>
                  <p className="text-muted mb-3">
                    <strong>Address:</strong> {property.location_name || property.address}
                  </p>
                  </div>
              </div>
            </div>
            
            

            {/* RIGHT column: Details */}
            <div className="col-lg-4">
              {/* Property Type Specific Header */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {/* Property Type Badge */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge fs-6 px-3 py-2 ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'}`}>
                      {property.type}
                    </span>
                    <button
                      className={`btn btn-sm rounded-circle favourite-btn ${isFavourite(property.id) ? 'btn-danger text-white favourited' : 'btn-outline-danger'}`}
                      onClick={() => handleFavouriteClick(property)}
                      title={isFavourite(property.id) ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      <i className={`fas fa-heart ${isFavourite(property.id) ? 'text-white' : ''}`}></i>
                    </button>
                  </div>

                  {/* Property Title */}
                  <h2 className="fw-bold mb-3">{property.title}</h2>

                  {/* Location */}
                  <p className="text-muted mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {property.location_name || property.address}
                  </p>

                  {/* Price Section - Different for Sale vs Rent */}
                  {property.type === 'For Sale' ? (
                    <div className="price-section sale mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h3 className="text-primary fw-bold mb-0">
                          ৳ {property.price ? new Intl.NumberFormat('en-BD').format(property.price) : 'Price on request'}
                        </h3>
                      </div>
                      <small className="text-muted">Total Price</small>
                      {property.area && property.price && (
                        <div className="mt-2">
                          <small className="text-muted">
                            ৳ {new Intl.NumberFormat('en-BD').format(Math.round(property.price / property.area))} per sq ft
                          </small>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="price-section rent mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h3 className="text-success fw-bold mb-0">
                          ৳ {property.monthly_rent ? new Intl.NumberFormat('en-BD').format(property.monthly_rent) : 'Rent on request'}/month
                        </h3>
                      </div>
                      <small className="text-muted">Monthly Rent</small>
                      {property.area && property.monthly_rent && (
                        <div className="mt-2">
                          <small className="text-muted">
                            ৳ {new Intl.NumberFormat('en-BD').format(Math.round(property.monthly_rent / property.area))} per sq ft/month
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Property Specifications */}
                  <div className="row g-3 mb-4">
                    {property.bedrooms && (
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded specification-card">
                          <i className="fas fa-bed fa-2x text-primary mb-2"></i>
                          <div className="fw-bold">{property.bedrooms}</div>
                          <small className="text-muted">Bedrooms</small>
                        </div>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded specification-card">
                          <i className="fas fa-bath fa-2x text-info mb-2"></i>
                          <div className="fw-bold">{property.bathrooms}</div>
                          <small className="text-muted">Bathrooms</small>
                        </div>
                      </div>
                    )}
                    {property.area && (
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded specification-card">
                          <i className="fas fa-ruler-combined fa-2x text-warning mb-2"></i>
                          <div className="fw-bold">{property.area}</div>
                          <small className="text-muted">sq ft</small>
                        </div>
                      </div>
                    )}
                    {property.parking && (
                      <div className="col-6">
                        <div className="text-center p-3 bg-light rounded specification-card">
                          <i className="fas fa-car fa-2x text-secondary mb-2"></i>
                          <div className="fw-bold">{property.parking}</div>
                          <small className="text-muted">Parking</small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <button
                      onClick={() => handleAddToCart(property)}
                      className="btn btn-warning btn-lg"
                    >
                      <i className="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    
                    <button
                      onClick={() => handleBookingClick(property)}
                      className={`btn btn-lg ${property.type === 'For Sale' ? 'btn-primary' : 'btn-success'}`}
                    >
                      <i className="fas fa-calendar-check me-2"></i>
                      {property.type === 'For Sale' ? 'Purchase Booking' : 'Rental Booking'}
                    </button>
                    
                    <button className="btn btn-outline-secondary btn-lg">
                      <i className="fas fa-phone me-2"></i>Call Now
                    </button>
                    
                    <button className="btn btn-outline-info btn-lg">
                      <i className="fas fa-share-alt me-2"></i>Share Property
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Agent/Contact Info */}
              <div className="card mb-4 shadow-sm agent-card">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <i className="fas fa-user-tie me-2 text-primary"></i>Property Agent
                  </h5>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{property.agent_name || 'Fatima Khan'}</h6>
                      <small className="text-muted">Senior Property Consultant</small>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-phone text-success me-2"></i>
                      <span>{property.agent_phone || '+880 1234-567890'}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-envelope text-info me-2"></i>
                      <span>{property.agent_email || 'fatima@netro-realestate.com'}</span>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-success btn-sm">
                      <i className="fab fa-whatsapp me-2"></i>WhatsApp
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-envelope me-2"></i>Send Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div className="card shadow-sm contact-form">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <i className="fas fa-paper-plane me-2 text-primary"></i>Quick Inquiry
                  </h5>
                  <form>
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
                      <textarea className="form-control" rows="3" placeholder={`I'm interested in this ${property.type.toLowerCase()} property. Please contact me with more details.`}></textarea>
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-paper-plane me-2"></i>Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          
           <h3>Location Map</h3>

                  {/* Interactive Map Container */}
                  <div className="map-container mb-3" style={{ height: '400px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    <iframe
                      src={`https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent((property.location_name || property.address || 'Dhaka') + ', Bangladesh')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${property.location_name || property.address}`}
                    ></iframe>

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
                

          {/* Similar Properties */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">
                    <i className="fas fa-home me-2 text-primary"></i>Similar Properties
                  </h4>
                  {similarProperties.length > 0 ? (
                    <div className="row g-4">
                      {similarProperties.map(similar => (
                        <div key={similar.id} className="col-md-4">
                          <div className="card h-100">
                            <img src={similar.image || 'https://via.placeholder.com/300x200'} className="card-img-top" alt={similar.title} style={{height: '200px', objectFit: 'cover'}} />
                            <div className="card-body">
                              <h6 className="card-title">{similar.title}</h6>
                              <p className="text-muted small">{similar.location}</p>
                              <p className="fw-bold text-primary">{similar.price_formatted}</p>
                              <Link to={`/property/${similar.id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No similar properties found.</p>
                      <Link to="/properties" className="btn btn-primary">Browse All Properties</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;