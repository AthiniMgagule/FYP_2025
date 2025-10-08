const { promisePool } = require('../config/database');

//====== to schedule/create maintanance (C)
exports.scheduleMaintenance = async (req, res) => {
  try {
    const {
      vehicleId,
      maintenanceType,
      description,
      startDate,
      endDate,
      cost,
      performedBy,
      notes
    } = req.body;

    // Update vehicle status to maintenance
    await promisePool.query(
      'UPDATE Vehicle SET status = "maintenance" WHERE vehicle_id = ?',
      [vehicleId]
    );

    const [result] = await promisePool.query(
      `INSERT INTO Maintenance 
       (vehicle_id, maintenance_type, description, start_date, end_date, cost, performed_by, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [vehicleId, maintenanceType, description, startDate, endDate, cost, performedBy, notes]
    );

    const [maintenance] = await promisePool.query(
      'SELECT * FROM Maintenance WHERE maintenance_id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: maintenance[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//====== to get maintanance (R)
exports.getMaintenanceByVehicle = async (req, res) => {
  try {
    const [maintenance] = await promisePool.query(
      `SELECT m.*, v.make, v.model, v.registration_number
       FROM Maintenance m
       JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
       WHERE m.vehicle_id = ?
       ORDER BY m.start_date DESC`,
      [req.params.vehicleId]
    );

    res.json({ success: true, count: maintenance.length, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllMaintenance = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT m.*, v.make, v.model, v.registration_number, v.category
      FROM Maintenance m
      JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
    `;

    const params = [];

    if (status) {
      query += ' WHERE m.status = ?';
      params.push(status);
    }

    query += ' ORDER BY m.start_date DESC';

    const [maintenance] = await promisePool.query(query, params);

    res.json({ success: true, count: maintenance.length, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMaintenanceById = async (req, res) => {
  try {
    const [maintenance] = await promisePool.query(
      `SELECT m.*, v.make, v.model, v.registration_number, v.year, v.category
       FROM Maintenance m
       JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
       WHERE m.maintenance_id = ?`,
      [req.params.id]
    );

    if (maintenance.length === 0) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    res.json({ success: true, data: maintenance[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//====== to update maintanance (U)
exports.updateMaintenance = async (req, res) => {
  try {
    const { status, actualEndDate, cost, notes } = req.body;

    const fields = [];
    const values = [];

    if (status) {
      fields.push('status = ?');
      values.push(status);
    }
    if (actualEndDate) {
      fields.push('actual_end_date = ?');
      values.push(actualEndDate);
    }
    if (cost !== undefined) {
      fields.push('cost = ?');
      values.push(cost);
    }
    if (notes) {
      fields.push('notes = ?');
      values.push(notes);
    }

    values.push(req.params.id);

    await promisePool.query(
      `UPDATE Maintenance SET ${fields.join(', ')} WHERE maintenance_id = ?`,
      values
    );

    // If maintenance is completed, update vehicle status back to available
    if (status === 'completed') {
      const [maintenance] = await promisePool.query(
        'SELECT vehicle_id FROM Maintenance WHERE maintenance_id = ?',
        [req.params.id]
      );

      if (maintenance.length > 0) {
        await promisePool.query(
          'UPDATE Vehicles SET status = "available" WHERE vehicle_id = ?',
          [maintenance[0].vehicle_id]
        );
      }
    }

    const [updated] = await promisePool.query('SELECT * FROM Maintenance WHERE maintenance_id = ?', [req.params.id]);

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//====== to delete maintanance (D)
exports.deleteMaintenance = async (req, res) => {
  try {
    // Get vehicle_id before deleting
    const [maintenance] = await promisePool.query(
      'SELECT vehicle_id FROM Maintenance WHERE maintenance_id = ?',
      [req.params.id]
    );

    if (maintenance.length === 0) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    await promisePool.query('DELETE FROM Maintenance WHERE maintenance_id = ?', [req.params.id]);

    // Check if there are other active maintenance records for this vehicle
    const [activeMaintenance] = await promisePool.query(
      `SELECT COUNT(*) as count FROM Maintenance 
       WHERE vehicle_id = ? AND status IN ('scheduled', 'in_progress')`,
      [maintenance[0].vehicle_id]
    );

    // If no active maintenance, set vehicle back to available
    if (activeMaintenance[0].count === 0) {
      await promisePool.query(
        'UPDATE Vehicle SET status = "available" WHERE vehicle_id = ?',
        [maintenance[0].vehicle_id]
      );
    }

    res.json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};