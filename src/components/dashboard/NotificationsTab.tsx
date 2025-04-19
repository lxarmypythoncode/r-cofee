import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createNotification } from '@/data/notificationsData';
import { getAllReservations, Reservation } from '@/data/reservationData';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

interface NotificationsTabProps {
  userRole: string;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedReservation, setSelectedReservation] = useState('');
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationData = await getAllReservations();
        setReservations(reservationData);
        
        const uniqueCustomers = reservationData.reduce<{ id: string; name: string; email: string }[]>((acc, reservation) => {
          if (!acc.some(c => c.id === reservation.userId)) {
            acc.push({
              id: reservation.userId,
              name: reservation.name,
              email: reservation.email
            });
          }
          return acc;
        }, []);
        
        setCustomers(uniqueCustomers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message || !selectedUserId) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createNotification({
        userId: selectedUserId,
        title,
        message,
        type: 'system',
        status: 'unread'
      });
      
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
      
      setTitle('');
      setMessage('');
      setSelectedUserId('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPromotion = () => {
    setTitle('Special Weekend Offer!');
    setMessage('Enjoy 20% off on all specialty coffee drinks this weekend. Show this notification to your server to redeem.');
  };

  const sendReminder = () => {
    setTitle('Reservation Reminder');
    setMessage('This is a friendly reminder about your upcoming reservation. We look forward to serving you soon!');
  };

  const sendAvailabilityUpdate = () => {
    setTitle('Reservation Availability Update');
    setMessage('We want to inform you that we have limited seating available on your reservation date. Please confirm your attendance or reschedule if needed.');
  };

  const handleReservationSelect = (reservationId: string) => {
    if (!reservationId) return;
    
    const reservation = reservations.find(r => r.id.toString() === reservationId);
    if (reservation) {
      setSelectedUserId(reservation.userId);
      setTitle(`Update on Your Reservation for ${format(parseISO(reservation.date), 'MMM dd')}`);
      setMessage(`Regarding your reservation for ${reservation.guests} guests on ${format(parseISO(reservation.date), 'MMMM dd, yyyy')} at ${reservation.time}: `);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Send Notifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>New Notification</CardTitle>
            <CardDescription>
              Send a notification to a customer about their reservation or promotions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
              {userRole === 'cashier' && (
                <div className="space-y-2">
                  <Label htmlFor="reservation">Select a Reservation</Label>
                  <Select 
                    value={selectedReservation} 
                    onValueChange={(value) => {
                      setSelectedReservation(value);
                      handleReservationSelect(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reservation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Upcoming Reservations</SelectLabel>
                        {reservations
                          .filter(r => r.status === 'pending' || r.status === 'confirmed')
                          .map(reservation => (
                            <SelectItem key={reservation.id} value={String(reservation.id)}>
                              {reservation.name} - {format(parseISO(reservation.date), 'MMM dd')} at {reservation.time}
                            </SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select 
                  value={selectedUserId} 
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Customers</SelectLabel>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification message"
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Quick notification templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={sendPromotion}
            >
              Special Promotion
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={sendReminder}
            >
              Reservation Reminder
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={sendAvailabilityUpdate}
            >
              Availability Update
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsTab;
