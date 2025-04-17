
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ShoppingBag, Calendar, User, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserNotifications, markNotificationAsRead, Notification } from '@/data/notificationsData';
import { format, parseISO } from 'date-fns';
import CustomerOrderTab from '@/components/dashboard/CustomerOrderTab';
import CustomerReservationsTab from '@/components/dashboard/CustomerReservationsTab';

const CustomerDashboard = () => {
  const { user, logout, isCustomer, allUsers, getAllUserData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // If not logged in or not a customer, redirect to login
    if (!user || !isCustomer(user)) {
      navigate('/login');
    }
  }, [user, isCustomer, navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const userNotifications = await getUserNotifications(user.id);
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => n.status === 'unread').length);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };

    fetchNotifications();
    // Check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Refresh user list when the component mounts or when activeTab changes to 'users'
  useEffect(() => {
    if (activeTab === 'users') {
      getAllUserData();
    }
  }, [activeTab, getAllUserData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (!user) {
    return <div className="container mx-auto py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="px-3 py-2 rounded-md bg-coffee text-white">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-coffee-light capitalize">Customer</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="orders" className="flex gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex gap-2">
                <Calendar className="h-4 w-4" />
                <span>My Reservations</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex gap-2 relative">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex gap-2">
                <Users className="h-4 w-4" />
                <span>All Users</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <CustomerOrderTab userId={user.id} />
            </TabsContent>
            
            <TabsContent value="reservations">
              <CustomerReservationsTab userId={user.id} />
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>My Notifications</CardTitle>
                  <CardDescription>
                    Stay updated with your reservations and special offers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications yet. We'll notify you about your reservations and special offers.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border rounded-md relative ${notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {notification.status === 'unread' && (
                            <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500"></div>
                          )}
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.createdAt), 'MMM dd, yyyy - h:mm a')}
                            </span>
                          </div>
                          <p className="mt-2 text-muted-foreground">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    View all registered users in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2 capitalize">{user.role.replace('_', ' ')}</td>
                            <td className="px-4 py-2 capitalize">{user.status || 'approved'}</td>
                            <td className="px-4 py-2">{format(new Date(user.createdAt), 'MMM dd, yyyy')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
