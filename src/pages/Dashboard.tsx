
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hasRole } from '@/data/userData';
import ReservationsTab from '@/components/dashboard/ReservationsTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import { Clock, Bell, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');

  // If not logged in or not an admin/cashier, redirect to login
  if (!isLoading && (!user || !(hasRole(user, ['admin', 'cashier'])))) {
    return <Navigate to="/login" />;
  }

  // Loading state
  if (isLoading) {
    return <div className="container mx-auto py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/6">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          <div className="flex flex-col gap-2">
            <div className="px-3 py-2 rounded-md bg-coffee text-white">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-coffee-light capitalize">{user?.role}</p>
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
            </TabsList>
            
            <TabsContent value="reservations">
              <ReservationsTab userRole={user?.role} />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsTab userRole={user?.role} />
            </TabsContent>
            
            {user?.role === 'admin' && (
              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
