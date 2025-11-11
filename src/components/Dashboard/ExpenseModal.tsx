import React from 'react';
import { Expense } from '../../types';
import { X, Calendar, DollarSign, Tag, CheckCircle, XCircle, ChevronDown, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateExpenseStatus, markExpenseAsUnpaid } from '../../data/mockData';

interface ExpenseModalProps {
  expenses: Expense[];
  title: string;
  onClose: () => void;
  onUpdate: () => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ expenses, title, onClose, onUpdate }) => {
  const { user } = useAuth();
  const isPayer = user?.role === 'payer';
  const isUnpaidModal = title.includes('Unpaid');

  const getStatusBadge = (status: string) => {
    return status === 'paid' ? (
      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        Paid
      </span>
    ) : (
      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
        <XCircle className="w-4 h-4" />
        Not Paid
      </span>
    );
  };

  const handleStatusChange = async (expense: Expense, newStatus: 'paid' | 'not_paid') => {
    if (!user || !isPayer) return;

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

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} • Total: ${totalAmount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No expenses found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
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
                    {getStatusBadge(expense.status)}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <span className="text-2xl font-bold text-gray-900">${expense.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {expense.paidAt && (
                        <p className="text-xs text-gray-500">
                          Paid on {new Date(expense.paidAt).toLocaleDateString()}
                        </p>
                      )}
                      {isPayer && (
                        <div className="relative">
                          <select
                            value={expense.status === 'paid' ? 'paid' : 'not_paid'}
                            onChange={(e) => handleStatusChange(expense, e.target.value as 'paid' | 'not_paid')}
                            className="appearance-none px-4 py-2 pr-8 bg-white border-2 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;

