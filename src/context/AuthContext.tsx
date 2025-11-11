import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUserByEmail, getUsers } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Verify user still exists and is active via API
      getUserByEmail(parsedUser.email)
        .then(foundUser => {
          if (foundUser && foundUser.status === 'active') {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
          } else {
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          localStorage.removeItem('user');
        });
    }
  }, []);

  const login = async (email: string) => {
    try {
      const foundUser = await getUserByEmail(email);
      if (foundUser && foundUser.status === 'active') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Access denied. Your account is pending approval or has been rejected.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Access denied. Your account is pending approval or has been rejected.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const foundUser = await getUserByEmail(user.email);
        if (foundUser && foundUser.status === 'active') {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

