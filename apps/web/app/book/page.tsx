'use client';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CreditCard, Check } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isAfter, isBefore, addMinutes, parse } from 'date-fns';
import { motion } from 'framer-motion';

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
  mystical: string;
  house: string;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  sessionType: string;
  timeSlot: TimeSlot | null;
  timezone: string;
}

interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  notes: string;
  timezone: string;
}

const SESSION_TYPES: SessionType[] = [
  {
    id: 'consultation',
    name: 'Initial Discovery Session',
    description: 'A comprehensive first meeting where we explore your inner landscape, current challenges, and natural patterns. Together we\'ll create a personalized roadmap for your growth and healing journey.',
    duration: 90,
    price: 20000, // $200
    color: 'from-jade-shadow to-jade-forest',
    mystical: 'Where your story begins to unfold',
    house: 'Foundation Work'
  },
  {
    id: 'session',
    name: 'Personal Growth Session',
    description: 'Deep therapeutic work focusing on specific patterns, relationships, or life transitions. Using archetypal insights and somatic awareness to create lasting transformation.',
    duration: 60,
    price: 12500, // $125
    color: 'from-jade-forest to-jade-sage',
    mystical: 'Integration and breakthrough moments',
    house: 'Core Healing'
  },
  {
    id: 'intensive',
    name: 'Transformational Deep-Dive',
    description: 'An extended container for profound inner work. Perfect for processing major life transitions, trauma integration, or when you\'re ready for significant personal evolution.',
    duration: 120,
    price: 25000, // $250
    color: 'from-jade-sage to-jade-seafoam',
    mystical: 'Complete restructuring and renewal',
    house: 'Advanced Integration'
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
    timeSlot: null,
    timezone: 'America/Los_Angeles'
  });

  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    timezone: 'America/Los_Angeles'
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
            name: clientDetails.name,
            email: clientDetails.email,
            phone: clientDetails.phone,
            notes: clientDetails.notes,
            timezone: clientDetails.timezone
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
      <div className="bg-jade-shadow/60 backdrop-blur-md rounded-lg border border-jade-moss/30 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-light text-jade-jade tracking-wide">Choose Your Date</h3>
          <div className="flex items-center gap-3 text-jade-mineral/70">
            <div className="w-8 h-0.5 bg-jade-sage/40"></div>
            <Calendar className="w-5 h-5" />
            <span className="text-sm tracking-wider">{format(selectedDate, 'MMMM yyyy')}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-center text-xs font-light text-jade-moss/60 py-3 tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isPast = isBefore(day, new Date()) && !isToday;

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={`
                  relative p-4 rounded-lg font-light transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-br from-jade-sage to-jade-seafoam text-white shadow-lg shadow-jade-sage/30'
                    : isPast
                      ? 'bg-jade-abyss/30 text-jade-moss/40 cursor-not-allowed border border-jade-shadow/20'
                      : 'bg-jade-night/50 text-jade-mineral hover:bg-jade-dusk/60 hover:text-jade-jade border border-jade-moss/30 hover:border-jade-sage/50'
                  }
                `}
                whileHover={!isPast ? { scale: 1.05 } : {}}
                whileTap={!isPast ? { scale: 0.95 } : {}}
              >
                {format(day, 'd')}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-jade-seafoam rounded-full animate-pulse shadow-lg shadow-jade-seafoam/50"></div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg bg-jade-sage/10 animate-pulse"></div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-jade-moss/60 italic tracking-wide">
            Select a date that feels aligned with your readiness
          </div>
        </div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    return (
      <div className="bg-jade-shadow/60 backdrop-blur-md rounded-lg border border-jade-moss/30 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-light text-jade-jade tracking-wide">Available Times</h3>
          <div className="flex items-center gap-3 text-jade-mineral/70">
            <div className="w-8 h-0.5 bg-jade-sage/40"></div>
            <Clock className="w-5 h-5" />
            <span className="text-sm tracking-wider">{format(selectedDate, 'EEEE, MMMM d')}</span>
          </div>
        </div>

        <div className="space-y-4">
          {availableSlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border border-jade-moss/30"></div>
                <div className="absolute inset-2 rounded-full border border-jade-forest/40"></div>
                <div className="absolute inset-4 rounded-full bg-jade-sage/20 animate-pulse"></div>
                <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-jade-mineral/60" />
              </div>
              <p className="text-jade-mineral/70 mb-2">No appointments available this day</p>
              <p className="text-jade-moss/60 text-sm">Please select a different date</p>
            </div>
          ) : (
            availableSlots.map(slot => (
              <motion.button
                key={slot.id}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`
                  w-full p-5 rounded-lg text-left transition-all duration-300 relative overflow-hidden group
                  ${slot.available
                    ? 'bg-jade-night/40 border border-jade-moss/30 hover:border-jade-sage/50 hover:bg-jade-dusk/50'
                    : 'bg-jade-abyss/20 border border-jade-shadow/20 cursor-not-allowed'
                  }
                  ${selectedSlot?.id === slot.id ? 'bg-jade-forest/20 border-jade-sage/50 shadow-lg shadow-jade-sage/10' : ''}
                `}
                whileHover={slot.available ? { scale: 1.02 } : {}}
                whileTap={slot.available ? { scale: 0.98 } : {}}
              >
                {/* Background glow effect */}
                {slot.available && (
                  <div className="absolute inset-0 bg-gradient-to-r from-jade-sage/5 via-jade-forest/5 to-jade-sage/5
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-lg font-light tracking-wide ${
                      slot.available
                        ? selectedSlot?.id === slot.id
                          ? 'text-jade-jade'
                          : 'text-jade-mineral'
                        : 'text-jade-moss/50'
                    }`}>
                      {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
                    </div>
                    {selectedSlot?.id === slot.id && (
                      <div className="w-3 h-3 bg-jade-seafoam rounded-full animate-pulse shadow-lg shadow-jade-seafoam/50"></div>
                    )}
                  </div>
                  <div className={`text-sm ${
                    slot.available
                      ? 'text-jade-mineral/70'
                      : 'text-jade-moss/40'
                  }`}>
                    {selectedSessionType?.mystical} • {selectedSessionType?.duration} minutes
                  </div>
                  {selectedSlot?.id === slot.id && (
                    <div className="mt-3 pt-3 border-t border-jade-sage/30">
                      <div className="text-xs text-jade-mineral/80 tracking-wide">
                        ✓ This time slot is selected
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover line effect */}
                {slot.available && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jade-sage to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </motion.button>
            ))
          )}
        </div>

        {availableSlots.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-xs text-jade-moss/60 italic tracking-wide">
              Choose a time that feels right for your inner work
            </div>
          </div>
        )}
      </div>
    );
  };
export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-abyss via-jade-shadow to-jade-night">
      {/* Cinematic jade background with subtle particles */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            <div className="w-1 h-1 bg-jade-seafoam rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Clean, professional header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-jade-jade mb-6 tracking-wide">
            Book Your Session
          </h1>
          <p className="text-xl text-jade-mineral/90 font-light max-w-2xl mx-auto leading-relaxed">
            Schedule a personalized session with Kelly to explore your inner world,
            process life transitions, and create lasting transformation.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-12 h-0.5 bg-jade-sage/40"></div>
            <div className="w-2 h-2 bg-jade-sage rounded-full"></div>
            <div className="w-12 h-0.5 bg-jade-sage/40"></div>
          </div>
        </div>

        {/* Progress Steps - Clean Navigation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-jade-moss/40"></div>
            <div className="flex items-center gap-8">
              {[
                { id: 'session-type', label: 'Choose Session', icon: User, description: 'Select your approach' },
                { id: 'date-time', label: 'Pick Date & Time', icon: Calendar, description: 'Find your perfect slot' },
                { id: 'details', label: 'Your Information', icon: User, description: 'Complete your booking' },
                { id: 'payment', label: 'Secure Payment', icon: CreditCard, description: 'Finalize reservation' }
              ].map((step, index) => {
                const isActive = bookingStep === step.id;
                const isCompleted = ['session-type', 'date-time', 'details'].indexOf(step.id) <
                                  ['session-type', 'date-time', 'details'].indexOf(bookingStep);
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <div className={`
                      relative flex items-center justify-center w-12 h-12 transition-all duration-500
                      ${isCompleted
                        ? 'bg-gradient-to-br from-jade-sage to-jade-seafoam shadow-lg shadow-jade-sage/30'
                        : isActive
                          ? 'bg-gradient-to-br from-jade-forest to-jade-sage shadow-lg shadow-jade-forest/40'
                          : 'bg-gradient-to-br from-jade-shadow/60 to-jade-night/60 border border-jade-moss/30'
                      }
                      rounded-lg backdrop-blur-sm
                    `}>
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="w-6 h-6 text-white" />
                        </motion.div>
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-jade-mineral/70'}`} />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <div className={`text-sm font-medium ${isActive ? 'text-jade-jade' : 'text-jade-mineral/60'}`}>
                        {step.label}
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? 'text-jade-mineral/80' : 'text-jade-moss/60'}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {bookingStep === 'session-type' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-light text-jade-jade mb-4">Session Options</h2>
                <p className="text-jade-mineral/80 text-lg">Choose the approach that feels right for where you are</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {SESSION_TYPES.map(sessionType => (
                  <motion.div
                    key={sessionType.id}
                    onClick={() => handleSessionTypeSelect(sessionType)}
                    className="group relative cursor-pointer"
                    whileHover={{ scale: 1.02, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Card with jade aesthetic */}
                    <div className="relative overflow-hidden">
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${sessionType.color} opacity-20
                        group-hover:opacity-30 transition-opacity duration-500
                      `}></div>
                      <div className="relative bg-jade-shadow/60 backdrop-blur-sm border border-jade-moss/30
                                    rounded-lg p-8 hover:border-jade-sage/50 transition-all duration-500
                                    group-hover:shadow-2xl group-hover:shadow-jade-forest/10">

                        {/* Session type indicator */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-jade-sage to-transparent"></div>

                        {/* Session badge */}
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-14 h-14 bg-gradient-to-br ${sessionType.color} rounded-lg
                                        flex items-center justify-center shadow-lg group-hover:shadow-xl
                                        transition-all duration-300 group-hover:scale-110`}>
                            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-jade-mineral/60 text-xs tracking-wider">
                              {sessionType.house}
                            </div>
                            <div className="text-jade-jade text-sm font-light">
                              {sessionType.duration} minutes
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-light text-jade-jade mb-3">
                          {sessionType.name}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-jade-mineral/70 text-sm italic mb-6 font-light">
                          {sessionType.mystical}
                        </p>

                        {/* Description */}
                        <p className="text-jade-mineral/80 mb-8 leading-relaxed text-sm">
                          {sessionType.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-0.5 bg-jade-sage/40"></div>
                            <div className="text-jade-mineral/60 text-xs tracking-wider">
                              Investment
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-light text-jade-jade">
                              ${sessionType.price / 100}
                            </div>
                            <div className="text-jade-moss/60 text-xs">
                              per session
                            </div>
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className={`
                          absolute inset-0 rounded-lg bg-gradient-to-br ${sessionType.color}
                          opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none
                        `}></div>
                      </div>
                    </div>
                  </motion.div>
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
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Session Summary */}
              <div className="text-center">
                <h2 className="text-4xl font-light text-jade-jade mb-6">
                  Complete Your Booking
                </h2>
                <p className="text-jade-mineral/70 text-lg mb-6">
                  Almost there - just a few details to finalize your session
                </p>
                <div className="bg-jade-shadow/60 backdrop-blur-lg rounded-2xl p-8 border border-jade-moss/30 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <span className="text-jade-sage font-medium tracking-wide">Session Type:</span>
                      <p className="text-jade-jade text-lg font-light">{selectedSessionType?.name}</p>
                      <p className="text-jade-mineral/60 text-xs italic">{selectedSessionType?.mystical}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-jade-sage font-medium tracking-wide">Date & Time:</span>
                      <p className="text-jade-jade text-lg font-light">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      <p className="text-jade-mineral/60 text-xs">{selectedSlot && format(selectedSlot.startTime, 'h:mm a')}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-jade-sage font-medium tracking-wide">Duration:</span>
                      <p className="text-jade-jade text-lg font-light">{selectedSessionType?.duration} minutes</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-jade-sage font-medium tracking-wide">Investment:</span>
                      <p className="text-jade-jade text-2xl font-light">${selectedSessionType?.price ? selectedSessionType.price / 100 : 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practitioner Connection Message */}
              <div className="bg-jade-night/60 backdrop-blur-lg rounded-2xl p-8 border border-jade-moss/30">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-jade-sage to-jade-seafoam rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-2xl">🌱</span>
                  </div>
                  <h3 className="text-2xl font-light text-jade-jade">Your Session with Kelly</h3>
                  <p className="text-jade-mineral/80 leading-relaxed max-w-2xl mx-auto">
                    Kelly creates a safe, nurturing container for deep personal work. With over a decade of experience in
                    therapeutic coaching and archetypal psychology, she helps you navigate life transitions, process emotions,
                    and discover your authentic path. Each session is tailored to meet you exactly where you are.
                  </p>
                  <p className="text-jade-mineral/60 text-sm">
                    Ready to begin your transformation journey?
                  </p>
                </div>
              </div>

              {/* Contact Information Form */}
              <div className="bg-jade-shadow/60 backdrop-blur-lg rounded-2xl p-8 border border-jade-moss/30">
                <h3 className="text-3xl font-light text-jade-jade text-center mb-8">
                  Your Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-jade-sage tracking-wide">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={clientDetails.name}
                      onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                      className="w-full px-6 py-4 bg-jade-night/60 border-2 border-jade-moss/30 rounded-xl text-jade-jade placeholder-jade-mineral/40 focus:border-jade-sage focus:ring-2 focus:ring-jade-sage/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="Your preferred name"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-jade-sage tracking-wide">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={clientDetails.email}
                      onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                      className="w-full px-6 py-4 bg-jade-night/60 border-2 border-jade-moss/30 rounded-xl text-jade-jade placeholder-jade-mineral/40 focus:border-jade-sage focus:ring-2 focus:ring-jade-sage/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-jade-sage tracking-wide">
                      Phone Number <span className="text-jade-mineral/60 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={clientDetails.phone}
                      onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-jade-night/60 border-2 border-jade-moss/30 rounded-xl text-jade-jade placeholder-jade-mineral/40 focus:border-jade-sage focus:ring-2 focus:ring-jade-sage/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-jade-sage tracking-wide">
                      Time Zone
                    </label>
                    <select
                      value={clientDetails.timezone}
                      onChange={(e) => setClientDetails({ ...clientDetails, timezone: e.target.value })}
                      className="w-full px-6 py-4 bg-jade-night/60 border-2 border-jade-moss/30 rounded-xl text-jade-jade focus:border-jade-sage focus:ring-2 focus:ring-jade-sage/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <label className="block text-sm font-medium text-jade-sage tracking-wide">
                    What brings you to this session? <span className="text-jade-mineral/60 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={clientDetails.notes}
                    onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 bg-jade-night/60 border-2 border-jade-moss/30 rounded-xl text-jade-jade placeholder-jade-mineral/40 focus:border-jade-sage focus:ring-2 focus:ring-jade-sage/20 focus:outline-none transition-all duration-200 backdrop-blur-sm"
                    placeholder="Share what's on your mind, any specific challenges you're facing, or areas you'd like to explore together..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 pt-8">
                  <button
                    onClick={() => setBookingStep('date-time')}
                    className="flex-1 px-8 py-4 border-2 border-jade-moss/50 text-jade-mineral rounded-xl hover:bg-jade-moss/10 hover:border-jade-sage transition-all duration-200 font-medium backdrop-blur-sm"
                  >
                    ← Back to Date & Time
                  </button>

                  <button
                    onClick={handleBookingSubmit}
                    disabled={isLoading || !clientDetails.name || !clientDetails.email}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-jade-sage via-jade-seafoam to-jade-sage text-white rounded-xl hover:from-jade-forest hover:via-jade-sage hover:to-jade-forest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg shadow-jade-sage/20 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Securing your session...
                      </span>
                    ) : (
                      `Complete Booking • $${selectedSessionType?.price ? selectedSessionType.price / 100 : 0}`
                    )}
                  </button>
                </div>
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
              className="px-6 py-3 bg-jade-night/60 text-jade-mineral border border-jade-moss/30 rounded-lg hover:bg-jade-dusk/60 hover:border-jade-sage/50
                       transition-all duration-200 backdrop-blur-sm"
            >
              ← Back
            </button>

            {bookingStep === 'date-time' && selectedSlot && (
              <button
                onClick={() => setBookingStep('details')}
                className="px-6 py-3 bg-gradient-to-r from-jade-sage to-jade-seafoam text-white rounded-lg hover:from-jade-forest hover:to-jade-sage
                         transition-all duration-200 font-medium shadow-lg shadow-jade-sage/20"
              >
                Continue to Details →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
