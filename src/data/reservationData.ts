
// Reservation data types and service to simulate database

export interface Table {
  id: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: number;
  specialRequests?: string;
  createdAt: string;
}

// Sample tables data
const tables: Table[] = [
  { id: 1, name: "Window Table 1", capacity: 2, isAvailable: true },
  { id: 2, name: "Window Table 2", capacity: 2, isAvailable: true },
  { id: 3, name: "Center Table 1", capacity: 4, isAvailable: true },
  { id: 4, name: "Center Table 2", capacity: 4, isAvailable: true },
  { id: 5, name: "Corner Booth 1", capacity: 6, isAvailable: true },
  { id: 6, name: "Corner Booth 2", capacity: 6, isAvailable: true },
  { id: 7, name: "Bar Seat 1", capacity: 1, isAvailable: true },
  { id: 8, name: "Bar Seat 2", capacity: 1, isAvailable: true },
  { id: 9, name: "Bar Seat 3", capacity: 1, isAvailable: true },
  { id: 10, name: "Bar Seat 4", capacity: 1, isAvailable: true },
];

// Sample reservations
let reservations: Reservation[] = [];

// Get available tables for a specific date and time
export const getAvailableTables = (date: string, time: string, guests: number): Promise<Table[]> => {
  return new Promise((resolve) => {
    // In a real implementation, we would check the database for tables that are not reserved at the given time
    setTimeout(() => {
      // Filter tables by capacity and availability
      const availableTables = tables.filter(table => 
        table.capacity >= guests && 
        !reservations.some(r => r.date === date && r.time === time && r.tableId === table.id)
      );
      resolve(availableTables);
    }, 300);
  });
};

// Create a new reservation
export const createReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReservation: Reservation = {
        ...reservationData,
        id: reservations.length + 1,
        createdAt: new Date().toISOString()
      };
      
      reservations.push(newReservation);
      console.log('New reservation created:', newReservation);
      resolve(newReservation);
    }, 500);
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
