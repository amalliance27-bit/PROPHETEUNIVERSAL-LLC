import React, { useState, useEffect } from 'react';
import { LiveHeaderBar } from './LiveHeaderBar';
import { AnalogueClock } from './AnalogueClock';
import { EmbossedDigitalClock } from './EmbossedDigitalClock';
import { VideoPanel } from './VideoPanel';
import { COMPANY_INFO } from '../constants';
import { playRoomTransitionSound, speakWelcomeMiamiTime, unlockAudioGlobal } from '../utils/sound';
import { isAnySpeechActive } from '../utils/elevenlabs';

interface SplashScreenProps {
  onEnter: () => void;
}

interface SplashSlide {
  id: number;
  title: string;
  subtitle: string;
  highlightText?: string;
  tagline?: string;
  gradientText: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isEntering, setIsEntering] = useState<boolean>(false);

  const slides: SplashSlide[] = [
    {
      id: 0,
      title: "WELCOME",
      subtitle: "Your One-Stop Destination for Life Insurance, Taxes & Estate Protection",
      tagline: "ROLIN PROPHETE & TEAM • MIAMI, FL",
      gradientText: "from-yellow-300 via-amber-100 to-yellow-400"
    },
    {
      id: 1,
      title: "PROPHETE",
      subtitle: "A Legacy Built On Trust, Protection & Integrity",
      tagline: "SECURITY • STABILITY • FAMILY FIRST",
      gradientText: "from-blue-400 via-cyan-300 to-sky-200"
    },
    {
      id: 2,
      title: "UNIVERSAL",
      subtitle: "Comprehensive Financial, Tax & Insurance Assurance",
      tagline: "LIFE • TAX PREPARATION • HOME & AUTO",
      gradientText: "from-yellow-300 via-amber-200 to-yellow-400"
    },
    {
      id: 3,
      title: "LLC",
      subtitle: "Protecting South Florida Families & Business Wealth",
      tagline: "PRESERVE YOUR ESTATE & LEGACY",
      gradientText: "from-emerald-300 via-teal-200 to-cyan-300"
    }
  ];

  // Update live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Epic Initial Splash Chime (Plays when the splash screen loads)
  const playEpicIntroChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      // Majestic G Major Executive Chord (G3, D4, G4, B4, D5) + Sparkle
      const freqs = [196.00, 293.66, 392.00, 493.88, 587.33];
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        
        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 2.25);
      });

      // Shimmering High Bell Accent (B5)
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(987.77, now + 0.25);
      
      bellGain.gain.setValueAtTime(0, now + 0.25);
      bellGain.gain.linearRampToValueAtTime(0.08, now + 0.32);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      
      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);
      
      bellOsc.start(now + 0.25);
      bellOsc.stop(now + 1.85);
    } catch {
      // Gracefully bypass if audio context is blocked
    }
  };

  // Play Epic Intro Chime & Welcome Greeting immediately when splash starts
  const [hasTriggeredAudio, setHasTriggeredAudio] = useState<boolean>(false);
  const [hasSpeechStarted, setHasSpeechStarted] = useState<boolean>(false);

  // Listen to actual speech events to verify Android browser playback
  useEffect(() => {
    const handleSpeechStart = () => {
      setHasSpeechStarted(true);
      setHasTriggeredAudio(true);
    };
    window.addEventListener('speech-start', handleSpeechStart);
    return () => {
      window.removeEventListener('speech-start', handleSpeechStart);
    };
  }, []);

  const triggerWelcomeAudio = (force = false) => {
    if (hasTriggeredAudio && !force) return; // Prevent multiple calls unless forced
    try {
      unlockAudioGlobal();
      playEpicIntroChime();
      speakWelcomeMiamiTime();
      setHasTriggeredAudio(true);
    } catch {
      // Ignore audio restriction errors
    }
  };

  // Trigger auto greeting immediately when splash screen reaches the second slide
  useEffect(() => {
    if (currentSlide >= 1 && !hasSpeechStarted) {
      triggerWelcomeAudio();
    }
  }, [currentSlide]);

  // Keep manual interaction listeners ready to enable audio if browser requires gesture (e.g. Android Chrome)
  useEffect(() => {
    const handleGesture = () => {
      unlockAudioGlobal();
      if (!hasSpeechStarted) {
        triggerWelcomeAudio(true);
      }
    };

    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    window.addEventListener('click', handleGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
    };
  }, [hasSpeechStarted]);

  // Multi-slide movie intro timeline loop
  useEffect(() => {
    const slideDuration = 5750; // 5.75 seconds per slide (23s total splash duration, +2s added)

    const progressIntervalMs = 100;
    const totalDuration = slides.length * slideDuration;

    let elapsed = currentSlide * slideDuration;

    const progressTimer = setInterval(() => {
      elapsed += progressIntervalMs;
      const currentPct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentPct);

      const newSlideIdx = Math.floor(elapsed / slideDuration);

      if (newSlideIdx >= slides.length) {
        // Ensure voice greeting (both ElevenLabs audio and Web Speech) has finished speaking before landing page hits
        const isStillSpeaking = isAnySpeechActive();
        if (isStillSpeaking && elapsed < 28000) {
          // Keep progress bar at 100% and wait for speech synthesis to conclude
          return;
        }

        clearInterval(progressTimer);
        handleFinish();
      } else if (newSlideIdx !== currentSlide) {
        setCurrentSlide(newSlideIdx);
      }
    }, progressIntervalMs);

    return () => clearInterval(progressTimer);
  }, [currentSlide, slides.length]);

  const handleFinish = () => {
    unlockAudioGlobal();
    playRoomTransitionSound();
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  // Clean, professional Date & Time formatting
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const currentSlideData = slides[currentSlide];

  const handleInteraction = () => {
    unlockAudioGlobal();
    if (!hasSpeechStarted) {
      triggerWelcomeAudio(true);
    }
  };

  return (
    <div 
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onPointerDown={handleInteraction}
      className={`fixed inset-0 z-[100] h-[100dvh] max-h-[100dvh] w-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none transition-all duration-700 ${isEntering ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.95)_0,rgba(2,6,23,1)_100%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0,transparent_75%)] pointer-events-none"></div>

      {/* Top Fixed Live Header Banner + Integrated Progress Bar */}
      <div className="relative z-20 w-full flex-shrink-0">
        <LiveHeaderBar />
        <div className="w-full bg-slate-900/90 h-1 sm:h-1.5 overflow-hidden shadow-inner border-b border-slate-800/60">
          <div 
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 h-full transition-all duration-75 linear shadow-[0_0_10px_#facc15]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Center Stage - Surgically Aligned Video & Clock */}
      <div className="relative z-10 flex flex-col items-center justify-evenly gap-6 sm:gap-10 text-center px-3 py-6 sm:py-10 max-w-4xl mx-auto w-full flex-1 min-h-0 overflow-y-auto">
        
        {/* Video Panel - Adjusted dimensions for mobile */}
        <div className="w-full flex justify-center flex-shrink-0">
          <VideoPanel subtitle="" className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm" videoHeightClass="h-40 sm:h-48 md:h-56" />
        </div>

        {/* Slide Content Container - Smooth Right-To-Left Track Transition */}
        <div className="w-full flex-shrink-0 min-h-[60px] sm:min-h-[75px] flex flex-col justify-center overflow-hidden pt-1">
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((s) => (
              <div 
                key={s.id} 
                className="w-full flex-shrink-0 flex flex-col items-center justify-center px-2 py-0.5"
              >
                {/* First Layer: Primary Title */}
                <h1 className={`text-[8vw] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${s.gradientText} drop-shadow-[0_0_25px_rgba(56,189,248,0.3)] uppercase leading-none mb-1.5 sm:mb-2 font-sans text-center whitespace-nowrap`}>
                  {s.title}
                </h1>

                {/* Second Layer: Tagline */}
                {s.tagline && (
                  <div className="text-[3vw] sm:text-base md:text-xl font-mono tracking-[0.18em] text-yellow-400 uppercase font-bold mb-1 sm:mb-1.5 whitespace-nowrap px-2 text-center">
                    {s.tagline}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unified Single Marquee Ticker independent of splash page changes */}
          <div className="w-full overflow-hidden flex whitespace-nowrap text-[4.5vw] sm:text-xl md:text-2xl lg:text-3xl text-white font-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-wide mt-2 sm:mt-4">
            <div className="animate-[marquee_35s_linear_infinite] inline-flex min-w-max">
              <span className="px-6 flex items-center">
                Your One-Stop Destination for Life Insurance Taxes Estate Protection <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> 1,270+ Visitors & Counting <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> A Legacy Built On Trust Protection Integrity <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Comprehensive Financial Tax Insurance Assurance <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Protecting South Florida Families Business Wealth <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Serving Dade Broward Palm Beach <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span>
              </span>
              <span className="px-6 flex items-center">
                Your One-Stop Destination for Life Insurance Taxes Estate Protection <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> 1,270+ Visitors & Counting <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> A Legacy Built On Trust Protection Integrity <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Comprehensive Financial Tax Insurance Assurance <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Protecting South Florida Families Business Wealth <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span> Serving Dade Broward Palm Beach <span className="text-yellow-400 mx-4 sm:mx-6 font-black text-lg sm:text-2xl md:text-3xl">•</span>
              </span>
            </div>
          </div>
        </div>

        {/* Clock & Date/Time Section - Centered & Symmetrically Spaced */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 my-2 sm:my-4">
          <AnalogueClock className="pt-0 pb-0" />
          <EmbossedDigitalClock className="mt-8 sm:mt-12 translate-y-3 scale-90 sm:scale-100 origin-top" isDarkBg={true} small={false} />
        </div>

      </div>

      {/* Bottom Bar Controls with Footer Banner */}
      <div className="relative z-20 w-full flex-shrink-0 space-y-1.5 px-3 sm:px-6 py-2 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="text-center flex flex-col items-center justify-center text-center gap-0.5">
            <h3 className="text-base sm:text-xl font-bold tracking-wider text-white uppercase drop-shadow-md">PROPHETE UNIVERSAL LLC</h3>
            <p className="text-teal-300 text-xs sm:text-base font-bold">{COMPANY_INFO.address}</p>
            <p className="text-teal-400 text-[10px] sm:text-sm font-bold opacity-80 whitespace-nowrap">Website Designer Jarvis-27</p>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-slate-800/80 pt-1.5 text-[10px] sm:text-xs font-mono text-slate-400">
          {/* Slide Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInteraction();
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'w-5 sm:w-6 bg-yellow-400 shadow-[0_0_8px_#facc15]' 
                    : 'w-1.5 sm:w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
