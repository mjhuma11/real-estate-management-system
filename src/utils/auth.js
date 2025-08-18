// Authentication utility functions

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
};

export const requireAuth = (requiredRole = null) => {
  if (!isLoggedIn()) {
    return false;
  }
  
  if (requiredRole && getUserRole() !== requiredRole) {
    return false;
  }
  
  return true;
};
