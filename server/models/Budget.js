const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    month: {
      type: String,
      required: [true, 'Please specify the month in YYYY-MM format'],
      match: [/^\d{4}-\d{2}$/, 'Please use the YYYY-MM format']
    },
    limit: {
      type: Number,
      required: [true, 'Please specify a budget limit amount'],
      min: [0, 'Limit cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate budget for the same user and month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
