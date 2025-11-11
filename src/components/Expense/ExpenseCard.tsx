import React from 'react';
import { Expense } from '../../types';
import { Calendar, DollarSign, Tag, CheckCircle, XCircle, ChevronDown, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateExpenseStatus, markExpenseAsUnpaid, mockUsers } from '../../data/mockData';

interface ExpenseCardProps {
  expense: Expense;
  onUpdate: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onUpdate }) => {
  const { user } = useAuth();
  const isPayer = user?.role === 'payer';

  const handleStatusChange = async (newStatus: 'paid' | 'not_paid') => {
    if (!isPayer || !user) return;

    try {
      if (newStatus === 'paid' && expense.status === 'not_paid') {
        await updateExpenseStatus(expense.id, user.id);
        onUpdate();
      } else if (newStatus === 'not_paid' && expense.status === 'paid') {
        await markExpenseAsUnpaid(expense.id);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating expense status:', error);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{expense.description}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1 text-purple-600 font-medium">
              <Calendar className="w-4 h-4" />
              Expense Date: {new Date(expense.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {expense.category}
            </span>
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <Clock className="w-4 h-4" />
              Created: {(() => {
                if (expense.createdAt) {
                  return new Date(expense.createdAt).toLocaleDateString() + ' ' + new Date(expense.createdAt).toLocaleTimeString();
                }
                // Fallback: extract timestamp from ID
                const timestamp = expense.id.replace('exp-', '');
                if (timestamp) {
                  const date = new Date(parseInt(timestamp));
                  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                }
                return 'Unknown';
              })()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPayer ? (
            <div className="relative">
              <select
                value={expense.status === 'paid' ? 'paid' : 'not_paid'}
                onChange={(e) => handleStatusChange(e.target.value as 'paid' | 'not_paid')}
                className="appearance-none px-3 py-1.5 pr-8 bg-white border-2 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                style={{
                  color: expense.status === 'paid' ? '#059669' : '#dc2626',
                  borderColor: expense.status === 'paid' ? '#d1fae5' : '#fee2e2',
                  backgroundColor: expense.status === 'paid' ? '#f0fdf4' : '#fef2f2',
                }}
              >
                <option value="paid">Paid</option>
                <option value="not_paid">Unpaid</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" 
                style={{ color: expense.status === 'paid' ? '#059669' : '#dc2626' }} 
              />
            </div>
          ) : (
            expense.status === 'paid' ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Paid
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <XCircle className="w-4 h-4" />
                Not Paid
              </span>
            )
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <span className="text-2xl font-bold text-gray-900">${expense.amount.toLocaleString()}</span>
        </div>
        {expense.paidAt && (
          <div className="text-xs text-gray-500">
            Paid on {new Date(expense.paidAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;

