import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaCar, FaCalendarCheck, FaUsers, 
  FaFileInvoiceDollar, FaTools, FaChartBar 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/vehicles', label: 'Vehicles', icon: <FaCar /> },
    { path: '/bookings', label: 'Bookings', icon: <FaCalendarCheck /> },
    { path: '/rentals', label: 'Rentals', icon: <FaCalendarCheck /> },
    { path: '/customers', label: 'Customers', icon: <FaUsers /> },
    { path: '/invoices', label: 'Invoices', icon: <FaFileInvoiceDollar /> },
    { path: '/maintenance', label: 'Maintenance', icon: <FaTools /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6 bg-gray-900">
        <h3 className="text-xl font-bold text-center">Car Rental</h3>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 hover:bg-gray-700 transition ${
              location.pathname === item.path ? 'bg-blue-600 border-l-4 border-blue-400' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;