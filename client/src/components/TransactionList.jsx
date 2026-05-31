import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import { Edit3, Trash2, Search, ArrowUpRight, ArrowDownRight, Filter, Calendar } from 'lucide-react';

const CATEGORIES = [
  'All',
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
];

const TransactionList = ({ refreshTrigger, onEditClick, onDeleteSuccess }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (type !== 'All') filters.type = type.toLowerCase();
      if (category !== 'All') filters.category = category;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const data = await getTransactions(filters);
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [refreshTrigger, search, type, category, startDate, endDate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        onDeleteSuccess();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting transaction');
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setType('All');
    setCategory('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="glass rounded-2xl border border-gray-800 p-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-100">Transaction History</h3>
          <p className="text-xs text-gray-500 font-medium">Filter, search and manage logs</p>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors self-start md:self-auto"
        >
          Clear Filters
        </button>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Type */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* End Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-8 text-sm text-gray-500 font-medium">
            Loading logs...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500 font-medium border border-dashed border-gray-800 rounded-xl">
            No transactions found matching filters.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-4 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700/60 rounded-xl transition-all"
            >
              {/* Left Side: Type Icon, Title, Sub */}
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm sm:text-base leading-tight">
                    {tx.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mt-1">
                    <span className="bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-400 font-medium">
                      {tx.category}
                    </span>
                    <span>&bull;</span>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    {tx.description && (
                      <>
                        <span>&bull;</span>
                        <span className="italic text-gray-600 truncate max-w-[120px] sm:max-w-[200px]">
                          {tx.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Amount and Actions */}
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold text-sm sm:text-base ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5 border-l border-gray-800 pl-3">
                  <button
                    onClick={() => onEditClick(tx)}
                    className="p-1.5 text-gray-500 hover:text-indigo-400 transition-colors rounded hover:bg-indigo-500/10"
                    title="Edit Log"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                    title="Delete Log"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
