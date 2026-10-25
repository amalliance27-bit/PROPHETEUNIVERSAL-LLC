import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { unlockAudioGlobal, getMiamiTimeGreeting } from '../utils/sound';
import { getBusinessHoursStatus } from '../getBusinessHoursStatus';
import { speakWithElevenLabs, stopElevenLabsSpeech, ELEVENLABS_VOICES, normalizeTTSPhonetics } from '../utils/elevenlabs';

interface TourSimulatorProps {
  setPage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  page: Page;
  roomName: string;
  getSpeechText: (greeting: string, officeStatus: string) => string;
  speechDurationMs: number;
}

const getTimeGreeting = () => {
  const fullGreeting = getMiamiTimeGreeting(); // e.g. "Good morning!"
  if (fullGreeting.toLowerCase().includes('morning')) return 'morning';
  if (fullGreeting.toLowerCase().includes('afternoon')) return 'afternoon';
  if (fullGreeting.toLowerCase().includes('evening')) return 'evening';
  return 'night';
};

const SHOWCASE_STEPS: TourStep[] = [
  {
    page: Page.HOME,
    roomName: "Room 1: Main Entrance & Core Ethos",
    getSpeechText: (greeting) => 
      `Hello Good ${greeting} and welcome to Prophete Universal! I am Pandora, your AI-Executive assistant and AMA website tour guide. Here to help you navigate our services. At Prophete Universal, our founding philosophy is built around one promise: protecting family health while creating a foundation of security and assurance for the future. Founded in 2014, we are a family-focused firm serving South Florida with a range of solutions, including tax preparation, life insurance with living benefits, home and auto insurance, and financial planning. Allow me to personally guide you through our virtual rooms and introduce you to the services designed to support you, your family, and your financial journey.`,
    speechDurationMs: 42000
  },
  {
    page: Page.ABOUT_US,
    roomName: "Room 2: Executive Director Showcase - Rolin Prophete",
    getSpeechText: () => 
      `Welcome to our Executive Director Showcase! Here we proudly honor Rolin Prophete, the executive director of Prophete Universal LLC. Over the past decade, Rolin has built this firm from the ground up on a foundation of integrity, family priority, and community empowerment. Under Mr Prophete's leadership, his loyal team delivers year round personalized financial strategy, maximum tax savings, and year-round support so your family is always protected.`,
    speechDurationMs: 32000
  },
  {
    page: Page.LIFE_INSURANCE,
    roomName: "Room 3: Life Insurance & Living Benefits",
    getSpeechText: () => 
      `Next we have our Life Insurance Showcase. What sets Prophete Universal apart is our emphasis on Living Benefits. Unlike traditional life insurance, Living Benefits allow you to receive cash payments while you are alive if diagnosed with a critical illness like cancer, heart attack, or stroke. We also offer our clients tax-free Indexed Universal Life policies, whole life, annuities, and college savings plans.`,
    speechDurationMs: 30000
  },
  {
    page: Page.TAX_SERVICES,
    roomName: "Room 4: Income Tax & 2026 Regulatory",
    getSpeechText: () => 
      `Now entering our Income Tax Services Room. At Prophete Universal, We guarantee maximum tax refunds for individuals, families, and businesses with zero long waiting lines. Looking ahead to 2026, we also provide assistance to small business owners, with mandatory Corporate Transparency Act BOI filings, and also IRS electronic mandates to avoid heavy penalties.`,
    speechDurationMs: 30000
  },
  {
    page: Page.HOME_INSURANCE,
    roomName: "Room 5: Asset Protection - Home & Auto Insurance",
    getSpeechText: () => 
      `Here in our Asset Protection Showcase, we safeguard your personal properties like home, condo, flood risks, and vehicles. From standard homeowners policies and Florida flood protection to commercial auto coverage, we compare top national insurance carriers to lock in the absolute best rates for your family.`,
    speechDurationMs: 28000
  },
  {
    page: Page.APPLICATIONS,
    roomName: "Room 6: Information & Application Portal",
    getSpeechText: () => 
      `Welcome to our Application Forms Portal! This is where you can securely complete your New Client Tax Intake, apply for Insurance with Living Benefits, or request a callback. As the site hostess, I am always right here to guide you through required documents like your W-2, photo ID, or coverage details.`,
    speechDurationMs: 26000
  },
  {
    page: Page.GAME_ROOM,
    roomName: "Room 7: Waiting Lounge & Interactive Relaxation",
    getSpeechText: () => 
      `Welcome to our Waiting Lounge! Here, our clients can relax before or after their appointment. You can tune into K-LOVE 89.7 FM and live soothing radio streams, enjoy featured video presentations in The Tube, or challenge yourself with mental brain games like checkers and memory puzzles in our arcade lounge.`,
    speechDurationMs: 28000
  },
  {
    page: Page.CONTACT,
    roomName: "Room 8: Receptionist Wrap-Up & Contact Room",
    getSpeechText: (_, officeStatus) => 
      `Now… We have arrived at our final showcase, The Contact us room! You can contact Rolin Prophete and our team directly at 786-877-7635, or visit our Miami office at 11996 North Miami Avenue. Thank you so much for taking this journey with me. ${officeStatus}. <break time="1.0s" /> ... If you would like to leave a message, schedule a consultation with Rolin, or fill out an application form today? Let me know, I am here at your service. And Remember, the best ethos of all... Health is Wealth! If you do not reply or select an option within 20 seconds, I will automatically disconnect.`,
    speechDurationMs: 42000
  }
];

export const TourSimulator: React.FC<TourSimulatorProps> = ({ setPage, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inactivityTimer, setInactivityTimer] = useState<number>(20);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimersRef = useRef<NodeJS.Timeout[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getBestFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    const preferredNames = [
      'Google US English', 'Samantha', 'Karen', 'Victoria', 'Microsoft Zira',
      'Daniela', 'Tessa', 'Fiona', 'Moira', 'Rishi', 'Veena', 'Alex'
    ];
    for (const name of preferredNames) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }
    const englishFemale = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
    if (englishFemale) return englishFemale;
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    return anyEnglish || voices[0];
  };

  const stopSpeech = () => {
    stopElevenLabsSpeech();

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    scrollTimersRef.current.forEach(timer => clearTimeout(timer));
    scrollTimersRef.current = [];

    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      window.dispatchEvent(new CustomEvent('speech-end'));
    }
  };

  const speak = async (text: string, onEnd: () => void, minDurationMs: number = 25000) => {
    stopSpeech();
    let hasEnded = false;
    const startTime = Date.now();

    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = null;
        }
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }
        
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(1200, Math.min(minDurationMs - elapsed, 2500));
        
        delayTimerRef.current = setTimeout(() => {
          onEnd();
        }, remaining);
      }
    };

    // Attempt ElevenLabs TTS with Female Voice (Pandora - Rachel)
    const elevenLabsRes = await speakWithElevenLabs(text, ELEVENLABS_VOICES.FEMALE_PANDORA);
    if (elevenLabsRes.success) {
      finish();
      return;
    }

    if (!('speechSynthesis' in window)) {
      delayTimerRef.current = setTimeout(() => {
        finish();
      }, minDurationMs);
      return;
    }

    try {
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(normalizeTTSPhonetics(text));
      currentUtteranceRef.current = utterance; // Retain reference to prevent garbage collection

      utterance.lang = 'en-US';
      const bestVoice = getBestFemaleVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      utterance.rate = 0.92; // Clear, comfortable narration rate
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        window.dispatchEvent(new CustomEvent('speech-start'));
      };
      utterance.onend = () => {
        window.dispatchEvent(new CustomEvent('speech-end'));
        finish();
      };
      utterance.onerror = () => {
        window.dispatchEvent(new CustomEvent('speech-end'));
        delayTimerRef.current = setTimeout(() => {
          finish();
        }, minDurationMs);
      };

      // Set safety timeout generously (minDurationMs + 25s, minimum 65s) to NEVER interrupt active speech
      const safetyTimeout = Math.max(minDurationMs + 25000, 65000);
      safetyTimerRef.current = setTimeout(() => {
        finish();
      }, safetyTimeout);

      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();

      keepAliveRef.current = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        } else {
          if (keepAliveRef.current) {
            clearInterval(keepAliveRef.current);
            keepAliveRef.current = null;
          }
        }
      }, 250);
    } catch (e) {
      delayTimerRef.current = setTimeout(() => {
        finish();
      }, minDurationMs);
    }
  };

  useEffect(() => {
    if (isOpen && isPlaying) {
      const step = SHOWCASE_STEPS[currentStepIndex];
      const greeting = getTimeGreeting();
      const officeStatus = getBusinessHoursStatus();
      const textToSpeak = step.getSpeechText(greeting, officeStatus);
      
      setPage(step.page);
      
      // Ensure all rooms start strictly at the top of source
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Paced showcase auto-scrolling with ample breathing room
      const duration = step.speechDurationMs || 30000;
      
      // Initial pause at top of source (7.5s breathing room) before scrolling down to main showcase block
      const t1 = setTimeout(() => {
        window.scrollTo({ top: 450, behavior: 'smooth' });
      }, Math.min(7500, duration * 0.25));

      // Second scroll pause at 17s to reveal middle sections/features
      const t2 = setTimeout(() => {
        window.scrollTo({ top: 900, behavior: 'smooth' });
      }, Math.min(17000, duration * 0.55));

      // Third scroll pause at 27s to reveal lower portal details & CTAs
      const t3 = setTimeout(() => {
        window.scrollTo({ top: 1350, behavior: 'smooth' });
      }, Math.min(27000, duration * 0.8));

      scrollTimersRef.current = [t1, t2, t3];

      speak(
        textToSpeak,
        () => {
          if (currentStepIndex < SHOWCASE_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            setIsCompleted(true);
            setIsPlaying(false);
          }
        },
        duration
      );

      return () => {
        stopSpeech();
      };
    }
  }, [currentStepIndex, isPlaying, isOpen, setPage]);

  // 20-second inactivity countdown after final wrap-up step
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCompleted) {
      setInactivityTimer(20);
      interval = setInterval(() => {
        setInactivityTimer(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted]);

  useEffect(() => {
    if (isCompleted && inactivityTimer === 0) {
      handleClose();
    }
  }, [isCompleted, inactivityTimer]);

  const startShowcase = () => {
    unlockAudioGlobal();
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  const handleClose = () => {
    stopSpeech();
    setIsPlaying(false);
    setIsCompleted(false);
    setPage(Page.HOME);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    onClose();
  };

  const prevIsOpenRef = useRef<boolean>(false);

  // Trigger showcase start when isOpen changes to true
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      startShowcase();
    } else if (!isOpen && prevIsOpenRef.current) {
      stopSpeech();
      setIsPlaying(false);
      setIsCompleted(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = SHOWCASE_STEPS[currentStepIndex];

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-auto">
      <button 
        onClick={handleClose}
        type="button"
        className="px-5 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 hover:border-red-500/80 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-2xl transition-all flex items-center gap-2.5 whitespace-nowrap tracking-wider uppercase cursor-pointer active:scale-95"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
        Stop Tour
      </button>
    </div>
  );
};

