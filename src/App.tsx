import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import DailyExpenses from './pages/DailyExpenses';
import WeeklyExpenses from './pages/WeeklyExpenses';
import MonthlyExpenses from './pages/MonthlyExpenses';
import YearlyExpenses from './pages/YearlyExpenses';
import ExpenseForm from './components/Expense/ExpenseForm';
import AdminPanel from './pages/AdminPanel';
import CategoryManagement from './pages/CategoryManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/daily" element={<ProtectedRoute><DailyExpenses /></ProtectedRoute>} />
            <Route path="/weekly" element={<ProtectedRoute><WeeklyExpenses /></ProtectedRoute>} />
            <Route path="/monthly" element={<ProtectedRoute><MonthlyExpenses /></ProtectedRoute>} />
            <Route path="/yearly" element={<ProtectedRoute><YearlyExpenses /></ProtectedRoute>} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  {user.role === 'admin' ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to="/" />
                  )}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  {user.role === 'creator' ? (
                    <CategoryManagement />
                  ) : (
                    <Navigate to="/" />
                  )}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  {(user.role === 'creator' || user.role === 'payer') ? (
                    <ExpenseForm />
                  ) : (
                    <Navigate to="/" />
                  )}
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;

