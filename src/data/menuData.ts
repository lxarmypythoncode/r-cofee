
import { supabase } from '@/integrations/supabase/client';

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'coffee' | 'tea' | 'pastry' | 'breakfast' | 'lunch' | 'dessert';
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  return data || [];
};

export const getMenuItemsByCategory = async (category: MenuItem['category']): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Error fetching menu items by category:', error);
    throw error;
  }

  return data || [];
};
