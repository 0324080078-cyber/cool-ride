import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, remove token and redirect
      localStorage.removeItem('token');
      // Note: In a real app, use React Router's navigate or a navigation service
      // For now, we'll just clear the token. The app should handle this in useEffect hooks
      console.error('Authentication expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  verifyOtp: (data: any) => apiClient.post('/auth/verify-otp', data),
  logout: () => apiClient.post('/auth/logout'),
};

// Trip Services
export const tripService = {
  getEstimate: (data: any) => apiClient.post('/trips/estimate', data),
  createTrip: (data: any) => apiClient.post('/trips', data),
  getTripDetails: (tripId: string) => apiClient.get(`/trips/${tripId}`),
  cancelTrip: (tripId: string, reason: string) =>
    apiClient.post(`/trips/${tripId}/cancel`, { reason }),
  rateTrip: (tripId: string, rating: number, comment?: string) =>
    apiClient.post(`/trips/${tripId}/rate`, { rating, comment }),
};

// User Services
export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
  uploadPhoto: (formData: FormData) =>
    apiClient.post('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Rider Services
export const riderService = {
  getNearby: (lat: number, lng: number) =>
    apiClient.get('/riders/nearby', { params: { lat, lng } }),
  updateLocation: (lat: number, lng: number) =>
    apiClient.post('/riders/location', { lat, lng }),
  toggleStatus: (isOnline: boolean) =>
    apiClient.post('/riders/toggle-status', { isOnline }),
  getEarnings: (startDate?: string, endDate?: string) =>
    apiClient.get('/riders/earnings', { params: { startDate, endDate } }),
};

export default apiClient;
