/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user by providing required details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       200:
 *         description: Successful user creation
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/signin:
 *   post:
 *     summary: User sign-in
 *     description: Sign in with valid credentials
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignin'
 *     responses:
 *       200:
 *         description: Successful user sign-in
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/updateUserRole:
 *   put:
 *     summary: Update user role
 *     description: Update the role of a user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRoleUpdate'
 *     responses:
 *       200:
 *         description: Successful role update
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Get a list of all users (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get the profile of the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of user profile
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/revenue:
 *   get:
 *     summary: Get all revenue data
 *     description: Get revenue data for reporting (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of revenue data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const { signUp, signIn, updateUserRole, getAllUsers, getUserInfo, getAllRevenueData } = require('./../controllers/user.controller');
const { authenticateToken } = require('./../middleware/auth');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.put('/updateUserRole', authenticateToken, updateUserRole);
router.get('/getAllUsers', authenticateToken, getAllUsers);
router.get('/profile', authenticateToken, getUserInfo);
router.get('/revenue', authenticateToken, getAllRevenueData);

module.exports = router;
