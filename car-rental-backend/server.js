const express = require('express');
require('dotenv').config();

const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { initDatabase } = require('./config/database');
const app = express();

//====== Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory exists');
}

//====== Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//====== IMPORTANT: CORS must come BEFORE body parsers
app.use(cors());

//====== Body parsers - these must come AFTER cors but BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//====== to initialize Database
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

//====== Routes
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

//====== Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});