import { refreshExpenses, refreshUserRequests, refreshCategories } from '../data/mockData';

// Setup API polling to sync data across devices
export const setupStorageSync = (onUpdate: () => void) => {
  // Poll API every 2 seconds to get latest data
  const interval = setInterval(async () => {
    try {
      await Promise.all([
        refreshExpenses(),
        refreshUserRequests(),
        refreshCategories(),
      ]);
      onUpdate();
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }, 2000); // Check every 2 seconds

  return () => {
    clearInterval(interval);
  };
};
