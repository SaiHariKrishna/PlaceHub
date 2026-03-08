const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidator, loginValidator, otpValidator } = require('../middleware/validators');

router.post('/register', registerValidator, register);
router.post('/verify-otp', otpValidator, verifyOTP);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
