
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  status: 'read' | 'unread';
  created_at: string;
}

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return (data || []).map(notification => ({
    ...notification,
    status: notification.status as 'read' | 'unread'
  }));
};

export const markNotificationAsRead = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ status: 'read' })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('notifications')
    .insert(notification);

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
