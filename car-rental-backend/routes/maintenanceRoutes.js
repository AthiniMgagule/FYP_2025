const express = require('express');
const router = express.Router();
const {
  scheduleMaintenance,
  updateMaintenance,
  getMaintenanceByVehicle,
  getAllMaintenance,
  getMaintenanceById,
  deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('staff', 'manager'), scheduleMaintenance);
router.get('/', protect, authorize('staff', 'manager'), getAllMaintenance);
router.get('/:id', protect, authorize('staff', 'manager'), getMaintenanceById);
router.get('/vehicle/:vehicleId', protect, authorize('staff', 'manager'), getMaintenanceByVehicle);
router.put('/:id', protect, authorize('staff', 'manager'), updateMaintenance);
router.delete('/:id', protect, authorize('manager'), deleteMaintenance);

module.exports = router;