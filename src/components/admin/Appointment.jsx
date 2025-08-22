import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    // initial fetch
    refreshAppointments(false);

    // start polling every 10 seconds (silent)
    pollingRef.current = setInterval(() => {
      refreshAppointments(true);
    }, 10000);

    // cleanup
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const refreshAppointments = async (silent = true) => {
    try {
      if (!silent) setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/get-appointments.php`);
      const result = await response.json();

      if (result.success) {
        setAppointments(prev => {
          // simple diff check to avoid unnecessary re-renders
          const incoming = JSON.stringify(result.data || []);
          const existing = JSON.stringify(prev || []);
          if (incoming !== existing) {
            return result.data || [];
          }
          return prev;
        });
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch appointments:', result.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/update-appointment-status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          status: newStatus
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setAppointments(prev => prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, admin_status: newStatus, updated_at: new Date().toISOString() }
            : appointment
        ));
        
        // Show success message
        alert(`Appointment ${newStatus} successfully!`);
      } else {
        alert(result.message || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('An error occurred while updating the appointment status');
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/delete-appointment.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointment_id: appointmentId })
      });

      const result = await response.json();
      
      if (result.success) {
        setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
        alert('Appointment deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while deleting the appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge bg-success">Accepted</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'waiting':
      default:
        return <span className="badge bg-warning">Waiting</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.admin_status === filter;
    const matchesSearch = 
      appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone?.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const getFilterCounts = () => {
    return {
      all: appointments.length,
      waiting: appointments.filter(a => a.admin_status === 'waiting').length,
      accepted: appointments.filter(a => a.admin_status === 'accepted').length,
      rejected: appointments.filter(a => a.admin_status === 'rejected').length
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              <i className="fas fa-calendar-alt me-2"></i>Appointment Management
            </h1>
            <button 
              onClick={() => refreshAppointments(false)}
              className="btn btn-outline-primary"
            >
              <i className="fas fa-sync-alt me-2"></i>Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <ul className="nav nav-pills">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                      >
                        All ({counts.all})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${filter === 'waiting' ? 'active' : ''}`}
                        onClick={() => setFilter('waiting')}
                      >
                        <i className="fas fa-clock me-1"></i>Waiting ({counts.waiting})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${filter === 'accepted' ? 'active' : ''}`}
                        onClick={() => setFilter('accepted')}
                      >
                        <i className="fas fa-check me-1"></i>Accepted ({counts.accepted})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                      >
                        <i className="fas fa-times me-1"></i>Rejected ({counts.rejected})
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="row">
        <div className="col-12">
          {lastUpdated && (
            <div className="text-muted small mb-2">
              <i className="fas fa-history me-1"></i>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          {filteredAppointments.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-calendar-times text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h4 className="text-muted">No appointments found</h4>
                <p className="text-muted">
                  {filter === 'all' 
                    ? 'No appointments have been submitted yet.' 
                    : `No ${filter} appointments found.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Customer</th>
                        <th>Property</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <div>
                              <strong>{appointment.name}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {appointment.id}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{appointment.property_title || 'Unknown Property'}</strong>
                              <br />
                              <small className="text-muted">
                                Property ID: {appointment.property_id}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <i className="fas fa-calendar me-1"></i>
                              {formatDate(appointment.appointment_date)}
                              <br />
                              <i className="fas fa-clock me-1"></i>
                              {formatTime(appointment.appointment_time)}
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(appointment.admin_status)}
                          </td>
                          <td>
                            <div>
                              <i className="fas fa-envelope me-1"></i>
                              <a href={`mailto:${appointment.email}`}>
                                {appointment.email}
                              </a>
                              <br />
                              <i className="fas fa-phone me-1"></i>
                              <a href={`tel:${appointment.phone}`}>
                                {appointment.phone}
                              </a>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              {appointment.admin_status === 'waiting' && (
                                <>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                                    className="btn btn-success btn-sm"
                                    title="Accept"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                                    className="btn btn-danger btn-sm"
                                    title="Reject"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                              {appointment.admin_status === 'accepted' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Reject"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                              {appointment.admin_status === 'rejected' && (
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                                  className="btn btn-outline-success btn-sm"
                                  title="Accept"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              <button
                                onClick={() => deleteAppointment(appointment.id)}
                                className="btn btn-outline-danger btn-sm ms-1"
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal would go here if needed */}
    </div>
  );
};

export default Appointment;
