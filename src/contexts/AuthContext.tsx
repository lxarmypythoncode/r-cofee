import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser, getAllUsers } from '@/data/userData';
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
  allUsers: User[];
  getAllUserData: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all users (only for super_admin)
  const getAllUserData = async () => {
    const users = await getAllUsers(user);
    setAllUsers(users);
    return users;
  };

  useEffect(() => {
    // Check for user in localStorage on app load
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Load all users data
    getAllUserData();
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // Check if the user is a cashier with pending status
    if (userData.role === 'cashier' && userData.status === 'pending') {
      console.log("Rejecting login for pending cashier:", userData);
      toast({
        title: "Account Pending",
        description: "Your account requires approval from a super admin.",
        variant: "destructive",
      });
      return;
    }
    
    // Log successful login
    console.log("Login successful for:", userData);
    
    setUser(userData);
    setCurrentUser(userData);
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userData.name}!`,
    });
    
    // Refresh the list of all users
    getAllUserData();
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
    allUsers,
    getAllUserData,
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
