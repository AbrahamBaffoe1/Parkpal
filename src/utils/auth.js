// utils/auth.js

export function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token !== null;
  }
  
  export function getAuthToken() {
    return localStorage.getItem('authToken');
  }
  
  export function setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }
  
  export function clearAuthToken() {
    localStorage.removeItem('authToken');
  }