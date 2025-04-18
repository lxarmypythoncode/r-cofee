
// Reservation data types and service to integrate with Supabase

import { supabase } from '@/integrations/supabase/client';

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
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
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
    paymentStatus: 'paid',
    paymentAmount: 50,
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
    paymentStatus: 'pending',
    paymentAmount: 80,
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
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'paymentAmount'>): Promise<Reservation> => {
  // Calculate payment amount based on guests ($20 per guest)
  const paymentAmount = reservationData.guests * 20;
  
  const newReservation: Reservation = {
    ...reservationData,
    id: reservations.length + 1,
    status: 'pending',
    paymentStatus: 'pending',
    paymentAmount,
    createdAt: new Date().toISOString()
  };
  
  try {
    // First try to insert into Supabase
    const { data, error } = await supabase.from('reservations').insert({
      user_id: reservationData.userId.toString(),
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      table_id: reservationData.tableId,
      special_requests: reservationData.specialRequests,
      status: 'pending'
    }).select('*').single();
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      // Fall back to local storage if Supabase fails
      reservations.push(newReservation);
      return newReservation;
    }
    
    console.log('Data saved to Supabase:', data);
    
    // Also insert a payment record
    const { data: paymentData, error: paymentError } = await supabase.from('payments').insert({
      reservation_id: data.id,
      user_id: reservationData.userId.toString(),
      amount: paymentAmount,
      status: 'pending'
    });
    
    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
    }
    
    // Map the Supabase data to our local format and return
    const supabaseReservation: Reservation = {
      id: data.id,
      userId: parseInt(data.user_id),
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      tableId: data.table_id,
      specialRequests: data.special_requests,
      status: data.status,
      paymentStatus: 'pending',
      paymentAmount: paymentAmount,
      createdAt: data.created_at
    };
    
    return supabaseReservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    // Fall back to local storage
    reservations.push(newReservation);
    return newReservation;
  }
};

// Get all reservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase.from('reservations').select(`
      *,
      payments (
        id,
        amount,
        status
      )
    `);
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return [...reservations];
    }
    
    if (data && data.length > 0) {
      console.log('Reservations loaded from Supabase:', data);
      
      // Map Supabase data to our local format
      const formattedReservations: Reservation[] = data.map(item => ({
        id: item.id,
        userId: parseInt(item.user_id),
        name: item.name,
        email: item.email,
        phone: item.phone,
        date: item.date,
        time: item.time,
        guests: item.guests,
        tableId: item.table_id,
        specialRequests: item.special_requests,
        status: item.status,
        paymentStatus: item.payments && item.payments[0] ? item.payments[0].status : 'pending',
        paymentAmount: item.payments && item.payments[0] ? item.payments[0].amount : item.guests * 20,
        createdAt: item.created_at
      }));
      
      return formattedReservations;
    }
    
    // Fall back to local storage if no data in Supabase
    return [...reservations];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [...reservations];
  }
};

// Get user reservations
export const getUserReservations = async (userId: number): Promise<Reservation[]> => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase.from('reservations')
      .select(`
        *,
        payments (
          id,
          amount,
          status
        )
      `)
      .eq('user_id', userId.toString());
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return reservations.filter(r => r.userId === userId);
    }
    
    if (data && data.length > 0) {
      console.log('User reservations loaded from Supabase:', data);
      
      // Map Supabase data to our local format
      const formattedReservations: Reservation[] = data.map(item => ({
        id: item.id,
        userId: parseInt(item.user_id),
        name: item.name,
        email: item.email,
        phone: item.phone,
        date: item.date,
        time: item.time,
        guests: item.guests,
        tableId: item.table_id,
        specialRequests: item.special_requests,
        status: item.status,
        paymentStatus: item.payments && item.payments[0] ? item.payments[0].status : 'pending',
        paymentAmount: item.payments && item.payments[0] ? item.payments[0].amount : item.guests * 20,
        createdAt: item.created_at
      }));
      
      return formattedReservations;
    }
    
    // Fall back to local storage if no data in Supabase
    return reservations.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return reservations.filter(r => r.userId === userId);
  }
};

// Update reservation status
export const updateReservationStatus = async (id: number, status: Reservation['status']): Promise<Reservation> => {
  try {
    // Try to update in Supabase first
    const { data, error } = await supabase.from('reservations')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        payments (
          id,
          amount,
          status
        )
      `)
      .single();
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      
      // Fall back to local storage
      const index = reservations.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Reservation not found');
      }
      
      reservations[index] = {
        ...reservations[index],
        status
      };
      
      return reservations[index];
    }
    
    // Map the Supabase data to our local format
    const updatedReservation: Reservation = {
      id: data.id,
      userId: parseInt(data.user_id),
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      tableId: data.table_id,
      specialRequests: data.special_requests,
      status: data.status,
      paymentStatus: data.payments && data.payments[0] ? data.payments[0].status : 'pending',
      paymentAmount: data.payments && data.payments[0] ? data.payments[0].amount : data.guests * 20,
      createdAt: data.created_at
    };
    
    return updatedReservation;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    
    // Fall back to local storage
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    
    reservations[index] = {
      ...reservations[index],
      status
    };
    
    return reservations[index];
  }
};

// Update payment status
export const updatePaymentStatus = async (id: number, paymentStatus: Reservation['paymentStatus']): Promise<Reservation> => {
  try {
    // First get the reservation with its payment
    const { data: reservationData, error: reservationError } = await supabase.from('reservations')
      .select(`
        *,
        payments (
          id
        )
      `)
      .eq('id', id)
      .single();
    
    if (reservationError) {
      console.error('Error fetching reservation:', reservationError);
      
      // Fall back to local storage
      const index = reservations.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Reservation not found');
      }
      
      reservations[index] = {
        ...reservations[index],
        paymentStatus
      };
      
      return reservations[index];
    }
    
    // Update the payment status
    const paymentId = reservationData.payments && reservationData.payments[0] ? 
      reservationData.payments[0].id : null;
    
    if (paymentId) {
      // If we have a payment record, update it
      const { error: updateError } = await supabase.from('payments')
        .update({ status: paymentStatus })
        .eq('id', paymentId);
      
      if (updateError) {
        console.error('Error updating payment:', updateError);
      }
    } else {
      // If no payment record exists, create one
      const { error: insertError } = await supabase.from('payments').insert({
        reservation_id: id,
        user_id: reservationData.user_id,
        amount: reservationData.guests * 20,
        status: paymentStatus
      });
      
      if (insertError) {
        console.error('Error creating payment:', insertError);
      }
    }
    
    // Get the updated reservation
    const { data, error } = await supabase.from('reservations')
      .select(`
        *,
        payments (
          id,
          amount,
          status
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching updated reservation:', error);
      
      // Fall back to local storage
      const index = reservations.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Reservation not found');
      }
      
      reservations[index] = {
        ...reservations[index],
        paymentStatus
      };
      
      return reservations[index];
    }
    
    // Map the Supabase data to our local format
    const updatedReservation: Reservation = {
      id: data.id,
      userId: parseInt(data.user_id),
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      tableId: data.table_id,
      specialRequests: data.special_requests,
      status: data.status,
      paymentStatus: data.payments && data.payments[0] ? data.payments[0].status : paymentStatus,
      paymentAmount: data.payments && data.payments[0] ? data.payments[0].amount : data.guests * 20,
      createdAt: data.created_at
    };
    
    return updatedReservation;
  } catch (error) {
    console.error('Error updating payment status:', error);
    
    // Fall back to local storage
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    
    reservations[index] = {
      ...reservations[index],
      paymentStatus
    };
    
    return reservations[index];
  }
};

// Get payment reports (for super_admin only)
export const getPaymentReports = async (): Promise<Reservation[]> => {
  try {
    // First try to use the payment_reports view
    const { data, error } = await supabase.from('payment_reports').select('*');
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return [...reservations];
    }
    
    if (data && data.length > 0) {
      console.log('Payment reports loaded from Supabase:', data);
      
      // Map Supabase data to our local format
      const formattedReports: Reservation[] = data.map(item => ({
        id: item.reservation_id,
        userId: parseInt(item.user_id),
        name: item.customer_name,
        email: '', // Not available in the view
        phone: '', // Not available in the view
        date: item.reservation_date,
        time: item.reservation_time,
        guests: 0, // Not available in the view
        tableId: 0, // Not available in the view
        status: 'confirmed', // Default status
        paymentStatus: item.status,
        paymentAmount: item.amount,
        createdAt: item.created_at
      }));
      
      return formattedReports;
    }
    
    // Fall back to local storage if no data in Supabase
    return [...reservations];
  } catch (error) {
    console.error('Error fetching payment reports:', error);
    return [...reservations];
  }
};

// Cancel a reservation
export const cancelReservation = async (id: number): Promise<Reservation> => {
  return updateReservationStatus(id, 'cancelled');
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
