import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { API_URL } from '../../config.jsx';
import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Admin Dashboard</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Print</button>
                    </div>
                </div>
            </div>

            {/* Dynamic Statistics */}
            <DashboardStats />

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
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
