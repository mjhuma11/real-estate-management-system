import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from './config';
import AuthContext from './contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);

  // Check if user data was passed from registration
  useEffect(() => {
    if (location.state?.user) {
      setFormData(prevState => ({
        ...prevState,
        email: location.state.user.email
      }));
      setMessage(location.state.message);
      setMessageType('success');
    }
  }, [location.state]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, isAuthenticated, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.status === true) {
        setMessage('Login successful!');
        setMessageType('success');
        
        // Use auth context to login
        login(data.user);
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again later.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">Login</h1>
              <p className="lead">Access your account to manage your properties and preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4 text-center">Welcome Back</h3>
                  
                  {/* Success/Error Message */}
                  {message && (
                    <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} mb-4`}>
                      {message}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        disabled={loading}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-4">
                    <p className="text-muted">Don't have an account? <a href="/register" className="text-decoration-none">Sign up</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;