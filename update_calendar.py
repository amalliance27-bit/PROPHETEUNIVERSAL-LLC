import sys
content = open('App.tsx').read()

start_marker = "const CalendarUI = () => {"
end_marker = "};// --- Main App Component ---"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    new_calendar = """const CalendarUI = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(16);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const days = Array.from({length: 28}, (_, i) => i + 1);
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const notes = formData.get('notes');

        const subject = `Appointment Request: ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0ARequested Appointment:%0D%0ADate: February ${selectedDate}, 2026%0D%0ATime: ${selectedTime}%0D%0A%0D%0AAdditional Notes:%0D%0A${notes}`;

        window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8 max-w-5xl mx-auto mt-8 animate-fade-in">
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
                <img src={LOGO_URL} alt="Agent" className="w-24 h-24 rounded-full shadow-md border-2 border-slate-100 mb-4 object-cover" />
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Schedule Consultation</h2>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-2 text-slate-700 text-lg font-semibold">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>30 min</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>Phone / Video Call</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Office Hours: 9:00 AM - 5:00 PM EST</span>
                    </span>
                </div>
                <p className="mt-4 text-center text-slate-600 font-medium text-lg max-w-2xl">
                    Select a date and time to request an appointment. We will follow up to confirm your booking and ensure you get the best options tailored to your needs.
                </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">Select a Date</h3>
                    <div className="flex items-center justify-between mb-6 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <button className="p-2 hover:bg-white hover:shadow rounded-lg text-slate-600 transition-all font-bold px-4">← Jan</button>
                        <span className="font-bold text-xl text-slate-800">February 2026</span>
                        <button className="p-2 hover:bg-white hover:shadow rounded-lg text-teal-700 transition-all font-bold px-4">Mar →</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-8">
                        {weekDays.map(d => (<div key={d} className="text-center text-sm font-bold text-slate-500 py-2 tracking-wider">{d}</div>))}
                        {days.map(d => {
                            const isWeekend = (d + 6) % 7 === 0 || (d + 6) % 7 === 6; // Rough math for Feb 2026 starting on Sun
                            return (
                                <button 
                                    key={d} 
                                    onClick={() => { if (!isWeekend) { setSelectedDate(d); setSelectedTime(null); } }} 
                                    disabled={isWeekend}
                                    className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                                        isWeekend 
                                            ? 'text-slate-300 cursor-not-allowed' 
                                            : selectedDate === d 
                                                ? 'bg-teal-600 text-white shadow-lg scale-110' 
                                                : 'hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-transparent hover:border-teal-200'
                                    }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-200 pt-8 lg:pt-0 lg:pl-12">
                     {!selectedTime ? (
                         <div className="animate-fade-in">
                             <h3 className="text-2xl font-bold text-center mb-6 text-slate-800">Select a Time for Feb {selectedDate}</h3>
                             <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                 {['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'].map(time => (
                                     <button 
                                        key={time} 
                                        onClick={() => setSelectedTime(time)} 
                                        className="py-4 px-4 border border-teal-200 bg-teal-50/30 text-teal-800 font-bold rounded-xl hover:bg-teal-600 hover:text-white hover:border-teal-600 hover:shadow-md transition-all text-lg"
                                     >
                                        {time}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     ) : (
                         <div className="animate-fade-in">
                             <button onClick={() => setSelectedTime(null)} className="flex items-center gap-2 text-lg font-bold text-teal-600 mb-6 hover:text-teal-800 transition-colors">
                                 <span>←</span> Back to times
                             </button>
                             <h3 className="text-2xl font-bold mb-6 text-slate-800">Confirm Appointment</h3>
                             <div className="bg-teal-50 p-5 rounded-xl mb-8 border border-teal-100 shadow-sm">
                                 <p className="font-bold text-teal-900 text-lg">Date: February {selectedDate}, 2026</p>
                                 <p className="font-bold text-teal-900 text-lg">Time: {selectedTime} EST</p>
                             </div>
                             <form className="space-y-5" onSubmit={handleBooking}>
                                 <div>
                                    <label className="block text-slate-700 font-bold mb-2">Name *</label>
                                    <input name="name" required placeholder="John Doe" className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-3 font-normal text-lg outline-none transition-all" />
                                 </div>
                                 <div>
                                    <label className="block text-slate-700 font-bold mb-2">Email *</label>
                                    <input name="email" type="email" required placeholder="john@example.com" className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-3 font-normal text-lg outline-none transition-all" />
                                 </div>
                                 <div>
                                    <label className="block text-slate-700 font-bold mb-2">Phone *</label>
                                    <input name="phone" type="tel" required placeholder="(555) 555-5555" className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-3 font-normal text-lg outline-none transition-all" />
                                 </div>
                                 <div>
                                    <label className="block text-slate-700 font-bold mb-2">Additional Notes</label>
                                    <textarea name="notes" placeholder="What would you like to discuss?" className="w-full border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-lg p-3 font-normal text-lg outline-none transition-all" rows={3} />
                                 </div>
                                 <button className="w-full bg-[#C23968] hover:bg-[#A82D57] text-white font-black py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-xl uppercase tracking-wider mt-4">
                                     REQUEST APPOINTMENT
                                 </button>
                             </form>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}

"""
    
    new_content = content[:start_idx] + new_calendar + content[end_idx:]
    open('App.tsx', 'w').write(new_content)
    print("Replaced CalendarUI.")
else:
    print("Could not find markers.")
