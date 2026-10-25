import sys

new_content = """import React from 'react';

interface VideoPanelProps {
  src?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  subtitleColor?: string;
  overlayText?: string;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({ 
  src = "https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4",
  className = "",
  title,
  subtitle,
  subtitleColor,
  overlayText
}) => {
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

  return (
    <div className={`w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto transform transition-transform duration-500 hover:scale-[1.01] flex-shrink-0 flex flex-col ${className}`}>
      <div className="relative w-full h-52 sm:h-64 md:h-72 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
        <video 
          src={src} 
          className="w-full h-full object-cover opacity-90"
          autoPlay
          loop
          muted
          playsInline
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
            <p className={`text-sm sm:text-base md:text-xl font-bold leading-snug ${displaySubtitleColor || 'text-slate-300'}`}>
              {displaySubtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
"""
open('components/VideoPanel.tsx', 'w').write(new_content)
