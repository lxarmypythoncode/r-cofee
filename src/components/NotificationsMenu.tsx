
import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUserNotifications, markNotificationAsRead, Notification } from '@/data/notificationsData';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsMenu = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          // Ensure we're passing a string
          const userNotifications = await getUserNotifications(String(user.id));
          setNotifications(userNotifications);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };

    fetchNotifications();
    
    // Periodically check for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationClick = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read' } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  if (!user) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted ${notification.status === 'unread' ? 'bg-blue-50' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
