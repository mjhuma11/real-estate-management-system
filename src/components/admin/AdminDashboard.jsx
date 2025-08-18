import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
                    <div className="position-sticky pt-3">
                        <div className="text-center mb-4">
                            <h5 className="text-white">NETRO Admin Panel</h5>
                            <small className="text-muted">Welcome, {user?.username}</small>
                        </div>
                        
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link active text-white" to="/admin">
                                    <i className="fas fa-tachometer-alt me-2"></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin/properties">
                                    <i className="fas fa-home me-2"></i>
                                    Properties
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin/projects">
                                    <i className="fas fa-building me-2"></i>
                                    Projects
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin/users">
                                    <i className="fas fa-users me-2"></i>
                                    Users
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin/categories">
                                    <i className="fas fa-tags me-2"></i>
                                    Categories
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/admin/locations">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    Locations
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Admin Dashboard</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group me-2">
                                <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                                <button type="button" className="btn btn-sm btn-outline-secondary">Print</button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="row mb-4">
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Total Properties</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-home fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-success shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                Total Projects</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-building fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-info shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                Total Users</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-users fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-warning shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                Featured Properties</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-star fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <Link to="/admin/properties/add" className="btn btn-primary btn-block">
                                                <i className="fas fa-plus me-2"></i>Add Property
                                            </Link>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Link to="/admin/projects/add" className="btn btn-success btn-block">
                                                <i className="fas fa-plus me-2"></i>Add Project
                                            </Link>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Link to="/admin/properties" className="btn btn-info btn-block">
                                                <i className="fas fa-list me-2"></i>View Properties
                                            </Link>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Link to="/admin/projects" className="btn btn-warning btn-block">
                                                <i className="fas fa-list me-2"></i>View Projects
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Recent Activities</h6>
                                </div>
                                <div className="card-body">
                                    <div className="list-group list-group-flush">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fas fa-home text-primary me-2"></i>
                                                No recent properties added
                                            </div>
                                        </div>
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fas fa-building text-success me-2"></i>
                                                No recent projects added
                                            </div>
                                        </div>
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fas fa-user text-info me-2"></i>
                                                No recent user registrations
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
