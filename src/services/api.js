// API Base URL - Uses environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/WDPF/React-project/real-estate-management-system/API';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Properties API
export const propertiesAPI = {
  // Get all properties with optional filters
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    return apiCall(`list-properties-simple.php${queryString ? `?${queryString}` : ''}`);
  },

  // Get property by ID
  getById: (id) => {
    return apiCall(`properties.php?id=${id}`);
  },

  // Get featured properties
  getFeatured: () => {
    return apiCall('properties.php?featured=1');
  },

  // Create new property
  create: (propertyData) => {
    return apiCall('properties.php', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Update property
  update: (id, propertyData) => {
    return apiCall('properties.php', {
      method: 'PUT',
      body: JSON.stringify({ id, ...propertyData }),
    });
  },

  // Delete property
  delete: (id) => {
    return apiCall('properties.php', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Projects API
export const projectsAPI = {
  // Get all projects with optional filters
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    return apiCall(`projects.php${queryString ? `?${queryString}` : ''}`);
  },

  // Get project by ID
  getById: (id) => {
    return apiCall(`projects.php?id=${id}`);
  },

  // Get featured projects
  getFeatured: () => {
    return apiCall('projects.php?featured=1');
  },

  // Get projects by status
  getByStatus: (status) => {
    return apiCall(`projects.php?status=${status}`);
  },

  // Create new project
  create: (projectData) => {
    return apiCall('projects.php', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
};

// Locations API
export const locationsAPI = {
  // Get all locations
  getAll: () => {
    return apiCall('locations-simple.php');
  },

  // Get locations by type
  getByType: (type) => {
    return apiCall(`locations-simple.php?type=${type}`);
  },
};

// Property Types API
export const propertyTypesAPI = {
  // Get all property types
  getAll: () => {
    return apiCall('property-types-simple.php');
  },
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: (contactData) => {
    return apiCall('contact.php', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Utility functions
export const formatPrice = (price) => {
  if (!price) return '';
  return `৳ ${new Intl.NumberFormat('en-BD').format(price)}`;
};

export const formatArea = (area, unit = 'sq_ft') => {
  if (!area) return '';
  const unitMap = {
    'sq_ft': 'sq ft',
    'sq_m': 'sq m',
    'katha': 'katha',
    'bigha': 'bigha'
  };
  return `${area} ${unitMap[unit] || 'sq ft'}`;
};

export default {
  propertiesAPI,
  projectsAPI,
  locationsAPI,
  propertyTypesAPI,
  contactAPI,
  formatPrice,
  formatArea,
};