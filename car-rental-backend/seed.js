const bcrypt = require('bcryptjs');
const { promisePool } = require('./config/database');

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');

        // Clear existing data (in reverse order of foreign key dependencies)
        await promisePool.query('SET FOREIGN_KEY_CHECKS = 0');
        await promisePool.query('TRUNCATE TABLE Invoice');
        await promisePool.query('TRUNCATE TABLE Rental');
        await promisePool.query('TRUNCATE TABLE Maintenance');
        await promisePool.query('TRUNCATE TABLE Booking');
        await promisePool.query('TRUNCATE TABLE VehicleFeature');
        await promisePool.query('TRUNCATE TABLE Vehicle');
        await promisePool.query('TRUNCATE TABLE Customer');
        await promisePool.query('TRUNCATE TABLE User');
        await promisePool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✓ Cleared existing data');

        // Hash password for all users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Users
        const users = [
            { email: 'manager@test.com', role: 'manager' },
            { email: 'staff1@test.com', role: 'staff' },
            { email: 'staff2@test.com', role: 'staff' },
            { email: 'john.doe@test.com', role: 'customer' },
            { email: 'jane.smith@test.com', role: 'customer' },
            { email: 'mike.johnson@test.com', role: 'customer' },
            { email: 'sarah.williams@test.com', role: 'customer' },
            { email: 'david.brown@test.com', role: 'customer' }
        ];

        const userIds = {};
        for (const user of users) {
            const [result] = await promisePool.query(
                'INSERT INTO User (email, password_hash, role) VALUES (?, ?, ?)',
                [user.email, hashedPassword, user.role]
            );
            userIds[user.email] = result.insertId;
        }
        console.log('✓ Created users (password: password123)');

        // 2. Create Customers
        const customers = [
            {
                userId: userIds['john.doe@test.com'],
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '+27123456789',
                address: '123 Main Street',
                city: 'Johannesburg',
                state: 'Gauteng',
                postalCode: '2000',
                country: 'South Africa',
                driversLicense: 'JD123456',
                licenseExpiry: '2026-12-31',
                dateOfBirth: '1990-05-15'
            },
            {
                userId: userIds['jane.smith@test.com'],
                firstName: 'Jane',
                lastName: 'Smith',
                phoneNumber: '+27123456790',
                address: '456 Oak Avenue',
                city: 'Pretoria',
                state: 'Gauteng',
                postalCode: '0002',
                country: 'South Africa',
                driversLicense: 'JS789012',
                licenseExpiry: '2027-06-30',
                dateOfBirth: '1988-08-22'
            },
            {
                userId: userIds['mike.johnson@test.com'],
                firstName: 'Mike',
                lastName: 'Johnson',
                phoneNumber: '+27123456791',
                address: '789 Pine Road',
                city: 'Benoni',
                state: 'Gauteng',
                postalCode: '1501',
                country: 'South Africa',
                driversLicense: 'MJ345678',
                licenseExpiry: '2025-03-15',
                dateOfBirth: '1985-11-10'
            },
            {
                userId: userIds['sarah.williams@test.com'],
                firstName: 'Sarah',
                lastName: 'Williams',
                phoneNumber: '+27123456792',
                address: '321 Elm Street',
                city: 'Sandton',
                state: 'Gauteng',
                postalCode: '2196',
                country: 'South Africa',
                driversLicense: 'SW901234',
                licenseExpiry: '2028-01-20',
                dateOfBirth: '1992-03-25'
            },
            {
                userId: userIds['david.brown@test.com'],
                firstName: 'David',
                lastName: 'Brown',
                phoneNumber: '+27123456793',
                address: '654 Maple Lane',
                city: 'Centurion',
                state: 'Gauteng',
                postalCode: '0157',
                country: 'South Africa',
                driversLicense: 'DB567890',
                licenseExpiry: '2026-09-12',
                dateOfBirth: '1987-07-18'
            }
        ];

        const customerIds = [];
        for (const customer of customers) {
            const [result] = await promisePool.query(
                `INSERT INTO Customer (user_id, first_name, last_name, phone_number, address, city, state, postal_code, country, drivers_license, license_expiry, date_of_birth)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [customer.userId, customer.firstName, customer.lastName, customer.phoneNumber, customer.address, customer.city, customer.state, customer.postalCode, customer.country, customer.driversLicense, customer.licenseExpiry, customer.dateOfBirth]
            );
            customerIds.push(result.insertId);
        }
        console.log('✓ Created customers');

        // 3. Create Vehicles
        const vehicles = [
            { reg: 'ABC123GP', make: 'Toyota', model: 'Corolla', year: 2022, category: 'economy', color: 'White', seats: 5, mileage: 15000, rate: 350, status: 'available' },
            { reg: 'DEF456GP', make: 'Toyota', model: 'Fortuner', year: 2023, category: 'SUV', color: 'Silver', seats: 7, mileage: 8000, rate: 800, status: 'available' },
            { reg: 'GHI789GP', make: 'BMW', model: '3 Series', year: 2023, category: 'luxury', color: 'Black', seats: 5, mileage: 5000, rate: 1200, status: 'available' },
            { reg: 'JKL012GP', make: 'Mercedes-Benz', model: 'C-Class', year: 2023, category: 'luxury', color: 'Blue', seats: 5, mileage: 3000, rate: 1500, status: 'rented' },
            { reg: 'MNO345GP', make: 'Volkswagen', model: 'Polo', year: 2021, category: 'economy', color: 'Red', seats: 5, mileage: 25000, rate: 300, status: 'available' },
            { reg: 'PQR678GP', make: 'Ford', model: 'Ranger', year: 2022, category: 'SUV', color: 'Grey', seats: 5, mileage: 18000, rate: 750, status: 'maintenance' },
            { reg: 'STU901GP', make: 'Hyundai', model: 'i20', year: 2023, category: 'economy', color: 'White', seats: 5, mileage: 2000, rate: 280, status: 'available' },
            { reg: 'VWX234GP', make: 'Audi', model: 'A4', year: 2023, category: 'luxury', color: 'Black', seats: 5, mileage: 6000, rate: 1400, status: 'available' },
            { reg: 'YZA567GP', make: 'Toyota', model: 'Quantum', year: 2022, category: 'van', color: 'White', seats: 14, mileage: 20000, rate: 900, status: 'available' },
            { reg: 'BCD890GP', make: 'Porsche', model: '911', year: 2023, category: 'sports', color: 'Red', seats: 2, mileage: 1500, rate: 3500, status: 'available' }
        ];

        const vehicleIds = [];
        for (const vehicle of vehicles) {
            const [result] = await promisePool.query(
                `INSERT INTO Vehicle (registration_number, make, model, year, category, color, number_of_seats, mileage, daily_rate, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [vehicle.reg, vehicle.make, vehicle.model, vehicle.year, vehicle.category, vehicle.color, vehicle.seats, vehicle.mileage, vehicle.rate, vehicle.status]
            );
            vehicleIds.push(result.insertId);
        }
        console.log('✓ Created vehicles');

        // 4. Create Vehicle Features
        const features = [
            { vehicleId: vehicleIds[0], name: 'Air Conditioning', description: 'Climate control system' },
            { vehicleId: vehicleIds[0], name: 'Bluetooth', description: 'Hands-free connectivity' },
            { vehicleId: vehicleIds[1], name: 'GPS Navigation', description: 'Built-in navigation system' },
            { vehicleId: vehicleIds[1], name: '4WD', description: 'Four-wheel drive capability' },
            { vehicleId: vehicleIds[2], name: 'Leather Seats', description: 'Premium leather interior' },
            { vehicleId: vehicleIds[2], name: 'Sunroof', description: 'Panoramic sunroof' },
            { vehicleId: vehicleIds[3], name: 'Premium Sound System', description: 'High-end audio' },
            { vehicleId: vehicleIds[9], name: 'Sport Mode', description: 'Enhanced performance mode' }
        ];

        for (const feature of features) {
            await promisePool.query(
                'INSERT INTO VehicleFeature (vehicle_id, feature_name, description) VALUES (?, ?, ?)',
                [feature.vehicleId, feature.name, feature.description]
            );
        }
        console.log('✓ Created vehicle features');

        // 5. Create Bookings
        const bookings = [
            { customerId: customerIds[0], vehicleId: vehicleIds[0], startDate: '2025-10-15', endDate: '2025-10-20', pickup: 'OR Tambo Airport', dropoff: 'OR Tambo Airport', status: 'confirmed', amount: 1750 },
            { customerId: customerIds[1], vehicleId: vehicleIds[3], startDate: '2025-10-08', endDate: '2025-10-12', pickup: 'Sandton Office', dropoff: 'Sandton Office', status: 'confirmed', amount: 6000 },
            { customerId: customerIds[2], vehicleId: vehicleIds[1], startDate: '2025-10-20', endDate: '2025-10-25', pickup: 'Pretoria Branch', dropoff: 'Pretoria Branch', status: 'pending', amount: 4000 },
            { customerId: customerIds[3], vehicleId: vehicleIds[4], startDate: '2025-09-01', endDate: '2025-09-05', pickup: 'Main Office', dropoff: 'Main Office', status: 'completed', amount: 1200 },
            { customerId: customerIds[4], vehicleId: vehicleIds[7], startDate: '2025-09-15', endDate: '2025-09-18', pickup: 'Centurion Mall', dropoff: 'Centurion Mall', status: 'completed', amount: 4200 },
            { customerId: customerIds[0], vehicleId: vehicleIds[6], startDate: '2025-10-05', endDate: '2025-10-07', pickup: 'Benoni Branch', dropoff: 'Benoni Branch', status: 'cancelled', amount: 560 }
        ];

        const bookingIds = [];
        for (const booking of bookings) {
            const [result] = await promisePool.query(
                `INSERT INTO Booking (customer_id, vehicle_id, start_date, end_date, pickup_location, dropoff_location, status, total_amount)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [booking.customerId, booking.vehicleId, booking.startDate, booking.endDate, booking.pickup, booking.dropoff, booking.status, booking.amount]
            );
            bookingIds.push(result.insertId);
        }
        console.log('✓ Created bookings');

        // 6. Create Rentals (for confirmed/completed bookings)
        const rentals = [
            { bookingId: bookingIds[1], checkoutDate: '2025-10-08 09:00:00', checkinDate: null, checkoutMileage: 3000, checkinMileage: null, checkoutStaffId: userIds['staff1@test.com'], checkinStaffId: null, fuelOut: 'Full', fuelIn: null, conditionOut: 'Excellent condition', conditionIn: null, status: 'active' },
            { bookingId: bookingIds[3], checkoutDate: '2025-09-01 10:00:00', checkinDate: '2025-09-05 16:00:00', checkoutMileage: 25000, checkinMileage: 25600, checkoutStaffId: userIds['staff1@test.com'], checkinStaffId: userIds['staff2@test.com'], fuelOut: 'Full', fuelIn: '3/4', conditionOut: 'Good', conditionIn: 'Minor scratch on door', status: 'completed' },
            { bookingId: bookingIds[4], checkoutDate: '2025-09-15 11:00:00', checkinDate: '2025-09-18 15:30:00', checkoutMileage: 6000, checkinMileage: 7200, checkoutStaffId: userIds['staff2@test.com'], checkinStaffId: userIds['staff1@test.com'], fuelOut: 'Full', fuelIn: 'Full', conditionOut: 'Excellent', conditionIn: 'Excellent', status: 'completed' }
        ];

        const rentalIds = [];
        for (const rental of rentals) {
            const [result] = await promisePool.query(
                `INSERT INTO Rental (booking_id, checkout_date, checkin_date, checkout_mileage, checkin_mileage, checkout_staff_id, checkin_staff_id, fuel_level_out, fuel_level_in, condition_notes_out, condition_notes_in, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [rental.bookingId, rental.checkoutDate, rental.checkinDate, rental.checkoutMileage, rental.checkinMileage, rental.checkoutStaffId, rental.checkinStaffId, rental.fuelOut, rental.fuelIn, rental.conditionOut, rental.conditionIn, rental.status]
            );
            rentalIds.push(result.insertId);
        }
        console.log('✓ Created rentals');

        // 7. Create Invoices (for completed rentals)
        const invoices = [
            { rentalId: rentalIds[1], rentalDays: 4, baseAmount: 1200, lateFee: 0, damageFee: 500, otherCharges: 0, taxAmount: 255, totalAmount: 1955, paymentStatus: 'paid', paymentMethod: 'Credit Card' },
            { rentalId: rentalIds[2], rentalDays: 3, baseAmount: 4200, lateFee: 0, damageFee: 0, otherCharges: 0, taxAmount: 630, totalAmount: 4830, paymentStatus: 'paid', paymentMethod: 'Debit Card' }
        ];

        for (const invoice of invoices) {
            await promisePool.query(
                `INSERT INTO Invoice (rental_id, rental_days, base_amount, late_fee, damage_fee, other_charges, tax_amount, total_amount, payment_status, payment_method)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [invoice.rentalId, invoice.rentalDays, invoice.baseAmount, invoice.lateFee, invoice.damageFee, invoice.otherCharges, invoice.taxAmount, invoice.totalAmount, invoice.paymentStatus, invoice.paymentMethod]
            );
        }
        console.log('✓ Created invoices');

        // 8. Create Maintenance Records
        const maintenanceRecords = [
            { vehicleId: vehicleIds[5], type: 'Regular Service', description: '60,000km service', startDate: '2025-10-01', endDate: '2025-10-15', actualEndDate: null, cost: 3500, status: 'in_progress', performedBy: 'AutoCare Services' },
            { vehicleId: vehicleIds[2], type: 'Tire Replacement', description: 'Replace all 4 tires', startDate: '2025-09-20', endDate: '2025-09-21', actualEndDate: '2025-09-21', cost: 8000, status: 'completed', performedBy: 'TirePro' },
            { vehicleId: vehicleIds[8], type: 'Brake Service', description: 'Brake pad replacement', startDate: '2025-11-01', endDate: '2025-11-02', actualEndDate: null, cost: 2500, status: 'scheduled', performedBy: 'QuickFix Garage' }
        ];

        for (const maintenance of maintenanceRecords) {
            await promisePool.query(
                `INSERT INTO Maintenance (vehicle_id, maintenance_type, description, start_date, end_date, actual_end_date, cost, status, performed_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [maintenance.vehicleId, maintenance.type, maintenance.description, maintenance.startDate, maintenance.endDate, maintenance.actualEndDate, maintenance.cost, maintenance.status, maintenance.performedBy]
            );
        }
        console.log('✓ Created maintenance records');

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('Test Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Manager: manager@test.com / password123');
        console.log('Staff 1: staff1@test.com / password123');
        console.log('Staff 2: staff2@test.com / password123');
        console.log('Customer 1: john.doe@test.com / password123');
        console.log('Customer 2: jane.smith@test.com / password123');
        console.log('Customer 3: mike.johnson@test.com / password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();