import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast';
import { getAllUsers } from '@/data/userData';
import { createNotification } from '@/data/notificationsData';
import { User } from '@/data/userData';

const NotificationsTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, []);

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Validate form
      if (!selectedUser || !notificationTitle.trim() || !notificationMessage.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      // Create the notification
      await createNotification({
        user_id: selectedUser,
        title: notificationTitle,
        message: notificationMessage,
        type: 'admin',
        status: 'unread'
      });

      // Reset form and show success message
      setSelectedUser('');
      setNotificationTitle('');
      setNotificationMessage('');
      setIsSending(false);
      
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      setIsSending(false);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
        <CardDescription>
          Send a notification to a specific user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={sendNotification} className="space-y-4">
          <div>
            <Label htmlFor="user">Select User</Label>
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label htmlFor="message">Notification Message</Label>
            <Input
              id="message"
              type="text"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter message"
            />
          </div>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
