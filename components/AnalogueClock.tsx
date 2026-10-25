import React, { useEffect, useState } from 'react';

interface AnalogueClockProps {
  className?: string;
}

export const AnalogueClock: React.FC<AnalogueClockProps> = ({ className = "pt-2 pb-1" }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const miamiTime = new Date(time.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  const seconds = miamiTime.getSeconds();
  const minutes = miamiTime.getMinutes();
  const hours = miamiTime.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-teal-950/80 rounded-full border-2 sm:border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] backdrop-blur-md flex items-center justify-center">
        {/* Clock Center */}
        <div className="absolute w-2.5 h-2.5 bg-yellow-400 rounded-full z-20 shadow-md"></div>
        
        {/* Hour Marks */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full h-full p-1"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`mx-auto bg-teal-300/80 rounded-full ${i % 3 === 0 ? 'w-0.5 sm:w-1 h-2 sm:h-3' : 'w-0.5 h-1'}`}></div>
          </div>
        ))}
        
        {/* Hands container */}
        <div className="relative w-full h-full">
          {/* Hour Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 sm:w-1.5 h-6 sm:h-7 bg-white rounded-full origin-bottom z-10"
            style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 sm:w-1 h-8 sm:h-10 bg-teal-100 rounded-full origin-bottom z-10"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }}
          />
          {/* Second Hand */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-9 sm:h-11 bg-red-500 rounded-full origin-bottom z-10"
            style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}
          />
        </div>
      </div>
      
    </div>
  );
};
