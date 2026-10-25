import re
with open('App.tsx', 'r') as f:
    content = f.read()

target = r"""      case Page\.CLIENT_WISHLIST:
         return \(
             <div className="animate-fade-in pb-12">
                 \{\/\* Header Section \*\/\}
                 <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-teal-900 mb-2">Client Wishlist</h2>
                        <p className="text-xl text-slate-600 mb-4">Tell us what you need, and we'll make it happen.</p>
                         <EmbossedDigitalClock className="!justify-start" isDarkBg={false} />
                    </div>
                 </div>

                 \{\/\* Green Panel \*\/\}
                 <div className="bg-\[#1a5f54\] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Your Request Panel</h3>
                        <p className="text-lg text-teal-100 max-w-3xl leading-relaxed">
                            Use this form to send information directly to the LLC email, or speak to Pandora to dictate your wishlist.
                        </p>
                    </div>
                 </div>

                 \{\/\* Options Grid \*\/\}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                        \{\/\* Option 1 \*\/\}
                        <div className="bg-emerald-50 p-8 rounded-xl shadow-md border border-emerald-100">
                            <span className="bg-emerald-200 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full mb-4 inline-block">Option 1</span>
                            <h4 className="text-xl font-bold text-teal-900 mb-3">Speak to Pandora</h4>
                            <p className="text-slate-700">
                                Click the microphone icon in the bottom right corner to speak with our AI agent. She can answer questions or you can dictate your message.
                            </p>
                        </div>
                        
                        \{\/\* Option 2 \*\/\}
                        <div className="bg-blue-50 p-8 rounded-xl shadow-md border border-blue-100">
                            <span className="bg-blue-200 text-blue-800 text-sm font-bold px-3 py-1 rounded-full mb-4 inline-block">Option 2</span>
                            <h4 className="text-xl font-bold text-teal-900 mb-3">Manual Submission</h4>
                            <p className="text-slate-700">
                                Fill out the form below and click "Send Email Manually" to open your mail client with your request pre-filled.
                            </p>
                        </div>
                    </div>
                 </div>

                 \{\/\* Main Content Area \*\/\}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                     <div className="flex flex-col lg:flex-row gap-12 items-start">
                         
                         \{\/\* Left Column: Image & Text \*\/\}
                         <div className="lg:w-1/2 space-y-8">
                             <div className="border-l-4 border-yellow-400 pl-6">
                                <h3 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">Your Needs</h3>
                                <p className="text-xl text-slate-600 font-medium">We are here to listen.</p>
                             </div>
                             <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img 
                                     src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/f01ceb926257271119cb5fb763f9abf3cc32b977/wishlist.png"
                                     alt="Client Wishlist"
                                     className="w-full h-auto object-cover"
                                />
                             </div>
                         </div>

                         \{\/\* Right Column: Form \*\/\}
                         <div className="lg:w-1/2 w-full">
                            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
                                <h3 className="text-2xl font-bold text-center text-teal-900 mb-2">Send us a Request</h3>
                                <p className="text-center text-slate-600 mb-8 text-lg">Direct communication to the LLC leadership.</p>
                                
                                <form className="space-y-6" onSubmit={(e) => \{
                                    e.preventDefault\(\);
                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData\(form\);
                                    const name = formData.get\('name'\);
                                    const contact = formData.get\('contact'\);
                                    const wish = formData.get\('wish'\);
                                    
                                    const subject = `Client Wishlist Request from \$\{name\}`;
                                    const body = `Name: \$\{name\}%0D%0AContact: \$\{contact\}%0D%0A%0D%0AWishlist/Request:%0D%0A\$\{wish\}`;
                                    
                                    window.location.href = `mailto:\$\{COMPANY_INFO.email\}\?subject=\$\{subject\}&body=\$\{body\}`;
                                \}\}>
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2 text-lg">Full Name</label>
                                        <input name="name" type="text" placeholder="John Doe" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-lg" required />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2 text-lg">Contact Phone/Email</label>
                                        <input name="contact" type="text" placeholder="\(555\) 555-5555" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-lg" required />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold mb-2 text-lg">Your Wishlist / Request</label>
                                        <textarea name="wish" rows=\{5\} placeholder="I would like to request..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-lg resize-none" required></textarea>
                                    </div>

                                    <button className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-teal-900 font-bold text-xl rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=\{2\} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Email Manually
                                    </button>
                                </form>
                            </div>
                         </div>
                     </div>
                 </div>
                 
                 \{\/\* Schedule Banner footer integration \*\/\}
                 <div className="mt-8">
                     <div id="schedule-banner-section">
               <ScheduleBanner onClick=\{() => setCurrentPage\(Page.SCHEDULE_CALL\)\} />
             </div>
                 </div>
             </div>
         );"""

with open('/tmp/target.txt', 'r') as f:
    target = f.read()

replacement = """      case Page.CLIENT_WISHLIST:
         return (
             <ContentRoom title="Client Wishlist" subtitle="Tell us what you need, and we'll make it happen." image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/f01ceb926257271119cb5fb763f9abf3cc32b977/wishlist.png" onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}>
                 <div className="space-y-6">
                     
                     <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                         <h3 className="text-xl sm:text-2xl font-bold text-teal-900 mb-4">Your Request Panel</h3>
                         <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
                             Use this form to send information directly to the LLC email, or speak to Pandora to dictate your wishlist.
                         </p>
                         
                         <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                             {/* Option 1 */}
                             <div className="bg-emerald-50 p-5 sm:p-6 rounded-xl border border-emerald-100">
                                 <span className="bg-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block">Option 1</span>
                                 <h4 className="text-lg font-bold text-teal-900 mb-2">Speak to Pandora</h4>
                                 <p className="text-sm sm:text-base text-slate-700">
                                     Click the microphone icon in the bottom right corner to speak with our AI agent. She can answer questions or you can dictate your message.
                                 </p>
                             </div>
                             
                             {/* Option 2 */}
                             <div className="bg-blue-50 p-5 sm:p-6 rounded-xl border border-blue-100">
                                 <span className="bg-blue-200 text-blue-800 text-xs sm:text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block">Option 2</span>
                                 <h4 className="text-lg font-bold text-teal-900 mb-2">Manual Submission</h4>
                                 <p className="text-sm sm:text-base text-slate-700">
                                     Fill out the form below and click "Send Email Manually" to open your mail client with your request pre-filled.
                                 </p>
                             </div>
                         </div>
                         
                         <div className="border-t border-slate-200 pt-8 mt-4">
                             <h3 className="text-xl sm:text-2xl font-bold text-center text-teal-900 mb-2">Send us a Request</h3>
                             <p className="text-center text-slate-600 mb-6 text-base sm:text-lg">Direct communication to the LLC leadership.</p>
                             
                             <form className="space-y-5" onSubmit={(e) => {
                                 e.preventDefault();
                                 const form = e.target as HTMLFormElement;
                                 const formData = new FormData(form);
                                 const name = formData.get('name');
                                 const contact = formData.get('contact');
                                 const wish = formData.get('wish');
                                 
                                 const subject = `Client Wishlist Request from ${name}`;
                                 const body = `Name: ${name}%0D%0AContact: ${contact}%0D%0A%0D%0AWishlist/Request:%0D%0A${wish}`;
                                 
                                 window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
                             }}>
                                 <div>
                                     <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Full Name</label>
                                     <input name="name" type="text" placeholder="John Doe" className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg" required />
                                 </div>
                                 
                                 <div>
                                     <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Contact Phone/Email</label>
                                     <input name="contact" type="text" placeholder="(555) 555-5555" className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg" required />
                                 </div>
                                 
                                 <div>
                                     <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Your Wishlist / Request</label>
                                     <textarea name="wish" rows={4} placeholder="I would like to request..." className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg resize-none" required></textarea>
                                 </div>
                                 
                                 <button className="w-full py-3 sm:py-4 bg-yellow-400 hover:bg-yellow-300 text-teal-900 font-bold text-lg sm:text-xl rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                     </svg>
                                     Send Email Manually
                                 </button>
                             </form>
                         </div>
                     </div>
                 </div>
             </ContentRoom>
         );
"""

new_content = content.replace(target, replacement)
if new_content != content:
    with open('App.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Replacement failed")
