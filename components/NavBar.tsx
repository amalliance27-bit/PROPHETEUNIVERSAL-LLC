import React, { useState } from 'react';
import { Page } from '../types';

interface NavBarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  onLogoClick?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage, setPage, onLogoClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reordered links: About Us is now first (index 0)
  const links = [
    { id: Page.ABOUT_US, label: 'About Us' },
    { id: Page.PROJECTS_2027, label: 'Project 2027' },
    { id: Page.LIFE_INSURANCE, label: 'Life Insurance' },
    { id: Page.AUTO_INSURANCE, label: 'Auto Insurance' },
    { id: Page.HOME_INSURANCE, label: 'Home Insurance' },
    { id: Page.TAX_SERVICES, label: 'Tax Services' },
    { id: Page.APPLICATIONS, label: 'Application Forms' },
    { id: Page.FAQ, label: 'FAQ' },
    { id: Page.CONTACT, label: 'Contact Us' }
  ];

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  const LOGO_URL = "https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/62cb067b244c96e1a2d7fa688d9121d4f7ec0e2b/pu%20logo%20white.png";

  const isHome = currentPage === Page.HOME;

  return (
    <>
      <nav className={`relative z-40 shadow-xl transition-all duration-300 ${isHome ? 'bg-blue-900 border-b-4 border-red-600' : 'bg-teal-900 border-b border-teal-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20"> 
            
            {/* Left: Logo & Title */}
            <div className="flex items-center cursor-pointer group flex-shrink-0 gap-2.5 sm:gap-3" onClick={() => { if (onLogoClick) { onLogoClick(); setIsMenuOpen(false); } else { handleNavClick(Page.HOME); } }}>
               <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-blue-600 ring-2 ring-blue-400/50 flex items-center justify-center shadow-md shrink-0 overflow-hidden relative">
                 <img 
                    src={LOGO_URL}
                    alt="Prophete Universal Logo" 
                    className="w-full h-full object-contain object-center block group-hover:scale-105 transition-transform"
                  />
               </div>
                <div className="flex flex-col justify-center -mt-1">
                  <span className="font-extrabold text-lg sm:text-xl md:text-2xl text-white leading-none tracking-tight uppercase">Prophete Universal</span>
                  <span className="text-sm sm:text-lg md:text-xl text-emerald-300 font-black uppercase tracking-wider mt-0.5 drop-shadow-sm">Tax & Insurance <span className="text-amber-400 ml-1 text-[0.75em]">EST 2014</span></span>
                </div>
            </div>

            {/* Right: Navigation Links (Desktop) */}
            <div className="hidden xl:flex items-center justify-end space-x-1">
                {links.map((link) => (
                    <button
                    key={link.id}
                    onClick={() => setPage(link.id)}
                    className={`group relative px-3 py-2 rounded-lg text-base font-bold transition-all duration-200 flex items-center gap-1.5 ${
                        currentPage === link.id
                        ? 'text-white bg-teal-700 shadow-inner border border-yellow-400/40'
                        : 'text-teal-100 hover:text-white hover:bg-teal-800'
                    }`}
                    >
                    <span>{link.label}</span>
                    <span className={`text-xs text-yellow-300 transition-all duration-300 inline-block ${
                      currentPage === link.id 
                        ? 'translate-x-1 opacity-100' 
                        : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1'
                    }`}>
                      →
                    </span>
                    </button>
                ))}

              {/* Separator */}
              <div className="h-6 w-px bg-teal-700 mx-3"></div>
              
              {/* Action Buttons */}
               <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide bg-teal-800 border border-teal-600 text-teal-100 hover:bg-teal-700 transition-colors"
                    onClick={() => setPage(Page.CLIENT_WISHLIST)}
                  >
                    Wishlist
                  </button>

                  <button 
                    className="group px-5 py-2 rounded-lg text-base font-bold bg-yellow-400 text-teal-900 hover:bg-yellow-300 shadow-md transition-transform hover:scale-105 whitespace-nowrap flex items-center gap-1.5"
                    onClick={() => setPage(Page.CONTACT)}
                  >
                    <span>Free Consult</span>
                    <span className="group-hover:translate-x-1 transition-transform font-black">→</span>
                  </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center xl:hidden -mt-1.5">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1 rounded-md text-teal-100 hover:bg-teal-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Over Panel Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
          
          {/* Panel */}
          <div className="fixed inset-x-0 top-0 bg-teal-50 shadow-2xl transform transition-transform duration-300 ease-in-out max-h-screen overflow-y-auto rounded-b-3xl border-b-4 border-yellow-400">
             {/* Panel Header */}
             <div className="flex items-center justify-between px-6 py-6 border-b border-teal-100 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-600 ring-2 ring-blue-400/50 flex items-center justify-center shadow-md shrink-0 overflow-hidden relative">
                      <img 
                         src={LOGO_URL}
                         alt="Logo"
                         className="w-full h-full object-contain object-center block"
                      />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-bold text-teal-900 leading-none text-xl uppercase">Prophete Universal</span>
                      <span className="text-sm text-teal-600 font-bold uppercase tracking-wider">Tax & Insurance <span className="text-amber-600 ml-1 text-[0.8em]">EST 2014</span></span>
                   </div>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
             </div>

             {/* Links List */}
             <div className="p-4 space-y-1 bg-slate-50/50">
                <button
                    onClick={() => { if (onLogoClick) { onLogoClick(); setIsMenuOpen(false); } else { handleNavClick(Page.HOME); } }}
                    className="block w-full text-left px-6 py-4 rounded-xl text-xl font-bold text-slate-600 hover:bg-white hover:text-teal-900 hover:shadow-sm" // Increased to text-xl
                >
                    Home Page
                </button>
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`block w-full text-left px-6 py-4 rounded-xl text-xl font-bold transition-all ${ // Increased to text-xl
                      currentPage === link.id
                        ? 'bg-red-50 text-red-600 shadow-sm translate-x-1'
                        : 'text-slate-600 hover:bg-white hover:text-teal-900 hover:shadow-sm'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                    onClick={() => handleNavClick(Page.CLIENT_WISHLIST)}
                    className="block w-full text-left px-6 py-4 rounded-xl text-xl font-bold text-slate-600 hover:bg-white hover:text-teal-900 hover:shadow-sm" // Increased to text-xl
                >
                    Client Wishlist
                </button>
             </div>
             
             {/* Bottom CTA */}
             <div className="p-6 bg-white border-t border-teal-100">
                <button 
                   onClick={() => handleNavClick(Page.CONTACT)}
                   className="w-full py-4 bg-teal-900 text-white font-bold rounded-xl shadow-md hover:bg-teal-800 uppercase tracking-wide text-xl"
                >
                   Free Consultation Call
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};