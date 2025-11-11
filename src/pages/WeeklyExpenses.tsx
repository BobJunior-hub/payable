import React, { useMemo, useState, useEffect } from 'react';
import ExpenseList from '../components/Expense/ExpenseList';
import { mockExpenses, loadInitialData } from '../data/mockData';
import { setupStorageSync } from '../utils/dataSync';

const WeeklyExpenses: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const weeklyExpenses = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekAgo && expenseDate <= today;
    });
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

  return <ExpenseList expenses={weeklyExpenses} title="Weekly Expenses" />;
};

export default WeeklyExpenses;

