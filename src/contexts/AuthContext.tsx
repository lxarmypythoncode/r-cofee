import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser, getAllUsers } from '@/data/userData';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Set up auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === 'SIGNED_IN' && session?.user) {
          // If user signs in with Supabase but we don't have local user data,
          // we'll keep using our local system for now
          if (!storedUser) {
            // Here we could fetch user data from a Supabase profile table if needed
            console.log("User signed in with Supabase:", session.user);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          // If user signs out of Supabase, we'll sign them out locally too
          if (storedUser) {
            setUser(null);
            setCurrentUser(null);
          }
        }
      }
    );
    
    // Initialize Supabase auth session
    const initializeSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase session error:", error);
        } else if (data.session) {
          console.log("Found existing Supabase session:", data.session);
          // Here we could sync with our local auth if needed
        }
      } catch (err) {
        console.error("Error initializing Supabase auth:", err);
      }
    };
    
    initializeSupabase();
    
    // Load all users data
    getAllUserData();
    
    setIsLoading(false);
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (userData: User) => {
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
    
    // Try to sign in with Supabase if email and password are available
    // This is a basic integration - in a real app, you'd need to properly handle auth
    if (userData.email && userData.password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        });
        
        if (error) {
          console.error("Supabase login error:", error);
        } else {
          console.log("Supabase auth successful:", data);
        }
      } catch (err) {
        console.error("Error with Supabase login:", err);
      }
    }
    
    setUser(userData);
    setCurrentUser(userData);
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userData.name}!`,
    });
    
    // Refresh the list of all users
    getAllUserData();
  };

  const logout = async () => {
    // Also sign out from Supabase
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out from Supabase:", error);
      }
    } catch (err) {
      console.error("Supabase signout error:", err);
    }
    
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
