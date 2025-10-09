import React, { useState, useEffect } from 'react';
import { getVehicles, deleteVehicle } from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import VehicleForm from './VehicleForm';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState({ category: '', status: '' });

  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles(filter);
      setVehicles(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (error) {
        alert(error, 'Error deleting vehicle');
      }
    }
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVehicle(null);
    fetchVehicles();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Vehicle
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select 
          value={filter.category} 
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="economy">Economy</option>
          <option value="luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="van">Van</option>
          <option value="sports">Sports</option>
        </select>

        <select 
          value={filter.status} 
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registration</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Make & Model</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Daily Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
  {vehicles.map((vehicle) => (
    <tr key={vehicle.vehicle_id} className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-sm">#{vehicle.vehicle_id}</td>
      
      {/* Vehicle Image */}
      <td className="px-4 py-3">
        {vehicle.image_url ? (
          <img 
            src={vehicle.image_url} 
            alt={vehicle.make + " " + vehicle.model} 
            className="w-20 h-12 object-cover rounded border"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </td>
      
      <td className="px-4 py-3 text-sm">{vehicle.registration_number}</td>
      <td className="px-4 py-3 text-sm">{vehicle.make} {vehicle.model}</td>
      <td className="px-4 py-3 text-sm">{vehicle.year}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {vehicle.category}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">R{vehicle.daily_rate}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 text-xs rounded-full ${
          vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
          vehicle.status === 'rented' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {vehicle.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(vehicle)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(vehicle.vehicle_id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {showForm && (
        <VehicleForm 
          vehicle={selectedVehicle} 
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default VehicleList;