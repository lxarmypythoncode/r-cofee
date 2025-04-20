
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import { User } from '@/data/userData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isStaff: (user: User | null) => boolean;
  isSuperAdmin: (user: User | null) => boolean;
  isAdmin: (user: User | null) => boolean;
  isCashier: (user: User | null) => boolean;
  isCustomer: (user: User | null) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: supabaseUser, loading } = useSupabaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (error) throw error;

        if (data?.role === 'cashier' && data?.status !== 'approved') {
          await supabase.auth.signOut();
          setUser(null);
          toast({
            title: "Account Pending",
            description: "Your account requires approval from a super admin.",
            variant: "destructive",
          });
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getProfile();
  }, [supabaseUser]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  // Helper functions to check user roles
  const isStaff = (user: User | null): boolean => {
    if (!user) return false;
    return ['admin', 'cashier', 'super_admin'].includes(user.role);
  };

  const isSuperAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'super_admin';
  };

  const isAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin';
  };

  const isCashier = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'cashier';
  };

  const isCustomer = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'customer';
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        login,
        logout,
        isLoading: isLoading || loading,
        isStaff,
        isSuperAdmin,
        isAdmin,
        isCashier,
        isCustomer,
      }}
    >
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
