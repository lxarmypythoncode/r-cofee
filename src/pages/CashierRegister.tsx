
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '@/data/userData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Coffee, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const CashierRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register as a cashier with pending status
      await registerUser(email, name, password, 'cashier');
      
      toast({
        title: "Registration Pending",
        description: "Your account has been registered and is awaiting super admin approval.",
      });
      setIsRegistered(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="h-12 w-12 text-coffee mb-2" />
            <h1 className="font-serif text-3xl font-bold text-coffee">R-Coffee</h1>
            <h2 className="text-xl font-semibold mb-2">Registration Submitted</h2>
          </div>
          
          <Alert className="mb-6">
            <AlertDescription>
              Your cashier account has been registered successfully and is now pending approval from a super admin. 
              You will not be able to log in until your account is approved.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button onClick={() => navigate('/staff-login')} className="w-full">
              Return to Staff Login
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
          <h2 className="text-xl font-semibold mb-2">Cashier Registration</h2>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Register as a cashier. Your account will require super admin approval before you can log in.
          </p>
        </div>

        <Alert className="mb-4">
          <AlertDescription>
            After registration, a super admin must approve your account before you can log in.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cashier@example.com"
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
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Registering..." : "Register as Cashier"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/staff-login" className="text-coffee underline hover:text-coffee-dark">
              Staff Login
            </Link>
          </p>
          
          <div className="flex justify-center mt-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Main Menu</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierRegister;
