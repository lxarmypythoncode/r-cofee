// User authentication and roles management

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'cashier' | 'admin' | 'super_admin';
  status?: 'pending' | 'approved';
  createdAt: string;
  password?: string; // Only used during registration, never stored in localStorage
}

// Initialize users from localStorage or use defaults
const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('rcoffee_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }

  // Default users if none in localStorage
  const defaultUsers: User[] = [
    {
      id: 1,
      email: 'super_admin@rcoffee.com',
      name: 'Super Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      password: 'admin123', // In a real app, we would never store plain text passwords
    },
    {
      id: 2,
      email: 'admin@rcoffee.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      password: 'admin123',
    },
    {
      id: 3,
      email: 'cashier@rcoffee.com',
      name: 'Cashier User',
      role: 'cashier',
      status: 'approved',
      createdAt: new Date().toISOString(),
      password: 'cashier123',
    },
    {
      id: 4,
      email: 'customer@example.com',
      name: 'Customer',
      role: 'customer',
      createdAt: new Date().toISOString(),
      password: 'customer123',
    },
  ];

  // Store default users
  localStorage.setItem('rcoffee_users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Get users from localStorage or initialize with defaults
let users = getInitialUsers();

// Function to save users to localStorage
const saveUsers = () => {
  const usersToSave = users.map(({ password, ...user }) => user); // Remove passwords before saving
  localStorage.setItem('rcoffee_users', JSON.stringify(usersToSave));
};

// Verify user credentials
export const verifyUser = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        // Return a copy without the password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Authentication functions
export const authenticateUser = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        // Return a copy without the password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
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
  return new Promise((resolve, reject) => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      reject(new Error('Email already in use'));
      return;
    }

    setTimeout(() => {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        email,
        name,
        role,
        password,
        status: role === 'cashier' ? 'pending' : undefined,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      saveUsers();
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      resolve(userWithoutPassword);
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
      const filteredUsers = users
        .filter(user => user.role === role)
        .map(({ password, ...user }) => user); // Remove passwords
      resolve(filteredUsers);
    }, 500);
  });
};

// Get pending user registrations
export const getPendingUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingUsers = users
        .filter(user => user.status === 'pending')
        .map(({ password, ...user }) => user); // Remove passwords
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
        saveUsers();
        const { password, ...userWithoutPassword } = users[userIndex];
        resolve(userWithoutPassword);
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
        saveUsers();
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Update user details
export const updateUser = (userId: number, updates: Partial<User>): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        // Don't allow changing role or id
        const { role, id, ...allowedUpdates } = updates;
        
        users[userIndex] = {
          ...users[userIndex],
          ...allowedUpdates,
        };
        
        saveUsers();
        
        // Return without password
        const { password, ...userWithoutPassword } = users[userIndex];
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Add a new user (for super admin only)
export const addUser = (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      reject(new Error('Email already in use'));
      return;
    }

    setTimeout(() => {
      const newUser: User = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      saveUsers();
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      resolve(userWithoutPassword);
    }, 500);
  });
};
