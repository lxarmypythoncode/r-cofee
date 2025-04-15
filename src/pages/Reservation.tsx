
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAvailableTables, 
  createReservation, 
  getTimeSlots, 
  getMaxGuestCapacity, 
  Table 
} from '@/data/reservationData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const Reservation = () => {
  const { toast } = useToast();
  const timeSlots = getTimeSlots();
  const maxGuests = getMaxGuestCapacity();
  const today = new Date();
  const maxDate = addDays(today, 30);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  
  // Available tables based on selection
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch available tables when date, time, and guests change
  useEffect(() => {
    const fetchTables = async () => {
      if (date && time && guests) {
        setLoading(true);
        try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const tables = await getAvailableTables(formattedDate, time, guests);
          setAvailableTables(tables);
          setSelectedTable(null); // Reset selected table when criteria change
        } catch (error) {
          console.error('Failed to fetch tables:', error);
          toast({
            title: "Error",
            description: "Failed to fetch available tables. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableTables([]);
        setSelectedTable(null);
      }
    };
    
    fetchTables();
  }, [date, time, guests, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !selectedTable) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields and select a table.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const reservation = await createReservation({
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
        title: "Reservation Confirmed!",
        description: `Your reservation for ${guests} on ${formattedDate} at ${time} has been booked.`,
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setDate(undefined);
      setTime('');
      setGuests(2);
      setSpecialRequests('');
      setSelectedTable(null);
      
    } catch (error) {
      console.error('Failed to create reservation:', error);
      toast({
        title: "Reservation Failed",
        description: "We couldn't process your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-coffee-dark text-white py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Reserve a Table</h1>
            <p className="text-cream/90">
              Book your experience at R-Coffee and enjoy our delicious menu in our cozy atmosphere
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
      </div>
      
      {/* Reservation Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Column */}
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=2070&auto=format&fit=crop" 
                alt="R-Coffee interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-coffee-dark/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h2 className="font-serif text-2xl font-bold mb-2">R-Coffee Experience</h2>
                <p className="text-sm">Reserve your spot and enjoy our premium coffee in a warm, inviting space.</p>
              </div>
            </div>
            
            {/* Form Column */}
            <div className="p-6 md:p-8">
              <h2 className="font-serif text-2xl text-coffee-dark font-bold mb-6">Reservation Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4 reservation-form">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-espresso mb-1">Name *</label>
                  <input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1">Email *</label>
                    <input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Your email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-espresso mb-1">Phone *</label>
                    <input 
                      id="phone" 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-1">Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal bg-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => isBefore(date, startOfDay(today)) || isBefore(maxDate, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-espresso mb-1">Time *</label>
                    <div className="relative">
                      <select 
                        id="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        required
                        className="appearance-none"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-coffee pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-espresso mb-1">Guests *</label>
                    <select 
                      id="guests" 
                      value={guests} 
                      onChange={(e) => setGuests(parseInt(e.target.value))} 
                      required
                    >
                      {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Table Selection */}
                {date && time && guests > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2">Select a Table *</label>
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-coffee"></div>
                      </div>
                    ) : availableTables.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableTables.map((table) => (
                          <button
                            key={table.id}
                            type="button"
                            onClick={() => setSelectedTable(table.id)}
                            className={`p-2 text-sm rounded border transition ${
                              selectedTable === table.id 
                                ? 'border-coffee bg-coffee/10 text-coffee-dark' 
                                : 'border-gray-200 hover:border-coffee/50'
                            }`}
                          >
                            {table.name}
                            <span className="block text-xs text-espresso/80">
                              Seats {table.capacity}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm py-2">
                        No tables available for {guests} guests at this time. Please select a different time or date.
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-espresso mb-1">Special Requests (Optional)</label>
                  <textarea 
                    id="specialRequests" 
                    value={specialRequests} 
                    onChange={(e) => setSpecialRequests(e.target.value)} 
                    placeholder="Any special requirements or requests"
                    rows={3}
                    className="bg-white border border-coffee/20 rounded px-4 py-2 w-full focus:outline-none focus:border-coffee focus:ring-1 focus:ring-coffee"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!date || !time || !selectedTable || submitting}
                  className="w-full bg-coffee hover:bg-coffee-dark"
                >
                  {submitting ? 'Processing...' : 'Confirm Reservation'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Policy Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-coffee-dark font-bold mb-4 text-center">Reservation Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-coffee-dark mb-2">Cancellation Policy</h3>
              <p className="text-sm text-espresso mb-4">
                Please notify us at least 4 hours in advance if you need to cancel your reservation.
                For parties of 6 or more, we require 24 hours notice.
              </p>
              
              <h3 className="font-medium text-coffee-dark mb-2">Large Parties</h3>
              <p className="text-sm text-espresso">
                For groups larger than 6, please contact us directly at (555) 123-4567
                to arrange your reservation.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-coffee-dark mb-2">Late Arrival</h3>
              <p className="text-sm text-espresso mb-4">
                We hold reservations for 15 minutes past the reservation time.
                Please call if you're running late.
              </p>
              
              <h3 className="font-medium text-coffee-dark mb-2">Special Events</h3>
              <p className="text-sm text-espresso">
                Interested in hosting a private event? Email us at events@r-coffee.com
                for information about our private dining options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
