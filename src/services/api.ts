import { Expense, UserRole } from '../types';

// API requests go through Vite proxy (port 5173) which forwards to backend (port 3001)
// This way all requests go through the same port as the frontend
const API_BASE_URL = '/api';

// Generic fetch wrapper
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
};

// ========== USERS ==========
export const getUsers = async () => {
  return fetchAPI('/users');
};

export const getUserByEmail = async (email: string) => {
  return fetchAPI(`/users/${email}`);
};

// ========== EXPENSES ==========
export const getExpenses = async () => {
  return fetchAPI('/expenses');
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  return fetchAPI('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
};

export const updateExpenseStatus = async (id: string, status: 'paid' | 'not_paid', userId?: string) => {
  return fetchAPI(`/expenses/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, userId }),
  });
};

// ========== USER REQUESTS ==========
export const getUserRequests = async () => {
  return fetchAPI('/user-requests');
};

export const createUserRequest = async (name: string, email: string) => {
  return fetchAPI('/user-requests', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
};

export const approveUserRequest = async (requestId: string, role: UserRole, approvedBy: string) => {
  return fetchAPI(`/user-requests/${requestId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ role, approvedBy }),
  });
};

export const rejectUserRequest = async (requestId: string) => {
  return fetchAPI(`/user-requests/${requestId}/reject`, {
    method: 'PATCH',
  });
};

// ========== CATEGORIES ==========
export const getCategories = async () => {
  return fetchAPI('/categories');
};

export const addCategory = async (name: string) => {
  return fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const deleteCategory = async (name: string) => {
  return fetchAPI(`/categories/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
};

