import React, { useMemo, useState, useEffect } from 'react';
import ExpenseList from '../components/Expense/ExpenseList';
import { mockExpenses, loadInitialData } from '../data/mockData';
import { setupStorageSync } from '../utils/dataSync';

const MonthlyExpenses: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const monthlyExpenses = useMemo(() => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthAgo && expenseDate <= today;
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

  return <ExpenseList expenses={monthlyExpenses} title="Monthly Expenses" />;
};

export default MonthlyExpenses;

