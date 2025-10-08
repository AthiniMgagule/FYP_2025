import React, { useState, useEffect } from 'react';
import { searchVehicles, createBooking, updateBooking, cancelBooking } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import BookingForm from './BookingForm';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      // Using searchVehicles to get bookings (you might need to create a separate getBookings endpoint)
      const response = await searchVehicles({ status: filter !== 'all' ? filter : undefined });
      setBookings(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleConfirm = async (bookingId) => {
    if (window.confirm('Confirm this booking?')) {
      try {
        await updateBooking(bookingId, { status: 'confirmed' });
        fetchBookings();
      } catch (error) {
        alert(error, 'Error confirming booking');
      }
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        fetchBookings();
      } catch (error) {
        alert(error, 'Error cancelling booking');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBooking(null);
    fetchBookings();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> New Booking
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All Bookings
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">End Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{booking.booking_id}</td>
                <td className="px-4 py-3 text-sm">{booking.first_name} {booking.last_name}</td>
                <td className="px-4 py-3 text-sm">{booking.make} {booking.model}</td>
                <td className="px-4 py-3 text-sm">{booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}</td>

                <td className="px-4 py-3 text-sm">${Number(booking.total_amount || 0).toFixed(2)}</td>

                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => handleConfirm(booking.booking_id)}
                        className="text-green-600 hover:text-green-800"
                        title="Confirm Booking"
                      >
                        <FaCheck size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEdit(booking)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Booking"
                    >
                      <FaEdit size={18} />
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleCancel(booking.booking_id)}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Booking"
                      >
                        <FaTimes size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BookingForm 
          booking={selectedBooking} 
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default BookingList;