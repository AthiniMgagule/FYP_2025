const { promisePool } = require('../config/database');
const path = require('path');

//====== CREATE Vehicle (C)
exports.createVehicle = async (req, res) => {
  try {
    console.log('➡️ Received body:', req.body);
    console.log('➡️ Received file:', req.file);

    const { registrationNumber, make, model, year, category, color, numberOfSeats, mileage, dailyRate, features } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    console.log('🖼️ Computed imageUrl:', imageUrl);

    const [result] = await promisePool.query(
      `INSERT INTO Vehicle 
      (registration_number, make, model, year, category, color, number_of_seats, mileage, daily_rate, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [registrationNumber, make, model, year, category, color, numberOfSeats, mileage, dailyRate, imageUrl]
    );

    console.log('✅ Vehicle inserted with ID:', result.insertId);

    const [newVehicle] = await promisePool.query('SELECT * FROM Vehicle WHERE vehicle_id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newVehicle[0] });
  } catch (error) {
    console.error('❌ Vehicle creation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//====== READ All Vehicles (R)
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

    // Add full URLs for image paths
    const vehiclesWithFullUrls = vehicles.map(v => ({
      ...v,
      image_url: v.image_url
        ? `${req.protocol}://${req.get('host')}${v.image_url}`
        : null,
    }));

    res.json({
      success: true,
      count: vehiclesWithFullUrls.length,
      data: vehiclesWithFullUrls,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

//====== READ Vehicle by ID (R)
exports.getVehicle = async (req, res) => {
  try {
    const [vehicles] = await promisePool.query(
      'SELECT * FROM Vehicle WHERE vehicle_id = ?',
      [req.params.id]
    );

    if (vehicles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    }

    const [features] = await promisePool.query(
      'SELECT * FROM VehicleFeature WHERE vehicle_id = ?',
      [req.params.id]
    );

    const vehicle = vehicles[0];
    vehicle.image_url = vehicle.image_url
      ? `${req.protocol}://${req.get('host')}${vehicle.image_url}`
      : null;

    res.json({ success: true, data: { ...vehicle, features } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//====== UPDATE Vehicle (U)
exports.updateVehicle = async (req, res) => {
  try {
    const fields = [];
    const values = [];

    Object.keys(req.body).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = ?`);
      values.push(req.body[key]);
    });

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      fields.push('image_url = ?');
      values.push(imageUrl);
    }

    values.push(req.params.id);

    await promisePool.query(
      `UPDATE Vehicle SET ${fields.join(', ')} WHERE vehicle_id = ?`,
      values
    );

    const [updated] = await promisePool.query(
      'SELECT * FROM Vehicle WHERE vehicle_id = ?',
      [req.params.id]
    );

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//====== DELETE Vehicle (D)
exports.deleteVehicle = async (req, res) => {
  try {
    await promisePool.query('DELETE FROM Vehicle WHERE vehicle_id = ?', [
      req.params.id,
    ]);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};