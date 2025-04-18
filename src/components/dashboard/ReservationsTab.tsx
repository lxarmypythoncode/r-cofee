
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody,
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getAllReservations, 
  updateReservationStatus, 
  Reservation,
  updatePaymentStatus
} from '@/data/reservationData';
import { createNotification } from '@/data/notificationsData';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Check, Clock, X, Send, DollarSign, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReservationsTabProps {
  userRole: string;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({ userRole }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reservations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (id: number, status: Reservation['status']) => {
    try {
      const updatedReservation = await updateReservationStatus(id, status);
      
      // Update the reservations list
      setReservations(prevReservations => 
        prevReservations.map(res => res.id === id ? updatedReservation : res)
      );
      
      // Create notification for the user
      let message = '';
      let title = '';
      
      switch (status) {
        case 'confirmed':
          title = 'Reservation Confirmed';
          message = `Your reservation for ${updatedReservation.guests} guests on ${format(parseISO(updatedReservation.date), 'MMM dd')} at ${updatedReservation.time} has been confirmed.`;
          break;
        case 'finished':
          title = 'Reservation Completed';
          message = `Thank you for dining with us! We hope you enjoyed your experience at R-Coffee.`;
          break;
        case 'cancelled':
          title = 'Reservation Cancelled';
          message = `Your reservation for ${format(parseISO(updatedReservation.date), 'MMM dd')} at ${updatedReservation.time} has been cancelled.`;
          break;
        default:
          title = 'Reservation Update';
          message = `Your reservation status has been updated to ${status}.`;
      }
      
      await createNotification({
        userId: updatedReservation.userId,
        title,
        message,
        type: 'reservation',
        status: 'unread'
      });
      
      toast({
        title: "Success",
        description: `Reservation status updated to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    }
  };

  const handlePaymentStatusChange = async (id: number, paymentStatus: Reservation['paymentStatus']) => {
    try {
      const updatedReservation = await updatePaymentStatus(id, paymentStatus);
      
      // Update the reservations list
      setReservations(prevReservations => 
        prevReservations.map(res => res.id === id ? updatedReservation : res)
      );
      
      // Create notification for the user
      let title = 'Payment Update';
      let message = `Your payment for reservation on ${format(parseISO(updatedReservation.date), 'MMM dd')} at ${updatedReservation.time} has been marked as ${paymentStatus}.`;
      
      await createNotification({
        userId: updatedReservation.userId,
        title,
        message,
        type: 'payment',
        status: 'unread'
      });
      
      toast({
        title: "Success",
        description: `Payment status updated to ${paymentStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  // Send a notification to a customer
  const sendCustomNotification = async (userId: number, reservationDetails: string) => {
    try {
      await createNotification({
        userId,
        title: 'Message from R-Coffee',
        message: `Regarding your reservation ${reservationDetails}: We're looking forward to seeing you! Please call us if you need to make any changes.`,
        type: 'system',
        status: 'unread'
      });
      
      toast({
        title: "Success",
        description: "Notification sent to customer",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading reservations...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'finished':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Finished</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Payment Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate total revenue from confirmed and paid reservations
  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled' && r.paymentStatus === 'paid')
    .reduce((sum, reservation) => sum + reservation.paymentAmount, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reservations</h2>
      
      {isSuperAdmin(userRole) && (
        <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
            Revenue Report
          </h3>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Total from {reservations.filter(r => r.status !== 'cancelled' && r.paymentStatus === 'paid').length} paid reservations
          </p>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{reservation.name}</p>
                    <p className="text-sm text-muted-foreground">{reservation.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {reservation.date ? format(parseISO(reservation.date), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.guests}</TableCell>
                <TableCell>${reservation.paymentAmount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(reservation.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {reservation.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Confirm</span>
                      </Button>
                    )}
                    
                    {reservation.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleStatusChange(reservation.id, 'finished')}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark Finished</span>
                      </Button>
                    )}
                    
                    {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </Button>
                    )}
                    
                    {reservation.paymentStatus === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handlePaymentStatusChange(reservation.id, 'paid')}
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>Mark Paid</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => sendCustomNotification(
                        reservation.userId, 
                        `on ${format(parseISO(reservation.date), 'MMM dd')} at ${reservation.time}`
                      )}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span className="sr-only">Send notification</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationsTab;
