import React, { useState, useEffect } from 'react';
import { getRentals, getActiveRentals } from '../../services/api';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import CheckoutForm from './CheckoutForm';
import CheckinForm from './CheckinForm';

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, [filter]);

  const fetchRentals = async () => {
    try {
      let response;
      if (filter === 'active') {
        response = await getActiveRentals();
      } else {
        response = await getRentals({ status: filter });
      }
      setRentals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setLoading(false);
    }
  };

  const handleCheckin = (rental) => {
    setSelectedRental(rental);
    setShowCheckin(true);
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    setShowCheckin(false);
    setSelectedRental(null);
    fetchRentals();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rental Management</h1>
        <button 
          onClick={() => setShowCheckout(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaSignOutAlt /> Process Checkout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('active')}
        >
          Active Rentals
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('')}
        >
          All Rentals
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rental ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Checkout Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expected Return</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.rental_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{rental.rental_id}</td>
                <td className="px-4 py-3 text-sm">{rental.first_name} {rental.last_name}</td>
                <td className="px-4 py-3 text-sm">{rental.make} {rental.model} ({rental.registration_number})</td>
                <td className="px-4 py-3 text-sm">{new Date(rental.checkout_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">{new Date(rental.end_date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {rental.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {rental.status === 'active' && (
                    <button 
                      onClick={() => handleCheckin(rental)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaSignInAlt size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCheckout && <CheckoutForm onClose={handleCloseModal} />}
      {showCheckin && <CheckinForm rental={selectedRental} onClose={handleCloseModal} />}
    </div>
  );
};

export default RentalList;