
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser } from '@/data/userData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isStaff: (user: User | null) => boolean;
  isSuperAdmin: (user: User | null) => boolean;
  isAdmin: (user: User | null) => boolean;
  isCashier: (user: User | null) => boolean;
  isCustomer: (user: User | null) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on app load
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // For staff roles, check authorization
    if (userData.role === 'admin' || userData.role === 'cashier') {
      // If the user is a cashier and their status is pending, deny access
      if (userData.role === 'cashier' && userData.status === 'pending') {
        toast({
          title: "Account Pending",
          description: "Your account requires approval from a super admin.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Super admin doesn't need the status check as they're always approved
    
    setUser(userData);
    setCurrentUser(userData);
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Helper function to check if user is staff (admin, super_admin or cashier)
  const isStaff = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'cashier' || user.role === 'super_admin';
  };

  // Helper function to check if user is super admin
  const isSuperAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'super_admin';
  };

  // Helper function to check if user is admin
  const isAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
  };

  // Helper function to check if user is cashier
  const isCashier = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'cashier';
  };

  // Helper function to check if user is customer
  const isCustomer = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'customer';
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isStaff,
    isSuperAdmin,
    isAdmin,
    isCashier,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
