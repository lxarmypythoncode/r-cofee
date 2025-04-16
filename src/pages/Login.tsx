
import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateUser } from '@/data/userData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Coffee } from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const user = await authenticateUser(email, password);
      
      if (user) {
        login(user);
        
        // Redirect based on role
        if (user.role === 'admin' || user.role === 'cashier') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials for quick testing
  const loginAsAdmin = () => {
    setEmail('admin@rcoffee.com');
    setPassword('password');
  };

  const loginAsCashier = () => {
    setEmail('cashier@rcoffee.com');
    setPassword('password');
  };

  const loginAsCustomer = () => {
    setEmail('customer@example.com');
    setPassword('password');
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Coffee className="h-12 w-12 text-coffee mb-2" />
          <h1 className="font-serif text-3xl font-bold text-coffee">R-Coffee</h1>
          <h2 className="text-xl font-semibold mb-6">Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-coffee underline hover:text-coffee-dark">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-center text-sm text-muted-foreground mb-3">Demo Accounts:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={loginAsAdmin}>Admin</Button>
            <Button variant="outline" size="sm" onClick={loginAsCashier}>Cashier</Button>
            <Button variant="outline" size="sm" onClick={loginAsCustomer}>Customer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
