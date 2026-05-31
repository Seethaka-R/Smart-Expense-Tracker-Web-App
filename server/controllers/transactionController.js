const Transaction = require('../models/Transaction');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate, search } = req.query;
    
    // Build query object
    let query = { user: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Include the entire end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (title, amount, type, category)' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || new Date(),
      description
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, date, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard analytics / summary
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {};
    const monthlySpending = {}; // Format: "YYYY-MM": amount

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        
        // Category breakdown
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;

        // Monthly Breakdown for charts (expenses only)
        const monthYear = new Date(tx.date).toISOString().substring(0, 7); // "YYYY-MM"
        monthlySpending[monthYear] = (monthlySpending[monthYear] || 0) + tx.amount;
      }
    });

    const netSavings = totalIncome - totalExpenses;

    // Convert category breakdown to array for charting ease
    const categoryBreakdownArray = Object.keys(categoryBreakdown).map((cat) => ({
      name: cat,
      value: categoryBreakdown[cat]
    }));

    // Convert monthly breakdown to sorted array
    const monthlySpendingArray = Object.keys(monthlySpending)
      .map((month) => ({
        month,
        amount: monthlySpending[month]
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        categoryBreakdown: categoryBreakdownArray,
        monthlySpending: monthlySpendingArray
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
};
