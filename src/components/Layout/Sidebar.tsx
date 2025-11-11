import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, CalendarDays, CalendarRange, CalendarCheck, Plus, Shield, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userRequests } from '../../data/mockData';
import NotificationBadge from '../NotificationBadge';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      const updatePendingCount = () => {
        const pending = userRequests.filter(r => r.status === 'pending').length;
        setPendingCount(pending);
      };
      
      updatePendingCount();
      const interval = setInterval(updatePendingCount, 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/daily', icon: Calendar, label: 'Daily Expenses' },
    { path: '/weekly', icon: CalendarDays, label: 'Weekly Expenses' },
    { path: '/monthly', icon: CalendarRange, label: 'Monthly Expenses' },
    { path: '/yearly', icon: CalendarCheck, label: 'Yearly Expenses' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              to="/admin"
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Admin Panel</span>
              <NotificationBadge count={pendingCount} />
            </Link>
          </div>
        )}
        
        {user?.role === 'creator' && (
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <Link
              to="/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/categories')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Manage Categories</span>
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Expense</span>
            </Link>
          </div>
        )}
        
        {user?.role === 'payer' && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              to="/create"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Expense</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

