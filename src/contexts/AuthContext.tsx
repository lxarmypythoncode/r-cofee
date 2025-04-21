
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  profile: Tables<'profiles'> | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.role === 'cashier' && data?.status !== 'approved') {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          toast({
            title: "Account Pending",
            description: "Your account requires approval from a super admin.",
            variant: "destructive",
          });
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getProfile();
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // First check if this is the admin account that may need creation
      const isAdminAccount = email === 'admin@example.com' && password === 'admin123';
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error && isAdminAccount) {
        // If login fails for admin account, try to create it
        console.log("Trying to create admin account during login...");
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'admin123',
          options: {
            data: {
              name: 'Super Admin',
              role: 'super_admin'
            }
          }
        });
        
        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            // If it's already registered, this is likely another issue
            throw new Error("Admin account exists but login failed. Check your password.");
          } else {
            throw signUpError;
          }
        }
        
        // Try logging in again after creating
        const secondAttempt = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (secondAttempt.error) {
          throw secondAttempt.error;
        }
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = "Invalid email or password";
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. For super admin, try clicking 'Create Super Admin' first.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
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

  const isStaff = (user: User | null): boolean => {
    if (!user) return false;
    return profile?.role === 'admin' || profile?.role === 'cashier' || profile?.role === 'super_admin';
  };

  const isSuperAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return profile?.role === 'super_admin';
  };

  const isAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return profile?.role === 'admin';
  };

  const isCashier = (user: User | null): boolean => {
    if (!user) return false;
    return profile?.role === 'cashier';
  };

  const isCustomer = (user: User | null): boolean => {
    if (!user) return false;
    return profile?.role === 'customer';
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{
        user,
        profile,
        login,
        logout,
        isLoading,
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
