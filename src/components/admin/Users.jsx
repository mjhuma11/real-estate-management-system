import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  // Debounce search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1); // This will trigger fetchUsers via the other useEffect
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : '',
        status: statusFilter !== 'all' ? statusFilter : ''
      });

      console.log('Fetching users from:', `${API_URL}/get-users.php?${params}`);
      const response = await fetch(`${API_URL}/get-users.php?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users API response:', data);
      
      if (data.success) {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / usersPerPage));
      } else {
        setError(data.error || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to connect to server. Please check your API connection.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Since API handles filtering, we use users directly
  const filteredUsers = users;

  const getRoleBadge = (role) => {
    const roleMap = {
      'admin': 'danger',
      'agent': 'warning',
      'customer': 'primary'
    };
    
    return (
      <span className={`badge bg-${roleMap[role]} bg-opacity-10 text-${roleMap[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'success',
      'inactive': 'secondary',
      'suspended': 'danger'
    };
    
    return (
      <span className={`badge bg-${statusMap[status]} bg-opacity-10 text-${statusMap[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/update-user-status.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        alert('Failed to update user status: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/delete-user.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId })
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Failed to delete user: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    agents: 0,
    customers: 0
  });

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/get-users-count.php`);
      const data = await response.json();
      
      if (data.success && data.stats) {
        setTotalStats({
          totalUsers: data.stats.total,
          activeUsers: data.stats.status.active,
          agents: data.stats.roles.agent,
          customers: data.stats.roles.customer
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const stats = totalStats;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">User Management</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
            Refresh
          </button>
          <Link to="/admin/users/new" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add New User
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary bg-opacity-10 border-primary">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h4 className="text-primary">{stats.totalUsers}</h4>
              <p className="mb-0 text-primary">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body text-center">
              <i className="fas fa-user-check fa-2x text-success mb-2"></i>
              <h4 className="text-success">{stats.activeUsers}</h4>
              <p className="mb-0 text-success">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-warning">
            <div className="card-body text-center">
              <i className="fas fa-user-tie fa-2x text-warning mb-2"></i>
              <h4 className="text-warning">{stats.agents}</h4>
              <p className="mb-0 text-warning">Agents</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body text-center">
              <i className="fas fa-user fa-2x text-info mb-2"></i>
              <h4 className="text-info">{stats.customers}</h4>
              <p className="mb-0 text-info">Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            {loading ? 'Loading users...' : `Users (${filteredUsers.length})`}
          </h6>
          {!loading && (
            <small className="text-muted">
              Page {currentPage} of {totalPages}
            </small>
          )}
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0 text-muted">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} 
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                          <div className="small text-muted">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <div className="small">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="small text-muted">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                      <div className="small text-muted">
                        {new Date(user.lastLogin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        <div>Views: {user.propertiesViewed}</div>
                        <div>Inquiries: {user.inquiries}</div>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to={`/admin/users/edit/${user.id}`}>
                            <i className="fas fa-edit me-2"></i>Edit User
                          </Link></li>
                          <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                            <i className={`fas fa-${user.status === 'active' ? 'pause' : 'play'} me-2`}></i>
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </a></li>
                          {user.status !== 'suspended' && (
                            <li><a className="dropdown-item text-warning" href="#" onClick={() => handleStatusChange(user.id, 'suspended')}>
                              <i className="fas fa-ban me-2"></i>Suspend User
                            </a></li>
                          )}
                          {user.status === 'suspended' && (
                            <li><a className="dropdown-item text-success" href="#" onClick={() => handleStatusChange(user.id, 'active')}>
                              <i className="fas fa-check me-2"></i>Unsuspend User
                            </a></li>
                          )}
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item text-danger" href="#" onClick={() => handleDeleteUser(user.id)}>
                            <i className="fas fa-trash me-2"></i>Delete User
                          </a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-users fa-3x mb-3"></i>
                      <p className="mb-0">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="card-footer bg-white">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;