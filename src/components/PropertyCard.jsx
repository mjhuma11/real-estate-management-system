import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
          alt={property.title}
          className="img-fluid w-100"
          style={{ height: '250px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          }}
        />
        <span className={`badge ${property.type === 'For Sale' ? 'bg-primary' : 'bg-success'} position-absolute top-0 start-0 m-3`}>
          {property.type}
        </span>
        {property.featured == 1 && (
          <span className="badge bg-warning position-absolute top-0 end-0 m-3">Featured</span>
        )}
        <div className="position-absolute bottom-0 end-0 m-3">
          <button className="btn btn-light btn-sm rounded-circle me-2">
            <i className="fas fa-heart"></i>
          </button>
          <button className="btn btn-light btn-sm rounded-circle">
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold">{property.title}</h5>
        <p className="text-muted mb-2">
          <i className="fas fa-map-marker-alt me-2"></i>{property.location_name || property.address}
        </p>
        <div className="row g-2 mb-3">
          {property.bedrooms && (
            <div className="col-4">
              <small className="text-muted">
                <i className="fas fa-bed me-1"></i>{property.bedrooms} bed
              </small>
            </div>
          )}
          <div className="col-4">
            <small className="text-muted">
              <i className="fas fa-bath me-1"></i>{property.bathrooms} bath
            </small>
          </div>
          <div className="col-4">
            <small className="text-muted">
              <i className="fas fa-ruler-combined me-1"></i>{property.area} sq ft
            </small>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-primary fw-bold mb-0">
            {property.price_formatted || `৳ ${new Intl.NumberFormat('en-BD').format(property.price)}`}
          </h6>
          <Link
            to={`/property/${property.id}`}
            className="btn btn-outline-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;