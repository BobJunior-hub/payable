import { Expense, User, UserRequest, UserRole } from '../types';
import * as api from '../services/api';

// Initial users (these are loaded from API)
export const mockUsers: User[] = [
  { id: '1', name: 'John Viewer', email: 'viewer@company.com', role: 'viewer', status: 'active' },
  { id: '2', name: 'Sarah Creator', email: 'creator@company.com', role: 'creator', status: 'active' },
  { id: '3', name: 'Mike Payer', email: 'payer@company.com', role: 'payer', status: 'active' },
  { id: 'admin-1', name: 'Admin User', email: 'admin@company.com', role: 'admin', status: 'active' },
];

// Cache for expenses, user requests, and categories
export let mockExpenses: Expense[] = [];
export let userRequests: UserRequest[] = [];
export let categories: string[] = [];

// Load initial data from API
export const loadInitialData = async () => {
  try {
    [mockExpenses, userRequests, categories] = await Promise.all([
      api.getExpenses(),
      api.getUserRequests(),
      api.getCategories(),
    ]);
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
};

// ========== USER REQUESTS ==========
export const addUserRequest = async (name: string, email: string): Promise<UserRequest> => {
  const request = await api.createUserRequest(name, email);
  userRequests = [request, ...userRequests];
  return request;
};

export const approveUserRequest = async (requestId: string, role: UserRole, approvedBy: string): Promise<User | null> => {
  try {
    const newUser = await api.approveUserRequest(requestId, role, approvedBy);
    if (newUser) {
      mockUsers.push(newUser);
      // Update local cache
      userRequests = await api.getUserRequests();
      return newUser;
    }
    return null;
  } catch (error) {
    console.error('Error approving user request:', error);
    return null;
  }
};

export const rejectUserRequest = async (requestId: string): Promise<boolean> => {
  try {
    await api.rejectUserRequest(requestId);
    userRequests = await api.getUserRequests();
    return true;
  } catch (error) {
    console.error('Error rejecting user request:', error);
    return false;
  }
};

// ========== CATEGORIES ==========
export const addCategory = async (categoryName: string): Promise<boolean> => {
  try {
    const trimmedName = categoryName.trim();
    if (!trimmedName || categories.includes(trimmedName)) {
      return false;
    }
    await api.addCategory(trimmedName);
    categories = await api.getCategories();
    return true;
  } catch (error) {
    console.error('Error adding category:', error);
    return false;
  }
};

export const deleteCategory = async (categoryName: string): Promise<boolean> => {
  try {
    // Check if category is used in any expenses
    const isUsed = mockExpenses.some(expense => expense.category === categoryName);
    if (isUsed) {
      return false; // Cannot delete if in use
    }
    await api.deleteCategory(categoryName);
    categories = await api.getCategories();
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// ========== EXPENSES ==========
export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  const newExpense = await api.createExpense(expense);
  mockExpenses = [newExpense, ...mockExpenses];
  return newExpense;
};

export const updateExpenseStatus = async (id: string, userId: string): Promise<Expense | null> => {
  try {
    const expense = mockExpenses.find(e => e.id === id);
    if (expense && expense.status === 'not_paid') {
      const updated = await api.updateExpenseStatus(id, 'paid', userId);
      mockExpenses = await api.getExpenses();
      return updated;
    }
    return null;
  } catch (error) {
    console.error('Error updating expense status:', error);
    return null;
  }
};

export const markExpenseAsUnpaid = async (id: string): Promise<Expense | null> => {
  try {
    const expense = mockExpenses.find(e => e.id === id);
    if (expense && expense.status === 'paid') {
      const updated = await api.updateExpenseStatus(id, 'not_paid');
      mockExpenses = await api.getExpenses();
      return updated;
    }
    return null;
  } catch (error) {
    console.error('Error marking expense as unpaid:', error);
    return null;
  }
};

export const markAllUnpaidAsPaid = async (userId: string): Promise<number> => {
  try {
    let count = 0;
    const unpaidExpenses = mockExpenses.filter(e => e.status === 'not_paid');
    for (const expense of unpaidExpenses) {
      await api.updateExpenseStatus(expense.id, 'paid', userId);
      count++;
    }
    mockExpenses = await api.getExpenses();
    return count;
  } catch (error) {
    console.error('Error marking all as paid:', error);
    return 0;
  }
};

export const markAllPaidAsUnpaid = async (): Promise<number> => {
  try {
    let count = 0;
    const paidExpenses = mockExpenses.filter(e => e.status === 'paid');
    for (const expense of paidExpenses) {
      await api.updateExpenseStatus(expense.id, 'not_paid');
      count++;
    }
    mockExpenses = await api.getExpenses();
    return count;
  } catch (error) {
    console.error('Error marking all as unpaid:', error);
    return 0;
  }
};

// Refresh functions for polling
export const refreshExpenses = async () => {
  try {
    mockExpenses = await api.getExpenses();
  } catch (error) {
    console.error('Error refreshing expenses:', error);
  }
};

export const refreshUserRequests = async () => {
  try {
    userRequests = await api.getUserRequests();
  } catch (error) {
    console.error('Error refreshing user requests:', error);
  }
};

export const refreshCategories = async () => {
  try {
    categories = await api.getCategories();
  } catch (error) {
    console.error('Error refreshing categories:', error);
  }
};
