
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Clock, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-coffee-dark text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="block">Savor the Moment at</span>
              <span className="text-cream">R-Coffee</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-cream/90">
              Where every cup tells a story and every visit feels like coming home.
              Experience premium coffee and delicious food in a warm, inviting space.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-cream text-coffee-dark hover:bg-cream/90">
                <Link to="/menu">View Our Menu</Link>
              </Button>
              <Button asChild variant="outline" className="border-cream text-cream hover:bg-cream/10">
                <Link to="/reservation">Reserve a Table</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="bg-cream hero-pattern py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-4">Our Story</h2>
              <p className="text-espresso mb-4">
                Founded in 2015, R-Coffee began as a small corner café with a passion for quality coffee and community. 
                Today, we've grown into a beloved establishment that still maintains the warmth and personal touch that made us special from day one.
              </p>
              <p className="text-espresso mb-6">
                We source our beans directly from ethical farms around the world, and our culinary team crafts delicious food using local, seasonal ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-coffee mt-1" />
                  <div>
                    <h3 className="font-medium text-coffee-dark">Premium Quality</h3>
                    <p className="text-sm text-espresso">Only the finest ingredients</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Coffee className="h-5 w-5 text-coffee mt-1" />
                  <div>
                    <h3 className="font-medium text-coffee-dark">Master Baristas</h3>
                    <p className="text-sm text-espresso">Expert coffee crafters</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop" 
                  alt="R-Coffee interior" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mocha/20 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-coffee/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Featured Menu</h2>
            <p className="text-coffee max-w-2xl mx-auto">Discover our most loved coffee and food items that keep our customers coming back</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Menu Item 1 */}
            <div className="menu-card group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=2070&auto=format&fit=crop" 
                  alt="Cappuccino"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-coffee-dark">Cappuccino</h3>
                  <span className="text-coffee font-medium">$4.50</span>
                </div>
                <p className="text-sm text-espresso/80">Equal parts espresso, steamed milk, and milk foam.</p>
              </div>
            </div>
            
            {/* Menu Item 2 */}
            <div className="menu-card group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1603046891748-a640fd857a3b?q=80&w=1974&auto=format&fit=crop" 
                  alt="Avocado Toast"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-coffee-dark">Avocado Toast</h3>
                  <span className="text-coffee font-medium">$8.50</span>
                </div>
                <p className="text-sm text-espresso/80">Sourdough toast topped with avocado, cherry tomatoes, and feta.</p>
              </div>
            </div>
            
            {/* Menu Item 3 */}
            <div className="menu-card group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1974&auto=format&fit=crop" 
                  alt="Tiramisu"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-coffee-dark">Tiramisu</h3>
                  <span className="text-coffee font-medium">$7.00</span>
                </div>
                <p className="text-sm text-espresso/80">Coffee-soaked ladyfingers layered with mascarpone cream.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild className="bg-coffee hover:bg-coffee-dark">
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-coffee-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-4">Ready to Experience R-Coffee?</h2>
            <p className="mb-8">Reserve your table now and treat yourself to our exceptional coffee and food in our cozy atmosphere.</p>
            <Button asChild size="lg" className="bg-cream text-coffee-dark hover:bg-cream/90">
              <Link to="/reservation">Make a Reservation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hours */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-coffee/10">
              <Clock className="h-8 w-8 text-coffee mb-4" />
              <h3 className="font-serif text-xl font-medium text-coffee-dark mb-3">Opening Hours</h3>
              <p className="text-espresso mb-2">Monday - Friday: 7:00 AM - 8:00 PM</p>
              <p className="text-espresso">Saturday - Sunday: 8:00 AM - 9:00 PM</p>
            </div>
            
            {/* Location */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-coffee/10">
              <MapPin className="h-8 w-8 text-coffee mb-4" />
              <h3 className="font-serif text-xl font-medium text-coffee-dark mb-3">Location</h3>
              <p className="text-espresso mb-2">123 Coffee Street</p>
              <p className="text-espresso">Espresso City, 10001</p>
            </div>
            
            {/* Special */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-coffee/10">
              <Coffee className="h-8 w-8 text-coffee mb-4" />
              <h3 className="font-serif text-xl font-medium text-coffee-dark mb-3">Specialty</h3>
              <p className="text-espresso mb-2">Single-origin coffee beans</p>
              <p className="text-espresso">House-made pastries daily</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
