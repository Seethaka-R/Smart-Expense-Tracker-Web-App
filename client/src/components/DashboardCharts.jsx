import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-950/95 border border-gray-800 p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-semibold text-gray-400">
          {payload[0].name || payload[0].payload.month || 'Data'}
        </p>
        <p className="text-sm font-extrabold text-indigo-400 mt-1">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ summary }) => {
  const { categoryBreakdown = [], monthlySpending = [] } = summary || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown Chart */}
      <div className="glass rounded-2xl border border-gray-800 p-6 flex flex-col h-[400px]">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
            <PieIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100">Spending by Category</h3>
            <p className="text-xs text-gray-500 font-medium">Expense distribution</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {categoryBreakdown.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 font-medium">
              No expense entries to plot.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-400 font-semibold">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Spending Trend */}
      <div className="glass rounded-2xl border border-gray-800 p-6 flex flex-col h-[400px]">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100">Monthly Spending Trend</h3>
            <p className="text-xs text-gray-500 font-medium">Monthly total expense timeline</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          {monthlySpending.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 font-medium">
              No historical trend data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#4b5563"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                />
                <YAxis
                  stroke="#4b5563"
                  fontSize={11}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {monthlySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6366f1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
