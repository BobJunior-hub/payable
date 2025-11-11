import React, { useState } from 'react';
import { Expense } from '../../types';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  title: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, title }) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'not_paid'>('all');
  const [, setRefresh] = useState(0);

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const handleUpdate = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'paid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter('not_paid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'not_paid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Not Paid
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No expenses found for this period.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

