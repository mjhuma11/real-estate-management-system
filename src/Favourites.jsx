import { Link } from 'react-router-dom';
import { useFavourites } from './contexts/FavouritesContext';

const Favourites = () => {
  const { favourites, removeFavourite, clearAllFavourites } = useFavourites();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-heart me-3"></i>My Favourites
              </h1>
              <p className="lead">Properties you've saved for later</p>
            </div>
          </div>
        </div>
      </section>

      {/* Favourites Content */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-6">
              <h3 className="fw-bold">Favourite Properties</h3>
              <p className="text-muted">
                {favourites.length === 0 ? 'No favourite properties yet' : `${favourites.length} favourite ${favourites.length === 1 ? 'property' : 'properties'}`}
              </p>
            </div>
            {favourites.length > 0 && (
              <div className="col-md-6 text-end">
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearAllFavourites}
                >
                  <i className="fas fa-trash me-2"></i>Clear All Favourites
                </button>
              </div>
            )}
          </div>

          {favourites.length === 0 ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="text-muted">
                  <i className="fas fa-heart fa-3x mb-3 text-muted"></i>
                  <h4>No Favourite Properties</h4>
                  <p>Start browsing properties and click the heart icon to add them to your favourites.</p>
                  <Link to="/properties" className="btn btn-primary">
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {favourites.map(property => (
                <div key={property.id} className="col-lg-4 col-md-6">
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
                        <button 
                          className="btn btn-danger btn-sm rounded-circle me-2"
                          onClick={() => removeFavourite(property.id)}
                          title="Remove from favourites"
                        >
                          <i className="fas fa-heart text-white"></i>
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
                        <div className="d-flex gap-2">
                          <Link
                            to={`/property/${property.id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/book-now?property=${property.id}&title=${encodeURIComponent(property.title)}&type=${property.type}`}
                            className="btn btn-success btn-sm"
                          >
                            <i className="fas fa-shopping-cart me-1"></i>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favourites;
