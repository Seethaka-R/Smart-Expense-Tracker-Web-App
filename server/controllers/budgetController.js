const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get user budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ month: -1 });
    res.status(200).json({ success: true, budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update a budget limit
// @route   POST /api/budgets
// @access  Private
const upsertBudget = async (req, res) => {
  try {
    const { month, limit } = req.body;

    if (!month || limit === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide both month (YYYY-MM) and limit amount' });
    }

    // Find and update or insert (upsert)
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get budget and actual expense details for a specific month
// @route   GET /api/budgets/status/:month
// @access  Private
const getBudgetStatus = async (req, res) => {
  try {
    const { month } = req.params; // Expects "YYYY-MM"

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ success: false, message: 'Invalid month format. Please use YYYY-MM' });
    }

    // Get budget for the month
    const budget = await Budget.findOne({ user: req.user.id, month });
    const budgetLimit = budget ? budget.limit : 0;

    // Get actual expense total for this month
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);

    const transactions = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: { $gte: start, $lt: end }
    });

    const totalExpense = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budgetLimit - totalExpense;
    const isExceeded = totalExpense > budgetLimit;
    const alertMessage = isExceeded
      ? `Warning: You have exceeded your budget of $${budgetLimit} by $${Math.abs(remaining).toFixed(2)}!`
      : remaining <= budgetLimit * 0.15 && budgetLimit > 0
      ? `Careful: You have spent ${((totalExpense / budgetLimit) * 100).toFixed(1)}% of your monthly budget. Only $${remaining.toFixed(2)} remaining.`
      : null;

    res.status(200).json({
      success: true,
      status: {
        month,
        budgetLimit,
        totalExpense,
        remaining,
        isExceeded,
        alertMessage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
  getBudgetStatus
};
