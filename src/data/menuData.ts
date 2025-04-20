
import { supabase } from '@/integrations/supabase/client';

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'coffee' | 'tea' | 'pastry' | 'breakfast' | 'lunch' | 'dessert';
};

// Export a local menuItems array for SuperAdminTab to use
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Espresso',
    description: 'Concentrated coffee served in a small, strong shot.',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04',
    category: 'coffee'
  },
  {
    id: 2,
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and milk foam.',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213',
    category: 'coffee'
  },
  // More mock items can be added as needed
];

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  // Ensure type safety by explicitly casting the category
  return (data || []).map(item => ({
    ...item,
    category: item.category as MenuItem['category']
  }));
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

  // Ensure type safety by explicitly casting the category
  return (data || []).map(item => ({
    ...item,
    category: item.category as MenuItem['category']
  }));
};
