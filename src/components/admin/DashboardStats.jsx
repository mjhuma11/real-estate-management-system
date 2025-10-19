import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.jsx';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        properties: {
            total: 0,
            available: 0,
            sold: 0,
            featured: 0,
            thisMonth: 0
        },
        projects: {
            total: 0,
            ongoing: 0,
            completed: 0,
            upcoming: 0
        },
        users: {
            total: 0,
            active: 0,
            agents: 0,
            customers: 0,
            thisMonth: 0
        },
        bookings: {
            total: 0,
            pending: 0,
            confirmed: 0,
            thisMonth: 0,
            revenue: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchStats();
        // Auto-refresh every 2 minutes
        const interval = setInterval(fetchStats, 120000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            
            const response = await fetch(`${API_URL}/dashboard-stats.php`);
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
                setLastUpdated(new Date());
            } else {
                console.error('Failed to fetch stats:', data.error);
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num || 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${color} shadow h-100 py-2`}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
                                {title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {loading ? (
                                    <div className={`spinner-border spinner-border-sm text-${color}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    formatNumber(value)
                                )}
                            </div>
                            {subtitle && (
                                <div className="text-xs text-muted mt-1">{subtitle}</div>
                            )}
                            {trend && (
                                <div className={`text-xs mt-1 ${trend.positive ? 'text-success' : 'text-danger'}`}>
                                    <i className={`fas fa-arrow-${trend.positive ? 'up' : 'down'} me-1`}></i>
                                    {trend.value}% from last month
                                </div>
                            )}
                        </div>
                        <div className="col-auto">
                            <i className={`fas ${icon} fa-2x text-gray-300`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Dashboard Overview</h2>
                <div className="d-flex align-items-center">
                    {lastUpdated && (
                        <small className="text-muted me-3">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </small>
                    )}
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={fetchStats}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Main Stats Row */}
            <div className="row mb-4">
                <StatCard
                    title="Total Properties"
                    value={stats.properties.total}
                    icon="fa-home"
                    color="primary"
                    subtitle={`${formatNumber(stats.properties.available)} available`}
                />
                <StatCard
                    title="Total Projects"
                    value={stats.projects.total}
                    icon="fa-building"
                    color="success"
                    subtitle={`${formatNumber(stats.projects.ongoing)} ongoing`}
                />
                <StatCard
                    title="Total Users"
                    value={stats.users.total}
                    icon="fa-users"
                    color="info"
                    subtitle={`${formatNumber(stats.users.active)} active`}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={formatCurrency(stats.bookings.revenue)}
                    icon="fa-dollar-sign"
                    color="warning"
                    subtitle={`${formatNumber(stats.bookings.thisMonth)} bookings`}
                />
            </div>

            {/* Detailed Stats Row */}
            <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-primary">
                                <i className="fas fa-home me-2"></i>Properties
                            </h6>
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="h6 mb-0 text-success">{formatNumber(stats.properties.available)}</div>
                                    <small className="text-muted">Available</small>
                                </div>
                                <div className="col-6">
                                    <div className="h6 mb-0 text-danger">{formatNumber(stats.properties.sold)}</div>
                                    <small className="text-muted">Sold</small>
                                </div>
                            </div>
                            <hr className="my-2" />
                            <div className="text-center">
                                <div className="h6 mb-0 text-warning">{formatNumber(stats.properties.featured)}</div>
                                <small className="text-muted">Featured</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-success">
                                <i className="fas fa-building me-2"></i>Projects
                            </h6>
                            <div className="row text-center">
                                <div className="col-4">
                                    <div className="h6 mb-0 text-warning">{formatNumber(stats.projects.ongoing)}</div>
                                    <small className="text-muted">Ongoing</small>
                                </div>
                                <div className="col-4">
                                    <div className="h6 mb-0 text-success">{formatNumber(stats.projects.completed)}</div>
                                    <small className="text-muted">Done</small>
                                </div>
                                <div className="col-4">
                                    <div className="h6 mb-0 text-info">{formatNumber(stats.projects.upcoming)}</div>
                                    <small className="text-muted">Coming</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-info">
                                <i className="fas fa-users me-2"></i>Users
                            </h6>
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="h6 mb-0 text-warning">{formatNumber(stats.users.agents)}</div>
                                    <small className="text-muted">Agents</small>
                                </div>
                                <div className="col-6">
                                    <div className="h6 mb-0 text-primary">{formatNumber(stats.users.customers)}</div>
                                    <small className="text-muted">Customers</small>
                                </div>
                            </div>
                            <hr className="my-2" />
                            <div className="text-center">
                                <div className="h6 mb-0 text-success">{formatNumber(stats.users.thisMonth)}</div>
                                <small className="text-muted">New this month</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="card-title text-warning">
                                <i className="fas fa-calendar-check me-2"></i>Bookings
                            </h6>
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="h6 mb-0 text-warning">{formatNumber(stats.bookings.pending)}</div>
                                    <small className="text-muted">Pending</small>
                                </div>
                                <div className="col-6">
                                    <div className="h6 mb-0 text-success">{formatNumber(stats.bookings.confirmed)}</div>
                                    <small className="text-muted">Confirmed</small>
                                </div>
                            </div>
                            <hr className="my-2" />
                            <div className="text-center">
                                <div className="h6 mb-0 text-info">{formatNumber(stats.bookings.thisMonth)}</div>
                                <small className="text-muted">This month</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;