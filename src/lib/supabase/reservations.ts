
import { supabase } from '@/integrations/supabase/client';

export interface Reservation {
  id: number;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  special_requests?: string;
  created_at: string;
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('reservations')
    .insert([{ ...reservation, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserReservations(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('reservation_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAllReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateReservationStatus(id: number, status: Reservation['status']) {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReservation(id: number) {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
