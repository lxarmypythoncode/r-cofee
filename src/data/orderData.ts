
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface UserOrder {
  id: number;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export const getUserOrders = async (userId: string): Promise<UserOrder[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }

  return (data || []).map(order => ({
    ...order,
    userId: order.user_id,
    createdAt: order.created_at,
  }));
};

export const getAllOrders = async (): Promise<UserOrder[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }

  return (data || []).map(order => ({
    ...order,
    userId: order.user_id,
    createdAt: order.created_at,
  }));
};

export const createOrder = async (orderData: Omit<UserOrder, 'id' | 'createdAt'>): Promise<UserOrder> => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: orderData.status,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return {
    ...data,
    userId: data.user_id,
    createdAt: data.created_at,
  };
};

export const updateOrderStatus = async (
  orderId: number, 
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
): Promise<UserOrder> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return {
    ...data,
    userId: data.user_id,
    createdAt: data.created_at,
  };
};
