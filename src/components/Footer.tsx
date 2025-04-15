
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Mail, Coffee, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-coffee-dark text-cream pt-12 pb-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="h-6 w-6" />
            <span className="font-serif text-xl font-bold">R-Coffee</span>
          </div>
          <p className="mb-4">Experience the perfect blend of comfort and taste at R-Coffee, where every cup tells a story.</p>
          <div className="flex gap-4">
            <a href="https://instagram.com" aria-label="Instagram" className="text-cream hover:text-cream/80 transition">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="text-cream hover:text-cream/80 transition">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-cream hover:text-cream/80 transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">Opening Hours</h3>
          <div className="flex items-start gap-2 mb-3">
            <Clock className="h-5 w-5 mt-0.5" />
            <div>
              <p>Monday - Friday: 7:00 AM - 8:00 PM</p>
              <p>Saturday - Sunday: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
          <h3 className="font-serif text-lg font-semibold mb-4 mt-6">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/menu" className="hover:underline">Menu</Link>
            <Link to="/reservation" className="hover:underline">Reservations</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-5 w-5 mt-0.5" />
            <p>123 Coffee Street, Espresso City, 10001</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5" />
            <p>(555) 123-4567</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <p>info@r-coffee.com</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-cream/20">
        <p className="text-center text-sm">© {new Date().getFullYear()} R-Coffee. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
