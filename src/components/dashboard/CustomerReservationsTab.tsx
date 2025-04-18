
import React, { useState, useEffect } from 'react';
import { getUserReservations, Reservation, cancelReservation, updatePaymentStatus } from '@/data/reservationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Info, Users, X, DollarSign, CreditCard } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';

interface CustomerReservationsTabProps {
  userId: number;
}

const CustomerReservationsTab: React.FC<CustomerReservationsTabProps> = ({ userId }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const data = await getUserReservations(userId);
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
        toast({
          title: "Error",
          description: "Failed to load your reservations. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'cancelled' } 
            : reservation
        )
      );
      
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel your reservation. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Payment Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading your reservations...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">You don't have any reservations yet</h3>
        <p className="text-muted-foreground mt-2">Book a table to enjoy our delicious offerings</p>
        <Button className="mt-4" asChild>
          <a href="/reservation">Make a Reservation</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Reservations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  {format(parseISO(reservation.date), 'MMMM dd, yyyy')}
                </CardTitle>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`
                    ${reservation.status === 'confirmed' ? 'bg-green-500' : ''}
                    ${reservation.status === 'pending' ? 'bg-amber-500' : ''}
                    ${reservation.status === 'cancelled' ? 'bg-red-500' : ''}
                  `}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                  {getPaymentStatusBadge(reservation.paymentStatus)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>${reservation.paymentAmount.toFixed(2)}</span>
                </div>
                
                {reservation.specialRequests && (
                  <div className="flex items-start text-muted-foreground mt-2">
                    <Info className="h-4 w-4 mr-2 mt-1" />
                    <span className="text-sm">{reservation.specialRequests}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Reservation
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your reservation for {format(parseISO(reservation.date), 'MMMM dd, yyyy')} at {reservation.time}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {reservation.status === 'cancelled' && (
                <div className="w-full text-center text-muted-foreground text-sm">
                  This reservation has been cancelled
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerReservationsTab;
