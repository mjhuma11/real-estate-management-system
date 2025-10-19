import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.jsx';

const RealtimeNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Check for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/get-notifications.php`);
            const data = await response.json();
            
            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            // Fallback to mock notifications
            setNotifications(getMockNotifications());
            setUnreadCount(3);
        } finally {
            setLoading(false);
        }
    };

    const getMockNotifications = () => [
        {
            id: 1,
            type: 'booking',
            title: 'New Property Booking',
            message: 'John Doe booked "Luxury Apartment in Gulshan"',
            time: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false,
            icon: 'fa-calendar-check',
            color: 'success'
        },
        {
            id: 2,
            type: 'property',
            title: 'Property Added',
            message: 'New property "Modern Villa in Dhanmondi" was added',
            time: new Date(Date.now() - 15 * 60000).toISOString(),
            read: false,
            icon: 'fa-home',
            color: 'primary'
        },
        {
            id: 3,
            type: 'user',
            title: 'New User Registration',
            message: 'Sarah Ahmed registered as an agent',
            time: new Date(Date.now() - 30 * 60000).toISOString(),
            read: false,
            icon: 'fa-user-plus',
            color: 'info'
        },
        {
            id: 4,
            type: 'inquiry',
            title: 'Property Inquiry',
            message: 'Michael Brown inquired about "Penthouse in Banani"',
            time: new Date(Date.now() - 60 * 60000).toISOString(),
            read: true,
            icon: 'fa-question-circle',
            color: 'warning'
        }
    ];

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${API_URL}/mark-notification-read.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: notificationId })
            });

            const data = await response.json();
            
            if (data.success) {
                setNotifications(notifications.map(notif => 
                    notif.id === notificationId ? { ...notif, read: true } : notif
                ));
                setUnreadCount(Math.max(0, unreadCount - 1));
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${API_URL}/mark-all-notifications-read.php`, {
                method: 'POST'
            });

            const data = await response.json();
            
            if (data.success) {
                setNotifications(notifications.map(notif => ({ ...notif, read: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const formatTime = (timeString) => {
        const time = new Date(timeString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return time.toLocaleDateString();
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-outline-secondary position-relative"
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="dropdown-header d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Notifications</span>
                        <div>
                            {unreadCount > 0 && (
                                <button 
                                    className="btn btn-sm btn-link text-decoration-none p-0 me-2"
                                    onClick={markAllAsRead}
                                >
                                    Mark all read
                                </button>
                            )}
                            <button 
                                className="btn btn-sm btn-link text-decoration-none p-0"
                                onClick={fetchNotifications}
                                disabled={loading}
                            >
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    {loading ? (
                        <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div 
                                key={notification.id}
                                className={`dropdown-item-text p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="d-flex align-items-start">
                                    <div className={`me-3 text-${notification.color}`}>
                                        <i className={`fas ${notification.icon}`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h6 className="mb-1 fw-bold">{notification.title}</h6>
                                            {!notification.read && (
                                                <span className="badge bg-primary rounded-pill ms-2">New</span>
                                            )}
                                        </div>
                                        <p className="mb-1 text-muted small">{notification.message}</p>
                                        <small className="text-muted">{formatTime(notification.time)}</small>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <i className="fas fa-bell-slash fa-2x mb-2"></i>
                            <p className="mb-0">No notifications</p>
                        </div>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    <div className="text-center">
                        <a href="#" className="dropdown-item text-center text-primary">
                            View all notifications
                        </a>
                    </div>
                </div>
            )}
            
            {showDropdown && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100" 
                    style={{ zIndex: -1 }}
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
};

export default RealtimeNotifications;