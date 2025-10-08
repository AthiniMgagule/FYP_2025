const { promisePool } = require('../config/database');

//====== to create vehicle (C)
exports.createVehicle = async (req, res) => {
    try {
        const { registrationNumber, make, model, year, category, color, numberOfSeats, mileage, dailyRate, features } = req.body;

        const [result] = await promisePool.query(
            `INSERT INTO Vehicle (registration_number, make, model, year, category, color, number_of_seats, mileage, daily_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [registrationNumber, make, model, year, category, color, numberOfSeats, mileage, dailyRate]
        );

        const vehicleId = result.insertId;

        //====== to add features to VehicleFeature if provided
        if (features && features.length > 0) {
            for (const feature of features) {
                await promisePool.query(
                'INSERT INTO VehicleFeature (vehicle_id, feature_name, description) VALUES (?, ?, ?)',
                [vehicleId, feature.name, feature.description]
                );
            }
        }

        const [newVehicle] = await promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [vehicleId]);
        
        res.status(201).json({ success: true, data: newVehicle[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to get all vehicles in the db (R)
exports.getAllVehicles = async (req, res) => {
    try {
        const { category, status, minRate, maxRate } = req.query;
        
        let query = 'SELECT * FROM Vehicle WHERE 1=1';
        const params = [];

        if (category) {
        query += ' AND category = ?';
        params.push(category);
        }
        if (status) {
        query += ' AND status = ?';
        params.push(status);
        }
        if (minRate) {
        query += ' AND daily_rate >= ?';
        params.push(minRate);
        }
        if (maxRate) {
        query += ' AND daily_rate <= ?';
        params.push(maxRate);
        }

        const [vehicles] = await promisePool.query(query, params);
        
        res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to get vehicle by vehicle_id (R)
exports.getVehicle = async (req, res) => {
    try {
        const [vehicles] = await promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [req.params.id]);
        
        if (vehicles.length === 0) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        //====== to get features from VehicleFeature table
        const [features] = await promisePool.query('SELECT * FROM VehicleFeature WHERE vehicle_id = ?', [req.params.id]);
        
        res.json({ success: true, data: { ...vehicles[0], features } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//====== to update vehicle (U)
exports.updateVehicle = async (req, res) => {
    try {
        const fields = [];
        const values = [];

        Object.keys(req.body).forEach(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = ?`);
        values.push(req.body[key]);
        });

        values.push(req.params.id);

        await promisePool.query(
        `UPDATE Vehicle SET ${fields.join(', ')} WHERE vehicle_id = ?`,
        values
        );

        const [updated] = await promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [req.params.id]);
        
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//====== to delete vehicle (D)
exports.deleteVehicle = async (req, res) => {
    try {
        await promisePool.query('DELETE FROM Vehicle WHERE vehicle_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};