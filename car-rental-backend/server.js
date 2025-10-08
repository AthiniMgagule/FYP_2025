const express = require('express');
require('dotenv').config();

const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { initDatabase } = require('./config/database');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//====== to initialize Database
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

//====== Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Car Rental API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});