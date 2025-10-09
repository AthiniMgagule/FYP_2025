const { promisePool } = require('../config/database');

exports.processCheckout = async (req, res) => {
    try {
        const {
        bookingId,
        checkoutMileage,
        fuelLevelOut,
        conditionNotesOut
        } = req.body;

        //====== to verify that booking exists and is confirmed
        const [bookings] = await promisePool.query(
        'SELECT * FROM Booking WHERE booking_id = ? AND status = "confirmed"',
        [bookingId]
        );

        if (bookings.length === 0) {
        return res.status(404).json({ success: false, message: 'Confirmed booking not found' });
        }

        const booking = bookings[0];

        //====== to update vehicle status to rented
        await promisePool.query(
        'UPDATE Vehicle SET status = "rented" WHERE vehicle_id = ?',
        [booking.vehicle_id]
        );

        //====== to create rental record
        const [result] = await promisePool.query(
        `INSERT INTO Rental
        (booking_id, checkout_date, checkout_mileage, checkout_staff_id, fuel_level_out, condition_notes_out, status)
        VALUES (?, NOW(), ?, ?, ?, ?, 'active')`,
        [bookingId, checkoutMileage, req.user.id, fuelLevelOut, conditionNotesOut]
        );

        const [rental] = await promisePool.query('SELECT * FROM Rental WHERE rental_id = ?', [result.insertId]);

        res.status(201).json({ success: true, data: rental[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.processCheckin = async (req, res) => {
    try {
        const {
            rentalId,
            checkinMileage,
            fuelLevelIn,
            conditionNotesIn,
            lateFee = 0,
            damageFee = 0,
            otherCharges = 0
        } = req.body;

        //====== Get active rental info
        const [rentals] = await promisePool.query(
            `SELECT r.*, b.vehicle_id, b.start_date, b.end_date, b.total_amount, v.daily_rate
             FROM Rental r
             JOIN Booking b ON r.booking_id = b.booking_id
             JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
             WHERE r.rental_id = ? AND r.status = 'active'`,
            [rentalId]
        );

        if (rentals.length === 0) {
            return res.status(404).json({ success: false, message: 'Active rental not found' });
        }

        const rental = rentals[0];

        //====== Update rental record
        await promisePool.query(
            `UPDATE Rental
             SET checkin_date = NOW(),
                 checkin_mileage = ?,
                 checkin_staff_id = ?,
                 fuel_level_in = ?,
                 condition_notes_in = ?,
                 status = 'completed'
             WHERE rental_id = ?`,
            [checkinMileage, req.user.id, fuelLevelIn, conditionNotesIn, rentalId]
        );

        //====== Update vehicle status and mileage
        await promisePool.query(
            `UPDATE Vehicle
             SET status = 'available', mileage = ?
             WHERE vehicle_id = ?`,
            [checkinMileage, rental.vehicle_id]
        );

        //====== Update booking status
        await promisePool.query(
            `UPDATE Booking
             SET status = 'completed'
             WHERE booking_id = ?`,
            [rental.booking_id]
        );

        //====== Calculate rental days
        const checkoutDate = new Date(rental.checkout_date);
        const checkinDate = new Date(); // actual check-in time
        let rentalDays = Math.ceil((checkinDate - checkoutDate) / (1000 * 60 * 60 * 24));
        if (rentalDays < 1) rentalDays = 1; // minimum 1 day

        //====== Calculate amounts
        const baseAmount = rental.daily_rate * rentalDays;
        const taxAmount = baseAmount * 0.15;
        const totalAmount = baseAmount + parseFloat(lateFee) + parseFloat(damageFee) + parseFloat(otherCharges) + taxAmount;

        //====== Create invoice
        await promisePool.query(
            `INSERT INTO Invoice
             (rental_id, rental_days, base_amount, late_fee, damage_fee, other_charges, tax_amount, total_amount, payment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [rentalId, rentalDays, baseAmount, lateFee, damageFee, otherCharges, taxAmount, totalAmount]
        );

        //====== Return updated rental info
        const [updatedRental] = await promisePool.query('SELECT * FROM Rental WHERE rental_id = ?', [rentalId]);

        res.json({ success: true, data: updatedRental[0], message: 'Check-in processed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getActiveRentals = async (req, res) => {
    try {
        const [rentals] = await promisePool.query(
        `SELECT 
            r.*,
            b.customer_id,
            b.start_date,
            b.end_date,
            v.make,
            v.model,
            v.registration_number,
            c.first_name,
            c.last_name,
            c.phone_number
        FROM Rental r
        JOIN Booking b ON r.booking_id = b.booking_id
        JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
        JOIN Customer c ON b.customer_id = c.customer_id
        WHERE r.status = 'active'
        ORDER BY r.checkout_date DESC`
        );

        res.json({ success: true, count: rentals.length, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getRentalById = async (req, res) => {
    try {
        const [rentals] = await promisePool.query(
        `SELECT 
            r.*,
            b.*,
            v.make,
            v.model,
            v.year,
            v.registration_number,
            v.category,
            c.first_name,
            c.last_name,
            c.phone_number,
            c.email
        FROM Rental r
        JOIN Booking b ON r.booking_id = b.booking_id
        JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
        JOIN Customer c ON b.customer_id = c.customer_id
        WHERE r.rental_id = ?`,
        [req.params.id]
        );

        if (rentals.length === 0) {
        return res.status(404).json({ success: false, message: 'Rental not found' });
        }

        res.json({ success: true, data: rentals[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllRentals = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = `
        SELECT 
            r.*,
            b.start_date,
            b.end_date,
            v.make,
            v.model,
            v.registration_number,
            c.first_name,
            c.last_name
        FROM Rental r
        JOIN Booking b ON r.booking_id = b.booking_id
        JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
        JOIN Customer c ON b.customer_id = c.customer_id
        `;

        const params = [];

        if (status) {
        query += ' WHERE r.status = ?';
        params.push(status);
        }

        query += ' ORDER BY r.checkout_date DESC';

        const [rentals] = await promisePool.query(query, params);

        res.json({ success: true, count: rentals.length, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};