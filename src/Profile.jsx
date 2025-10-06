import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">My Profile</h1>
              <p className="lead">Manage your account information and view your activity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Profile Menu</h5>
                </div>
                <div className="list-group list-group-flush">
                  <Link to="/profile" className="list-group-item list-group-item-action active">
                    <i className="fas fa-user me-2"></i>Profile Information
                  </Link>
                  <Link to="/my-bookings" className="list-group-item list-group-item-action">
                    <i className="fas fa-calendar-check me-2"></i>My Bookings
                  </Link>
                  <Link to="/favourites" className="list-group-item list-group-item-action">
                    <i className="fas fa-heart me-2"></i>My Favourites
                  </Link>
                  <Link to="/cart" className="list-group-item list-group-item-action">
                    <i className="fas fa-shopping-cart me-2"></i>My Cart
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Profile Information</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong>Username:</strong>
                    </div>
                    <div className="col-sm-9">
                      {user?.username || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong>Email:</strong>
                    </div>
                    <div className="col-sm-9">
                      {user?.email || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong>Role:</strong>
                    </div>
                    <div className="col-sm-9">
                      <span className="badge bg-info">
                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong>Member Since:</strong>
                    </div>
                    <div className="col-sm-9">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <strong>Last Login:</strong>
                    </div>
                    <div className="col-sm-9">
                      {user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary">
                      <i className="fas fa-edit me-2"></i>Edit Profile
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-key me-2"></i>Change Password
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="mb-0">Recent Activity</h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="fas fa-history fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">No recent activity</h6>
                    <p className="text-muted">Your recent actions will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;