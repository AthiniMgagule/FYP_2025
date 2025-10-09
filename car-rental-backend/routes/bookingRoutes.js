const express = require('express');
const router = express.Router();
const {
    searchAvailableVehicles,
    createBooking,
    getCustomerBookings,
    updateBooking,
    cancelBooking,
    getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

//====== to use as /api/bookings/...
router.get('/search', searchAvailableVehicles);
router.post('/', protect, createBooking);
router.get('/', protect, getAllBookings)
router.get('/customer/:customerId', protect, getCustomerBookings);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;