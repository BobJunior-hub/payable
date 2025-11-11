export type UserRole = 'viewer' | 'creator' | 'payer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending';
}

export interface UserRequest {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  role?: UserRole;
}

export type PaymentStatus = 'paid' | 'not_paid';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: PaymentStatus;
  createdBy: string;
  createdAt: string;
  paidBy?: string;
  paidAt?: string;
}

export interface Statistics {
  totalExpenses: number;
  paidExpenses: number;
  unpaidExpenses: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

