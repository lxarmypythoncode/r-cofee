import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import {
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  Reservation
} from '@/data/reservationData';
import { createNotification } from '@/data/notificationsData';

interface ReservationsTabProps {
  userRole: string | undefined;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({ userRole }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reservationDate, setReservationDate] = useState<Date | undefined>(new Date());
  const [reservationTime, setReservationTime] = useState('12:00');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const reservationsData = await getReservations();
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReservation = async () => {
    try {
      setIsLoading(true);
      if (!reservationDate || !reservationTime || !customerName || !customerEmail) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newReservation = {
        reservationDate: format(reservationDate, 'yyyy-MM-dd'),
        reservationTime: reservationTime,
        numberOfGuests: numberOfGuests,
        customerName: customerName,
        customerEmail: customerEmail,
        status: 'pending',
        userId: '1', // Default User ID
      };

      await createReservation(newReservation);
      fetchReservations();
      setIsDialogOpen(false);
      setReservationDate(new Date());
      setReservationTime('12:00');
      setNumberOfGuests(1);
      setCustomerName('');
      setCustomerEmail('');

      toast({
        title: "Success",
        description: "Reservation created successfully",
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReservation = async (id: number) => {
    try {
      const updatedReservation = await updateReservationStatus(id, 'approved');
      
      // Create notification for the user
      await createNotification({
        user_id: updatedReservation.userId,
        title: "Reservation Approved",
        message: `Your reservation for ${format(new Date(updatedReservation.reservationDate), 'PP')} at ${updatedReservation.reservationTime} has been approved.`,
        type: "reservation",
        status: "unread"
      });
      
      fetchReservations();
      
      toast({
        title: "Success",
        description: "Reservation approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve reservation",
        variant: "destructive",
      });
    }
  };

  const handleRejectReservation = async (id: number) => {
    try {
      const updatedReservation = await updateReservationStatus(id, 'rejected');
      
      // Create notification for the user
      await createNotification({
        user_id: updatedReservation.userId,
        title: "Reservation Rejected",
        message: `Your reservation for ${format(new Date(updatedReservation.reservationDate), 'PP')} at ${updatedReservation.reservationTime} could not be accommodated at this time.`,
        type: "reservation",
        status: "unread"
      });
      
      fetchReservations();
      
      toast({
        title: "Success",
        description: "Reservation rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject reservation",
        variant: "destructive",
      });
    }
  };

  const handleCompleteReservation = async (id: number) => {
    try {
      const updatedReservation = await updateReservationStatus(id, 'completed');
      
      // Create notification for the user
      await createNotification({
        user_id: updatedReservation.userId,
        title: "Thank You for Visiting",
        message: `Thank you for dining with us. We hope you enjoyed your experience and look forward to serving you again soon!`,
        type: "reservation",
        status: "unread"
      });
      
      fetchReservations();
      
      toast({
        title: "Success",
        description: "Reservation marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete reservation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    try {
      await deleteReservation(id);
      fetchReservations();
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Reservations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Reservation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reservation</DialogTitle>
              <DialogDescription>
                Make a new reservation for a customer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <DatePicker
                    id="date"
                    mode="single"
                    selected={reservationDate}
                    onSelect={setReservationDate}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    type="time"
                    id="time"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  type="number"
                  id="guests"
                  value={numberOfGuests.toString()}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="johndoe@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateReservation} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Reservation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reservation List</CardTitle>
          <CardDescription>
            View and manage all reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{format(new Date(reservation.reservationDate), 'PP')}</TableCell>
                      <TableCell>{reservation.reservationTime}</TableCell>
                      <TableCell>{reservation.numberOfGuests}</TableCell>
                      <TableCell>{reservation.customerName}</TableCell>
                      <TableCell>{reservation.customerEmail}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {userRole === 'admin' && reservation.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveReservation(reservation.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectReservation(reservation.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {userRole === 'admin' && reservation.status === 'approved' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleCompleteReservation(reservation.id)}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReservation(reservation.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsTab;
