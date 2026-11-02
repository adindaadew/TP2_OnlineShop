// Mobile API Configuration
import { Platform } from 'react-native';

// Default to deployed backend, with fallback for local development
const DEPLOYED_URL = 'https://tp-2-online-shop.vercel.app/api';

// For local development on Android emulator use 10.0.2.2, for iOS/Web use localhost
const LOCAL_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

export const API_BASE_URL = DEPLOYED_URL;
export const LOCAL_BASE_URL = LOCAL_URL;

export default API_BASE_URL;
