import React, { useState, useEffect } from 'react';

export const EmbossedDigitalClock: React.FC<{ 
  className?: string; 
  isDarkBg?: boolean;
  small?: boolean;
}> = ({ 
  className = "",
  isDarkBg = true,
  small = false
}) => {
  const [timeState, setTimeState] = useState<{
    time: string;
    date: string;
  }>({ time: '', date: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Miami, FL Timezone (America/New_York) - Hours and Minutes only
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Remove commas from date string and replace with dot
      const dateStr = now.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).replace(/,/g, '');

      setTimeState({
        time: timeStr,
        date: dateStr
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeState.time) return null;

  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <div 
        className={`inline-flex flex-nowrap whitespace-nowrap items-center justify-center gap-2 sm:gap-3 px-3 py-1 font-mono tracking-widest uppercase select-none transition-all ${
          isDarkBg 
            ? "text-yellow-300 [text-shadow:_1px_1px_1px_rgba(0,0,0,0.9),_-1px_-1px_1px_rgba(255,255,255,0.15)]" 
            : "text-teal-900/90 [text-shadow:_1px_1px_0_rgba(255,255,255,0.8),_-1px_-1px_1px_rgba(0,0,0,0.25)]"
        }`}
        title="Miami, FL Time & Date"
      >
        <span className={small ? "text-xs sm:text-sm md:text-base font-black tracking-wider" : "text-xl sm:text-2xl md:text-3xl font-black tracking-widest"}>{timeState.time}</span>
        <span className={small ? "w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399] mx-1 shrink-0 animate-pulse" : "w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399] mx-1.5 shrink-0 animate-pulse"} style={{ animationDuration: '4s' }}></span>
        <span className={small ? "text-[10px] sm:text-xs md:text-sm font-extrabold opacity-95" : "text-base sm:text-lg md:text-xl font-extrabold opacity-95"}>{timeState.date}</span>
      </div>
    </div>
  );
};
