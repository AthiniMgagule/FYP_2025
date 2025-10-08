const express = require('express');
const router = express.Router();
const {
    processCheckout,
    processCheckin,
    getActiveRentals,
    getRentalById,
    getAllRentals
} = require('../controllers/rentalController');
const { protect, authorize } = require('../middleware/auth');

//====== to be used as /api/rentals/...
router.post('/checkout', protect, authorize('staff', 'manager'), processCheckout);
router.post('/checkin', protect, authorize('staff', 'manager'), processCheckin);
router.get('/active', protect, authorize('staff', 'manager'), getActiveRentals);
router.get('/', protect, authorize('staff', 'manager'), getAllRentals);
router.get('/:id', protect, authorize('staff', 'manager'), getRentalById);

module.exports = router;