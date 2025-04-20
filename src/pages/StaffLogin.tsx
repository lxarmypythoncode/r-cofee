import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Coffee, Key, ArrowLeft, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const StaffLogin = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('super_admin@rcoffee.com');
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
      // Delete existing users and reset data
      const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        throw fetchError;
      }

      for (const user of users) {
        await supabase.auth.admin.deleteUser(user.id);
      }

      // Re-create default users if needed
      toast({
        title: "Data Reset",
        description: "All user data has been reset.",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check profile status after successful login
      if (profile?.role === 'cashier' && profile?.status === 'pending') {
        setIsPendingCashier(true);
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      if (['admin', 'cashier', 'super_admin'].includes(profile?.role || '')) {
        navigate('/dashboard');
      } else {
        setLoginError("Invalid credentials or insufficient permissions");
        toast({
          title: "Login Failed",
          description: "Invalid credentials or insufficient permissions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login");
      toast({
        title: "Error",
        description: "An error occurred during login",
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
                placeholder="staff@rcoffee.com"
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
              Super admin login: super_admin@rcoffee.com / password: admin123
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
