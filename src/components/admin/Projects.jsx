import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { projectsData } from '../../data/database';
import AddProject from './AddProject';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setProjects(Object.values(projectsData));
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      // In a real app, this would be an API call
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': 'success',
      'ongoing': 'primary',
      'upcoming': 'warning'
    };
    return statusMap[status] || 'secondary';
  };

  const handleAddProject = (newProject) => {
    // In a real app, this would be an API call
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setShowAddForm(false);
    navigate('/admin/projects');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Project Management</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus me-2"></i>Add New Project
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <AddProject 
          onClose={() => setShowAddForm(false)}
          onProjectAdded={handleAddProject}
        />
      )}

      {/* Projects Grid */}
      <div className="row g-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  {project.images && project.images.length > 0 && (
                    <img 
                      src={project.images[0]} 
                      className="img-fluid" 
                      alt={project.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text text-muted mb-2">{project.location}</p>
                  <p className="card-text">{project.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${getStatusBadge(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(project.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
