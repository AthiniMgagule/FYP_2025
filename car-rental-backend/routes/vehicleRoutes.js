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
const upload = require('../middleware/upload'); // <-- import multer middleware

//====== to use as /api/vehicles/...
router.get('/', getAllVehicles);
router.get('/:id', getVehicle);

// Add upload.single('image') for file upload
router.post('/', protect, authorize('manager', 'staff'), upload.single('image'), createVehicle);
router.put('/:id', protect, authorize('manager', 'staff'), upload.single('image'), updateVehicle);
router.delete('/:id', protect, authorize('manager'), deleteVehicle);

module.exports = router;
