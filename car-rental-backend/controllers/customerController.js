const { promisePool } = require('../config/database');

//====== to get customer profile (R)
exports.getCustomerProfile = async (req, res) => {
    try {
        const [customers] = await promisePool.query(
        `SELECT c.*, u.email, u.role, u.created_at 
        FROM Customer c
        JOIN User u ON c.user_id = u.user_id
        WHERE c.customer_id = ?`,
        [req.params.id]
        );

        if (customers.length === 0) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({ success: true, data: customers[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to get customers (R)
exports.getAllCustomers = async (req, res) => {
    try {
        const [customers] = await promisePool.query(
        `SELECT c.*, u.email, u.is_active
        FROM Customer c
        JOIN User u ON c.user_id = u.user_id
        ORDER BY c.customer_id DESC`
        );

        res.json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getCustomerRentalHistory = async (req, res) => {
    try {
        const [rentals] = await promisePool.query(
        `SELECT 
            r.*,
            b.start_date,
            b.end_date,
            b.pickup_location,
            b.dropoff_location,
            v.make,
            v.model,
            v.year,
            v.registration_number,
            i.total_amount,
            i.payment_status
        FROM Rental r
        JOIN Booking b ON r.booking_id = b.booking_id
        JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
        LEFT JOIN Invoice i ON r.rental_id = i.rental_id
        WHERE b.customer_id = ?
        ORDER BY r.checkout_date DESC`,
        [req.params.id]
        );

        res.json({ success: true, count: rentals.length, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to update customer profile (U)
exports.updateCustomerProfile = async (req, res) => {
    try {
        const {
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state,
        postalCode,
        country,
        driversLicense,
        licenseExpiry,
        dateOfBirth
        } = req.body;

        const fields = [];
        const values = [];

        if (firstName) {
        fields.push('first_name = ?');
        values.push(firstName);
        }
        if (lastName) {
        fields.push('last_name = ?');
        values.push(lastName);
        }
        if (phoneNumber) {
        fields.push('phone_number = ?');
        values.push(phoneNumber);
        }
        if (address) {
        fields.push('address = ?');
        values.push(address);
        }
        if (city) {
        fields.push('city = ?');
        values.push(city);
        }
        if (state) {
        fields.push('state = ?');
        values.push(state);
        }
        if (postalCode) {
        fields.push('postal_code = ?');
        values.push(postalCode);
        }
        if (country) {
        fields.push('country = ?');
        values.push(country);
        }
        if (driversLicense) {
        fields.push('drivers_license = ?');
        values.push(driversLicense);
        }
        if (licenseExpiry) {
        fields.push('license_expiry = ?');
        values.push(licenseExpiry);
        }
        if (dateOfBirth) {
        fields.push('date_of_birth = ?');
        values.push(dateOfBirth);
        }

        values.push(req.params.id);

        await promisePool.query(
        `UPDATE Customer SET ${fields.join(', ')} WHERE customer_id = ?`,
        values
        );

        const [updated] = await promisePool.query('SELECT * FROM Customer WHERE customer_id = ?', [req.params.id]);

        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

