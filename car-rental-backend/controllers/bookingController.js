const { promisePool } = require('../config/database');

exports.searchAvailableVehicles = async (req, res) => {
    try {
        const { startDate, endDate, category, features } = req.query;

        let query = `
        SELECT DISTINCT v.* FROM Vehicle v
        WHERE v.status = 'available'
        AND v.vehicle_id NOT IN (
            SELECT vehicle_id FROM Booking
            WHERE status IN ('confirmed', 'pending')
            AND ((start_date <= ? AND end_date >= ?)
            OR (start_date <= ? AND end_date >= ?))
        )
        AND v.vehicle_id NOT IN (
            SELECT vehicle_id FROM Maintenance
            WHERE status IN ('scheduled', 'in_progress')
            AND start_date <= ? AND (end_date >= ? OR end_date IS NULL)
        )
        `;

        const params = [endDate, startDate, startDate, endDate, endDate, startDate];

        if (category) {
        query += ' AND v.category = ?';
        params.push(category);
        }

        const [vehicles] = await promisePool.query(query, params);
        
        res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to create booking in Booking table (C)
exports.createBooking = async (req, res) => {
    try {
        const { customerId, vehicleId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;

        //====== to check if vehicle is available
        const [conflicts] = await promisePool.query(
            `SELECT * FROM Booking 
            WHERE vehicle_id = ? 
            AND status IN ('confirmed', 'pending')
            AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))`,
            [vehicleId, endDate, startDate, startDate, endDate]
        );

        if (conflicts.length > 0) {
            return res.status(400).json({ success: false, message: 'Vehicle not available for selected dates' });
        }

        //====== to get vehicle daily rate
        const [vehicles] = await promisePool.query('SELECT daily_rate FROM Vehicle WHERE vehicle_id = ?', [vehicleId]);
        const dailyRate = vehicles[0].daily_rate;
        
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const totalAmount = dailyRate * days;

        const [result] = await promisePool.query(
            `INSERT INTO Booking (customer_id, vehicle_id, start_date, end_date, pickup_location, dropoff_location, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [customerId, vehicleId, startDate, endDate, pickupLocation, dropoffLocation, totalAmount]
        );

        const [booking] = await promisePool.query('SELECT * FROM Booking WHERE booking_id = ?', [result.insertId]);
        
        res.status(201).json({ success: true, data: booking[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to get customer bookings (R)
exports.getCustomerBookings = async (req, res) => {
    try {
        const [bookings] = await promisePool.query(
        `SELECT b.*, v.make, v.model, v.year, v.category, v.registration_number,
       c.first_name, c.last_name
FROM Booking b
JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
JOIN Customer c ON b.customer_id = c.customer_id
ORDER BY b.booking_date DESC`,
        [req.params.customerId]
        );
        
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//====== to update customer booking (U)
exports.updateBooking = async (req, res) => {
    try {
        const { startDate, endDate, pickupLocation, dropoffLocation, status } = req.body;

        const fields = [];
        const values = [];

        if (startDate) {
        fields.push('start_date = ?');
        values.push(startDate);
        }
        if (endDate) {
        fields.push('end_date = ?');
        values.push(endDate);
        }
        if (pickupLocation) {
        fields.push('pickup_location = ?');
        values.push(pickupLocation);
        }
        if (dropoffLocation) {
        fields.push('dropoff_location = ?');
        values.push(dropoffLocation);
        }
        if (status) {
        fields.push('status = ?');
        values.push(status);
        }

        values.push(req.params.id);

        await promisePool.query(
        `UPDATE Booking SET ${fields.join(', ')} WHERE booking_id = ?`,
        values
        );

        const [updated] = await promisePool.query('SELECT * FROM Booking WHERE booking_id = ?', [req.params.id]);
        
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//====== to cancel customer booking
//====== should I delete the booking at some point??
exports.cancelBooking = async (req, res) => {
    try {
        await promisePool.query(
            `UPDATE Bookings SET status = 'cancelled' WHERE booking_id = ?`,
            [req.params.id]
        );
        
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};