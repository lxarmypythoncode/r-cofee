
// User authentication and roles management

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'cashier' | 'admin';
  createdAt: string;
}

// Sample users for demo purposes
const users: User[] = [
  {
    id: 1,
    email: 'admin@rcoffee.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'cashier@rcoffee.com',
    name: 'Cashier User',
    role: 'cashier',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    email: 'customer@example.com',
    name: 'Customer',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];

// Authentication functions
export const authenticateUser = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    // In a real app, we would check password hash
    // For demo, we'll just check if email exists and return the user
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      resolve(user || null);
    }, 500);
  });
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Set current user to localStorage
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Register a new user
export const registerUser = (email: string, name: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: users.length + 1,
        email,
        name,
        role: 'customer', // Default role for new users
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

// Check if user has required role
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};
