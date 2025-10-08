import React, { useState } from 'react';
import { processCheckin } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const CheckinForm = ({ rental, onClose }) => {
  const [formData, setFormData] = useState({
    rentalId: rental?.rental_id || '',
    checkinMileage: '',
    fuelLevelIn: 'full',
    conditionNotesIn: '',
    additionalCharges: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await processCheckin(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing check-in');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Process Check-in</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Rental Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Rental Information</h3>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Customer:</span> {rental?.first_name} {rental?.last_name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Vehicle:</span> {rental?.make} {rental?.model} ({rental?.registration_number})
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Rental ID:</span> #{rental?.rental_id}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Return Mileage *</label>
            <input
              type="number"
              step="0.01"
              value={formData.checkinMileage}
              onChange={(e) => setFormData({ ...formData, checkinMileage: e.target.value })}
              required
              placeholder="Enter current mileage"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Fuel Level *</label>
            <select
              value={formData.fuelLevelIn}
              onChange={(e) => setFormData({ ...formData, fuelLevelIn: e.target.value })}
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
              value={formData.conditionNotesIn}
              onChange={(e) => setFormData({ ...formData, conditionNotesIn: e.target.value })}
              rows="4"
              placeholder="Note any damage or issues found"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Additional Charges ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.additionalCharges}
              onChange={(e) => setFormData({ ...formData, additionalCharges: e.target.value })}
              placeholder="Late fees, damage charges, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include any late fees, damage charges, or refueling charges
            </p>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Complete Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;