const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendStatusEmail } = require('../config/email');

// POST /api/applications/:jobId/apply — Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if deadline has passed
    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check profile completion before applying
    const student = await User.findById(req.user._id);
    const requiredFields = ['age', 'branch', 'cgpa', 'resumeUrl'];
    const missingFields = requiredFields.filter((f) => !student[f]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Please complete your profile before applying',
        missingFields,
      });
    }

    // Check for duplicate application
    const existing = await Application.findOne({ job: jobId, student: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
    });

    res.status(201).json(application);
  } catch (error) {
    // Handle MongoDB duplicate key error as fallback
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/my — Get student's own applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/check/:jobId — Check if student applied to a job
exports.checkApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      job: req.params.jobId,
      student: req.user._id,
    });
    res.json({ applied: !!application, application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/admin/job/:jobId — Get all applicants for a job (admin)
exports.getJobApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', '-password -otp -otpExpiry')
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/applications/admin/:id/status — Update application status (admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Rejected', 'Selected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('student', '-password -otp -otpExpiry')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send email notification on status change
    try {
      await sendStatusEmail(
        application.student.email,
        application.student.name,
        application.job.title,
        application.job.company,
        status
      );
    } catch (emailErr) {
      console.error('Status email failed:', emailErr.message);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/applications/admin/stats — Admin analytics dashboard data
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isVerified: true });
    const totalApplications = await Application.countDocuments();
    const totalJobs = await Job.countDocuments();

    // Top 5 most applied companies
    const mostApplied = await Application.aggregate([
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobData' } },
      { $unwind: '$jobData' },
      { $group: { _id: '$jobData.company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Application counts by status
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ totalStudents, totalApplications, totalJobs, mostApplied, statusCounts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
