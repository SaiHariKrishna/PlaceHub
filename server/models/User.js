const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    // Student profile fields
    age: { type: Number },
    branch: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    cgpa: { type: Number },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
