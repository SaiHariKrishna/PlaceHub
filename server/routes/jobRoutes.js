const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} = require('../controllers/jobController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { jobValidator } = require('../middleware/validators');
const { uploadLogo } = require('../middleware/upload');

router.get('/', authenticate, getAllJobs);
router.get('/recommended', authenticate, getRecommendedJobs);
router.get('/:id', authenticate, getJobById);
router.post('/', authenticate, adminOnly, uploadLogo.single('logo'), jobValidator, createJob);
router.put('/:id', authenticate, adminOnly, uploadLogo.single('logo'), jobValidator, updateJob);
router.delete('/:id', authenticate, adminOnly, deleteJob);

module.exports = router;
