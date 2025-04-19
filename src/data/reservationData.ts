
export interface Reservation {
  id: number;  // Keep as number for database consistency
  userId: string;
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
