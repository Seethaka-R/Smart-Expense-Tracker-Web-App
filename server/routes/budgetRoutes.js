const express = require('express');
const router = express.Router();
const { getBudgets, upsertBudget, getBudgetStatus } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all budget routes

router.route('/')
  .get(getBudgets)
  .post(upsertBudget);

router.get('/status/:month', getBudgetStatus);

module.exports = router;
