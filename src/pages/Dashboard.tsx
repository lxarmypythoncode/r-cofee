
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hasRole } from '@/data/userData';
import ReservationsTab from '@/components/dashboard/ReservationsTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import SuperAdminTab from '@/components/dashboard/SuperAdminTab';
import OrdersTab from '@/components/dashboard/OrdersTab';
import { Clock, Bell, Settings, ShieldCheck, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const navigate = useNavigate();

  // If not logged in or not an admin/cashier/super_admin, redirect to login
  if (!isLoading && (!user || !(hasRole(user, ['admin', 'cashier', 'super_admin'])))) {
    return <Navigate to="/login" />;
  }

  // Loading state
  if (isLoading) {
    return <div className="container mx-auto py-12 text-center">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <p className="text-sm text-coffee-light capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="reservations" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="reservations" className="flex gap-2">
                <Clock className="h-4 w-4" />
                <span>Reservations</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="settings" className="flex gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              )}
              {user?.role === 'super_admin' && (
                <TabsTrigger value="super_admin" className="flex gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Super Admin</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="reservations">
              <ReservationsTab userRole={user?.role} />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTab userRole={user?.role} />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsTab userRole={user?.role} />
            </TabsContent>
            
            {user?.role === 'admin' && (
              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
            )}
            
            {user?.role === 'super_admin' && (
              <TabsContent value="super_admin">
                <SuperAdminTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
