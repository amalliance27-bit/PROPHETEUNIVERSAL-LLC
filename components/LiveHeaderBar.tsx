import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../constants';
import { getBusinessHoursStatus } from '../getBusinessHoursStatus';

interface MarketItem {
  symbol: string;
  label: string;
  price: string;
  change: string;
  isUp: boolean;
}

export const LiveHeaderBar: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pu_visitor_count');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1270) return parsed;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 1270;
  });

  useEffect(() => {
    try {
      localStorage.setItem('pu_visitor_count', visitorCount.toString());
    } catch (e) {
      // Ignore
    }
  }, [visitorCount]);

  // Simulate subtle real-time visitor influx
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        setVisitorCount(prev => prev + 1);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const [markets, setMarkets] = useState<MarketItem[]>([
    { symbol: 'GOLD', label: 'GOLD (XAU)', price: '$2748.50', change: '+0.75%', isUp: true },
    { symbol: 'SILVER', label: 'SILVER (XAG)', price: '$31.95', change: '+1.12%', isUp: true },
    { symbol: 'COPPER', label: 'COPPER (HG)', price: '$4.38', change: '+0.42%', isUp: true },
    { symbol: 'BTC', label: 'BITCOIN (BTC)', price: '$96540', change: '+2.85%', isUp: true },
    { symbol: 'NASDAQ', label: 'NASDAQ (IXIC)', price: '18982.50', change: '+0.68%', isUp: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch free live crypto/gold market quotes where available, with graceful fallback
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd&include_24hr_change=true');
        if (res.ok) {
          const data = await res.json();
          setMarkets(prev => prev.map(m => {
            if (m.symbol === 'BTC' && data.bitcoin) {
              const p = data.bitcoin.usd;
              const ch = data.bitcoin.usd_24h_change || 2.85;
              return {
                ...m,
                price: `$${p.toLocaleString().replace(/,/g, '')}`,
                change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`,
                isUp: ch >= 0
              };
            }
            if (m.symbol === 'GOLD' && data['pax-gold']) {
              const p = data['pax-gold'].usd;
              const ch = data['pax-gold'].usd_24h_change || 0.75;
              return {
                ...m,
                price: `$${p.toLocaleString().replace(/,/g, '')}`,
                change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`,
                isUp: ch >= 0
              };
            }
            return m;
          }));
        }
      } catch (err) {
        // Fallback silently without throwing errors
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const formattedDate = time.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).replace(/,/g, '');

  const formattedTime = time.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const officeStatus = getBusinessHoursStatus();
  const isOpen = officeStatus.toLowerCase().includes('open');

  const dotSeparator = (
    <span className="text-amber-400 font-black text-sm mx-3 sm:mx-5 select-none drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]">
      •
    </span>
  );

  const tickerSegment = (
    <span className="inline-flex items-center text-xs sm:text-sm font-mono tracking-wide">
      {/* 1. AI Assistance Beacon */}
      <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-yellow-400 font-black uppercase tracking-wider shadow-sm shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span>AI ASSISTANCE AVAILABLE 24/7</span>
      </span>

      {dotSeparator}

      {/* 2. Serving Area */}
      <span className="text-white font-black uppercase tracking-wider shrink-0">
        Serving Dade Broward Palm Beach
      </span>

      {dotSeparator}

      {/* 2b. Visitor Counter Badge */}
      <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs sm:text-sm">VISITORS:</span>
        <span className="text-cyan-300 font-black text-xs sm:text-sm tracking-wider">{visitorCount.toLocaleString()}</span>
      </span>

      {dotSeparator}

      {/* 3. Live Date & Time */}
      <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-xs sm:text-sm shrink-0">
        <span className="text-slate-400 font-bold">MIAMI:</span>
        <span className="text-cyan-300 font-black">{formattedDate}</span>
        <span className="text-slate-600 font-bold">|</span>
        <span className="text-yellow-300 font-black">{formattedTime}</span>
      </span>

      {dotSeparator}

      {/* 4. Office Status */}
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 font-black uppercase tracking-wider shrink-0 ${isOpen ? 'text-emerald-400' : 'text-amber-300'}`}>
        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
        <span>{officeStatus}</span>
      </span>

      {dotSeparator}

      {/* 5. Live Market Stocks & Commodities */}
      <span className="inline-flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 shrink-0">
        <span className="text-xs font-black uppercase text-amber-300 tracking-wider mr-1">MARKETS:</span>
        {markets.map((m, idx) => (
          <React.Fragment key={m.symbol}>
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm">
              <span className="text-slate-300 font-bold">{m.label}</span>
              <span className="text-white font-black">{m.price}</span>
              <span className={`font-black ${m.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.isUp ? '▲' : '▼'} {m.change}
              </span>
            </span>
            {idx < markets.length - 1 && <span className="text-slate-700 mx-1">|</span>}
          </React.Fragment>
        ))}
      </span>

      {dotSeparator}

      {/* 6. Phone Contact */}
      <a 
        href={`tel:${COMPANY_INFO.phone}`}
        className="text-yellow-300 hover:text-yellow-200 font-black inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 hover:border-yellow-400 transition-colors shrink-0 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        <span>CALL US: {COMPANY_INFO.phone}</span>
      </a>

      {dotSeparator}

      {/* 7. Visitor Counter Badge (After Phone Call) */}
      <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs sm:text-sm">VISITORS:</span>
        <span className="text-cyan-300 font-black text-xs sm:text-sm tracking-wider">{visitorCount.toLocaleString()}</span>
      </span>

      {dotSeparator}
    </span>
  );

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-slate-800/90 py-1.5 font-mono shadow-md w-full overflow-hidden relative select-none z-50">
      <div className="animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] flex whitespace-nowrap min-w-max items-center">
        {tickerSegment}
        {tickerSegment}
      </div>
    </div>
  );
};

