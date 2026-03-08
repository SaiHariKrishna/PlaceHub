const SavedJob = require('../models/SavedJob');

// POST /api/saved-jobs/:jobId — Bookmark a job
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const existing = await SavedJob.findOne({ job: jobId, student: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const saved = await SavedJob.create({ job: jobId, student: req.user._id });
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/saved-jobs/:jobId — Remove bookmark
exports.unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ job: req.params.jobId, student: req.user._id });
    res.json({ message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/saved-jobs — Get all saved jobs for student
exports.getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ student: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/saved-jobs/check/:jobId — Check if a job is saved
exports.checkSaved = async (req, res) => {
  try {
    const saved = await SavedJob.findOne({ job: req.params.jobId, student: req.user._id });
    res.json({ saved: !!saved });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
