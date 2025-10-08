import React from 'react';
import { FaTimes } from 'react-icons/fa';

const InvoiceDetails = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="border-b pb-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Invoice ID</p>
              <p className="text-lg font-bold">#{invoice.invoice_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rental ID</p>
              <p className="text-lg font-bold">#{invoice.rental_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="font-semibold">{new Date(invoice.issue_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-semibold">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Customer Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{invoice.first_name} {invoice.last_name}</p>
            <p className="text-sm text-gray-600">{invoice.email}</p>
            <p className="text-sm text-gray-600">{invoice.phone_number}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Rental Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{invoice.make} {invoice.model}</p>
            <p className="text-sm text-gray-600">Registration: {invoice.registration_number}</p>
            <p className="text-sm text-gray-600">
              Period: {new Date(invoice.checkout_date).toLocaleDateString()} - {new Date(invoice.checkin_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Base Rental Cost</td>
                <td className="text-right">${invoice.base_amount?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Additional Charges</td>
                <td className="text-right">${invoice.additional_charges?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Tax</td>
                <td className="text-right">${invoice.tax_amount?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="border-b font-bold text-lg">
                <td className="py-2">Total Amount</td>
                <td className="text-right">${invoice.total_amount?.toFixed(2)}</td>
              </tr>
              <tr className="border-b text-green-600">
                <td className="py-2">Paid Amount</td>
                <td className="text-right">${invoice.paid_amount?.toFixed(2) || '0.00'}</td>
              </tr>
              <tr className="font-bold text-lg">
                <td className="py-2">Balance Due</td>
                <td className="text-right text-red-600">
                  ${((invoice.total_amount || 0) - (invoice.paid_amount || 0)).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-6">
            <span className={`px-4 py-2 text-sm rounded-full ${
              invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              invoice.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              Status: {invoice.payment_status}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;