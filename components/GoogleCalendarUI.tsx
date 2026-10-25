import React, { useState, useEffect } from 'react';
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutGoogle,
  getCurrentUser,
  fetchCalendarEvents,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  sendGmailMessage,
  CalendarEventItem
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';
import { Calendar, Clock, CheckCircle2, AlertCircle, LogOut, RefreshCw, PlusCircle, Trash2, ExternalLink, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { VideoPanel } from './VideoPanel';

interface GoogleCalendarUIProps {
  LOGO_URL: string;
}

export const GoogleCalendarUI: React.FC<GoogleCalendarUIProps> = ({ LOGO_URL }) => {
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [selectedTime, setSelectedTime] = useState<string | null>('10:00 AM');

  // Auth & Calendar States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Events State
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [eventError, setEventError] = useState<string | null>(null);

  // Booking Form
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [syncToGoogleCalendar, setSyncToGoogleCalendar] = useState<boolean>(true);

  // Booking result status
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [syncedEventLink, setSyncedEventLink] = useState<string | null>(null);
  const [gmailSentStatus, setGmailSentStatus] = useState<string | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const prevMonthDate = new Date(year, month - 1, 1);
  const nextMonthDate = new Date(year, month + 1, 1);

  const prevMonthName = prevMonthDate.toLocaleString('default', { month: 'short' });
  const nextMonthName = nextMonthDate.toLocaleString('default', { month: 'short' });

  // Init Auth State Listener
  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u) => {
        setUser(u);
        setIsAuthenticated(true);
        if (u.email) setClientEmail(u.email);
        if (u.displayName) setClientName(u.displayName);
        loadEvents();
      },
      () => {
        setUser(null);
        setIsAuthenticated(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setIsAuthenticated(true);
        if (res.user.email) setClientEmail(res.user.email);
        if (res.user.displayName) setClientName(res.user.displayName);
        loadEvents();
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setAuthError(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setIsAuthenticated(false);
      setEvents([]);
    } catch (err: any) {
      console.error('Sign out failed:', err);
    }
  };

  const loadEvents = async () => {
    setIsLoadingEvents(true);
    setEventError(null);
    try {
      const timeMin = new Date(year, month, 1).toISOString();
      const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const fetched = await fetchCalendarEvents(timeMin, timeMax);
      setEvents(fetched);
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setEventError(err?.message || 'Could not load Google Calendar events.');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(prevMonthDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(nextMonthDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Convert Date + Time string (e.g., "10:00 AM") to ISO format
  const getEventIsoTimes = (d: number, timeStr: string) => {
    const dateObj = new Date(year, month, d);
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const start = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hours, minutes);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min consultation

    return {
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      formattedStart: start.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }),
    };
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and a time for your appointment.');
      return;
    }

    const { startIso, endIso, formattedStart } = getEventIsoTimes(selectedDate, selectedTime);

    // If user wants to sync with Google Calendar, ask mandatory explicit user confirmation dialog
    if (isAuthenticated && syncToGoogleCalendar) {
      const confirmMsg = `Confirm scheduling appointment:\n\nTitle: Consultation - Prophete Universal\nDate & Time: ${formattedStart}\nClient: ${clientName} (${clientEmail})\n\nWould you like to add this event directly to your Google Calendar?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }

    setIsBooking(true);
    setBookingSuccess(null);
    setSyncedEventLink(null);

    let googleLink: string | null = null;

    try {
      if (isAuthenticated && syncToGoogleCalendar) {
        const createdEvent = await createGoogleCalendarEvent({
          summary: `Consultation with Prophete Universal - ${clientName}`,
          description: `Appointment Request for ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone}\nNotes: ${notes}\n\nOffice Address: ${COMPANY_INFO.address}\nPhone: ${COMPANY_INFO.phone}`,
          location: COMPANY_INFO.address,
          startIso,
          endIso,
        });

        if (createdEvent.htmlLink) {
          googleLink = createdEvent.htmlLink;
          setSyncedEventLink(googleLink);
        }
        await loadEvents();
      }

      // If signed in with Gmail, send official confirmation via Gmail API
      if (isAuthenticated && clientEmail) {
        try {
          const emailSubject = `Consultation Confirmation - Prophete Universal (${monthName} ${selectedDate}, ${year})`;
          const emailBody = `
            <h2>Appointment Confirmation</h2>
            <p>Dear <strong>${clientName}</strong>,</p>
            <p>Thank you for scheduling a consultation with <strong>Prophete Universal</strong>.</p>
            <p><strong>Appointment Details:</strong></p>
            <ul>
              <li><strong>Date:</strong> ${monthName} ${selectedDate}, ${year}</li>
              <li><strong>Time:</strong> ${selectedTime} EST</li>
              <li><strong>Phone:</strong> ${clientPhone}</li>
              <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
              <li><strong>Location:</strong> ${COMPANY_INFO.address}</li>
            </ul>
            <p>If you need to make any changes, please reply directly to this email or call us at <strong>${COMPANY_INFO.phone}</strong>.</p>
            <br/>
            <p>Best regards,<br/><strong>Prophete Universal Team</strong></p>
          `;
          await sendGmailMessage({ to: clientEmail, subject: emailSubject, bodyText: emailBody });
          setGmailSentStatus(`Confirmation email sent directly via Gmail to ${clientEmail}`);
        } catch (gmailErr: any) {
          console.warn('Gmail API send email warning:', gmailErr);
        }
      }

      setBookingSuccess(`Your appointment for ${monthName} ${selectedDate}, ${year} at ${selectedTime} EST has been successfully booked!`);

      if (!isAuthenticated) {
        // Send email notification fallback
        const subject = `Appointment Request: ${clientName}`;
        const body = `Name: ${clientName}%0D%0AEmail: ${clientEmail}%0D%0APhone: ${clientPhone}%0D%0A%0D%0ARequested Appointment:%0D%0ADate: ${monthName} ${selectedDate}, ${year}%0D%0ATime: ${selectedTime}%0D%0A%0D%0AAdditional Notes:%0D%0A${notes}`;

        // Trigger mailto after brief delay
        setTimeout(() => {
          window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
        }, 1200);
      }

    } catch (err: any) {
      console.error('Booking / Calendar Sync Error:', err);
      alert(`Booking recorded, but calendar sync had an issue: ${err?.message || 'Error syncing to Google Calendar'}`);
    } finally {
      setIsBooking(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, summary: string) => {
    if (!window.confirm(`Are you sure you want to remove the event "${summary}" from your Google Calendar?`)) {
      return;
    }

    try {
      await deleteGoogleCalendarEvent(eventId);
      await loadEvents();
    } catch (err: any) {
      alert(`Failed to delete event: ${err?.message || 'Error deleting event'}`);
    }
  };

  return (
    <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 p-4 sm:p-6 md:p-10 max-w-5xl mx-auto mt-4 animate-fade-in text-slate-800">
      
      {/* Top Video Guide Panel */}
      <div className="mb-8 p-4 sm:p-6 bg-white/90 border border-sky-200 shadow-sm rounded-2xl">
        <div className="text-center mb-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How to Book Your Consultation</h3>
          <p className="text-slate-600 text-sm sm:text-base font-medium mt-1">Watch this quick video guide to choose your preferred appointment date and sync directly with Google Calendar.</p>
        </div>
        <VideoPanel 
          src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4" 
          subtitle="Prophete Universal • Calendar Schedule" 
          controls={true} 
          className="w-full max-w-lg mx-auto shadow-md rounded-xl overflow-hidden" 
          videoHeightClass="h-48 sm:h-60" 
        />
      </div>

      {/* Header Info Block */}
      <div className="flex flex-col items-center mb-8 pb-8 border-b border-sky-200/80 text-center">
        <div className="w-24 h-24 mb-4 rounded-full bg-white border-2 border-blue-600 ring-2 ring-blue-400/50 flex items-center justify-center shadow-md overflow-hidden mx-auto">
          <img src={LOGO_URL} alt="Prophete Universal Logo" className="w-full h-full object-contain object-center block" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 uppercase tracking-wide">Calendar Schedule</h2>
        
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-2 text-slate-700 text-sm sm:text-base font-semibold">
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-sky-200 shadow-sm">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>30 min</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-sky-200 shadow-sm">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Phone / Video Call</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-sky-200 shadow-sm text-teal-800">
            <span className="font-bold">Office Hours: 9:00 AM - 5:00 PM EST</span>
          </span>
        </div>

        {/* Google Calendar Sync Bar */}
        <div className="w-full max-w-2xl mt-6 p-4 rounded-2xl bg-white border border-teal-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <div className="text-left text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-teal-900 block sm:inline">Google Calendar Integration: </span>
                <span>Sign in with Google to sync appointments directly to your calendar!</span>
              </div>
              
              {/* Official Standard Google Sign-In Button */}
              <button 
                type="button" 
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button min-w-[200px] flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg px-4 py-2 shadow-sm font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-bold text-xs sm:text-sm">
                    {isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
              <div className="flex items-center gap-3 text-left">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-teal-400" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                    {user?.displayName?.[0] || 'G'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-teal-950 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected to Google Calendar
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadEvents}
                  disabled={isLoadingEvents}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Refresh Google Calendar events"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEvents ? 'animate-spin text-teal-600' : ''}`} />
                  Sync
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Sign Out from Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {authError && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 max-w-xl">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* Main Layout: Calendar Date Selector & Time/Form Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Date Picker */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-center mb-4 text-slate-800">Select a Date</h3>
          <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-inner">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow rounded-lg text-teal-700 transition-all font-bold px-3 text-sm">
              ← {prevMonthName}
            </button>
            <span className="font-bold text-lg sm:text-xl text-slate-800">{monthName} {year}</span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow rounded-lg text-teal-700 transition-all font-bold px-3 text-sm">
              {nextMonthName} →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
            {weekDays.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 py-1.5 tracking-wider">{d}</div>
            ))}
            
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9 w-9 sm:h-11 sm:w-11 mx-auto" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const dateObj = new Date(year, month, d);
              const dayOfWeek = dateObj.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isDisabled = isWeekend || isPast;

              return (
                <button 
                  key={d} 
                  onClick={() => { if (!isDisabled) { setSelectedDate(d); } }} 
                  disabled={isDisabled}
                  className={`h-9 w-9 sm:h-11 sm:w-11 mx-auto rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all ${
                    isDisabled 
                      ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                      : selectedDate === d 
                        ? 'bg-teal-600 text-white shadow-lg scale-105 ring-2 ring-teal-400/50 font-extrabold' 
                        : 'hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-transparent hover:border-teal-200 bg-white shadow-sm'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Connected Google Calendar Events List Preview */}
          {isAuthenticated && (
            <div className="mt-6 p-4 bg-white rounded-2xl border border-teal-200 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3 border-b border-teal-100 pb-2">
                <h4 className="font-extrabold text-teal-950 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-4 h-4 text-teal-600" /> Your Google Calendar Events
                </h4>
                <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {events.length} Events in {monthName}
                </span>
              </div>

              {isLoadingEvents ? (
                <p className="text-xs text-slate-500 py-3 text-center animate-pulse">Loading Google Calendar events...</p>
              ) : eventError ? (
                <p className="text-xs text-rose-600 py-2">{eventError}</p>
              ) : events.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 italic text-center">No events found in Google Calendar for this month.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {events.map(ev => {
                    const startStr = ev.start.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day';
                    const dateStr = ev.start.dateTime ? new Date(ev.start.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ev.start.date;

                    return (
                      <div key={ev.id} className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{ev.summary}</p>
                          <p className="text-slate-500 text-[11px]">{dateStr} • {startStr}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {ev.htmlLink && (
                            <a href={ev.htmlLink} target="_blank" rel="noopener noreferrer" className="p-1 text-teal-600 hover:text-teal-800" title="Open in Google Calendar">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button onClick={() => handleDeleteEvent(ev.id, ev.summary)} className="p-1 text-rose-500 hover:text-rose-700" title="Remove event">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Time Slot & Booking Form */}
        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-10 text-left">
          <h3 className="text-2xl font-bold mb-4 text-slate-800 text-center lg:text-left">
            {selectedDate ? `Selected: ${monthName} ${selectedDate}, ${year}` : 'Select a Date First'}
          </h3>

          <div className="mb-6">
            <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wider">Choose Time Slot (EST)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
              {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'].map(time => (
                <button 
                  key={time} 
                  type="button"
                  onClick={() => setSelectedTime(time)} 
                  disabled={!selectedDate}
                  className={`py-2.5 px-3 border font-bold rounded-xl transition-all text-sm text-center ${
                    selectedTime === time
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-400/50'
                      : 'border-teal-200 bg-teal-50/50 text-teal-900 hover:bg-teal-600 hover:text-white hover:border-teal-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {bookingSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 text-sm font-bold animate-fade-in space-y-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
              {syncedEventLink && (
                <a 
                  href={syncedEventLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg shadow-sm transition-colors mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Event in Google Calendar
                </a>
              )}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleBooking}>
            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Full Name *</label>
              <input 
                name="name" 
                required 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Doe" 
                className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-2.5 font-normal text-base outline-none transition-all bg-white" 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Email *</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="john@example.com" 
                className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-2.5 font-normal text-base outline-none transition-all bg-white" 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Phone Number *</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(786) 877-7635" 
                className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-2.5 font-normal text-base outline-none transition-all bg-white" 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Topic / Discussion Notes</label>
              <textarea 
                name="notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Tax preparation, Life insurance policy quote..." 
                className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-2.5 font-normal text-base outline-none transition-all bg-white" 
                rows={2} 
              />
            </div>

            {/* Checkbox for Google Calendar Sync */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 p-3 bg-teal-50/80 border border-teal-200 rounded-xl">
                <input 
                  type="checkbox" 
                  id="sync-google-cal" 
                  checked={syncToGoogleCalendar}
                  onChange={(e) => setSyncToGoogleCalendar(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="sync-google-cal" className="text-xs font-bold text-teal-900 cursor-pointer flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Automatically sync appointment to my Google Calendar
                </label>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center justify-between gap-2">
                <span>Sign in with Google above to sync this appointment to your Google Calendar!</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isBooking || !selectedDate || !selectedTime}
              className="w-full bg-[#C23968] hover:bg-[#A82D57] text-white font-black py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-lg uppercase tracking-wider mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBooking ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Scheduling Appointment...</span>
                </>
              ) : (
                <span>REQUEST APPOINTMENT</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
