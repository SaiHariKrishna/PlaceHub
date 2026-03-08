const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// GET /api/jobs — Get all jobs with optional search and filters
exports.getAllJobs = async (req, res) => {
  try {
    const { search, company, location, jobType, skills, deadline } = req.query;
    const filter = {};

    // Full-text search across title, company, description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }
    if (deadline) filter.deadline = { $gte: new Date(deadline) };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/recommended — Jobs matching student skills
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.skills || user.skills.length === 0) {
      // No skills set — return latest open jobs
      const jobs = await Job.find({ deadline: { $gte: new Date() } })
        .sort({ createdAt: -1 })
        .limit(6);
      return res.json(jobs);
    }

    // Find open jobs that match at least one student skill
    const jobs = await Job.find({
      skills: { $in: user.skills },
      deadline: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    // Score by number of matching skills and sort descending
    const scored = jobs
      .map((job) => {
        const matchCount = job.skills.filter((skill) =>
          user.skills.some((us) => us.toLowerCase() === skill.toLowerCase())
        ).length;
        return { ...job.toObject(), matchScore: matchCount };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(scored.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/:id — Get single job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/jobs — Create job (admin only)
exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const jobData = { ...req.body, postedBy: req.user._id };

    // Parse skills and requirements if sent as JSON strings (FormData)
    if (typeof jobData.skills === 'string') {
      jobData.skills = JSON.parse(jobData.skills);
    }
    if (typeof jobData.requirements === 'string') {
      jobData.requirements = JSON.parse(jobData.requirements);
    }

    // Upload logo to Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'placehub/logos', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      jobData.logo = result.secure_url;
      jobData.logoPublicId = result.public_id;
    }

    const job = await Job.create(jobData);

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/jobs/:id — Update job (admin only)
exports.updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updateData = { ...req.body };

    // Parse skills and requirements if sent as JSON strings (FormData)
    if (typeof updateData.skills === 'string') {
      updateData.skills = JSON.parse(updateData.skills);
    }
    if (typeof updateData.requirements === 'string') {
      updateData.requirements = JSON.parse(updateData.requirements);
    }

    // Handle logo removal
    if (updateData.removeLogo === 'true') {
      if (job.logoPublicId) {
        await cloudinary.uploader.destroy(job.logoPublicId);
      }
      updateData.logo = '';
      updateData.logoPublicId = '';
      delete updateData.removeLogo;
    }

    // Upload new logo if provided
    if (req.file) {
      // Delete old logo from Cloudinary
      if (job.logoPublicId) {
        await cloudinary.uploader.destroy(job.logoPublicId);
      }
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'placehub/logos', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      updateData.logo = result.secure_url;
      updateData.logoPublicId = result.public_id;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/jobs/:id — Delete job (admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    // Clean up logo from Cloudinary
    if (job.logoPublicId) {
      await cloudinary.uploader.destroy(job.logoPublicId);
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
