/* */
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

//====== MySQL database initialization
const initDatabase = async () => {
    const connection = await promisePool.getConnection();
    
    try {
        //====== to create User table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS User (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('customer', 'staff', 'manager') NOT NULL DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
        `);

        //====== to create Customer table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Customer (
            customer_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT UNIQUE NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone_number VARCHAR(20),
            address TEXT,
            city VARCHAR(50),
            state VARCHAR(50),
            postal_code VARCHAR(20),
            country VARCHAR(50),
            drivers_license VARCHAR(50) UNIQUE,
            license_expiry DATE,
            date_of_birth DATE,
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
        )
        `);

        //====== to create Vehicle table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Vehicle (
            vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
            registration_number VARCHAR(20) UNIQUE NOT NULL,
            make VARCHAR(50) NOT NULL,
            model VARCHAR(50) NOT NULL,
            year INT NOT NULL,
            category ENUM('economy', 'luxury', 'SUV', 'van', 'sports') NOT NULL,
            color VARCHAR(30),
            number_of_seats INT,
            mileage DECIMAL(10,2),
            daily_rate DECIMAL(10,2) NOT NULL,
            status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

        //====== to create VehicleFeature table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS VehicleFeature (
            feature_id INT PRIMARY KEY AUTO_INCREMENT,
            vehicle_id INT NOT NULL,
            feature_name VARCHAR(50) NOT NULL,
            description TEXT,
            FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE
        )
        `);

        //====== to create Booking table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Booking (
            booking_id INT PRIMARY KEY AUTO_INCREMENT,
            customer_id INT NOT NULL,
            vehicle_id INT NOT NULL,
            booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            pickup_location VARCHAR(255),
            dropoff_location VARCHAR(255),
            status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
            total_amount DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
            FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
        )
        `);

        //====== to create Rental table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Rental (
            rental_id INT PRIMARY KEY AUTO_INCREMENT,
            booking_id INT UNIQUE NOT NULL,
            checkout_date TIMESTAMP,
            checkin_date TIMESTAMP,
            checkout_mileage DECIMAL(10,2),
            checkin_mileage DECIMAL(10,2),
            checkout_staff_id INT,
            checkin_staff_id INT,
            fuel_level_out VARCHAR(20),
            fuel_level_in VARCHAR(20),
            condition_notes_out TEXT,
            condition_notes_in TEXT,
            status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
            FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
            FOREIGN KEY (checkout_staff_id) REFERENCES User(user_id),
            FOREIGN KEY (checkin_staff_id) REFERENCES User(user_id)
        )
        `);

        //====== to create Invoice table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Invoice (
            invoice_id INT PRIMARY KEY AUTO_INCREMENT,
            rental_id INT UNIQUE NOT NULL,
            invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            rental_days INT,
            base_amount DECIMAL(10,2),
            late_fee DECIMAL(10,2) DEFAULT 0,
            damage_fee DECIMAL(10,2) DEFAULT 0,
            other_charges DECIMAL(10,2) DEFAULT 0,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2),
            payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
            payment_method VARCHAR(50),
            notes TEXT,
            FOREIGN KEY (rental_id) REFERENCES Rental(rental_id)
        )
        `);

        //====== to create Maintenance table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS Maintenance (
            maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
            vehicle_id INT NOT NULL,
            maintenance_type VARCHAR(50) NOT NULL,
            description TEXT,
            start_date DATE NOT NULL,
            end_date DATE,
            actual_end_date DATE,
            cost DECIMAL(10,2),
            status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
            performed_by VARCHAR(100),
            notes TEXT,
            FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
        )
        `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { promisePool, initDatabase };