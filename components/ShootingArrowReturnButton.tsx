import React, { useState } from 'react';

interface ShootingArrowReturnButtonProps {
  onClick: () => void;
  label?: string;
  direction?: 'left' | 'right';
}

export const ShootingArrowReturnButton: React.FC<ShootingArrowReturnButtonProps> = ({ 
  onClick, 
  label = "Return to Lobby",
  direction = 'left'
}) => {
  const [isShooting, setIsShooting] = useState<boolean>(false);

  const handleClick = () => {
    if (isShooting) return;
    setIsShooting(true);

    // Smooth shooting animation duration before firing page navigation
    setTimeout(() => {
      onClick();
      setIsShooting(false);
    }, 650);
  };

  return (
    <div className="relative my-6 flex justify-center items-center overflow-visible z-30">
      
      {/* Shooting Particle Beam Overlay */}
      {isShooting && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Glowing trajectory line */}
          <div className={`absolute h-1 bg-gradient-to-r from-transparent via-yellow-400 to-cyan-400 shadow-[0_0_20px_#facc15] animate-pulse w-full ${direction === 'left' ? 'left-0' : 'right-0'}`}></div>
          
          {/* Shooting Flying Arrow Icon */}
          <div className={`fixed text-4xl sm:text-6xl text-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,1)] transition-all duration-700 ease-in-out font-black ${
            direction === 'left' 
              ? 'animate-shoot-left' 
              : 'animate-shoot-right'
          }`}>
            {direction === 'left' ? '←' : '➔'}
          </div>

          {/* Particle Burst Ripple */}
          <div className="absolute w-32 h-32 rounded-full border-4 border-yellow-400 animate-ping opacity-75"></div>
        </div>
      )}

      {/* Interactive Button */}
      <button 
        onClick={handleClick}
        disabled={isShooting}
        className={`group relative flex items-center gap-3 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 text-white px-7 py-3 rounded-full shadow-xl border border-teal-600/60 font-extrabold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isShooting ? 'opacity-50 scale-95 cursor-not-allowed' : 'hover:bg-teal-800 hover:border-teal-400'
        }`}
      >
        {/* Animated Arrow Icon */}
        <span className={`text-xl text-teal-300 group-hover:text-yellow-300 transition-transform duration-300 group-hover:-translate-x-1 font-bold ${
          isShooting ? (direction === 'left' ? '-translate-x-12 opacity-0' : 'translate-x-12 opacity-0') : ''
        }`}>
          {direction === 'left' ? '←' : '➔'}
        </span>

        {/* Button Label */}
        <span className="uppercase tracking-wider text-teal-100 group-hover:text-white font-sans font-bold">
          {isShooting ? 'Returning to Lobby...' : label}
        </span>
      </button>

    </div>
  );
};
