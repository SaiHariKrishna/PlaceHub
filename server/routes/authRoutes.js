const express = require('express');
const router = express.Router();
const { register, verifyOTP, login, logout, getMe, forgotPassword, verifyResetOTP, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidator, loginValidator, otpValidator, forgotPasswordValidator, resetOtpValidator, resetPasswordValidator } = require('../middleware/validators');

router.post('/register', registerValidator, register);
router.post('/verify-otp', otpValidator, verifyOTP);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

// Forgot password routes
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/verify-reset-otp', resetOtpValidator, verifyResetOTP);
router.post('/reset-password', resetPasswordValidator, resetPassword);

module.exports = router;
