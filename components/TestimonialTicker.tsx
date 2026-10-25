import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  service: string;
  quote: string;
  rating: number;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marcus T.",
    location: "Miami, FL",
    service: "Life Insurance w/ Living Benefits",
    quote: "Rolin helped our family secure Living Benefits after two other brokers turned us down. True peace of mind!",
    rating: 5,
    date: "Verified Client"
  },
  {
    id: 2,
    name: "Sandra V.",
    location: "Fort Lauderdale, FL",
    service: "Tax Services",
    quote: "Got my maximum tax refund faster than ever. 100% accurate filing with no hassle or stress.",
    rating: 5,
    date: "Verified Client"
  },
  {
    id: 3,
    name: "Jean-Luc P.",
    location: "Hollywood, FL",
    service: "Home & Auto Insurance",
    quote: "Switched both my home and auto coverage to Prophete Universal. Better protection at lower monthly rates!",
    rating: 5,
    date: "Verified Client"
  },
  {
    id: 4,
    name: "Elena M.",
    location: "Hialeah, FL",
    service: "24/7 Executive Support",
    quote: "Whenever we have urgent insurance or tax questions, their support is always there. Unmatched dedication.",
    rating: 5,
    date: "Verified Client"
  },
  {
    id: 5,
    name: "David R.",
    location: "Pembroke Pines, FL",
    service: "IUL Tax-Free Retirement",
    quote: "Rolin explained Indexed Universal Life so clearly. Now my retirement savings are protected from market losses.",
    rating: 5,
    date: "Verified Client"
  },
  {
    id: 6,
    name: "Nathalie B.",
    location: "Miramar, FL",
    service: "Mortgage Protection",
    quote: "Trustworthy and honest service. They treated our family like their own from day one.",
    rating: 5,
    date: "Verified Client"
  }
];

export const TestimonialTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic rotation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#24060A] via-[#4A0E17] to-[#24060A] border-y-2 border-amber-500/50 text-white py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden my-2 shadow-[0_0_30px_rgba(74,14,23,0.5)]">
      {/* Subtle Burgundy Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-2 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            TESTIMONIALS
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 pb-4 border-b border-rose-900/80">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-extrabold uppercase tracking-widest text-sm sm:text-base md:text-lg">
              Live Client Reviews & Experiences
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400 fill-current drop-shadow" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm sm:text-base text-rose-200 font-extrabold ml-1">5.0 / 5.0 Rating</span>
          </div>
        </div>

        {/* Auto-Rotating Smooth Right-to-Left Sliding Track */}
        <div className="relative overflow-hidden w-full py-2">
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((item) => (
              <div 
                key={item.id}
                className="w-full flex-shrink-0 px-1"
              >
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#5C131D] via-[#4A0E17] to-[#3D0A11] border-2 border-rose-500/50 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl">
                  <div className="flex-1 space-y-4 text-center">
                    <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold italic leading-relaxed drop-shadow-sm">
                      "{item.quote}"
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                      <span className="font-black text-amber-300 text-base sm:text-lg md:text-xl whitespace-nowrap">
                        {item.name}
                      </span>
                      <span className="text-amber-400 font-black text-sm sm:text-base">•</span>
                      <span className="text-rose-100 text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">
                        {item.location}
                      </span>
                      <span className="text-amber-400 font-black text-sm sm:text-base">•</span>
                      <span className="px-3 sm:px-4 py-1 bg-[#24060A] border border-amber-400/60 text-amber-200 text-xs sm:text-sm md:text-base font-black rounded-full shadow-inner whitespace-nowrap inline-block">
                        {item.service}
                      </span>
                      <span className="text-amber-400 font-black text-sm sm:text-base">•</span>
                      <span className="text-amber-300 text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wider whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0 bg-[#24060A]/90 px-5 py-4 rounded-xl border border-amber-400/50 shadow-xl">
                    <div className="flex gap-1 mb-1.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm uppercase tracking-wider text-amber-300 font-extrabold">
                      5-Star Review
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls & Dots */}
        <div className="flex items-center justify-between pt-4 mt-2">
          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all rounded-full ${
                  idx === currentIndex 
                    ? 'w-7 bg-amber-400' 
                    : 'w-2 bg-rose-950/80 hover:bg-rose-800'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-[#24060A] hover:bg-[#5C131D] border border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-md active:scale-95"
              aria-label="Previous Testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-[#24060A] hover:bg-[#5C131D] border border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-md active:scale-95"
              aria-label="Next Testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
