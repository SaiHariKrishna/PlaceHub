const { validationResult } = require('express-validator');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// GET /api/users/profile — Get own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiry');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/profile — Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Only allow updating these fields
    const allowedFields = ['name', 'age', 'branch', 'skills', 'cgpa', 'linkedin', 'github', 'portfolio'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select(
      '-password -otp -otpExpiry'
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/resume — Upload resume to Cloudinary
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);

    // Delete old resume from Cloudinary if one exists
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: 'raw' });
    }

    // Upload new resume buffer to Cloudinary (enforce PDF format)
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'placehub/resumes', format: 'pdf' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Save URL and public ID to user profile
    user.resumeUrl = result.secure_url;
    user.resumePublicId = result.public_id;
    await user.save();

    res.json({ resumeUrl: result.secure_url });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};
