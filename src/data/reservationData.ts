
export interface Reservation {
  id: number;  // Keep as number for database consistency
  userId: string;  // Changed from number to string
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'finished' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  createdAt: string;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

// Mock data for reservations
let reservations: Reservation[] = [
  {
    id: 1,
    userId: "3",  // Changed from number to string
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    date: "2025-04-20",
    time: "7:00 PM",
    guests: 2,
    tableId: 4,
    specialRequests: "Window seat please",
    status: "confirmed",
    paymentStatus: "paid",
    paymentAmount: 40,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: "3",  // Changed from number to string
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    date: "2025-05-10",
    time: "6:30 PM",
    guests: 4,
    tableId: 7,
    status: "pending",
    paymentStatus: "pending",
    paymentAmount: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: "5",  // Changed from number to string
    name: "Sarah Smith",
    email: "sarah@example.com",
    phone: "555-987-6543",
    date: "2025-04-25",
    time: "8:00 PM",
    guests: 2,
    tableId: 3,
    status: "confirmed",
    paymentStatus: "paid",
    paymentAmount: 40,
    createdAt: new Date().toISOString()
  }
];

// Mock tables data
const tables: Table[] = [
  { id: 1, name: "Table 1", capacity: 2, isAvailable: true },
  { id: 2, name: "Table 2", capacity: 2, isAvailable: true },
  { id: 3, name: "Table 3", capacity: 2, isAvailable: false },
  { id: 4, name: "Table 4", capacity: 4, isAvailable: false },
  { id: 5, name: "Table 5", capacity: 4, isAvailable: true },
  { id: 6, name: "Table 6", capacity: 6, isAvailable: true },
  { id: 7, name: "Table 7", capacity: 6, isAvailable: false },
  { id: 8, name: "Table 8", capacity: 8, isAvailable: true },
];

// Get all reservations (for admin/staff)
export const getAllReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reservations);
    }, 300);
  });
};

// Get user reservations (for customer)
export const getUserReservations = (userId: string): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userReservations = reservations.filter(r => r.userId === userId);
      resolve(userReservations);
    }, 300);
  });
};

// Create a new reservation
export const createReservation = (data: Omit<Reservation, 'id' | 'status' | 'paymentStatus' | 'paymentAmount' | 'createdAt'>): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReservation: Reservation = {
        ...data,
        id: reservations.length + 1,
        status: 'pending',
        paymentStatus: 'pending',
        paymentAmount: data.guests * 20, // $20 per guest
        createdAt: new Date().toISOString()
      };
      
      reservations.push(newReservation);
      resolve(newReservation);
    }, 300);
  });
};

// Update reservation status
export const updateReservationStatus = (id: number, status: Reservation['status']): Promise<Reservation | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservationIndex = reservations.findIndex(r => r.id === id);
      
      if (reservationIndex === -1) {
        resolve(undefined);
        return;
      }
      
      const updatedReservation = {
        ...reservations[reservationIndex],
        status
      };
      
      reservations[reservationIndex] = updatedReservation;
      resolve(updatedReservation);
    }, 300);
  });
};

// Update payment status
export const updatePaymentStatus = (id: number, paymentStatus: Reservation['paymentStatus']): Promise<Reservation | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservationIndex = reservations.findIndex(r => r.id === id);
      
      if (reservationIndex === -1) {
        resolve(undefined);
        return;
      }
      
      const updatedReservation = {
        ...reservations[reservationIndex],
        paymentStatus
      };
      
      reservations[reservationIndex] = updatedReservation;
      resolve(updatedReservation);
    }, 300);
  });
};

// Cancel a reservation
export const cancelReservation = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservationIndex = reservations.findIndex(r => r.id === id);
      
      if (reservationIndex !== -1) {
        reservations[reservationIndex].status = 'cancelled';
      }
      
      resolve();
    }, 300);
  });
};

// Get available tables for the given date, time, and party size
export const getAvailableTables = (date: string, time: string, guests: number): Promise<Table[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application, this would check the database for conflicts
      // Here we're just simulating by returning some tables that can accommodate the party size
      const availableTables = tables.filter(
        table => table.isAvailable && table.capacity >= guests
      );
      resolve(availableTables);
    }, 300);
  });
};
