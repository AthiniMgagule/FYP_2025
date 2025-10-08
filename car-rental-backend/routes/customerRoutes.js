const express = require('express');
const router = express.Router();
const {
    getCustomerProfile,
    updateCustomerProfile,
    getCustomerRentalHistory,
    getAllCustomers
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

//====== to be used as /api/customers/..
router.get('/', protect, authorize('staff', 'manager'), getAllCustomers);
router.get('/:id', protect, getCustomerProfile);
router.put('/:id', protect, updateCustomerProfile);
router.get('/:id/rental-history', protect, getCustomerRentalHistory);

module.exports = router;