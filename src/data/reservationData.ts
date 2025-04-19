
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Table {
  id: number;
  name: string;
  capacity: number;
  is_available: boolean;
}

export interface Reservation {
  id: number;
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

// Get available tables for a specific date and time
export const getAvailableTables = async (date: string, time: string, guests: number): Promise<Table[]> => {
  try {
    // Get all tables that can accommodate the party size
    const { data: allTables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .gte('capacity', guests);

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return [];
    }

    // Get reserved tables for the given date and time
    const { data: reservedTables, error: reservationsError } = await supabase
      .from('reservations')
      .select('table_id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled');

    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      return [];
    }

    // Filter out reserved tables
    const reservedTableIds = reservedTables.map(r => r.table_id);
    return allTables.filter(table => !reservedTableIds.includes(table.id));
  } catch (error) {
    console.error('Error in getAvailableTables:', error);
    return [];
  }
};

// Create a new reservation
export const createReservation = async (data: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'paymentAmount'>): Promise<Reservation | null> => {
  try {
    // Calculate payment amount ($20 per guest)
    const paymentAmount = data.guests * 20;

    // Insert reservation
    const { data: newReservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        user_id: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        table_id: data.tableId,
        special_requests: data.specialRequests,
        status: 'pending'
      })
      .select()
      .single();

    if (reservationError) {
      console.error('Error creating reservation:', reservationError);
      return null;
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        reservation_id: newReservation.id,
        user_id: data.userId,
        amount: paymentAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment:', paymentError);
    }

    // Map the response to our interface
    return {
      id: newReservation.id,
      userId: newReservation.user_id,
      name: newReservation.name,
      email: newReservation.email,
      phone: newReservation.phone,
      date: newReservation.date,
      time: newReservation.time,
      guests: newReservation.guests,
      tableId: newReservation.table_id,
      specialRequests: newReservation.special_requests,
      status: newReservation.status as 'pending' | 'confirmed' | 'finished' | 'cancelled',
      paymentStatus: payment?.status as 'pending' | 'paid' | 'refunded' || 'pending',
      paymentAmount: payment?.amount || paymentAmount,
      createdAt: newReservation.created_at
    };
  } catch (error) {
    console.error('Error in createReservation:', error);
    return null;
  }
};

// Get user reservations
export const getUserReservations = async (userId: string | number): Promise<Reservation[]> => {
  try {
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select(`
        *,
        payments (
          status,
          amount
        )
      `)
      .eq('user_id', userId.toString());

    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      return [];
    }

    return reservations.map(reservation => ({
      id: reservation.id,
      userId: reservation.user_id,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      tableId: reservation.table_id,
      specialRequests: reservation.special_requests,
      status: reservation.status as 'pending' | 'confirmed' | 'finished' | 'cancelled',
      paymentStatus: reservation.payments?.[0]?.status as 'pending' | 'paid' | 'refunded' || 'pending',
      paymentAmount: reservation.payments?.[0]?.amount || (reservation.guests * 20),
      createdAt: reservation.created_at
    }));
  } catch (error) {
    console.error('Error in getUserReservations:', error);
    return [];
  }
};

// Get all reservations
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        *,
        payments (
          status,
          amount
        )
      `)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching all reservations:', error);
      return [];
    }

    return reservations.map(reservation => ({
      id: reservation.id,
      userId: reservation.user_id,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      tableId: reservation.table_id,
      specialRequests: reservation.special_requests,
      status: reservation.status as 'pending' | 'confirmed' | 'finished' | 'cancelled',
      paymentStatus: reservation.payments?.[0]?.status as 'pending' | 'paid' | 'refunded' || 'pending',
      paymentAmount: reservation.payments?.[0]?.amount || (reservation.guests * 20),
      createdAt: reservation.created_at
    }));
  } catch (error) {
    console.error('Error in getAllReservations:', error);
    return [];
  }
};

// Update reservation status
export const updateReservationStatus = async (id: number, status: Reservation['status']): Promise<Reservation | null> => {
  try {
    const { data: updatedReservation, error: updateError } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        payments (
          status,
          amount
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating reservation status:', updateError);
      return null;
    }

    return {
      id: updatedReservation.id,
      userId: updatedReservation.user_id,
      name: updatedReservation.name,
      email: updatedReservation.email,
      phone: updatedReservation.phone,
      date: updatedReservation.date,
      time: updatedReservation.time,
      guests: updatedReservation.guests,
      tableId: updatedReservation.table_id,
      specialRequests: updatedReservation.special_requests,
      status: updatedReservation.status as 'pending' | 'confirmed' | 'finished' | 'cancelled',
      paymentStatus: updatedReservation.payments?.[0]?.status as 'pending' | 'paid' | 'refunded' || 'pending',
      paymentAmount: updatedReservation.payments?.[0]?.amount || (updatedReservation.guests * 20),
      createdAt: updatedReservation.created_at
    };
  } catch (error) {
    console.error('Error in updateReservationStatus:', error);
    return null;
  }
};

// Update payment status
export const updatePaymentStatus = async (id: number, paymentStatus: Reservation['paymentStatus']): Promise<Reservation | null> => {
  try {
    // First get the reservation and its payment
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select(`
        *,
        payments (
          id,
          status,
          amount
        )
      `)
      .eq('id', id)
      .single();

    if (reservationError) {
      console.error('Error fetching reservation:', reservationError);
      return null;
    }

    // Update the payment status
    const paymentId = reservation.payments?.[0]?.id;
    if (paymentId) {
      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: paymentStatus })
        .eq('id', paymentId);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
        return null;
      }
    }

    return {
      id: reservation.id,
      userId: reservation.user_id,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      tableId: reservation.table_id,
      specialRequests: reservation.special_requests,
      status: reservation.status as 'pending' | 'confirmed' | 'finished' | 'cancelled',
      paymentStatus: paymentStatus,
      paymentAmount: reservation.payments?.[0]?.amount || (reservation.guests * 20),
      createdAt: reservation.created_at
    };
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    return null;
  }
};

// Cancel reservation
export const cancelReservation = async (id: number): Promise<Reservation | null> => {
  return updateReservationStatus(id, 'cancelled');
};

// Get all time slots
export const getTimeSlots = (): string[] => [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM"
];

// Get the maximum guest capacity
export const getMaxGuestCapacity = async (): Promise<number> => {
  const { data } = await supabase
    .from('tables')
    .select('capacity')
    .order('capacity', { ascending: false })
    .limit(1)
    .single();

  return data?.capacity || 8; // Default to 8 if no tables found
};
