import React, { useState, useEffect } from 'react';
import { getBudgetStatus, upsertBudget } from '../services/api';
import { Target, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

const BudgetStatus = ({ refreshTrigger }) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().substring(0, 7) // "YYYY-MM"
  );
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isExceeded, setIsExceeded] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [inputLimit, setInputLimit] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await getBudgetStatus(currentMonth);
      if (data.success && data.status) {
        const { budgetLimit, totalExpense, remaining, isExceeded, alertMessage } = data.status;
        setBudgetLimit(budgetLimit);
        setTotalExpense(totalExpense);
        setRemaining(remaining);
        setIsExceeded(isExceeded);
        setAlertMsg(alertMessage);
        setInputLimit(budgetLimit || '');
      }
    } catch (err) {
      console.error('Error fetching budget status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [currentMonth, refreshTrigger]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const limitVal = parseFloat(inputLimit);
      if (isNaN(limitVal) || limitVal < 0) {
        alert('Please enter a valid positive number');
        setLoading(false);
        return;
      }
      await upsertBudget(currentMonth, limitVal);
      setEditing(false);
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating budget');
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage spent
  const spentPercent = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 0;

  // Decide color of progress bar
  let barColor = 'bg-emerald-500';
  if (spentPercent >= 100) {
    barColor = 'bg-red-500';
  } else if (spentPercent >= 80) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className="glass rounded-2xl border border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100">Monthly Budget</h3>
            <p className="text-xs text-gray-500 font-medium">Keep track of your limit</p>
          </div>
        </div>
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-gray-950 border border-gray-800 text-xs sm:text-sm text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
        />
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${
            isExceeded
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}
        >
          {isExceeded ? (
            <Flame className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{alertMsg}</span>
        </div>
      )}

      {/* Progress Bar & Summary Stats */}
      <div className="space-y-4">
        {editing ? (
          <form onSubmit={handleSaveBudget} className="flex gap-2">
            <input
              type="number"
              placeholder="Set limit ($)"
              value={inputLimit}
              onChange={(e) => setInputLimit(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setInputLimit(budgetLimit);
              }}
              className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 font-semibold px-3 py-2 rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Budget Limit
              </span>
              <span className="font-extrabold text-2xl text-gray-100">
                ${budgetLimit.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 hover:border-indigo-500/40 px-3 py-1.5 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10"
            >
              Edit Budget
            </button>
          </div>
        )}

        {/* Progress Bar Visual */}
        {budgetLimit > 0 && (
          <div className="space-y-1.5">
            <div className="w-full bg-gray-950 rounded-full h-3.5 border border-gray-900 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(spentPercent, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-gray-500">{spentPercent.toFixed(0)}% Spent</span>
              <span
                className={
                  isExceeded
                    ? 'text-red-400'
                    : remaining <= budgetLimit * 0.15
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {isExceeded ? 'Over limit' : `$${remaining.toFixed(2)} remaining`}
              </span>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-950 border border-gray-900 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Spent This Month
            </span>
            <span className="font-bold text-gray-200 text-base sm:text-lg">
              ${totalExpense.toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-950 border border-gray-900 p-3.5 rounded-xl">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isExceeded ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span className="text-xs font-bold text-red-400">Exceeded</span>
                </>
              ) : budgetLimit === 0 ? (
                <span className="text-xs font-semibold text-gray-500">Not Set</span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-400">On Track</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetStatus;
