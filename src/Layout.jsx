import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./contexts/AuthContext";
import { useFavourites } from "./contexts/FavouritesContext";
import { useCart } from "./contexts/CartContext";

const Layout = () => {
    const { user, isAuthenticated, logout, isAdmin } = useContext(AuthContext);
    const { getFavouritesCount } = useFavourites();
    const { getCartCount } = useCart();
    
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div>
            {/* Top Header */}
            <div className="bg-dark text-white py-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <small>
                                <i className="fas fa-phone me-2"></i>+880-1754-567890
                                <i className="fas fa-envelope ms-3 me-2"></i>info@netro-realestate.com
                            </small>
                        </div>
                        <div className="col-md-6 text-end">
                            <small>
                                <i className="fas fa-clock me-2"></i>Mon - Sat: 9:00 AM - 6:00 PM
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
                        NETRO <span className="text-secondary">Real Estate Ltd</span>
                    </Link>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/about">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/properties">Properties</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/services">Services</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fw-semibold" href="#" id="projectsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Projects
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="projectsDropdown">
                                    <li><Link className="dropdown-item" to="/projects/completed">Completed</Link></li>
                                    <li><Link className="dropdown-item" to="/projects/ongoing">Ongoing</Link></li>
                                    <li><Link className="dropdown-item" to="/projects/upcoming">Upcoming</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="/projects">All Projects</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/contact">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold position-relative d-flex align-items-center justify-content-center" to="/favourites" style={{width: '50px', height: '50px'}}>
                                    <i className="fas fa-heart position-relative" style={{fontSize: '2rem', color: '#dc3545'}}>
                                        {getFavouritesCount() > 0 && (
                                            <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold" style={{fontSize: '0.8rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                                                {getFavouritesCount()}
                                            </span>
                                        )}
                                    </i>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold position-relative" to="/cart">
                                    <i className="fas fa-shopping-cart me-1"></i>Cart
                                    {getCartCount() > 0 && (
                                        <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill" style={{fontSize: '0.6rem'}}>
                                            {getCartCount()}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            {isAuthenticated() ? (
                                <>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle fw-semibold" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fas fa-user me-2"></i>
                                            {user?.username || user?.email || 'User'}
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="userDropdown">
                                            {isAdmin() && (
                                                <li>
                                                    <Link className="dropdown-item" to="/admin">
                                                        <i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <Link className="dropdown-item" to="/profile">
                                                    <i className="fas fa-user-cog me-2"></i>Profile
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link fw-semibold" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link fw-semibold" to="/register">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-dark text-white py-5 mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <h5 className="text-primary mb-3">NETRO Real Estate Ltd</h5>
                            <p className="text-light">Your trusted partner in finding the perfect property. We provide comprehensive real estate solutions with professional excellence.</p>
                            <div className="d-flex">
                                <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h6 className="text-primary mb-3">Quick Links</h6>
                            <ul className="list-unstyled">
                                <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
                                <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
                                <li><Link to="/properties" className="text-light text-decoration-none">Properties</Link></li>
                                <li><Link to="/services" className="text-light text-decoration-none">Services</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h6 className="text-primary mb-3">Services</h6>
                            <ul className="list-unstyled">
                                <li className="text-light">Property Sales</li>
                                <li className="text-light">Property Rental</li>
                                <li className="text-light">Property Management</li>
                                <li className="text-light">Investment Consulting</li>
                            </ul>
                        </div>
                        <div className="col-lg-3 mb-4">
                            <h6 className="text-primary mb-3">Contact Info</h6>
                            <p className="text-light mb-2">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                 23,Gulsan, Dhaka, Bangladesh
                            </p>
                            <p className="text-light mb-2">
                                <i className="fas fa-phone me-2"></i>
                                +880-1754-567890
                            </p>
                            <p className="text-light">
                                <i className="fas fa-envelope me-2"></i>
                                info@netro-realestate.com
                            </p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-light mb-0">&copy; 2025 Netro Real Estate Ltd. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-end">
                            <p className="text-light mb-0">Privacy Policy | Terms of Service</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
export default Layout;
