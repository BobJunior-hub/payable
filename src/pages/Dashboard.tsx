import React, { useMemo, useState, useEffect } from 'react';
import { DollarSign, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import RecentExpenses from '../components/Dashboard/RecentExpenses';
import ExpenseModal from '../components/Dashboard/ExpenseModal';
import { mockExpenses, loadInitialData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { setupStorageSync } from '../utils/dataSync';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isPayer = user?.role === 'payer';
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    // Load initial data from API
    loadInitialData().then(() => {
      handleUpdate();
    });

    // Setup sync to detect changes from other devices
    const cleanup = setupStorageSync(() => {
      handleUpdate();
    });
    return cleanup;
  }, []);

  const statistics = useMemo(() => {
    const totalExpenses = mockExpenses.length;
    const paidExpenses = mockExpenses.filter(e => e.status === 'paid').length;
    const unpaidExpenses = totalExpenses - paidExpenses;
    const totalAmount = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
    const paidAmount = mockExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      totalExpenses,
      paidExpenses,
      unpaidExpenses,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  }, [refreshKey]);

  const paidExpenses = useMemo(() => {
    return mockExpenses.filter(e => e.status === 'paid');
  }, [refreshKey]);

  const unpaidExpenses = useMemo(() => {
    return mockExpenses.filter(e => e.status === 'not_paid');
  }, [refreshKey]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Expenses"
          value={statistics.totalExpenses}
          icon={DollarSign}
          color="bg-blue-500"
        />
        <StatsCard
          title="Paid Expenses"
          value={statistics.paidExpenses}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Unpaid Expenses"
          value={statistics.unpaidExpenses}
          icon={XCircle}
          color="bg-red-500"
        />
        <StatsCard
          title="Total Amount"
          value={`$${statistics.totalAmount.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount Summary</h3>
          <div className="space-y-4">
            <button
              onClick={() => setShowPaidModal(true)}
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700 font-medium group-hover:text-green-700">Paid Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ${statistics.paidAmount.toLocaleString()}
                </span>
                <span className="text-sm text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </button>
            <button
              onClick={() => setShowUnpaidModal(true)}
              className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700 font-medium group-hover:text-red-700">Unpaid Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">
                  ${statistics.unpaidAmount.toLocaleString()}
                </span>
                <span className="text-sm text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </button>
          </div>
        </div>
        <RecentExpenses expenses={mockExpenses} />
      </div>

      <ExpenseChart expenses={mockExpenses} />

      {/* Modals */}
      {showPaidModal && (
        <ExpenseModal
          expenses={paidExpenses}
          title="Paid Expenses"
          onClose={() => setShowPaidModal(false)}
          onUpdate={handleUpdate}
        />
      )}
      {showUnpaidModal && (
        <ExpenseModal
          expenses={unpaidExpenses}
          title="Unpaid Expenses"
          onClose={() => setShowUnpaidModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;

