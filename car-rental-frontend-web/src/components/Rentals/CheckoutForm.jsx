import React, { useState } from 'react';
import { processCheckout } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const CheckoutForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    bookingId: '',
    checkoutMileage: '',
    fuelLevelOut: 'full',
    conditionNotesOut: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await processCheckout(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing checkout');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Process Checkout</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Booking ID *</label>
            <input
              type="number"
              value={formData.bookingId}
              onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
              required
              placeholder="Enter confirmed booking ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Current Mileage *</label>
            <input
              type="number"
              step="0.01"
              value={formData.checkoutMileage}
              onChange={(e) => setFormData({ ...formData, checkoutMileage: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Fuel Level *</label>
            <select
              value={formData.fuelLevelOut}
              onChange={(e) => setFormData({ ...formData, fuelLevelOut: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full</option>
              <option value="3/4">3/4</option>
              <option value="1/2">1/2</option>
              <option value="1/4">1/4</option>
              <option value="empty">Empty</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Condition Notes</label>
            <textarea
              value={formData.conditionNotesOut}
              onChange={(e) => setFormData({ ...formData, conditionNotesOut: e.target.value })}
              rows="4"
              placeholder="Note any existing damage or condition"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
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
              {loading ? 'Processing...' : 'Complete Checkout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;