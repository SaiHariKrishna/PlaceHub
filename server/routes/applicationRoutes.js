const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  checkApplication,
  getJobApplicants,
  updateApplicationStatus,
  getAdminStats,
} = require('../controllers/applicationController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Student routes
router.post('/:jobId/apply', authenticate, applyToJob);
router.get('/my', authenticate, getMyApplications);
router.get('/check/:jobId', authenticate, checkApplication);

// Admin routes
router.get('/admin/stats', authenticate, adminOnly, getAdminStats);
router.get('/admin/job/:jobId', authenticate, adminOnly, getJobApplicants);
router.put('/admin/:id/status', authenticate, adminOnly, updateApplicationStatus);

module.exports = router;
