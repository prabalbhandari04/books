const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model'); 
const config = require('../config/config');
const sendRevenueEmail = require('../utils/sendRevenueEmail');

const signUp = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate if required fields are present in the request
        if (!email || !password ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered with this email' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            userType,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate if required fields are present in the request
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, config.token_secret , { expiresIn: '7d' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        // Validate if required fields are present in the request
        if (!userId || !newRole) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Update the user role in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { userType: newRole }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserInfo = async (req, res) => {
    try {
        // Get user information from the authenticated user (req.user)
        const userId = req.user.userId;
        const user = await User.findById(userId);

        res.json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getRevenue = async (userId) => {
    const currentDate = new Date();
    const user = await User.findById(userId).select('revenue');

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    const periodRevenue = user.revenue;

    // Calculate total revenue for all periods
    const totalRevenue = periodRevenue.reduce((total, entry) => total + entry.amount, 0);

    // Calculate total revenue for the current month
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthRevenue = periodRevenue
        .filter(entry => entry.date >= startOfCurrentMonth)
        .reduce((total, entry) => total + entry.amount, 0);

    // Calculate total revenue for the current year
    const startOfCurrentYear = new Date(currentDate.getFullYear(), 0, 1);
    const currentYearRevenue = periodRevenue
        .filter(entry => entry.date >= startOfCurrentYear)
        .reduce((total, entry) => total + entry.amount, 0);

    return {
        userId,
        totalRevenue,
        currentMonthRevenue,
        currentYearRevenue,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };
};

const getCurrentMonthRevenue = async (userId) => {
    const currentDate = new Date();
    const startOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const users = await User.find({
        '_id': userId,
        'revenue.date': { $gte: startOfPeriod }
    }).select('revenue');

    const periodRevenue = users.flatMap(user => user.revenue);
    const currentMonthRevenue = periodRevenue
        .filter(entry => entry.date.getMonth() === currentDate.getMonth());

    // Calculate total revenue for the current month
    const totalCurrentMonthRevenue = currentMonthRevenue.reduce((total, entry) => total + entry.amount, 0);

    return { userId, currentMonthRevenue, totalCurrentMonthRevenue, month: currentDate.getMonth() + 1 };
};

const getCurrentYearRevenue = async (userId) => {
    const currentDate = new Date();
    const startOfPeriod = new Date(currentDate.getFullYear(), 0, 1);

    const users = await User.find({
        '_id': userId,
        'revenue.date': { $gte: startOfPeriod }
    }).select('revenue');

    const periodRevenue = users.flatMap(user => user.revenue);
    const currentYearRevenue = periodRevenue
        .filter(entry => entry.date.getFullYear() === currentDate.getFullYear());

    // Calculate total revenue for the current year
    const totalCurrentYearRevenue = currentYearRevenue.reduce((total, entry) => total + entry.amount, 0);

    return { userId, currentYearRevenue, totalCurrentYearRevenue, year: currentDate.getFullYear() };
};

const getAllRevenueData = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Call the controllers to get data
        const overallRevenueData = await getRevenue(userId);
        const currentMonthRevenueData = await getCurrentMonthRevenue(userId);
        const currentYearRevenueData = await getCurrentYearRevenue(userId);

        // Combine the results and send the response
        const combinedData = {
            userId,
            overallRevenue: overallRevenueData.totalRevenue,
            currentMonthRevenue: currentMonthRevenueData.totalCurrentMonthRevenue,
            currentYearRevenue: currentYearRevenueData.totalCurrentYearRevenue,
            month: currentMonthRevenueData.month,
            year: currentYearRevenueData.year
        };
        const user = await User.findById(req.user.userId);
        const userEmail = user.email;  
        console.log(userEmail)
        sendRevenueEmail(
            userEmail,
            overallRevenueData.totalRevenue,
            currentMonthRevenueData.totalCurrentMonthRevenue,
            currentYearRevenueData.totalCurrentYearRevenue,
            currentMonthRevenueData.month,
            currentYearRevenueData.year
        );

        res.json(combinedData);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        res.status(status).json({ error: message });
    }
};



module.exports = {
    signUp,
    signIn,
    updateUserRole,
    getAllUsers,
    getUserInfo,
    getAllRevenueData,
    getCurrentMonthRevenue
};
