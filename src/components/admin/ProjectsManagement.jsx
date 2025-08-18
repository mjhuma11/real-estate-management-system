import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';

const ProjectsManagement = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, project: null });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.API_URL}list-projects.php`);
            const data = await response.json();
            
            if (data.success) {
                setProjects(data.projects);
            } else {
                setError(data.error || 'Failed to fetch projects');
            }
        } catch (err) {
            setError('Error fetching projects: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const response = await fetch(`${config.API_URL}delete-project.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: projectId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProjects(projects.filter(p => p.id !== projectId));
                setDeleteModal({ show: false, project: null });
            } else {
                alert('Error deleting project: ' + data.error);
            }
        } catch (err) {
            alert('Error deleting project: ' + err.message);
        }
    };

    const toggleFeatured = async (projectId, currentFeatured) => {
        try {
            const response = await fetch(`${config.API_URL}update-project.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: projectId, 
                    featured: currentFeatured ? 0 : 1 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setProjects(projects.map(p => 
                    p.id === projectId 
                        ? { ...p, featured: currentFeatured ? 0 : 1 }
                        : p
                ));
            } else {
                alert('Error updating project: ' + data.error);
            }
        } catch (err) {
            alert('Error updating project: ' + err.message);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN').format(price) + ' BDT';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'planning': { class: 'bg-secondary', label: 'Planning' },
            'ongoing': { class: 'bg-warning', label: 'Ongoing' },
            'completed': { class: 'bg-success', label: 'Completed' },
            'upcoming': { class: 'bg-info', label: 'Upcoming' }
        };
        
        const config = statusConfig[status] || { class: 'bg-secondary', label: status };
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Projects Management</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <Link to="/admin/projects/add" className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>Add New Project
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">All Projects ({projects.length})</h6>
                </div>
                <div className="card-body">
                    {projects.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="fas fa-building fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No projects found</h5>
                            <p className="text-muted">Start by adding your first project</p>
                            <Link to="/admin/projects/add" className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>Add Project
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Location</th>
                                        <th>Price Range</th>
                                        <th>Units</th>
                                        <th>Featured</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td>{project.id}</td>
                                            <td>
                                                <div>
                                                    <strong>{project.name}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {project.category_name && `${project.category_name} • `}
                                                        {project.completion_percentage}% Complete
                                                    </small>
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(project.status)}</td>
                                            <td>{project.location_name || 'N/A'}</td>
                                            <td>
                                                {project.min_price && project.max_price ? (
                                                    <span>
                                                        {formatPrice(project.min_price)} - {formatPrice(project.max_price)}
                                                    </span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td>
                                                {project.total_units ? (
                                                    <span>
                                                        {project.available_units || 0} / {project.total_units} Available
                                                    </span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${project.featured ? 'btn-warning' : 'btn-outline-warning'}`}
                                                    onClick={() => toggleFeatured(project.id, project.featured)}
                                                    title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                                                >
                                                    <i className={`fas fa-star ${project.featured ? 'text-white' : ''}`}></i>
                                                </button>
                                            </td>
                                            <td>{formatDate(project.created_at)}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <Link 
                                                        to={`/admin/projects/edit/${project.id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <Link 
                                                        to={`/project/${project.slug}`}
                                                        className="btn btn-sm btn-outline-info"
                                                        title="View"
                                                        target="_blank"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => setDeleteModal({ show: true, project })}
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
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setDeleteModal({ show: false, project: null })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the project "<strong>{deleteModal.project.name}</strong>"?</p>
                                <p className="text-danger">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setDeleteModal({ show: false, project: null })}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={() => handleDelete(deleteModal.project.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManagement;
