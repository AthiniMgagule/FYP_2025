const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

//====== to generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

//====== to register new user
exports.register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, phoneNumber, driversLicense } = req.body;

        const [existingUser] = await promisePool.query('SELECT * FROM User WHERE email = ?', [email]); //====== to check if user exists
        
        if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: 'User already exists' });
        }

        //====== to hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //====== to insert user
        const [userResult] = await promisePool.query(
            'INSERT INTO User (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role || 'customer']
        );

        const userId = userResult.insertId;

        //====== if role is customer, insert into Customer table
        if (role === 'customer' || !role) {
        await promisePool.query(
            'INSERT INTO Customer (user_id, first_name, last_name, phone_number, drivers_license) VALUES (?, ?, ?, ?, ?)',
            [userId, firstName, lastName, phoneNumber, driversLicense]
        );
        }

        const [newUser] = await promisePool.query('SELECT user_id, email, role FROM User WHERE user_id = ?', [userId]);
        const token = generateToken(newUser[0]);

        res.status(201).json({
        success: true,
        token,
        user: newUser[0]
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//====== to login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const [users] = await promisePool.query('SELECT * FROM User WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({
        success: true,
        token,
        user: {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//====== to get the current user
exports.getMe = async (req, res) => {
    try {
        const [users] = await promisePool.query(
            'SELECT user_id, email, role, created_at FROM User WHERE user_id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};