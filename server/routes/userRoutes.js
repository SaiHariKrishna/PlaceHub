const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { profileValidator } = require('../middleware/validators');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, profileValidator, updateProfile);
router.post('/resume', authenticate, upload.single('resume'), uploadResume);

module.exports = router;
