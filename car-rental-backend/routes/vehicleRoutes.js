const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

//====== to use as /api/vehicles/...
router.get('/', getAllVehicles);
router.get('/:id', getVehicle);
router.post('/', protect, authorize('manager', 'staff'), createVehicle);
router.put('/:id', protect, authorize('manager', 'staff'), updateVehicle);
router.delete('/:id', protect, authorize('manager'), deleteVehicle);

module.exports = router;