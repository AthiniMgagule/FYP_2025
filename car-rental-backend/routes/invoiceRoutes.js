const express = require('express');
const router = express.Router();
const {
    getInvoiceByRentalId,
    getInvoiceById,
    updateInvoice,
    processPayment,
    getAllInvoices
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

//====== to be used as /api/invoices/...
router.get('/', protect, authorize('staff', 'manager'), getAllInvoices);
router.get('/:id', protect, getInvoiceById);
router.get('/rental/:rentalId', protect, getInvoiceByRentalId);
router.put('/:id', protect, authorize('staff', 'manager'), updateInvoice);
router.post('/:id/payment', protect, authorize('staff', 'manager'), processPayment);

module.exports = router;