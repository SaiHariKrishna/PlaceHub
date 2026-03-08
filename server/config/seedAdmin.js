const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Seed default admin account on server start
// NOTE: Change the default admin password in production
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin',
        email: 'admin@placehub.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });
      console.log('Admin account seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;
