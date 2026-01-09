import axios, { InternalAxiosRequestConfig } from 'axios';

// The URL of your Spring Boot Server
const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically add the Token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  
  // 1. Try to get the token from the NEW Zustand storage
  const storage = localStorage.getItem('auth-storage'); // This is the key we set in use-auth.ts
  let token = null;

  if (storage) {
    try {
      // 2. Parse the JSON to extract the actual token string
      const parsedStorage = JSON.parse(storage);
      token = parsedStorage.state?.token;
    } catch (e) {
      console.error("Failed to parse auth token", e);
    }
  }

  // 3. Fallback: Check for the old raw token key just in case
  if (!token) {
     token = localStorage.getItem('token');
  }

  // 4. Attach the header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});