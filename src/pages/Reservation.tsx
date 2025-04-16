import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTimeSlots, getMaxGuestCapacity, getAvailableTables, createReservation, Table } from '@/data/reservationData';

const Reservation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [maxGuests, setMaxGuests] = useState<number>(6);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const defaultUserId = 3;

  useEffect(() => {
    const fetchTimeSlots = () => {
      const slots = getTimeSlots();
      setTimeSlots(slots);
    };

    const fetchMaxGuests = () => {
      const max = getMaxGuestCapacity();
      setMaxGuests(max);
    };

    fetchTimeSlots();
    fetchMaxGuests();
  }, []);

  useEffect(() => {
    const fetchAvailableTables = async () => {
      if (date && time && guests) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        try {
          const tables = await getAvailableTables(formattedDate, time, guests);
          setAvailableTables(tables);
          if (tables.length > 0) {
            setSelectedTable(tables[0].id);
          } else {
            setSelectedTable(null);
          }
        } catch (error) {
          console.error('Error fetching available tables:', error);
        }
      }
    };

    if (date && time && guests) {
      fetchAvailableTables();
    } else {
      setAvailableTables([]);
      setSelectedTable(null);
    }
  }, [date, time, guests]);

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (step === 1 && date) {
      setStep(2);
    }
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    if (step === 2) {
      setStep(3);
    }
  };

  const handleGuestsChange = (value: string) => {
    setGuests(Number(value));
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(Number(tableId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !selectedTable) return;

    setIsLoading(true);
    const formattedDate = format(date, 'yyyy-MM-dd');

    try {
      await createReservation({
        userId: defaultUserId,
        name,
        email,
        phone,
        date: formattedDate,
        time,
        guests,
        tableId: selectedTable,
        specialRequests,
      });

      toast({
        title: "Reservation Created",
        description: `Your reservation for ${guests} on ${format(date, 'MMMM d, yyyy')} at ${time} has been created. You will receive a confirmation soon.`,
      });

      setDate(undefined);
      setTime('');
      setGuests(2);
      setSpecialRequests('');
      setSelectedTable(null);
      setStep(1);

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={handleBackToLogin}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-serif font-bold text-coffee">Reserve a Table</h1>
        </div>
        <p className="text-muted-foreground mb-8">Book your visit to R-Coffee and enjoy premium coffee and cuisine.</p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-coffee text-white' : 'bg-gray-200'}`}>1</div>
                <div className="ml-2 font-medium">Date</div>
              </div>
              <div className="w-12 h-0.5 mx-2 self-center bg-gray-200"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-coffee text-white' : 'bg-gray-200'}`}>2</div>
                <div className="ml-2 font-medium">Time</div>
              </div>
              <div className="w-12 h-0.5 mx-2 self-center bg-gray-200"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-coffee text-white' : 'bg-gray-200'}`}>3</div>
                <div className="ml-2 font-medium">Details</div>
              </div>
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                    className="rounded-md border"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Select a Time</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={time === slot ? "default" : "outline"}
                      onClick={() => handleTimeSelect(slot)}
                      className={time === slot ? "bg-coffee hover:bg-coffee-dark" : ""}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Select value={time} onValueChange={handleTimeSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select value={guests.toString()} onValueChange={handleGuestsChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="table">Table</Label>
                      <Select 
                        value={selectedTable ? selectedTable.toString() : ''} 
                        onValueChange={handleTableSelect}
                        disabled={availableTables.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={availableTables.length > 0 ? "Select table" : "No tables available"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTables.map((table) => (
                            <SelectItem key={table.id} value={table.id.toString()}>
                              {table.name} (Seats {table.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any dietary requirements or special requests?"
                      rows={3}
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !selectedTable}
                      className="bg-coffee hover:bg-coffee-dark"
                    >
                      {isLoading ? "Processing..." : "Complete Reservation"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
