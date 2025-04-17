
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMenuItems, MenuItem } from '@/data/menuData';
import { createOrder, getUserOrders, UserOrder } from '@/data/orderData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Check, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CustomerOrderTabProps {
  userId: number;
}

const CustomerOrderTab: React.FC<CustomerOrderTabProps> = ({ userId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('coffee');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    };
    
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    
    fetchMenuItems();
    fetchOrders();
  }, [userId]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.item.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your order`,
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity: newQuantity } 
          : cartItem
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    );
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your order",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const orderItems = cart.map(cartItem => ({
        menuItemId: cartItem.item.id,
        name: cartItem.item.name,
        price: cartItem.item.price,
        quantity: cartItem.quantity
      }));
      
      const newOrder = await createOrder({
        userId,
        items: orderItems,
        total: calculateTotal(),
        status: 'pending'
      });
      
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCart([]);
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been sent to the kitchen",
      });
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
            <CardDescription>
              Select items to add to your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="coffee" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-4">
                <TabsTrigger value="coffee">Coffee</TabsTrigger>
                <TabsTrigger value="tea">Tea</TabsTrigger>
                <TabsTrigger value="pastry">Pastries</TabsTrigger>
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dessert">Desserts</TabsTrigger>
              </TabsList>
              
              <TabsContent value={selectedCategory}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMenuItems.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <Button 
                          onClick={() => addToCart(item)} 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full"
                        >
                          Add to Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              View your previous orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No previous orders. Your order history will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">Order #{order.id}</h3>
                          {getStatusIcon(order.status)}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), 'PPP - h:mm a')}
                        </p>
                      </div>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 border-t pt-3">
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Your Order</span>
            </CardTitle>
            <CardDescription>
              Review your current order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Your cart is empty. Add items from the menu.
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(cartItem => (
                  <div key={cartItem.item.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="font-medium">{cartItem.item.name}</h4>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{cartItem.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(cartItem.item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col">
            <div className="w-full flex justify-between py-4 font-medium">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <Button 
              className="w-full" 
              disabled={cart.length === 0 || isLoading}
              onClick={handleSubmitOrder}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CustomerOrderTab;
