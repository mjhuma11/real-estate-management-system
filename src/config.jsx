const config = {
    API_URL: import.meta.env.VITE_API_URL || '/api'
};

// Helper function to get API URL with proper formatting
export const getApiUrl = (endpoint = '') => {
    const baseUrl = config.API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
};

export const API_URL = config.API_URL;
export default config;