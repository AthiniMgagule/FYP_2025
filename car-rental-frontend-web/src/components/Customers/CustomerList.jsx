import React, { useState, useEffect } from 'react';
import { getCustomers } from '../../services/api';
import { FaEye } from 'react-icons/fa';
import CustomerDetails from './CustomerDetails';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Driver's License</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{customer.customer_id}</td>
                <td className="px-4 py-3 text-sm">{customer.first_name} {customer.last_name}</td>
                <td className="px-4 py-3 text-sm">{customer.email}</td>
                <td className="px-4 py-3 text-sm">{customer.phone_number || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{customer.drivers_license || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{customer.city || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleViewDetails(customer)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <CustomerDetails 
          customer={selectedCustomer}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default CustomerList;