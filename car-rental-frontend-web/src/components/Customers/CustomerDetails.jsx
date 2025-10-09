import React, { useState, useEffect } from 'react';
import { getCustomerRentalHistory } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const CustomerDetails = ({ customer, onClose }) => {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      const response = await getCustomerRentalHistory(customer.customer_id);
      setRentalHistory(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rental history:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    return isNaN(num) ? 'Pending' : num.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Personal Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
              <span className="text-sm">{customer.first_name} {customer.last_name}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
              <span className="text-sm">{customer.phone_number || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Driver's License</label>
              <span className="text-sm">{customer.drivers_license || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
              <span className="text-sm">{customer.address || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
              <span className="text-sm">{customer.city || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Rental History */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
            Rental History
          </h3>
          {loading ? (
            <div>Loading history...</div>
          ) : rentalHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Rental ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Checkout</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Checkin</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalHistory.map((rental) => (
                    <tr key={rental.rental_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">#{rental.rental_id}</td>
                      <td className="px-4 py-3 text-sm">{rental.make} {rental.model} ({rental.registration_number})</td>
                      <td className="px-4 py-3 text-sm">{new Date(rental.checkout_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">
                        {rental.checkin_date ? new Date(rental.checkin_date).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="px-4 py-3 text-sm">R{formatCurrency(rental.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rental.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          rental.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.payment_status || rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No rental history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
