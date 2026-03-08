const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs, checkSaved } = require('../controllers/savedJobController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getSavedJobs);
router.get('/check/:jobId', authenticate, checkSaved);
router.post('/:jobId', authenticate, saveJob);
router.delete('/:jobId', authenticate, unsaveJob);

module.exports = router;
