import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    { title: 'Total Properties', value: '48', icon: 'home', color: 'primary', link: '/admin/properties' },
    { title: 'Active Projects', value: '12', icon: 'building', color: 'success', link: '/admin/projects' },
    { title: 'New Inquiries', value: '8', icon: 'envelope', color: 'warning', link: '/admin/inquiries' },
    { title: 'Total Users', value: '156', icon: 'users', color: 'info', link: '/admin/users' },
  ];

  const recentActivities = [
    { id: 1, type: 'New Property', description: 'Luxury Villa in Banani added', time: '2 hours ago' },
    { id: 2, type: 'Inquiry', description: 'New inquiry for Apartment #45', time: '5 hours ago' },
    { id: 3, type: 'Update', description: 'Project status updated: RiverView Phase 2', time: '1 day ago' },
    { id: 4, type: 'New User', description: 'New agent registered: John Doe', time: '2 days ago' },
  ];

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3">
            <Link to={stat.link} className="text-decoration-none">
              <div className={`card bg-${stat.color} bg-opacity-10 border-0 h-100`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">{stat.title}</h6>
                      <h3 className="mb-0">{stat.value}</h3>
                    </div>
                    <div className={`bg-${stat.color} bg-opacity-25 p-3 rounded-circle`}>
                      <i className={`fas fa-${stat.icon} text-${stat.color} fs-4`}></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Activities */}
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activities</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="list-group-item border-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{activity.type}</h6>
                        <p className="mb-0 text-muted">{activity.description}</p>
                      </div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/admin/properties/new" className="btn btn-primary mb-2">
                  <i className="fas fa-plus me-2"></i>Add New Property
                </Link>
                <Link to="/admin/projects/new" className="btn btn-outline-primary mb-2">
                  <i className="fas fa-plus me-2"></i>Add New Project
                </Link>
                <Link to="/admin/properties" className="btn btn-outline-secondary mb-2">
                  <i className="fas fa-eye me-2"></i>View All Properties
                </Link>
                <Link to="/admin/projects" className="btn btn-outline-secondary">
                  <i className="fas fa-eye me-2"></i>View All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
