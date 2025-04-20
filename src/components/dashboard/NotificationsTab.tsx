
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { getUserNotifications, createNotification, markNotificationAsRead, Notification } from '@/data/notificationsData';

interface NotificationsTabProps {
  userRole: string | undefined;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ userRole }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // Fetch all notifications - since we don't have a real user ID in this context
      // we're simulating fetching all notifications for admin users
      const allNotifications = await getUserNotifications('all');
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleSendTestNotification = async () => {
    try {
      if (!userRole) return;
      
      await createNotification({
        user_id: "1", // Test user ID
        title: "Test Notification",
        message: "This is a test notification sent by an admin.",
        type: "system",
        status: "unread"
      });
      
      toast({
        title: "Success",
        description: "Test notification sent",
      });
      
      fetchNotifications();
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {userRole === 'admin' && (
        <div className="flex justify-end">
          <Button onClick={handleSendTestNotification}>
            Send Test Notification
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>
            Manage notifications sent to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id} className={notification.status === 'unread' ? 'bg-blue-50' : ''}>
                      <TableCell>{format(new Date(notification.created_at), 'PP')}</TableCell>
                      <TableCell>{notification.user_id.substring(0, 8)}</TableCell>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell className="max-w-md truncate">{notification.message}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${notification.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {notification.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {notification.status === 'unread' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
