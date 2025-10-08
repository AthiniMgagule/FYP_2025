const { promisePool } = require('../config/database');

exports.getInvoiceByRentalId = async (req, res) => {
  try {
    const [invoices] = await promisePool.query(
      `SELECT 
        i.*,
        r.checkout_date,
        r.checkin_date,
        b.customer_id,
        b.vehicle_id,
        v.make,
        v.model,
        v.registration_number,
        c.first_name,
        c.last_name,
        c.email,
        c.phone_number
       FROM Invoice i
       JOIN Rental r ON i.rental_id = r.rental_id
       JOIN Booking b ON r.booking_id = b.booking_id
       JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
       JOIN Customer c ON b.customer_id = c.customer_id
       WHERE i.rental_id = ?`,
      [req.params.rentalId]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoices[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const [invoices] = await promisePool.query(
      `SELECT 
        i.*,
        r.checkout_date,
        r.checkin_date,
        b.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        v.make,
        v.model,
        v.registration_number
       FROM Invoice i
       JOIN Rental r ON i.rental_id = r.rental_id
       JOIN Booking b ON r.booking_id = b.booking_id
       JOIN Customer c ON b.customer_id = c.customer_id
       JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
       WHERE i.invoice_id = ?`,
      [req.params.id]
    );

    if (invoices.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoices[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { lateFee, damageFee, otherCharges, notes } = req.body;

    // Get current invoice
    const [current] = await promisePool.query('SELECT * FROM Invoice WHERE invoice_id = ?', [req.params.id]);

    if (current.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const invoice = current[0];

    // Recalculate total
    const newLateFee = lateFee !== undefined ? lateFee : invoice.late_fee;
    const newDamageFee = damageFee !== undefined ? damageFee : invoice.damage_fee;
    const newOtherCharges = otherCharges !== undefined ? otherCharges : invoice.other_charges;

    const newTotal = parseFloat(invoice.base_amount) + parseFloat(newLateFee) + 
                     parseFloat(newDamageFee) + parseFloat(newOtherCharges) + 
                     parseFloat(invoice.tax_amount);

    await promisePool.query(
      `UPDATE Invoice
       SET late_fee = ?, damage_fee = ?, other_charges = ?, total_amount = ?, notes = ?
       WHERE invoice_id = ?`,
      [newLateFee, newDamageFee, newOtherCharges, newTotal, notes || invoice.notes, req.params.id]
    );

    const [updated] = await promisePool.query('SELECT * FROM Invoice WHERE invoice_id = ?', [req.params.id]);

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    await promisePool.query(
      `UPDATE Invoice
       SET payment_status = 'paid', payment_method = ?
       WHERE invoice_id = ?`,
      [paymentMethod, req.params.id]
    );

    const [updated] = await promisePool.query('SELECT * FROM Invoice WHERE invoice_id = ?', [req.params.id]);

    res.json({ success: true, data: updated[0], message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const { paymentStatus } = req.query;

    let query = `
      SELECT 
        i.*,
        c.first_name,
        c.last_name,
        v.make,
        v.model,
        v.registration_number
       FROM Invoice i
       JOIN Rental r ON i.rental_id = r.rental_id
       JOIN Booking b ON r.booking_id = b.booking_id
       JOIN Customer c ON b.customer_id = c.customer_id
       JOIN Vehicle v ON b.vehicle_id = v.vehicle_id
    `;

    const params = [];

    if (paymentStatus) {
      query += ' WHERE i.payment_status = ?';
      params.push(paymentStatus);
    }

    query += ' ORDER BY i.invoice_date DESC';

    const [invoices] = await promisePool.query(query, params);

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};