// Robust cross-platform device token storage
// Supports AsyncStorage if installed, localStorage on Web, and in-memory persistence fallback

let memoryStorage = {};

let nativeStorage = null;
try {
  // Dynamically resolve AsyncStorage if available
  // eslint-disable-next-line global-require
  const mod = require('@react-native-async-storage/async-storage');
  nativeStorage = mod?.default || mod;
} catch {
  nativeStorage = null;
}

export const storage = {
  async getItem(key) {
    try {
      if (nativeStorage && typeof nativeStorage.getItem === 'function') {
        return await nativeStorage.getItem(key);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch {
      return memoryStorage[key] || null;
    }
  },

  async setItem(key, value) {
    try {
      memoryStorage[key] = value;
      if (nativeStorage && typeof nativeStorage.setItem === 'function') {
        await nativeStorage.setItem(key, value);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      memoryStorage[key] = value;
    }
  },

  async removeItem(key) {
    try {
      delete memoryStorage[key];
      if (nativeStorage && typeof nativeStorage.removeItem === 'function') {
        await nativeStorage.removeItem(key);
        return;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      delete memoryStorage[key];
    }
  },
};

export default storage;
