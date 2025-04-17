
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserReservations, Reservation } from '@/data/reservationData';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerReservationsTabProps {
  userId: number;
}

const CustomerReservationsTab: React.FC<CustomerReservationsTabProps> = ({ userId }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getUserReservations(userId);
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleNewReservation = () => {
    navigate('/reservation');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading your reservations...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Reservations</h2>
        <Button onClick={handleNewReservation}>New Reservation</Button>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">No Reservations Yet</h3>
            <p className="text-muted-foreground mb-6 text-center">
              You haven't made any reservations yet. Book a table to enjoy our coffee and food.
            </p>
            <Button onClick={handleNewReservation}>Make Your First Reservation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <div className={`p-2 text-center text-sm font-medium uppercase ${getStatusBadgeClass(reservation.status)}`}>
                {reservation.status}
              </div>
              <CardHeader>
                <CardTitle>Reservation #{reservation.id}</CardTitle>
                <CardDescription>
                  {format(parseISO(reservation.date), 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Table {reservation.tableNumber || 'To be assigned'}</span>
                  </div>
                  {reservation.specialRequests && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-1">Special Requests:</h4>
                      <p className="text-sm text-muted-foreground">{reservation.specialRequests}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReservationsTab;
