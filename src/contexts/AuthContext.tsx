
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
    // Only allow admin, super_admin and cashier roles to log in
    if (userData.role !== 'admin' && userData.role !== 'cashier' && userData.role !== 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Only staff members can log in to the system.",
        variant: "destructive",
      });
      return;
    }

    // If the user is a cashier and their status is pending, deny access
    if (userData.role === 'cashier' && userData.status === 'pending') {
      toast({
        title: "Account Pending",
        description: "Your account requires approval from a super admin.",
        variant: "destructive",
      });
      return;
    }

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

  const value = {
    user,
    login,
    logout,
    isLoading,
    isStaff,
    isSuperAdmin,
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
