import React, { useMemo, useState, useEffect } from 'react';
import ExpenseList from '../components/Expense/ExpenseList';
import { mockExpenses, loadInitialData } from '../data/mockData';
import { setupStorageSync } from '../utils/dataSync';

const DailyExpenses: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const dailyExpenses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockExpenses.filter(expense => expense.date === today);
  }, [refreshKey]);

  useEffect(() => {
    loadInitialData().then(() => {
      setRefreshKey(prev => prev + 1);
    });
    const cleanup = setupStorageSync(() => {
      setRefreshKey(prev => prev + 1);
    });
    return cleanup;
  }, []);

  return <ExpenseList expenses={dailyExpenses} title="Daily Expenses" />;
};

export default DailyExpenses;

