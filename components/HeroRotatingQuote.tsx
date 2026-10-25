import React, { useState, useEffect } from 'react';

interface HeroQuoteItem {
  quote: string;
  source: string;
}

const HERO_QUOTES: HeroQuoteItem[] = [
  {
    quote: '"About 102 million American adults either need life insurance or need more coverage."',
    source: '2024 LIMRA INSURANCE BAROMETER STUDY'
  },
  {
    quote: '"Rolin helped our family secure Living Benefits after two other brokers turned us down. True peace of mind!"',
    source: 'MARCUS T. • MIAMI, FL (VERIFIED CLIENT)'
  },
  {
    quote: '"Got my maximum tax refund faster than ever. 100% accurate filing with no hassle or stress."',
    source: 'SANDRA V. • FORT LAUDERDALE, FL (VERIFIED CLIENT)'
  },
  {
    quote: '"Switched both my home and auto coverage to Prophete Universal. Better protection at lower monthly rates!"',
    source: 'JEAN-LUC P. • HOLLYWOOD, FL (VERIFIED CLIENT)'
  },
  {
    quote: '"Whenever we have urgent insurance or tax questions, their support is always there. Unmatched dedication."',
    source: 'ELENA M. • HIALEAH, FL (VERIFIED CLIENT)'
  },
  {
    quote: '"Rolin explained Indexed Universal Life so clearly. Now my retirement savings are protected from market losses."',
    source: 'DAVID R. • PEMBROKE PINES, FL (VERIFIED CLIENT)'
  }
];

export const HeroRotatingQuote: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_QUOTES.length);
        setIsVisible(true);
      }, 700);
    }, 10000); // 10 seconds cycle

    return () => clearInterval(interval);
  }, []);

  const currentQuote = HERO_QUOTES[currentIndex];

  return (
    <div className="mt-6 mx-auto bg-emerald-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 shadow-xl border border-emerald-600/50 max-w-xl min-h-[200px] flex flex-col justify-between">
      <div className={`transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold italic leading-snug text-center">
          {currentQuote.quote}
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-emerald-200">
          <span className="h-px w-8 bg-emerald-500/50"></span>
          <p className="text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-wider text-yellow-300 text-center">
            {currentQuote.source}
          </p>
          <span className="h-px w-8 bg-emerald-500/50"></span>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {HERO_QUOTES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentIndex(idx);
                setIsVisible(true);
              }, 300);
            }}
            aria-label={`Go to quote ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-5 bg-yellow-400' : 'w-1.5 bg-emerald-400/30 hover:bg-emerald-400/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
