import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import VehicleList from './components/Vehicles/VehicleList';
import CustomerList from './components/Customers/CustomerList';
import BookingList from './components/Bookings/BookingList';
import RentalList from './components/Rentals/RentalList';
import InvoiceList from './components/Invoices/InvoiceList';
import MaintenanceList from './components/Maintenance/MaintenanceList';
// import Reports from './components/Reports/Reports';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/vehicles"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <VehicleList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/customers"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <CustomerList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/bookings"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <BookingList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/rentals"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <RentalList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/invoices"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <InvoiceList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/maintenance"
            element={
              <PrivateRoute allowedRoles={['staff', 'manager']}>
                <Layout>
                  <MaintenanceList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          {/* <Route
            path="/reports"
            element={
              <PrivateRoute allowedRoles={['manager']}>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          /> */}
          
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                  <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                  <a href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;