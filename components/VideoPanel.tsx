import React from 'react';

interface VideoPanelProps {
  src?: string;
  className?: string;
  videoHeightClass?: string;
  title?: string;
  subtitle?: string;
  subtitleColor?: string;
  overlayText?: string;
  noBorder?: boolean;
  controls?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  muteAfterOneLoop?: boolean;
  onClick?: () => void;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ 
  src = "https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4",
  className = "",
  videoHeightClass,
  title,
  subtitle,
  subtitleColor,
  overlayText,
  noBorder = false,
  controls = false,
  objectFit = 'contain',
  muteAfterOneLoop = true,
  onClick
}) => {
  const previousTimeRef = React.useRef<number>(0);

  // Determine title and subtitle from props or fallback parsing
  let displayTitle = title;
  let displaySubtitle = subtitle;
  let displaySubtitleColor = subtitleColor;

  if (!displayTitle && !displaySubtitle && overlayText) {
    if (overlayText.includes('•')) {
      const parts = overlayText.split('•');
      displayTitle = parts[0].trim();
      displaySubtitle = parts[1].trim();
    } else {
      displaySubtitle = overlayText;
    }
  }

  if (displayTitle === undefined && displaySubtitle === undefined && !overlayText) {
    displaySubtitle = "Protecting Your Family. Preserving Your Wealth.";
  }

  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.muted) return;
    window.dispatchEvent(new CustomEvent('video-play'));
  };

  const handlePause = () => {
    window.dispatchEvent(new CustomEvent('video-pause'));
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!muteAfterOneLoop || video.muted || !video.duration) return;

    const currentTime = video.currentTime;
    const prevTime = previousTimeRef.current;

    // Check if loop completed (time wrapped back near 0 or reached end)
    const reachedEnd = video.duration > 0 && currentTime >= video.duration - 0.3;
    const loopedBack = prevTime > 1.0 && currentTime < prevTime - 1.0;

    if (reachedEnd || loopedBack) {
      video.muted = true;
      previousTimeRef.current = 0;
      return;
    }

    previousTimeRef.current = currentTime;
  };

  const handleEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (muteAfterOneLoop && !video.muted) {
      video.muted = true;
    }
    handlePause();
  };

  const hasCustomMaxWidth = className.includes('max-w-') || className.includes('w-');

  return (
    <div 
      onClick={onClick}
      className={`w-full ${hasCustomMaxWidth ? '' : 'max-w-sm sm:max-w-md md:max-w-lg'} mx-auto transform transition-transform duration-500 hover:scale-[1.01] flex-shrink-0 flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`relative w-full ${videoHeightClass || 'h-40 sm:h-48 md:h-56 lg:h-60'} rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ${noBorder ? 'border-0' : 'border border-slate-800/50'}`}>
        <video 
          src={src} 
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : objectFit === 'fill' ? 'object-fill' : 'object-contain bg-slate-950'} opacity-95`}
          autoPlay={!controls}
          loop={!controls}
          muted={!controls}
          playsInline
          controls={controls}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
      
      {(displayTitle || displaySubtitle) && (
        <div className="mt-4 text-center">
          {displayTitle && (
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wide mb-1">
              {displayTitle}
            </h3>
          )}
          {displaySubtitle && (
            <p className={`text-base sm:text-lg md:text-xl font-bold leading-snug ${displaySubtitleColor || 'text-emerald-400'}`}>
              {displaySubtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
