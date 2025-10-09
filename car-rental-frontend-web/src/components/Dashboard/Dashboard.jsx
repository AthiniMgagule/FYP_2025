import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { FaCar, FaCalendarCheck, FaUsers, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;
  }

  const statCards = [
    { title: 'Available Vehicles', value: stats?.overview?.available_vehicles || 0, icon: FaCar, color: 'bg-green-500' },
    { title: 'Rented Vehicles', value: stats?.overview?.rented_vehicles || 0, icon: FaCar, color: 'bg-blue-500' },
    { title: 'Active Rentals', value: stats?.overview?.active_rentals || 0, icon: FaCalendarCheck, color: 'bg-orange-500' },
    { title: 'Total Customers', value: stats?.overview?.total_customers || 0, icon: FaUsers, color: 'bg-purple-500' },
    {
      title: 'Pending Payments',
      value: `R${Number(stats?.overview?.pending_payments || 0).toFixed(2)}`,
      icon: FaDollarSign,
      color: 'bg-red-500'
    },
    {
      title: 'Revenue (30 Days)',
      value: `R${Number(stats?.overview?.revenue_last_30_days || 0).toFixed(2)}`,
      icon: FaDollarSign,
      color: 'bg-green-600'
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className={`${stat.color} p-4 rounded-full text-white mr-4`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((booking) => (
                  <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">#{booking.booking_id}</td>
                    <td className="px-4 py-3 text-sm">{booking.first_name} {booking.last_name}</td>
                    <td className="px-4 py-3 text-sm">{booking.make} {booking.model}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Rentals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentRentals?.map((rental) => (
                  <tr key={rental.rental_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">#{rental.rental_id}</td>
                    <td className="px-4 py-3 text-sm">{rental.first_name} {rental.last_name}</td>
                    <td className="px-4 py-3 text-sm">{rental.make} {rental.model}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;