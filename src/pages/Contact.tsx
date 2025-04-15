
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      setName('');
      setEmail('');
      setMessage('');
      setSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-coffee-dark text-white py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-cream/90">
              Have questions or feedback? We'd love to hear from you
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
      </div>
      
      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl text-coffee-dark font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <MapPin className="h-6 w-6 text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Our Location</h3>
                    <p className="text-espresso">123 Coffee Street</p>
                    <p className="text-espresso">Espresso City, 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Phone className="h-6 w-6 text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Phone Number</h3>
                    <p className="text-espresso">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Mail className="h-6 w-6 text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Email Address</h3>
                    <p className="text-espresso">info@r-coffee.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <Clock className="h-6 w-6 text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Opening Hours</h3>
                    <p className="text-espresso">Monday - Friday: 7:00 AM - 8:00 PM</p>
                    <p className="text-espresso">Saturday - Sunday: 8:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200 relative">
                  <iframe
                    title="R-Coffee Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1649452193317!5m2!1sen!2s"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="font-serif text-2xl text-coffee-dark font-bold mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 reservation-form">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-espresso mb-1">Name</label>
                    <input 
                      id="name" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1">Email</label>
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
                    <label htmlFor="message" className="block text-sm font-medium text-espresso mb-1">Message</label>
                    <textarea 
                      id="message" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Your message"
                      rows={5}
                      className="bg-white border border-coffee/20 rounded px-4 py-2 w-full focus:outline-none focus:border-coffee focus:ring-1 focus:ring-coffee"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-coffee hover:bg-coffee-dark flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              {/* FAQ Teaser */}
              <div className="mt-8 p-6 rounded-lg bg-white shadow-md">
                <h3 className="font-serif text-xl text-coffee-dark font-bold mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-coffee-dark">Do you take reservations for large groups?</h4>
                    <p className="text-sm text-espresso">Yes, for groups of 6 or more, please call us directly.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-coffee-dark">Is there parking available?</h4>
                    <p className="text-sm text-espresso">Street parking is available, and there's a public parking garage one block away.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-coffee-dark">Do you offer WiFi?</h4>
                    <p className="text-sm text-espresso">Yes, we offer complimentary WiFi for all our customers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
