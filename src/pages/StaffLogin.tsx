
import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Coffee, ArrowLeft, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const StaffLogin = () => {
  const { user, profile, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com'); // Changed default email
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPendingCashier, setIsPendingCashier] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const resetData = async () => {
    try {
      // For now, just show a notification as we can't directly manage Supabase users
      toast({
        title: "Note",
        description: "This would reset data in a real application.",
      });
    } catch (error) {
      console.error('Reset data error:', error);
      toast({
        title: "Error",
        description: "Failed to reset data",
        variant: "destructive",
      });
    }
  };

  const createSuperAdmin = async () => {
    setIsLoading(true);
    try {
      // Create super admin user through sign up with a valid email domain
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@example.com', // Changed to a more universally accepted domain
        password: 'admin123',
        options: {
          data: {
            name: 'Super Admin',
            role: 'super_admin'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Super Admin Created",
        description: "Super admin account has been created. Please check the email for verification if required.",
      });
    } catch (error) {
      console.error("Create super admin error:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating super admin. Please try with a different email address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsPendingCashier(false);
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Login successful - redirect happens via the useAuth hook when user state changes
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "An error occurred during login");
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or insufficient permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPendingCashier) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="h-12 w-12 text-orange-500 mb-2" />
            <h1 className="font-serif text-3xl font-bold text-coffee">R-Coffee</h1>
            <h2 className="text-xl font-semibold mb-2">Account Pending Approval</h2>
          </div>
          
          <Alert className="mb-6">
            <AlertDescription>
              Your cashier account has been registered but is still pending approval from a super admin.
              You will be able to log in once your account is approved.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button onClick={() => setIsPendingCashier(false)} className="w-full">
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Coffee className="h-12 w-12 text-coffee mb-2" />
          <h1 className="font-serif text-3xl font-bold text-coffee">R-Coffee</h1>
          <h2 className="text-xl font-semibold mb-2">Staff Login</h2>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Access restricted to authorized staff members
          </p>
        </div>

        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-2">
              Super admin login: admin@example.com / password: admin123
            </p>
            
            <div className="flex justify-between mt-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetData} 
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Reset Data</span>
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={createSuperAdmin} 
                  className="flex items-center gap-1"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Create Super Admin</span>
                </Button>
                
                <Link to="/cashier-register" className="text-sm text-coffee hover:underline flex items-center">
                  Register as cashier
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
