import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3 border-bottom">
          <h4 className="text-center mb-0">NETRO Admin</h4>
        </div>
        <ul className="nav flex-column p-2">
          <li className="nav-item">
            <Link to="/admin" className="nav-link text-white">
              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/properties" className="nav-link text-white">
              <i className="fas fa-home me-2"></i>Properties
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/projects" className="nav-link text-white">
              <i className="fas fa-building me-2"></i>Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link text-white">
              <i className="fas fa-envelope me-2"></i>Users
              <span className="badge bg-danger rounded-pill ms-2">3</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/locations" className="nav-link text-white">
              <i className="fas fa-map-marker-alt me-2"></i>Locations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/property-types" className="nav-link text-white">
              <i className="fas fa-tags me-2"></i>Property Types
            </Link>
          </li>
          <li className="nav-item mt-4">
            <Link to="/" className="nav-link text-white">
              <i className="fas fa-arrow-left me-2"></i>Back to Site
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <div className="ms-auto d-flex align-items-center">
              <span className="me-3">{user?.username || user?.email}</span>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                  <i className="fas fa-user-circle"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
