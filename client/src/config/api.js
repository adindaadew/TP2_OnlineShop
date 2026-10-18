// Base API URL - switches between local and deployed backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default BASE_URL;
