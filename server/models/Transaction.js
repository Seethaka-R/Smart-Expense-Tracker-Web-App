const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0.01, 'Amount must be greater than 0']
    },
    type: {
      type: String,
      required: [true, 'Please specify transaction type'],
      enum: ['income', 'expense']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Salary',
        'Freelance',
        'Investment',
        'Gifts',
        'Food',
        'Rent',
        'Travel',
        'Shopping',
        'Bills',
        'Education',
        'Health',
        'Entertainment',
        'Other'
      ]
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot be more than 250 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
