"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CreditCard, Check } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isAfter, isBefore, addMinutes, parse } from 'date-fns';

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  sessionType?: 'consultation' | 'session' | 'intensive';
}

interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number; // cents
  color: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  sessionType: string;
  timeSlot: TimeSlot | null;
}

const SESSION_TYPES: SessionType[] = [
  {
    id: 'consultation',
    name: 'Initial Consultation',
    description: 'A deep dive into your current life situation and elemental alignment. Perfect for first-time clients.',
    duration: 90,
    price: 15000, // $150
    color: 'bg-blue-500'
  },
  {
    id: 'session',
    name: 'Spiralogic Session',
    description: 'A full archetypal exploration using the MAIA oracle system and elemental wisdom.',
    duration: 60,
    price: 12000, // $120
    color: 'bg-purple-500'
  },
  {
    id: 'intensive',
    name: 'Breakthrough Intensive',
    description: 'Extended deep work for major life transitions and breakthrough moments.',
    duration: 120,
    price: 25000, // $250
    color: 'bg-amber-500'
  }
];

// Fetch available time slots from API
const fetchAvailableSlots = async (date: Date, sessionType: string): Promise<TimeSlot[]> => {
  try {
    const response = await fetch(
      `/api/availability?date=${format(date, 'yyyy-MM-dd')}&sessionType=${sessionType}&days=1`
    );
    const data = await response.json();

    return data.availability.map((slot: any) => ({
      id: slot.id,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      available: slot.available,
      sessionType: slot.sessionType
    }));
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
};

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [bookingStep, setBookingStep] = useState<'session-type' | 'date-time' | 'details' | 'payment' | 'confirmation'>('session-type');
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    sessionType: '',
    timeSlot: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load available slots for selected date and session type
    if (selectedSessionType) {
      fetchAvailableSlots(selectedDate, selectedSessionType.id).then(setAvailableSlots);
    }
  }, [selectedDate, selectedSessionType]);

  const handleSessionTypeSelect = (sessionType: SessionType) => {
    setSelectedSessionType(sessionType);
    setBookingForm(prev => ({ ...prev, sessionType: sessionType.id }));
    setBookingStep('date-time');
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setBookingForm(prev => ({ ...prev, timeSlot: slot }));
    setBookingStep('details');
  };

  const handleFormUpdate = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async () => {
    setIsLoading(true);
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: selectedSessionType?.id,
          timeSlot: selectedSlot,
          clientInfo: {
            name: bookingForm.name,
            email: bookingForm.email,
            phone: bookingForm.phone,
            notes: bookingForm.notes
          },
          amount: selectedSessionType?.price,
          successUrl: `${window.location.origin}/book/success`,
          cancelUrl: `${window.location.origin}/book`
        })
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCalendar = () => {
    const startDate = startOfWeek(selectedDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Select Date</h3>
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-5 h-5" />
            <span>{format(selectedDate, 'MMMM yyyy')}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-white/60 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isPast = isBefore(day, new Date()) && !isToday;

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={`
                  relative p-3 rounded-lg font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-purple-500 text-white shadow-lg'
                    : isPast
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                      : 'bg-white/5 text-white hover:bg-white/10 hover:scale-105'
                  }
                `}
              >
                {format(day, 'd')}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Available Times</h3>
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="w-5 h-5" />
            <span>{format(selectedDate, 'EEEE, MMMM d')}</span>
          </div>
        </div>

        <div className="grid gap-3">
          {availableSlots.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No available times for this date.</p>
              <p className="text-sm">Please select a different date.</p>
            </div>
          ) : (
            availableSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`
                  p-4 rounded-lg border text-left transition-all duration-200
                  ${slot.available
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 text-white'
                    : 'border-gray-600/50 bg-gray-800/30 text-gray-500 cursor-not-allowed'
                  }
                  ${selectedSlot?.id === slot.id ? 'bg-purple-500/20 border-purple-400' : ''}
                `}
              >
                <div className="font-medium">
                  {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
                </div>
                <div className="text-sm text-white/70">
                  {selectedSessionType?.duration} minute {selectedSessionType?.name.toLowerCase()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Book Your Session</h1>
          <p className="text-xl text-white/80">Connect with the wisdom of the Spiralogic Oracle</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { id: 'session-type', label: 'Session Type', icon: User },
              { id: 'date-time', label: 'Date & Time', icon: Calendar },
              { id: 'details', label: 'Details', icon: User },
              { id: 'payment', label: 'Payment', icon: CreditCard }
            ].map((step, index) => {
              const isActive = bookingStep === step.id;
              const isCompleted = ['session-type', 'date-time', 'details'].indexOf(step.id) <
                                ['session-type', 'date-time', 'details'].indexOf(bookingStep);
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                    ${isCompleted ? 'bg-green-500' : isActive ? 'bg-purple-500' : 'bg-white/20'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-white/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {bookingStep === 'session-type' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Choose Your Session Type</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {SESSION_TYPES.map(sessionType => (
                  <div
                    key={sessionType.id}
                    onClick={() => handleSessionTypeSelect(sessionType)}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer
                             hover:bg-white/15 hover:border-purple-400/50 transition-all duration-200
                             hover:transform hover:scale-105"
                  >
                    <div className={`w-12 h-12 ${sessionType.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{sessionType.name}</h3>
                    <p className="text-white/70 mb-4 text-sm leading-relaxed">{sessionType.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{sessionType.duration} minutes</span>
                      <span className="text-2xl font-bold text-white">${sessionType.price / 100}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingStep === 'date-time' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {renderCalendar()}
              {renderTimeSlots()}
            </div>
          )}

          {bookingStep === 'details' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => handleFormUpdate('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                               text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => handleFormUpdate('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                               text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => handleFormUpdate('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                               text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      What would you like to explore in this session?
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => handleFormUpdate('notes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                               text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                      placeholder="Share what's on your mind, any specific challenges, or areas you'd like guidance on..."
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-white/80">
                    <div className="flex justify-between">
                      <span>Session Type:</span>
                      <span>{selectedSessionType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{selectedSlot && format(selectedSlot.startTime, 'h:mm a')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedSessionType?.duration} minutes</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-4">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Total:</span>
                        <span>${selectedSessionType?.price ? selectedSessionType.price / 100 : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookingSubmit}
                  disabled={!bookingForm.name || !bookingForm.email || isLoading}
                  className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500
                           text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-105"
                >
                  {isLoading ? 'Processing...' : `Pay $${selectedSessionType?.price ? selectedSessionType.price / 100 : 0} & Book Session`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {bookingStep !== 'session-type' && (
          <div className="max-w-6xl mx-auto mt-8 flex justify-between">
            <button
              onClick={() => {
                if (bookingStep === 'date-time') setBookingStep('session-type');
                if (bookingStep === 'details') setBookingStep('date-time');
              }}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20
                       transition-all duration-200"
            >
              Back
            </button>

            {bookingStep === 'date-time' && selectedSlot && (
              <button
                onClick={() => setBookingStep('details')}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                         transition-all duration-200"
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}