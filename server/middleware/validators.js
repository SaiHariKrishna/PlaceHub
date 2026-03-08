const { body } = require('express-validator');

// Validate student registration input
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .matches(/_2027@woxsen\.edu\.in$/)
    .withMessage('Email must end with _2027@woxsen.edu.in'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
];

// Validate login input
const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validate OTP input
const otpValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
];

// Validate profile update input
const profileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('Age must be between 16 and 100'),
  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be between 0 and 10'),
  body('branch').optional().trim().notEmpty(),
  body('linkedin').optional().trim(),
  body('github').optional().trim(),
  body('portfolio').optional().trim(),
];

// Validate job creation/update input
const jobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType')
    .isIn(['Full-time', 'Part-time', 'Internship', 'Contract'])
    .withMessage('Invalid job type'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
  body('skills')
    .custom((value) => {
      if (Array.isArray(value)) return value.length >= 1;
      if (typeof value === 'string') {
        try { return JSON.parse(value).length >= 1; } catch { return false; }
      }
      return false;
    })
    .withMessage('At least one skill is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
  otpValidator,
  profileValidator,
  jobValidator,
};
