import React, { useState, useEffect } from 'react';
import { getMaintenance, deleteMaintenance } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import MaintenanceForm from './MaintenanceForm';

const MaintenanceList = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMaintenance();
  }, [filter]);

  const fetchMaintenance = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getMaintenance(params);
      setMaintenanceRecords(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await deleteMaintenance(id);
        fetchMaintenance();
      } catch (error) {
        alert(error, 'Error deleting maintenance record');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRecord(null);
    fetchMaintenance();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Maintenance Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> Schedule Maintenance
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All Records
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Scheduled Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRecords.map((record) => (
              <tr key={record.maintenance_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{record.maintenance_id}</td>
                <td className="px-4 py-3 text-sm">
                  {record.make} {record.model} ({record.registration_number})
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    {record.maintenance_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{record.description}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(record.scheduled_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">R{record.cost != null ? Number(record.cost).toFixed(2) : '0.00'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'completed' ? 'bg-green-100 text-green-800' :
                    record.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    record.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.maintenance_id)}
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
        <MaintenanceForm 
          record={selectedRecord} 
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default MaintenanceList;1