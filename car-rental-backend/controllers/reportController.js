const { promisePool } = require('../config/database');

exports.getFleetReport = async (req, res) => {
  try {
    // Get counts by status
    const [statusCounts] = await promisePool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM Vehicle
      GROUP BY status
    `);

    // Get counts by category
    const [categoryCounts] = await promisePool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        status
      FROM Vehicle
      GROUP BY category, status
    `);

    // Get total fleet value (assuming cost = daily_rate * 365)
    const [fleetValue] = await promisePool.query(`
      SELECT 
        SUM(daily_rate * 365) as estimated_fleet_value,
        COUNT(*) as total_vehicles,
        AVG(daily_rate) as avg_daily_rate
      FROM Vehicle
    `);

    // Get vehicles details
    const [vehicles] = await promisePool.query(`
      SELECT 
        v.*,
        (SELECT COUNT(*) FROM Bookings WHERE vehicle_id = v.vehicle_id) as total_bookings,
        (SELECT COUNT(*) FROM Maintenance WHERE vehicle_id = v.vehicle_id) as total_maintenance
      FROM Vehicle v
      ORDER BY v.created_at DESC
    `);

    res.json({
      success: true,
      data: {
        statusSummary: statusCounts,
        categorySummary: categoryCounts,
        fleetMetrics: fleetValue[0],
        vehicles: vehicles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getCustomerActivityReport = async (req, res) => {
  try {
    // Get frequent renters
    const [frequentRenters] = await promisePool.query(`
      SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        u.email,
        c.phone_number,
        COUNT(DISTINCT b.booking_id) AS total_bookings,
        COUNT(DISTINCT r.rental_id) AS completed_rentals,
        SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) AS total_revenue
      FROM Customer c
      JOIN User u ON c.user_id = u.user_id
      LEFT JOIN Booking b ON c.customer_id = b.customer_id
      LEFT JOIN Rental r ON b.booking_id = r.booking_id AND r.status = 'completed'
      LEFT JOIN Invoice i ON r.rental_id = i.rental_id
      GROUP BY c.customer_id
      ORDER BY total_bookings DESC
      LIMIT 20
    `);

    // Get overdue returns
    const [overdueReturns] = await promisePool.query(`
      SELECT 
        r.rental_id,
        b.booking_id,
        b.end_date AS expected_return_date,
        c.first_name,
        c.last_name,
        c.phone_number,
        u.email,
        v.make,
        v.model,
        v.registration_number,
        DATEDIFF(CURDATE(), b.end_date) AS days_overdue
      FROM Rental r
      JOIN Booking b ON r.booking_id = b.booking_id
      JOIN Customer c ON b.customer_id = c.customer_id
      JOIN User u ON c.user_id = u.user_id
      JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
      WHERE r.status = 'active' AND b.end_date < CURDATE()
      ORDER BY days_overdue DESC
    `);

    // Get customer registration trends (last 12 months)
    const [registrationTrends] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS new_customers
      FROM User
      WHERE role = 'customer'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    // Get active vs inactive customers
    const [customerStatus] = await promisePool.query(`
      SELECT 
        COUNT(DISTINCT c.customer_id) AS total_customers,
        COUNT(DISTINCT CASE WHEN b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
              THEN c.customer_id END) AS active_customers,
        COUNT(DISTINCT CASE WHEN b.booking_date < DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
              OR b.booking_id IS NULL THEN c.customer_id END) AS inactive_customers
      FROM Customer c
      LEFT JOIN Booking b ON c.customer_id = b.customer_id
    `);

    res.json({
      success: true,
      data: {
        frequentRenters,
        overdueReturns,
        registrationTrends,
        customerStatus: customerStatus[0]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getUsageStatistics = async (req, res) => {
  try {
    // Most rented vehicles
    const [mostRented] = await promisePool.query(`
      SELECT 
        v.vehicle_id,
        v.make,
        v.model,
        v.year,
        v.category,
        v.registration_number,
        COUNT(r.rental_id) as rental_count,
        SUM(i.total_amount) as total_revenue,
        AVG(DATEDIFF(b.end_date, b.start_date)) as avg_rental_days
      FROM Vehicle v
      LEFT JOIN Booking b ON v.vehicle_id = b.vehicle_id
      LEFT JOIN Rental r ON b.booking_id = r.booking_id
      LEFT JOIN Invoice i ON r.rental_id = i.rental_id
      WHERE r.status = 'completed'
      GROUP BY v.vehicle_id
      ORDER BY rental_count DESC
      LIMIT 10
    `);

    // Popular categories
    const [popularCategories] = await promisePool.query(`
      SELECT 
        v.category,
        COUNT(r.rental_id) as rental_count,
        SUM(i.total_amount) as total_revenue,
        AVG(v.daily_rate) as avg_daily_rate
      FROM Vehicle v
      JOIN Booking b ON v.vehicle_id = b.vehicle_id
      JOIN Rental r ON b.booking_id = r.booking_id
      LEFT JOIN Invoice i ON r.rental_id = i.rental_id
      WHERE r.status = 'completed'
      GROUP BY v.category
      ORDER BY rental_count DESC
    `);

    // Rental trends (last 12 months)
    const [rentalTrends] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(r.checkout_date, '%Y-%m') as month,
        COUNT(r.rental_id) as rental_count,
        SUM(i.total_amount) as revenue,
        COUNT(DISTINCT b.customer_id) as unique_customers
      FROM Rental r
      JOIN Booking b ON r.booking_id = b.booking_id
      LEFT JOIN Invoice i ON r.rental_id = i.rental_id
      WHERE r.checkout_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(r.checkout_date, '%Y-%m')
      ORDER BY month
    `);

    // Revenue statistics
    const [revenueStats] = await promisePool.query(`
      SELECT 
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_invoice_amount,
        SUM(late_fee) as total_late_fees,
        SUM(damage_fee) as total_damage_fees,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_invoices
      FROM Invoice
      WHERE invoice_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    `);

    // Booking conversion rate
    const [conversionStats] = await promisePool.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        (COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*) * 100) as completion_rate
      FROM Booking
      WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    `);

    res.json({
      success: true,
      data: {
        mostRentedVehicles: mostRented,
        popularCategories: popularCategories,
        rentalTrends: rentalTrends,
        revenueStatistics: revenueStats[0],
        bookingConversion: conversionStats[0]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = 'invoice_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'invoice_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // 1️⃣ Total revenue breakdown
    const [revenueBreakdown] = await promisePool.query(`
      SELECT 
        COUNT(*) AS total_invoices,
        COALESCE(SUM(base_amount), 0) AS total_base_revenue,
        COALESCE(SUM(late_fee), 0) AS total_late_fees,
        COALESCE(SUM(damage_fee), 0) AS total_damage_fees,
        COALESCE(SUM(other_charges), 0) AS total_other_charges,
        COALESCE(SUM(tax_amount), 0) AS total_tax,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(AVG(total_amount), 0) AS avg_transaction_value
      FROM Invoice
      WHERE ${dateFilter}
    `, params);

    // 2️⃣ Revenue by vehicle category
    const [revenueByCategory] = await promisePool.query(`
      SELECT 
        v.category,
        COUNT(i.invoice_id) AS invoice_count,
        COALESCE(SUM(i.total_amount), 0) AS total_revenue,
        COALESCE(AVG(i.total_amount), 0) AS avg_revenue
      FROM Invoice i
      LEFT JOIN Rental r ON i.rental_id = r.rental_id
      LEFT JOIN Booking b ON r.booking_id = b.booking_id
      LEFT JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
      WHERE ${dateFilter.replace(/invoice_date/g, 'i.invoice_date')}
      GROUP BY v.category
      ORDER BY total_revenue DESC
    `, params);

    // 3️⃣ Monthly revenue
    const [monthlyRevenue] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(invoice_date, '%Y-%m') AS month,
        COUNT(*) AS invoice_count,
        COALESCE(SUM(base_amount), 0) AS base_revenue,
        COALESCE(SUM(late_fee + damage_fee + other_charges), 0) AS additional_fees,
        COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM Invoice
      WHERE ${dateFilter}
      GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
      ORDER BY month
    `, params);

    // 4️⃣ Payment status summary
    const [paymentStatus] = await promisePool.query(`
      SELECT 
        payment_status,
        COUNT(*) AS count,
        COALESCE(SUM(total_amount), 0) AS amount
      FROM Invoice
      WHERE ${dateFilter}
      GROUP BY payment_status
    `, params);

    res.json({
      success: true,
      data: {
        summary: revenueBreakdown[0] || {},
        byCategory: revenueByCategory,
        monthly: monthlyRevenue,
        paymentStatus: paymentStatus
      }
    });
  } catch (error) {
    console.error('Error in getRevenueReport:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


exports.getMaintenanceReport = async (req, res) => {
  try {
    // Maintenance costs by vehicle
    const [maintenanceCosts] = await promisePool.query(`
      SELECT 
        v.vehicle_id,
        v.make,
        v.model,
        v.registration_number,
        v.year,
        COUNT(m.maintenance_id) as maintenance_count,
        SUM(m.cost) as total_maintenance_cost,
        AVG(m.cost) as avg_maintenance_cost,
        MAX(m.start_date) as last_maintenance_date
      FROM Vehicle v
      LEFT JOIN Maintenance m ON v.vehicle_id = m.vehicle_id
      GROUP BY v.vehicle_id
      ORDER BY total_maintenance_cost DESC
    `);

    // Maintenance by type
    const [maintenanceTypes] = await promisePool.query(`
      SELECT 
        maintenance_type,
        COUNT(*) as count,
        SUM(cost) as total_cost,
        AVG(cost) as avg_cost,
        AVG(DATEDIFF(actual_end_date, start_date)) as avg_duration_days
      FROM Maintenance
      WHERE status = 'completed'
      GROUP BY maintenance_type
      ORDER BY count DESC
    `);

    // Upcoming maintenance
    const [upcomingMaintenance] = await promisePool.query(`
      SELECT 
        m.*,
        v.make,
        v.model,
        v.registration_number
      FROM Maintenance m
      JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
      WHERE m.status IN ('scheduled', 'in_progress')
      ORDER BY m.start_date
    `);

    // Maintenance trends
    const [maintenanceTrends] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(start_date, '%Y-%m') as month,
        COUNT(*) as maintenance_count,
        SUM(cost) as total_cost
      FROM Maintenance
      WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(start_date, '%Y-%m')
      ORDER BY month
    `);

    res.json({
      success: true,
      data: {
        costsByVehicle: maintenanceCosts,
        byType: maintenanceTypes,
        upcoming: upcomingMaintenance,
        trends: maintenanceTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Quick overview stats
    const [stats] = await promisePool.query(`
      SELECT 
        (SELECT COUNT(*) FROM Vehicle WHERE status = 'available') as available_vehicles,
        (SELECT COUNT(*) FROM Vehicle WHERE status = 'rented') as rented_vehicles,
        (SELECT COUNT(*) FROM Vehicle WHERE status = 'maintenance') as maintenance_vehicles,
        (SELECT COUNT(*) FROM Rental WHERE status = 'active') as active_rentals,
        (SELECT COUNT(*) FROM Booking WHERE status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM Customer) as total_customers,
        (SELECT SUM(total_amount) FROM Invoice WHERE payment_status = 'pending') as pending_payments,
        (SELECT SUM(total_amount) FROM Invoice
         WHERE payment_status = 'paid'
         AND invoice_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as revenue_last_30_days
    `);

    // Recent activity
    const [recentBookings] = await promisePool.query(`
      SELECT 
        b.*,
        c.first_name,
        c.last_name,
        v.make,
        v.model,
        v.registration_number
      FROM Booking b
      JOIN Customer c ON b.customer_id = c.customer_id
      JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
      ORDER BY b.booking_date DESC
      LIMIT 5
    `);

    const [recentRentals] = await promisePool.query(`
      SELECT 
        r.*,
        b.start_date,
        b.end_date,
        c.first_name,
        c.last_name,
        v.make,
        v.model,
        v.registration_number
      FROM Rental r
      JOIN Booking b ON r.booking_id = b.booking_id
      JOIN Customer c ON b.customer_id = c.customer_id
      JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
      ORDER BY r.checkout_date DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        recentBookings: recentBookings,
        recentRentals: recentRentals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};