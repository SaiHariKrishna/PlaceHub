const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
savedJobSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
