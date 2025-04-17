
// Order data to simulate database content

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface UserOrder {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

// Sample orders
let orders: UserOrder[] = [
  {
    id: 1,
    userId: 3,
    items: [
      { menuItemId: 1, name: "Espresso", price: 3.5, quantity: 2 },
      { menuItemId: 8, name: "Croissant", price: 3.5, quantity: 1 }
    ],
    total: 10.5,
    status: 'completed',
    createdAt: '2025-04-16T09:30:00.000Z'
  },
  {
    id: 2,
    userId: 3,
    items: [
      { menuItemId: 2, name: "Cappuccino", price: 4.5, quantity: 1 },
      { menuItemId: 9, name: "Blueberry Muffin", price: 3.75, quantity: 1 }
    ],
    total: 8.25,
    status: 'completed',
    createdAt: '2025-04-15T14:45:00.000Z'
  }
];

// Get orders for a user
export const getUserOrders = (userId: number): Promise<UserOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userOrders = orders
        .filter((order) => order.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(userOrders);
    }, 300);
  });
};

// Get all orders (for staff)
export const getAllOrders = (): Promise<UserOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      resolve(sortedOrders);
    }, 300);
  });
};

// Create a new order
export const createOrder = (orderData: Omit<UserOrder, 'id' | 'createdAt'>): Promise<UserOrder> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: UserOrder = {
        ...orderData,
        id: orders.length + 1,
        createdAt: new Date().toISOString()
      };
      
      orders.unshift(newOrder);
      resolve(newOrder);
    }, 500);
  });
};

// Update order status
export const updateOrderStatus = (
  orderId: number, 
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
): Promise<UserOrder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((order) => order.id === orderId);
      
      if (orderIndex === -1) {
        reject(new Error('Order not found'));
        return;
      }
      
      const updatedOrder = {
        ...orders[orderIndex],
        status
      };
      
      orders[orderIndex] = updatedOrder;
      resolve(updatedOrder);
    }, 300);
  });
};
