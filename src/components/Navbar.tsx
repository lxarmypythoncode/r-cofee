
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsMenu from '@/components/NotificationsMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const handleLoginClick = () => {
    navigate('/staff-login');
  };
  
  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };
  
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  // Only show staff login/logout options
  const showStaffAuth = user?.role === 'admin' || user?.role === 'cashier';

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-coffee" />
          <span className="font-serif text-xl font-bold text-coffee">R-Coffee</span>
        </Link>

        {isMobile ? (
          <>
            <div className="flex items-center gap-3">
              {showStaffAuth && user && <NotificationsMenu />}
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {mobileMenuOpen && (
              <div className="fixed inset-0 top-16 bg-white z-40 p-5">
                <div className="flex flex-col gap-4 text-center">
                  <Link 
                    to="/" 
                    className="py-2 px-4 text-coffee hover:bg-coffee/5 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/menu" 
                    className="py-2 px-4 text-coffee hover:bg-coffee/5 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Menu
                  </Link>
                  <Link 
                    to="/reservation" 
                    className="py-2 px-4 text-coffee hover:bg-coffee/5 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reserve a Table
                  </Link>
                  <Link 
                    to="/contact" 
                    className="py-2 px-4 text-coffee hover:bg-coffee/5 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  
                  {showStaffAuth && (
                    <>
                      {user && (
                        <>
                          <Link 
                            to="/dashboard" 
                            className="py-2 px-4 text-coffee hover:bg-coffee/5 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Button 
                            variant="ghost" 
                            className="w-full flex gap-2 items-center justify-center"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleLogoutClick();
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </Button>
                        </>
                      )}
                      {!user && (
                        <Button 
                          variant="ghost" 
                          className="w-full flex gap-2 items-center justify-center"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLoginClick();
                          }}
                        >
                          <User className="h-4 w-4" />
                          <span>Staff Login</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/" className="font-medium text-coffee hover:text-coffee-dark transition">
              Home
            </Link>
            <Link to="/menu" className="font-medium text-coffee hover:text-coffee-dark transition">
              Our Menu
            </Link>
            <Link to="/reservation" className="font-medium text-coffee hover:text-coffee-dark transition">
              Reserve a Table
            </Link>
            <Link to="/contact" className="font-medium text-coffee hover:text-coffee-dark transition">
              Contact
            </Link>
            
            {showStaffAuth && user && <NotificationsMenu />}
            
            {showStaffAuth && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Staff Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardClick}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogoutClick}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleLoginClick} className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Staff Login</span>
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
