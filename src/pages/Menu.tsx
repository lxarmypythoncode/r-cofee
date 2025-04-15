
import React, { useState, useEffect } from 'react';
import { getMenuItems, MenuItem } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  // Group menu items by category
  const coffeeItems = menuItems.filter(item => item.category === 'coffee');
  const teaItems = menuItems.filter(item => item.category === 'tea');
  const pastryItems = menuItems.filter(item => item.category === 'pastry');
  const breakfastItems = menuItems.filter(item => item.category === 'breakfast');
  const lunchItems = menuItems.filter(item => item.category === 'lunch');
  const dessertItems = menuItems.filter(item => item.category === 'dessert');
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-coffee-dark text-white py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-cream/90">
              Discover our carefully crafted selection of premium coffee, teas, and delicious food items
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee"></div>
          </div>
        ) : (
          <Tabs defaultValue="coffee" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white">
                <TabsTrigger value="coffee">Coffee</TabsTrigger>
                <TabsTrigger value="tea">Tea</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Coffee Tab */}
            <TabsContent value="coffee" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Coffee Selection</h2>
                <p className="text-coffee max-w-2xl mx-auto">Our signature coffee drinks are crafted with premium, ethically sourced beans</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffeeItems.map((item) => (
                  <div key={item.id} className="menu-card group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                        <span className="text-coffee font-medium">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-espresso/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Tea Tab */}
            <TabsContent value="tea" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Tea Selection</h2>
                <p className="text-coffee max-w-2xl mx-auto">Our premium loose leaf teas are sourced from the finest tea gardens around the world</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teaItems.map((item) => (
                  <div key={item.id} className="menu-card group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                        <span className="text-coffee font-medium">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-espresso/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Food Tab */}
            <TabsContent value="food" className="space-y-8">
              {/* Breakfast Section */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Breakfast</h2>
                  <p className="text-coffee max-w-2xl mx-auto">Start your day with our delicious breakfast options</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {breakfastItems.map((item) => (
                    <div key={item.id} className="menu-card group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                          <span className="text-coffee font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-espresso/80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Lunch Section */}
              <div>
                <div className="text-center mb-8 mt-12">
                  <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Lunch</h2>
                  <p className="text-coffee max-w-2xl mx-auto">Enjoy our hearty lunch options made with fresh ingredients</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lunchItems.map((item) => (
                    <div key={item.id} className="menu-card group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                          <span className="text-coffee font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-espresso/80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pastries & Desserts Section */}
              <div>
                <div className="text-center mb-8 mt-12">
                  <h2 className="font-serif text-3xl text-coffee-dark font-bold mb-2">Pastries & Desserts</h2>
                  <p className="text-coffee max-w-2xl mx-auto">Indulge in our freshly baked pastries and irresistible desserts</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...pastryItems, ...dessertItems].map((item) => (
                    <div key={item.id} className="menu-card group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-coffee-dark">{item.name}</h3>
                          <span className="text-coffee font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-espresso/80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* CTA Section */}
      <div className="bg-coffee-dark text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-4">Enjoyed Our Menu?</h2>
            <p className="mb-8">Visit us in person and experience our delicious offerings in our cozy atmosphere.</p>
            <Button asChild size="lg" className="bg-cream text-coffee-dark hover:bg-cream/90">
              <a href="/reservation">Reserve a Table</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
