import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, PiggyBank, WalletCards } from 'lucide-react';
import BudgetStatus from '../components/BudgetStatus';
import DashboardCharts from '../components/DashboardCharts';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { getTransactionSummary } from '../services/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value || 0);

const StatCard = ({ title, value, icon: Icon, tone }) => {
  const tones = {
    income: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expense: 'bg-red-500/10 text-red-400 border-red-500/20',
    savings: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  };

  return (
    <div className="glass rounded-2xl border border-gray-800 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-gray-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const refreshData = () => {
    setRefreshTrigger((count) => count + 1);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const data = await getTransactionSummary();
        if (data.success) {
          setSummary(data.summary);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [refreshTrigger]);

  const stats = useMemo(
    () => ({
      totalIncome: summary?.totalIncome || 0,
      totalExpenses: summary?.totalExpenses || 0,
      netSavings: summary?.netSavings || 0
    }),
    [summary]
  );

  const handleFormSuccess = () => {
    setEditingTransaction(null);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-darkBg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Smart Expense Tracker
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 mt-1">
              Dashboard
            </h1>
          </div>
          {loadingSummary && (
            <span className="text-xs font-semibold text-gray-500">Refreshing summary...</span>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Income"
            value={formatCurrency(stats.totalIncome)}
            icon={ArrowUpRight}
            tone="income"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon={ArrowDownRight}
            tone="expense"
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(stats.netSavings)}
            icon={PiggyBank}
            tone="savings"
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 mb-6">
          <div className="space-y-6">
            <TransactionForm
              editingTransaction={editingTransaction}
              onSubmitSuccess={handleFormSuccess}
              onCancel={editingTransaction ? () => setEditingTransaction(null) : undefined}
            />
            <BudgetStatus refreshTrigger={refreshTrigger} />
          </div>

          <div className="space-y-6 min-w-0">
            <div className="glass rounded-2xl border border-gray-800 p-5 flex items-center gap-3">
              <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400">
                <WalletCards className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-100">Financial Overview</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Review spending patterns and monthly movement.
                </p>
              </div>
            </div>
            <DashboardCharts summary={summary} />
          </div>
        </section>

        <TransactionList
          refreshTrigger={refreshTrigger}
          onEditClick={setEditingTransaction}
          onDeleteSuccess={refreshData}
        />
      </main>
    </div>
  );
};

export default Dashboard;
