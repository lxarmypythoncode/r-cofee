import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Users, DollarSign, CreditCard } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createReservation, getAvailableTables, Table } from '@/data/reservationData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', 
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM'
];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time.' }),
  guests: z.string().min(1, { message: 'Please select the number of guests.' }),
  tableId: z.number().optional(),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Reservation = () => {
  const { toast } = useToast();
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string>('2');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [estimatedCost, setEstimatedCost] = useState<number>(40); // Default $20 per guest

  if (user) {
    if (window.location.pathname === '/login' || 
        window.location.pathname === '/register' || 
        window.location.pathname === '/customer-login') {
      return <Navigate to="/" />;
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: '',
      guests: '2',
      specialRequests: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.name);
      form.setValue('email', user.email);
    }
  }, [user, form]);

  useEffect(() => {
    const guestCount = parseInt(selectedGuests) || 2;
    setEstimatedCost(guestCount * 20); // $20 per guest
  }, [selectedGuests]);

  useEffect(() => {
    const fetchAvailableTables = async () => {
      if (!selectedDate || !selectedTime || !selectedGuests) return;
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const tables = await getAvailableTables(
          formattedDate, 
          selectedTime, 
          parseInt(selectedGuests)
        );
        setAvailableTables(tables);
      } catch (error) {
        console.error('Error fetching available tables:', error);
      }
    };

    fetchAvailableTables();
  }, [selectedDate, selectedTime, selectedGuests]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or register to make a reservation",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDate = format(values.date, 'yyyy-MM-dd');
      const availableTables = await getAvailableTables(selectedDate, values.time, parseInt(values.guests));
      
      if (availableTables.length === 0) {
        toast({
          title: "No Tables Available",
          description: "Sorry, there are no tables available for the selected time and party size.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const tableId = availableTables[0].id;
      
      await createReservation({
        userId: String(user.id), // Convert ID to string
        name: values.name,
        email: values.email,
        phone: values.phone,
        date: selectedDate,
        time: values.time,
        guests: parseInt(values.guests),
        specialRequests: values.specialRequests || '',
        tableId
      });

      toast({
        title: "Reservation Submitted",
        description: "Your table reservation has been received. We'll confirm it shortly.",
      });

      form.reset({
        name: user.name,
        email: user.email,
        phone: '',
        guests: '2',
        specialRequests: '',
      });

      if (isCustomer(user)) {
        navigate('/customer-dashboard');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: "Submission Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-coffee mb-2">Reserve a Table</h1>
          <p className="text-muted-foreground">
            Book your table at R-Coffee and enjoy our delicious menu items
          </p>
        </div>

        {!user && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="mb-4">
                  Please login or register to make a reservation. This helps us manage your booking and provide you with better service.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild variant="default">
                    <Link to="/customer-login">Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>
              Fill out the form below to reserve your table. We'll send you a confirmation email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} disabled={!!user} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} disabled={!!user} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedGuests(value);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedTime(value);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {availableTables.length > 0 && (
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="tableId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select a Table</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a table" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTables.map((table) => (
                                <SelectItem key={table.id} value={table.id.toString()}>
                                  {table.name} (Seats {table.capacity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or dietary requirements?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Alert className="bg-muted">
                  <CreditCard className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Estimated Cost: ${estimatedCost.toFixed(2)}
                  </AlertTitle>
                  <AlertDescription>
                    Payment will be collected at the restaurant. A $20 per person minimum spend applies.
                  </AlertDescription>
                </Alert>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Reserve Table"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservation;
