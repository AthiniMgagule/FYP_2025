const express = require('express');
const router = express.Router();
const {
  getFleetReport,
  getCustomerActivityReport,
  getUsageStatistics,
  getRevenueReport,
  getMaintenanceReport,
  getDashboardStats
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/fleet', protect, authorize('manager', 'staff'), getFleetReport);
router.get('/customer-activity', protect, authorize('manager', 'staff'), getCustomerActivityReport);
router.get('/usage-statistics', protect, authorize('manager', 'staff'), getUsageStatistics);
router.get('/revenue', protect, authorize('manager'), getRevenueReport);
router.get('/maintenance', protect, authorize('manager', 'staff'), getMaintenanceReport);
router.get('/dashboard', protect, authorize('manager', 'staff'), getDashboardStats);

module.exports = router;