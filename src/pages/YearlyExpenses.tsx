import React, { useMemo, useState, useEffect } from 'react';
import ExpenseList from '../components/Expense/ExpenseList';
import { mockExpenses, loadInitialData } from '../data/mockData';
import { setupStorageSync } from '../utils/dataSync';

const YearlyExpenses: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const yearlyExpenses = useMemo(() => {
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);
    
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= yearAgo && expenseDate <= today;
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

  return <ExpenseList expenses={yearlyExpenses} title="Yearly Expenses" />;
};

export default YearlyExpenses;

