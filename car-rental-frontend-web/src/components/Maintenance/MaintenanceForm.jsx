import React, { useState, useEffect } from 'react';
import { scheduleMaintenance, updateMaintenance, getVehicles } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const MaintenanceForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    maintenanceType: 'routine',
    description: '',
    startDate: '',
    endDate: '',
    cost: 0,
    performedBy: '',
    notes: '',
    status: 'scheduled',
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();

    if (record) {
      setFormData({
        vehicleId: record.vehicle_id || '',
        maintenanceType: record.maintenance_type || 'routine',
        description: record.description || '',
        startDate: record.start_date?.split('T')[0] || '',
        endDate: record.end_date?.split('T')[0] || '',
        cost: record.cost || 0,
        performedBy: record.performed_by || '',
        notes: record.notes || '',
        status: record.status || 'scheduled',
      });
    }
  }, [record]);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles();
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (record) {
        await updateMaintenance(record.maintenance_id, formData);
      } else {
        await scheduleMaintenance(formData);
      }
      onClose();
    } catch (err) {
      console.error('Maintenance save error:', err);
      setError(err.response?.data?.message || 'Error saving maintenance record');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {record ? 'Edit Maintenance Record' : 'Schedule Maintenance'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Vehicle *</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">-- Select Vehicle --</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.make} {vehicle.model} - {vehicle.registration_number}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Maintenance Type *</label>
            <select
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="routine">Routine</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Estimated Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Performed By */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Performed By</label>
            <input
              type="text"
              name="performedBy"
              value={formData.performedBy}
              onChange={handleChange}
              placeholder="Technician or company name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : record ? 'Update Maintenance' : 'Schedule Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
