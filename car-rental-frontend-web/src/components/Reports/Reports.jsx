import React, { useState, useEffect } from 'react';
import {
  getRevenueReport,
  getUsageStatistics,
  getMaintenanceReport,
  getCustomerActivityReport
} from '../../services/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenueData, setRevenueData] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [customerActivity, setCustomerActivity] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      let data;
      switch (type) {
        case 'revenue':
          data = await getRevenueReport();
          console.log("this data im looking for", data);
          setRevenueData(data.data.data);
          break;
        case 'usage':
          data = await getUsageStatistics();
          console.log("this data im looking for", data);
          setUsageStats(data.data.data);
          break;
        case 'maintenance':
          data = await getMaintenanceReport();
          console.log("this data im looking for", data);
          setMaintenanceReport(data.data.data);
          break;
        case 'customers':
          data = await getCustomerActivityReport();
          setCustomerActivity(data.data.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${type} report:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const tabs = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'usage', label: 'Usage' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'customers', label: 'Customers' }
  ];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-4 font-semibold ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading report...</p>}

      {/* --- REVENUE TAB --- */}
      {activeTab === 'revenue' && revenueData && (
  <div>
    {/* --- Summary Cards --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { 
          label: 'Total Revenue', 
          value: revenueData.summary
            ? `R${Number(revenueData.summary.total_base_revenue || 0).toLocaleString()}`
            : 'R0'
        },
        { 
          label: 'Total Invoices', 
          value: revenueData.summary?.total_invoices || 0
        },
        { 
          label: 'Average per Invoice', 
          value: revenueData.summary
            ? `R${(
                Number(revenueData.summary.total_base_revenue || 0) / (revenueData.summary.total_invoices || 1)
              ).toLocaleString()}`
            : 'R0'
        }
      ].map((card, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-1">{card.label}</p>
          <p className="text-3xl font-bold text-blue-600">{card.value}</p>
        </div>
      ))}
    </div>

    {/* --- Revenue by Month --- */}
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue by Month</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {revenueData.monthly?.map((r) => (
          <div key={r.month} className="border rounded-lg p-4">
            <p className="text-sm text-gray-600">{r.month}</p>
            <p className="text-lg font-bold">R{Number(r.total_revenue || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500">{r.invoice_count || 0} invoices</p>
          </div>
        ))}
      </div>
    </div>

    {/* --- Revenue by Vehicle Category --- */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue by Vehicle</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Vehicle Category', 'Total Revenue', 'Total Invoices', 'Average Invoice'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {revenueData.byCategory?.map((v, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{v.category}</td>
                <td className="px-4 py-3 text-sm">R{Number(v.total_revenue || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{v.invoice_count || 0}</td>
                <td className="px-4 py-3 text-sm">R{Number(v.avg_revenue || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}



      {/* --- USAGE TAB --- */}
      {activeTab === 'usage' && usageStats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{usageStats.bookingConversion.total_bookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">{usageStats.bookingConversion.completion_rate}%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-1">Confirmed Bookings</p>
              <p className="text-3xl font-bold text-purple-600">{usageStats.bookingConversion.confirmed_bookings}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Most Rented Vehicles</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Vehicle', 'Rentals', 'Total Revenue', 'Avg Days'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usageStats.mostRentedVehicles.map((v) => (
                    <tr key={v.vehicle_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{v.make} {v.model}</td>
                      <td className="px-4 py-3 text-sm">{v.rental_count}</td>
                      <td className="px-4 py-3 text-sm">R{v.total_revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{v.avg_rental_days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usageStats.popularCategories.map((cat) => (
                <div key={cat.category} className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600">{cat.category}</p>
                  <p className="text-lg font-bold">R{cat.total_revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{cat.rental_count} rentals</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAINTENANCE TAB --- */}
      {activeTab === 'maintenance' && maintenanceReport && (
        <div>
          {/* --- Maintenance by Type --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {maintenanceReport.byType?.map((type) => (
              <div key={type.maintenance_type} className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">{type.maintenance_type}</p>
                <p className="text-3xl font-bold text-blue-600">
                  R{Number(type.total_cost || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{type.count || 0} jobs</p>
              </div>
            ))}
          </div>

          {/* --- Upcoming Maintenance --- */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Maintenance</h2>
            <div className="space-y-3">
              {maintenanceReport.upcoming?.map((m) => (
                <div key={m.maintenance_id} className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold">{m.make} {m.model}</p>
                  <p className="text-sm text-gray-600">{m.maintenance_type} — {m.status}</p>
                  <p className="text-xs text-gray-500">Starts: {m.start_date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Maintenance Costs by Vehicle --- */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Maintenance Costs by Vehicle</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Vehicle', 'Count', 'Total Cost', 'Avg Cost', 'Last Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maintenanceReport.costsByVehicle?.map((v) => (
                    <tr key={v.vehicle_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{v.make} {v.model}</td>
                      <td className="px-4 py-3 text-sm">{v.maintenance_count || 0}</td>
                      <td className="px-4 py-3 text-sm">
                        R{Number(v.total_maintenance_cost || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        R{Number(v.avg_maintenance_cost || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{v.last_maintenance_date || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      {/* --- CUSTOMERS TAB --- */}
      {activeTab === 'customers' && (
        <div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: 'Total Customers',
                value: customerActivity?.customerStatus?.total_customers ?? 0,
                color: 'text-purple-600'
              },
              {
                label: 'Active',
                value: customerActivity?.customerStatus?.active_customers ?? 0,
                color: 'text-green-600'
              },
              {
                label: 'Inactive',
                value: customerActivity?.customerStatus?.inactive_customers ?? 0,
                color: 'text-red-600'
              }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Frequent Renters Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Frequent Renters</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Customer', 'Bookings', 'Completed', 'Total Revenue'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(customerActivity?.frequentRenters ?? []).map((c) => (
                    <tr key={c.customer_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {c.first_name} {c.last_name}
                      </td>
                      <td className="px-4 py-3 text-sm">{c.total_bookings}</td>
                      <td className="px-4 py-3 text-sm">{c.completed_rentals}</td>
                      <td className="px-4 py-3 text-sm">
                        R{c.total_revenue?.toLocaleString() ?? '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overdue Returns */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Overdue Returns</h2>
            <div className="space-y-3">
              {(customerActivity?.overdueReturns ?? []).map((o) => (
                <div key={o.rental_id} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold">
                    {o.first_name} {o.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {o.make} {o.model} — {o.days_overdue} days overdue
                  </p>
                  <p className="text-xs text-gray-500">{o.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
