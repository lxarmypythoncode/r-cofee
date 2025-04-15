
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-coffee" />
          <span className="font-serif text-xl font-bold text-coffee">R-Coffee</span>
        </Link>

        {isMobile ? (
          <>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
