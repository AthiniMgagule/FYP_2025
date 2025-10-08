import React, { useState, useEffect } from 'react';
import { getInvoices, processPayment } from '../../services/api';
import { FaEye, FaDollarSign } from 'react-icons/fa';
import InvoiceDetails from './InvoiceDetails';
import PaymentForm from './PaymentForm';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      const params = filter !== 'all' ? { payment_status: filter } : {};
      const response = await getInvoices(params);
      setInvoices(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetails(true);
  };

  const handleProcessPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPayment(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setShowPayment(false);
    setSelectedInvoice(null);
    fetchInvoices();
  };

  if (loading) return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All Invoices
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
            filter === 'paid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('paid')}
        >
          Paid
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'overdue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('overdue')}
        >
          Overdue
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rental ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paid Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoice_id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{invoice.invoice_id}</td>
                <td className="px-4 py-3 text-sm">#{invoice.rental_id}</td>
                <td className="px-4 py-3 text-sm">{invoice.first_name} {invoice.last_name}</td>
                <td className="px-4 py-3 text-sm">${Number(invoice.total_amount || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">${invoice.paid_amount?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-3 text-sm font-semibold">
                  ${((invoice.total_amount || 0) - (invoice.paid_amount || 0)).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    invoice.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDetails(invoice)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye size={18} />
                    </button>
                    {invoice.payment_status !== 'paid' && (
                      <button 
                        onClick={() => handleProcessPayment(invoice)}
                        className="text-green-600 hover:text-green-800"
                        title="Process Payment"
                      >
                        <FaDollarSign size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <InvoiceDetails 
          invoice={selectedInvoice}
          onClose={handleCloseModal}
        />
      )}

      {showPayment && (
        <PaymentForm 
          invoice={selectedInvoice}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default InvoiceList;