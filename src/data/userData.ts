
// User authentication and roles management

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'cashier' | 'admin' | 'super_admin';
  status?: 'pending' | 'approved';
  createdAt: string;
}

// Sample users for demo purposes
const users: User[] = [
  {
    id: 1,
    email: 'super_admin@rcoffee.com',
    name: 'Super Admin',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'admin@rcoffee.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    email: 'cashier@rcoffee.com',
    name: 'Cashier User',
    role: 'cashier',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
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
export const registerUser = (email: string, name: string, password: string, role: 'cashier' | 'customer' = 'customer'): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: users.length + 1,
        email,
        name,
        role,
        status: role === 'cashier' ? 'pending' : undefined,
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

// Get all users with a specific role
export const getUsersByRole = (role: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredUsers = users.filter(user => user.role === role);
      resolve(filteredUsers);
    }, 500);
  });
};

// Get pending user registrations
export const getPendingUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingUsers = users.filter(user => user.status === 'pending');
      resolve(pendingUsers);
    }, 500);
  });
};

// Approve user registration
export const approveUser = (userId: number): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = 'approved';
        resolve(users[userIndex]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Delete user
export const deleteUser = (userId: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
