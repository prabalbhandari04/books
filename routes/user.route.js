// routes.js
const express = require('express');
const { signUp, signIn , updateUserRole, getAllUsers, getUserInfo } = require('./../controllers/user.controller'); 
const { authenticateToken } = require('./../middleware/auth'); 
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.put('/updateUserRole', authenticateToken, updateUserRole);

router.get('/getAllUsers', getAllUsers);

router.get('/profile', authenticateToken, getUserInfo);

module.exports = router;

