
// Reservation data types and service to integrate with Supabase

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
export const getAvailableTables = async (date: string, time: string, guests: number): Promise<Table[]> => {
  try {
    // Try to get reservations from Supabase for this date and time
    const { data: existingReservations, error } = await supabase
      .from('reservations')
      .select('table_id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled');
    
    if (error) {
      console.error('Error fetching reservations from Supabase:', error);
      // Fall back to local storage
      const bookedTableIds = reservations
        .filter(r => r.date === date && r.time === time && r.status !== 'cancelled')
        .map(r => r.tableId);
      
      return tables.filter(table => 
        table.capacity >= guests && !bookedTableIds.includes(table.id)
      );
    }
    
    // If we successfully got data from Supabase
    const bookedTableIds = existingReservations?.map(r => r.table_id) || [];
    
    return tables.filter(table => 
      table.capacity >= guests && !bookedTableIds.includes(table.id)
    );
  } catch (error) {
    console.error('Error in getAvailableTables:', error);
    // Fall back to local data in case of any error
    const bookedTableIds = reservations
      .filter(r => r.date === date && r.time === time && r.status !== 'cancelled')
      .map(r => r.tableId);
    
    return tables.filter(table => 
      table.capacity >= guests && !bookedTableIds.includes(table.id)
    );
  }
};

// Create a new reservation
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'paymentAmount'>): Promise<Reservation> => {
  // Calculate payment amount based on guests ($20 per guest)
  const paymentAmount = reservationData.guests * 20;
  
  try {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('reservations')
      .insert({
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
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      // Fall back to local storage if Supabase fails
      const newReservation: Reservation = {
        ...reservationData,
        id: reservations.length + 1,
        status: 'pending',
        paymentStatus: 'pending',
        paymentAmount,
        createdAt: new Date().toISOString()
      };
      reservations.push(newReservation);
      return newReservation;
    }
    
    console.log('Reservation saved to Supabase:', data);
    
    // Also insert a payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: data.id,
        user_id: reservationData.userId.toString(),
        amount: paymentAmount,
        status: 'pending'
      });
    
    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
    }
    
    // Map the Supabase data to our local format
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
    const newReservation: Reservation = {
      ...reservationData,
      id: reservations.length + 1,
      status: 'pending',
      paymentStatus: 'pending',
      paymentAmount,
      createdAt: new Date().toISOString()
    };
    reservations.push(newReservation);
    return newReservation;
  }
};

// Get all reservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('reservations')
      .select('*');
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return [...reservations];
    }
    
    if (data && data.length > 0) {
      console.log('Reservations loaded from Supabase:', data);
      
      // Get payment data separately
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*');
      
      if (paymentError) {
        console.error('Error fetching payments:', paymentError);
      }
      
      const paymentsByReservation = (paymentData || []).reduce((acc: any, payment: any) => {
        acc[payment.reservation_id] = payment;
        return acc;
      }, {});
      
      // Map Supabase data to our local format
      const formattedReservations: Reservation[] = data.map((item: any) => {
        const payment = paymentsByReservation[item.id] || null;
        
        return {
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
          paymentStatus: payment ? payment.status : 'pending',
          paymentAmount: payment ? payment.amount : item.guests * 20,
          createdAt: item.created_at
        };
      });
      
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
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId.toString());
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return reservations.filter(r => r.userId === userId);
    }
    
    if (data && data.length > 0) {
      console.log('User reservations loaded from Supabase:', data);
      
      // Get payment data separately
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .in('reservation_id', data.map((r: any) => r.id));
      
      if (paymentError) {
        console.error('Error fetching payments:', paymentError);
      }
      
      const paymentsByReservation = (paymentData || []).reduce((acc: any, payment: any) => {
        acc[payment.reservation_id] = payment;
        return acc;
      }, {});
      
      // Map Supabase data to our local format
      const formattedReservations: Reservation[] = data.map((item: any) => {
        const payment = paymentsByReservation[item.id] || null;
        
        return {
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
          paymentStatus: payment ? payment.status : 'pending',
          paymentAmount: payment ? payment.amount : item.guests * 20,
          createdAt: item.created_at
        };
      });
      
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
    // Try to update in Supabase
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
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
    
    // Get payment data for this reservation
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', id)
      .maybeSingle();
    
    if (paymentError) {
      console.error('Error fetching payment for reservation:', paymentError);
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
      paymentStatus: paymentData ? paymentData.status : 'pending',
      paymentAmount: paymentData ? paymentData.amount : data.guests * 20,
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
    // First get the reservation
    const { data: reservationData, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
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
    
    // Get or create payment for this reservation
    let payment = null;
    const { data: existingPayment, error: paymentQueryError } = await supabase
      .from('payments')
      .select('*')
      .eq('reservation_id', id)
      .maybeSingle();
    
    if (paymentQueryError) {
      console.error('Error querying payment:', paymentQueryError);
    }
    
    if (existingPayment) {
      // Update existing payment
      const { data: updatedPayment, error: updateError } = await supabase
        .from('payments')
        .update({ status: paymentStatus })
        .eq('id', existingPayment.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating payment:', updateError);
      } else {
        payment = updatedPayment;
      }
    } else {
      // Create new payment
      const { data: newPayment, error: insertError } = await supabase
        .from('payments')
        .insert({
          reservation_id: id,
          user_id: reservationData.user_id,
          amount: reservationData.guests * 20,
          status: paymentStatus
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating payment:', insertError);
      } else {
        payment = newPayment;
      }
    }
    
    // Map the data to our local format
    const updatedReservation: Reservation = {
      id: reservationData.id,
      userId: parseInt(reservationData.user_id),
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      tableId: reservationData.table_id,
      specialRequests: reservationData.special_requests,
      status: reservationData.status,
      paymentStatus: payment ? payment.status : paymentStatus,
      paymentAmount: payment ? payment.amount : reservationData.guests * 20,
      createdAt: reservationData.created_at
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
    // Try to use the payment_reports view
    const { data, error } = await supabase
      .from('payment_reports')
      .select('*');
    
    if (error) {
      console.error('Supabase error - falling back to local storage:', error);
      return [...reservations];
    }
    
    if (data && data.length > 0) {
      console.log('Payment reports loaded from Supabase:', data);
      
      // Map Supabase data to our local format
      const formattedReports: Reservation[] = data.map((item: any) => ({
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
