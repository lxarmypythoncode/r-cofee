// Notifications system

export interface Notification {
  id: string;  // Change from number to string to match usage
  userId: string;
  title: string;
  message: string;
  type: 'reservation' | 'order' | 'system';
  status: 'unread' | 'read';
  createdAt: string;
}

// Update the implementation to use string IDs
let notifications: Notification[] = [
  {
    id: '1',  // Ensure string ID
    userId: '3',
    title: 'Reservation Confirmed',
    message: 'Your reservation for 2 guests on Apr 18 at 7:00 PM has been confirmed.',
    type: 'reservation',
    status: 'unread',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '3',
    title: 'Special Offer',
    message: 'Enjoy 15% off on all premium coffee drinks this weekend!',
    type: 'system',
    status: 'unread',
    createdAt: new Date().toISOString(),
  },
];

// Modify functions to use string IDs
export const getUserNotifications = (userId: string): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = notifications.filter((n) => n.userId === userId);
      resolve(userNotifications);
    }, 300);
  });
};

export const markNotificationAsRead = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      notifications = notifications.map((n) => 
        n.id === id ? { ...n, status: 'read' } : n
      );
      resolve();
    }, 300);
  });
};

// Create a new notification
export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNotification: Notification = {
        ...notification,
        id: String(notifications.length + 1),
        createdAt: new Date().toISOString(),
      };
      notifications.push(newNotification);
      resolve(newNotification);
    }, 300);
  });
};
