import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+880 1234 567890',
        role: 'customer',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2025-08-12 09:30',
        propertiesViewed: 15,
        inquiries: 3,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+880 1712 345678',
        role: 'agent',
        status: 'active',
        joinDate: '2023-08-20',
        lastLogin: '2025-08-11 16:45',
        propertiesViewed: 45,
        inquiries: 12,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+880 1812 345679',
        role: 'customer',
        status: 'inactive',
        joinDate: '2024-03-10',
        lastLogin: '2025-07-28 14:20',
        propertiesViewed: 8,
        inquiries: 1,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 4,
        name: 'Sarah Ahmed',
        email: 'sarah@example.com',
        phone: '+880 1934 567891',
        role: 'admin',
        status: 'active',
        joinDate: '2023-01-05',
        lastLogin: '2025-08-12 11:15',
        propertiesViewed: 120,
        inquiries: 25,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 5,
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '+880 1555 123456',
        role: 'customer',
        status: 'suspended',
        joinDate: '2024-06-12',
        lastLogin: '2025-08-05 08:30',
        propertiesViewed: 22,
        inquiries: 7,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+880 1666 789012',
        role: 'agent',
        status: 'active',
        joinDate: '2023-11-18',
        lastLogin: '2025-08-10 13:45',
        propertiesViewed: 67,
        inquiries: 18,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const agents = users.filter(user => user.role === 'agent').length;
    const customers = users.filter(user => user.role === 'customer').length;

    return { totalUsers, activeUsers, agents, customers };
  };

  const stats = getUserStats();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">User Management</h1>
        <Link to="/admin/users/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add New User
        </Link>
      </div>

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
              {filteredUsers.length > 0 ? (
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
        {filteredUsers.length > 0 && (
          <div className="card-footer bg-white">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                </li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
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