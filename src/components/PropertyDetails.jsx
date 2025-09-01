import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost/WDPF/React-project/real-estate-management-system/API/get-property.php?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
        } else {
          throw new Error(data.message || 'Failed to load property');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="container mt-5 text-center">Loading property details...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  if (!property) {
    return <div className="container mt-5">Property not found</div>;
  }

  return (
    <div className="container mt-5">
      {/* Main Image */}
      <div className="mb-4">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="img-fluid rounded-3 w-100" 
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
            <span className="text-muted">No Image Available</span>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Property Title and Price */}
          <div className="mb-4">
            <h1 className="mb-2">{property.title}</h1>
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-primary me-2">{property.type}</span>
              <span className="text-muted">
                <i className="fas fa-map-marker-alt me-1"></i>
                {property.location_name || property.address}
              </span>
            </div>
            <h3 className="text-primary">{property.price_formatted || property.price}</h3>
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

          {/* Amenities */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Amenities</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {property.amenities_list?.length > 0 ? (
                  property.amenities_list.map((amenity) => (
                    <div key={amenity.id} className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-check text-success me-2"></i>
                        <span>{amenity.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p className="text-muted mb-0">No amenities listed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Description</h4>
            </div>
            <div className="card-body">
              {property.description ? (
                <div
                  className="property-description"
                  dangerouslySetInnerHTML={{ __html: property.description.replace(/\n/g, '<br />') }}
                />
              ) : (
                <p className="text-muted mb-0">No description available</p>
              )}
            </div>
          </div>

          {/* Location & Map */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Location</h4>
            </div>
            <div className="card-body p-0">
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address || property.location_name || '')}&output=embed`}
                  title="Property Location"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h5 className="mb-2">
                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                  Address
                </h5>
                <p className="mb-0">{property.address || property.location_name || 'Address not available'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Contact Agent</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0">
                  <img
                    src="https://ui-avatars.com/api/?name=Agent&background=0D6EFD&color=fff"
                    alt="Agent"
                    className="rounded-circle"
                    width="60"
                    height="60"
                  />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">{property.agent?.name || 'Property Agent'}</h6>
                  <p className="text-muted small mb-0">
                    <i className="fas fa-phone-alt me-1"></i> {property.agent?.phone || 'N/A'}
                  </p>
                </div>
              </div>
              <form>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="mb-3">
                  <input type="tel" className="form-control" placeholder="Phone Number" />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="3" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-paper-plane me-2"></i> Send Message
                </button>
              </form>
              <div className="share-buttons mt-3 pt-3 border-top">
                <h6 className="mb-2">Share this property</h6>
                <div className="d-flex">
                  <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary btn-sm me-2">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-link"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
       </div>
</div>

{/* Sidebar */}
<div className="col-lg-4">
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title mb-3">Contact Agent</h5>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-shrink-0">
          <img 
            src="https://ui-avatars.com/api/?name=Agent&background=0D6EFD&color=fff" 
            alt="Agent" 
            className="rounded-circle" 
            width="60"
            height="60"
          />
        </div>
        <div className="ms-3">
          <h6 className="mb-1">{property.agent?.name || 'Property Agent'}</h6>
          <p className="text-muted small mb-0">
            <i className="fas fa-phone-alt me-1"></i> {property.agent?.phone || 'N/A'}
          </p>
        </div>
      </div>
      <form>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Your Name" required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Your Email" required />
        </div>
        <div className="mb-3">
          <input type="tel" className="form-control" placeholder="Phone Number" />
        </div>
        <div className="mb-3">
          <textarea className="form-control" rows="3" placeholder="Your Message"></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          <i className="fas fa-paper-plane me-2"></i> Send Message
        </button>
      </form>
      <div className="share-buttons mt-3 pt-3 border-top">
        <h6 className="mb-2">Share this property</h6>
        <div className="d-flex">
          <a href="#" className="btn btn-outline-secondary btn-sm me-2">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="btn btn-outline-secondary btn-sm me-2">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="btn btn-outline-secondary btn-sm me-2">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="btn btn-outline-secondary btn-sm">
            <i className="fas fa-link"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  );
};



export default PropertyDetails;
