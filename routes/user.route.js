// routes.js
const express = require('express');
const { signUp, signIn } = require('./../controllers/user.controller'); 
const { authenticateToken } = require('./../middleware/auth'); 
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'User profile', user: req.user });
});

module.exports = router;
