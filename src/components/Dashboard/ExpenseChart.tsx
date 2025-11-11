import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense } from '../../types';

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const categoryData = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { paid: 0, unpaid: 0 };
    }
    if (expense.status === 'paid') {
      acc[expense.category].paid += expense.amount;
    } else {
      acc[expense.category].unpaid += expense.amount;
    }
    return acc;
  }, {} as Record<string, { paid: number; unpaid: number }>);

  const chartData = Object.entries(categoryData).map(([category, amounts]) => ({
    category,
    Paid: amounts.paid,
    Unpaid: amounts.unpaid,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Paid" fill="#10b981" />
          <Bar dataKey="Unpaid" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;

