
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const SettingsTab = () => {
  // This is a placeholder component for settings that only the admin can access
  const [storeName, setStoreName] = useState('R-Coffee');
  const [storeAddress, setStoreAddress] = useState('123 Coffee Lane, Brewsville, CA 94321');
  const [storePhone, setStorePhone] = useState('(555) 123-4567');
  const [storeEmail, setStoreEmail] = useState('info@rcoffee.com');
  
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure the store information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input
                  id="storePhone"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
            </div>
            
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage staff and customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section would allow the admin to create and manage user accounts, 
            including assigning roles (admin, cashier, customer).
          </p>
          <p className="mt-2 text-muted-foreground">
            For this demo, this functionality is not implemented.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled>Manage Users</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsTab;
