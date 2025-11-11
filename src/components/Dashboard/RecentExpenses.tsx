import React from 'react';
import { Expense } from '../../types';
import { Calendar, DollarSign } from 'lucide-react';

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => {
  const recent = expenses.slice(0, 5);

  const getStatusBadge = (status: string) => {
    return status === 'paid' ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Paid
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Not Paid
      </span>
    );
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
      <div className="space-y-4">
        {recent.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{expense.description}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${expense.amount.toLocaleString()}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{expense.category}</span>
              </div>
            </div>
            {getStatusBadge(expense.status)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;

