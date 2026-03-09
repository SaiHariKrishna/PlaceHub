const express = require('express');
const router = express.Router();
const {
  changePassword,
  getAllApplicants,
  getAllStudents,
  updateApplicationStatusWithEmail,
} = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate, adminOnly);

router.put('/change-password', changePassword);
router.get('/students', getAllStudents);
router.get('/all-applicants', getAllApplicants);
router.put('/update-status', updateApplicationStatusWithEmail);

module.exports = router;
