const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Application = require('../models/Application');
const { sendStatusEmail } = require('../config/email');

// GET /api/admin/students — Get all students with their applications
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email branch cgpa skills')
      .lean();

    const studentIds = students.map((s) => s._id);

    const applications = await Application.find({ student: { $in: studentIds } })
      .populate('job', 'title company')
      .lean();

    const appMap = {};
    for (const app of applications) {
      const sid = app.student.toString();
      if (!appMap[sid]) appMap[sid] = [];
      if (app.job) {
        appMap[sid].push({ jobTitle: app.job.title, company: app.job.company });
      }
    }

    const result = students.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      branch: s.branch || 'N/A',
      cgpa: s.cgpa ?? 'N/A',
      skills: s.skills || [],
      applications: appMap[s._id.toString()] || [],
    }));

    res.json({ students: result });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/change-password — Admin changes their own password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Fetch admin with password field (excluded by default in auth middleware)
    const admin = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash and save new password
    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/all-applicants — Get all applications across all jobs
exports.getAllApplicants = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', '-password -otp -otpExpiry')
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/update-application-status — Update application status + email notification
exports.updateApplicationStatusWithEmail = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Rejected', 'Selected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    )
      .populate('student', '-password -otp -otpExpiry')
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send status-update email to student
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
      // Don't fail the request — the status was already updated
    }

    res.json(application);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
