
// Reservation data types and service to simulate database

export interface Table {
  id: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'finished' | 'cancelled';
  createdAt: string;
}

// Tables data (1-50)
const tables: Table[] = [
  // Tables for 2 people
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Table ${i + 1}`,
    capacity: 2,
    isAvailable: true
  })),
  
  // Tables for 4 people
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 16,
    name: `Table ${i + 16}`,
    capacity: 4,
    isAvailable: true
  })),
  
  // Tables for 6 people
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 36,
    name: `Table ${i + 36}`,
    capacity: 6,
    isAvailable: true
  })),
  
  // Tables for 8 people
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 46,
    name: `Table ${i + 46}`,
    capacity: 8,
    isAvailable: true
  }))
];

// Sample reservations
let reservations: Reservation[] = [
  {
    id: 1,
    userId: 3,
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    date: "2025-04-20",
    time: "7:00 PM",
    guests: 2,
    tableId: 1,
    status: 'confirmed',
    createdAt: "2025-04-10T12:00:00.000Z"
  },
  {
    id: 2,
    userId: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-987-6543",
    date: "2025-04-21",
    time: "6:30 PM",
    guests: 4,
    tableId: 16,
    status: 'pending',
    createdAt: "2025-04-11T10:30:00.000Z"
  }
];

// Get available tables for a specific date and time
export const getAvailableTables = (date: string, time: string, guests: number): Promise<Table[]> => {
  return new Promise((resolve) => {
    // In a real implementation, we would check the database for tables that are not reserved at the given time
    setTimeout(() => {
      // Filter tables by capacity and availability
      const availableTables = tables.filter(table => 
        table.capacity >= guests && 
        !reservations.some(r => r.date === date && r.time === time && r.tableId === table.id && r.status !== 'cancelled')
      );
      resolve(availableTables);
    }, 300);
  });
};

// Create a new reservation
export const createReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReservation: Reservation = {
        ...reservationData,
        id: reservations.length + 1,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      reservations.push(newReservation);
      console.log('New reservation created:', newReservation);
      resolve(newReservation);
    }, 500);
  });
};

// Get all reservations
export const getAllReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...reservations]);
    }, 300);
  });
};

// Get user reservations
export const getUserReservations = (userId: number): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userReservations = reservations.filter(r => r.userId === userId);
      resolve(userReservations);
    }, 300);
  });
};

// Update reservation status
export const updateReservationStatus = (id: number, status: Reservation['status']): Promise<Reservation> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = reservations.findIndex(r => r.id === id);
      if (index === -1) {
        reject(new Error('Reservation not found'));
        return;
      }
      
      reservations[index] = {
        ...reservations[index],
        status
      };
      
      resolve(reservations[index]);
    }, 300);
  });
};

// Get all time slots
export const getTimeSlots = (): string[] => {
  return [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM"
  ];
};

// Get the maximum guest capacity
export const getMaxGuestCapacity = (): number => {
  return Math.max(...tables.map(table => table.capacity));
};
