import React from 'react';
import { Volume2 } from 'lucide-react';

interface VoiceIndicatorProps {
  isActive: boolean;
  isSpeaking: boolean;
  toggle: () => void;
  onOpenSimulator: () => void;
  isScrollPaused?: boolean;
  onToggleScrollPause?: () => void;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ 
  isActive, 
  isSpeaking, 
  toggle, 
  onOpenSimulator,
  isScrollPaused = false,
  onToggleScrollPause
}) => {
  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[60] flex flex-col items-end gap-2">
      {isActive && (
        <div className="bg-teal-900/90 text-white text-xs md:text-sm px-3 py-1.5 rounded-full backdrop-blur-md mb-1 animate-fade-in text-center border border-yellow-400/40 shadow-lg font-bold">
          {isSpeaking ? "Pandora is explaining..." : "Pandora is listening..."}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Web Tour Launcher Button */}
        <button
          onClick={onOpenSimulator}
          className="bg-yellow-400 border-2 border-teal-950 px-4 py-2 sm:px-5 sm:py-2.5 text-teal-950 font-black text-xs md:text-sm uppercase tracking-wide rounded-full shadow-2xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] whitespace-nowrap cursor-pointer"
          title="Start Guided Web Tour"
        >
          <span>Web Tour</span>
        </button>

        {/* Live Voice Mic Toggle */}
        <button
          onClick={toggle}
          className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 border-2 flex-shrink-0 cursor-pointer ${
            isActive ? 'bg-red-600 border-red-400 scale-110' : 'bg-teal-900 border-yellow-400 hover:scale-105 hover:bg-teal-800'
          }`}
          title={isActive ? "Disconnect Voice" : "Connect Live Voice with Pandora"}
        >
          {/* Pulsing rings when active */}
          {isActive && (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              <span className={`absolute inline-flex h-full w-full rounded-full border-2 border-white opacity-50 ${isSpeaking ? 'animate-pulse scale-125' : ''}`}></span>
            </>
          )}
          
          {/* Mic Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};