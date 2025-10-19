import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.jsx';
import './ActivityFeed.css';

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchActivities();
        // Refresh activities every minute
        const interval = setInterval(fetchActivities, 60000);
        return () => clearInterval(interval);
    }, [filter]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            console.log('Fetching activities from:', `${API_URL}/get-recent-activities.php?filter=${filter}&limit=10`);
            
            const response = await fetch(`${API_URL}/get-recent-activities.php?filter=${filter}&limit=10`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Activities API response:', data);
            
            if (data.success) {
                setActivities(data.activities || []);
            } else {
                console.error('API Error:', data.error);
                // If activities table doesn't exist, it will be created automatically
                if (data.error && data.error.includes('activities')) {
                    // Try again after a short delay to allow table creation
                    setTimeout(() => {
                        fetchActivities();
                    }, 2000);
                } else {
                    setActivities([]);
                }
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
            // Show empty state instead of mock data
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    // Removed mock data - now using real API data only

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return time.toLocaleDateString();
    };

    const getActivityTypeLabel = (type) => {
        const types = {
            'all': 'All Activities',
            'property_added': 'Properties',
            'booking_received': 'Bookings',
            'user_registered': 'Users',
            'project_updated': 'Projects'
        };
        return types[type] || type;
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Recent Activities</h6>
                <div className="d-flex align-items-center gap-2">
                    <select 
                        className="form-select form-select-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">All Activities</option>
                        <option value="property">Properties</option>
                        <option value="booking">Bookings</option>
                        <option value="user">Users</option>
                        <option value="project">Projects</option>
                    </select>
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={fetchActivities}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                    </button>
                </div>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 mb-0 text-muted">Loading activities...</p>
                    </div>
                ) : activities.length > 0 ? (
                    <div className="timeline">
                        {activities.map((activity, index) => (
                            <div key={activity.id} className={`timeline-item ${index === activities.length - 1 ? 'timeline-item-last' : ''}`}>
                                <div className="timeline-marker">
                                    <i className={`fas ${activity.icon} ${activity.color}`}></i>
                                </div>
                                <div className="timeline-content">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <p className="mb-1">
                                                <strong>{activity.user_name}</strong> {activity.message}
                                            </p>
                                            {activity.details && (
                                                <div className="small text-muted">
                                                    {activity.details.property_title && (
                                                        <span className="badge bg-light text-dark me-2">
                                                            {activity.details.property_title}
                                                        </span>
                                                    )}
                                                    {activity.details.booking_amount && (
                                                        <span className="badge bg-success text-white me-2">
                                                            {activity.details.booking_amount}
                                                        </span>
                                                    )}
                                                    {activity.details.role && (
                                                        <span className="badge bg-info text-white me-2">
                                                            {activity.details.role}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <small className="text-muted ms-2">
                                            {formatTime(activity.created_at)}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted">
                        <i className="fas fa-history fa-2x mb-2"></i>
                        <p className="mb-0">No recent activities</p>
                        <small>Activities will appear here as they happen</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;