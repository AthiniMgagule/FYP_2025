import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
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

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');

// Vehicles
export const getVehicles = (params) => api.get('/vehicles', { params });
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// Customers
export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const getCustomerRentalHistory = (id) => api.get(`/customers/${id}/rental-history`);

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const searchVehicles = (params) => api.get('/bookings/search', { params });
export const getCustomerBookings = (customerId) => api.get(`/bookings/customer/${customerId}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// Rentals
export const getRentals = (params) => api.get('/rentals', { params });
export const getRental = (id) => api.get(`/rentals/${id}`);
export const getActiveRentals = () => api.get('/rentals/active');
export const processCheckout = (data) => api.post('/rentals/checkout', data);
export const processCheckin = (data) => api.post('/rentals/checkin', data);

// Invoices
export const getInvoices = (params) => api.get('/invoices', { params });
export const getInvoice = (id) => api.get(`/invoices/${id}`);
export const getInvoiceByRental = (rentalId) => api.get(`/invoices/rental/${rentalId}`);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data);
export const processPayment = (id, data) => api.post(`/invoices/${id}/payment`, data);

// Maintenance
export const getMaintenance = (params) => api.get('/maintenance', { params });
export const getMaintenanceById = (id) => api.get(`/maintenance/${id}`);
export const getMaintenanceByVehicle = (vehicleId) => api.get(`/maintenance/vehicle/${vehicleId}`);
export const scheduleMaintenance = (data) => api.post('/maintenance', data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

// Reports
export const getFleetReport = () => api.get('/reports/fleet');
export const getCustomerActivityReport = () => api.get('/reports/customer-activity');
export const getUsageStatistics = () => api.get('/reports/usage-statistics');
export const getRevenueReport = (params) => api.get('/reports/revenue', { params });
export const getMaintenanceReport = () => api.get('/reports/maintenance');
export const getDashboardStats = () => api.get('/reports/dashboard');

export default api;