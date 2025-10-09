import React, { useState, useEffect } from 'react';
import { createBooking, updateBooking, searchVehicles, getCustomers } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const BookingForm = ({ booking, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchVehicles();
    
    if (booking) {
      setFormData({
        customerId: booking.customer_id || '',
        vehicleId: booking.vehicle_id || '',
        startDate: booking.start_date?.split('T')[0] || '',
        endDate: booking.end_date?.split('T')[0] || '',
        totalAmount: booking.total_amount || 0,
      });
    }
  }, [booking]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await searchVehicles({ status: 'available' });
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };


  const calculateTotal = () => {
    if (formData.vehicleId && formData.startDate && formData.endDate) {
      const vehicle = vehicles.find(v => v.vehicle_id === parseInt(formData.vehicleId));
      if (vehicle) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const total = days * vehicle.daily_rate;
        setFormData(prev => ({ ...prev, totalAmount: total }));
      }
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.vehicleId, formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (booking) {
        await updateBooking(booking.booking_id, formData);
      } else {
        await createBooking(formData);
      }
      onClose();
    } catch (err) {
      console.error('Booking save error:', err);
      setError(err.response?.data?.message || 'Error saving booking');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {booking ? 'Edit Booking' : 'Create New Booking'}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Customer *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} {customer.last_name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Vehicle *</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                    {vehicle.make} {vehicle.model} ({vehicle.registration_number}) - R{vehicle.daily_rate}/day
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-gray-700 font-semibold mb-2">Total Amount</label>
                <p className="text-3xl font-bold text-blue-600">
                  R{formData.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;