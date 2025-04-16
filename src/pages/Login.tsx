
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Users, UserPlus } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const goToReservation = () => {
    navigate('/reservation');
  };

  const goToStaffLogin = () => {
    navigate('/staff-login');
  };

  const goToCashierRegister = () => {
    navigate('/cashier-register');
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <Coffee className="h-12 w-12 text-coffee mb-2" />
          <h1 className="font-serif text-3xl font-bold text-coffee">R-Coffee</h1>
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Please select an option to continue
          </p>
        </div>

        <div className="grid gap-4">
          <Button 
            onClick={goToReservation} 
            className="w-full h-14 bg-coffee hover:bg-coffee-dark"
          >
            <Users className="mr-2 h-5 w-5" />
            Make a Reservation
          </Button>
          
          <Button 
            onClick={goToStaffLogin} 
            variant="outline"
            className="w-full h-14"
          >
            <Coffee className="mr-2 h-5 w-5" />
            Staff Login
          </Button>

          <Button 
            onClick={goToCashierRegister} 
            variant="ghost"
            className="w-full h-14"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Register as Cashier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
