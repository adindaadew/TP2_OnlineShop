// Base API URL - switches between local and deployed backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://tp-2-online-shop.vercel.app/api';

export default BASE_URL;
