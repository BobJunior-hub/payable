import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import { userRequests } from '../../data/mockData';
import NotificationBadge from '../NotificationBadge';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      let previousCount = userRequests.filter(r => r.status === 'pending').length;
      
      const updatePendingCount = () => {
        const currentCount = userRequests.filter(r => r.status === 'pending').length;
        setPendingCount(currentCount);
        
        // Show notification if new request came in
        if (currentCount > previousCount) {
          setShowNotification(true);
          // Play notification sound (optional)
          // new Audio('/notification.mp3').play().catch(() => {});
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => setShowNotification(false), 5000);
        }
        
        previousCount = currentCount;
      };
      
      updatePendingCount();
      const interval = setInterval(updatePendingCount, 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'viewer': return 'bg-blue-100 text-blue-800';
      case 'creator': return 'bg-green-100 text-green-800';
      case 'payer': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payable Management</h1>
          <p className="text-sm text-gray-600">Expense Tracking System</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Requests</span>
                </div>
                <NotificationBadge count={pendingCount} />
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {showNotification && (
          <div className="fixed top-20 right-6 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <div>
                <p className="font-semibold">New Access Request!</p>
                <p className="text-sm">You have {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

