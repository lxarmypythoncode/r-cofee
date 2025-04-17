
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllOrders, updateOrderStatus, UserOrder } from '@/data/orderData';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Clock, Check, X, AlertTriangle } from 'lucide-react';

interface OrdersTabProps {
  userRole: string;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ userRole }) => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Order #${orderId} is now ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update order status",
        variant: "destructive",
      });
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            <span className="ml-1 bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Processing</span>
            <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
              {orders.filter(o => o.status === 'processing').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex gap-2">
            <Check className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex gap-2">
            <X className="h-4 w-4" />
            <span>Cancelled</span>
          </TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} orders found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <CardDescription>
                          {format(new Date(order.createdAt), 'PPP - h:mm a')}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <ul className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {order.status === 'pending' && (
                          <>
                            <Button 
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                              variant="default"
                              className="gap-2"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Start Processing
                            </Button>
                            <Button 
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              variant="outline"
                              className="gap-2 text-destructive"
                            >
                              <X className="h-4 w-4" />
                              Cancel Order
                            </Button>
                          </>
                        )}
                        
                        {order.status === 'processing' && (
                          <Button 
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            variant="default"
                            className="gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersTab;
