import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';

interface RadioPlayerProps {
  isMicActive: boolean;
  isTourActive: boolean;
  isWaitingRoom?: boolean;
  isSplashActive?: boolean;
  isHomePage?: boolean;
}

export interface RadioStation {
  id: string;
  name: string;
  desc: string;
  url: string;
  fallbackUrl?: string;
}

export const STATIONS: RadioStation[] = [
  {
    id: 'k-love-897',
    name: 'K-LOVE 89.7 FM (WMLV South Florida)',
    desc: 'Positive, Encouraging Contemporary Christian Radio & Worship Hits',
    url: 'https://rtn.cdnstream1.com/2580_96.aac',
    fallbackUrl: 'https://ais-sa8.cdnstream1.com/3328_64/KSBJ.aac'
  },
  {
    id: 'gospel-praise-radio',
    name: 'JOY FM & Gospel Praise Radio',
    desc: 'Uplifting Contemporary Christian & Inspirational Gospel Music',
    url: 'https://ais-sa8.cdnstream1.com/3328_64/KSBJ.aac',
    fallbackUrl: 'https://ice7.securenetsystems.net/WJIE'
  },
  {
    id: 'soothing-ambient-reading',
    name: 'Soothing Ambient Reading & Focus',
    desc: 'Soft, deeply relaxing ambient space music for quiet reading and focused thought',
    url: 'https://ice1.somafm.com/deepspaceone-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/deepspaceone-128-mp3'
  },
  {
    id: 'drone-zone-ambient',
    name: 'Drone Zone Soothing Atmospheres',
    desc: 'Minimalist, tranquil, and seamless deep ambient soundscapes',
    url: 'https://ice1.somafm.com/dronezone-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/dronezone-128-mp3'
  },
  {
    id: 'sleepbot-environmental',
    name: 'Sleepbot Soft Environmental Ambient',
    desc: 'Calm ambient electronics & quiet soundscapes ideal for reading and rest',
    url: 'https://ice1.somafm.com/sleepbot-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/sleepbot-128-mp3'
  },
  {
    id: 'soothing-ambient',
    name: 'Soothing Ambient & Chill',
    desc: 'Deeply relaxing ambient, chillout, and peaceful rhythms',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/groovesalad-128-mp3'
  },
  {
    id: 'soothing-lush',
    name: 'Lush Soothing Lounge',
    desc: 'Sensuous, gentle vocals & soothing lounge sounds',
    url: 'https://ice1.somafm.com/lush-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/lush-128-mp3'
  },
  {
    id: 'illstreet-lounge',
    name: 'Illstreet Classic Lounge',
    desc: 'Smooth instrumental lounge, vintage chill, and light background beats',
    url: 'https://ice1.somafm.com/illstreet-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/illstreet-128-mp3'
  },
  {
    id: 'secret-agent-chill',
    name: 'Secret Agent Smooth',
    desc: 'Smooth, sophisticated & relaxing ambient lounge music',
    url: 'https://ice1.somafm.com/secretagent-128-mp3',
    fallbackUrl: 'https://ice2.somafm.com/secretagent-128-mp3'
  },
  {
    id: 'rain-nature',
    name: 'Peaceful Nature & Rain',
    desc: 'Calm Rain, Forest, and Peaceful Nature Sounds',
    url: 'https://az1.mediacp.eu/listen/natureradiosleep/radio.mp3'
  },
  {
    id: 'classical-music',
    name: 'Classical WQXR',
    desc: 'Timeless Classical Music and Soothing Symphonies',
    url: 'https://stream.wqxr.org/wqxr'
  },
  {
    id: 'haitian-kompa',
    name: 'Antilles Kompa Gold',
    desc: 'Haitian Kompa, Zouk & Cultural Melodies',
    url: 'https://antillesmedia.pro-fhi.net/antillesmediakompa'
  },
  {
    id: 'caribbean-flavor',
    name: 'FlavorJamz Caribbean',
    desc: 'Authentic Caribbean & Tropical Rhythms',
    url: 'https://stream.flavorjamz.com/stream.mp3'
  },
  {
    id: 'miami-beach',
    name: 'Miami Beach Radio',
    desc: 'Live from Miami Beach, Tropical & Dance',
    url: 'https://streaming.radiostreamlive.com/miamibeachradio_devices'
  },
  {
    id: 'big-1059',
    name: 'BIG 105.9 Miami',
    desc: 'South Florida\'s Classic Rock Station',
    url: 'https://stream.revma.ihrhls.com/zc557'
  },
  {
    id: 'hip-hop-rnb',
    name: '100 Hip Hop and RNB FM',
    desc: 'Florida\'s best Hip Hop and R&B hits',
    url: 'https://streaming.shoutcast.com/100-hip-hop-and-rnb-fm'
  },
  {
    id: 'el-nuevo-zol',
    name: 'El Nuevo Zol 106.7',
    desc: 'Miami\'s Hottest Latin & Reggaeton',
    url: 'https://liveaudio.lamusica.com/MIA_WXDJ_icy'
  },
  {
    id: 'joy-fm',
    name: 'JOY FM Florida',
    desc: 'Uplifting Contemporary Christian Music',
    url: 'https://rtn.cdnstream1.com/2580_96.aac'
  },
  {
    id: 'chill-lounge',
    name: 'Chill Lounge Florida',
    desc: 'Relaxing ambient and lounge sounds',
    url: 'https://vip2.fastcast4u.com/proxy/chillfla?mp=/1'
  }
];

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
  isMicActive,
  isTourActive,
  isWaitingRoom = false,
  isSplashActive = false,
  isHomePage = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUserEnabled, setIsUserEnabled] = useState<boolean>(true);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.10); // Soft 10% ambient background volume
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isSpeechSynthesizing, setIsSpeechSynthesizing] = useState<boolean>(false);
  const [hasLandingDelayFinished, setHasLandingDelayFinished] = useState<boolean>(false);
  const [isAutoStopped, setIsAutoStopped] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStation = STATIONS[currentStationIndex];

  // Helper to cleanly cancel any ongoing audio volume fade animation
  const cancelFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // Helper to smoothly fade audio volume to target level
  const fadeAudioTo = (targetVol: number, durationMs: number = 4000) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelFade();

    const startVol = audio.volume;
    const diff = targetVol - startVol;
    if (Math.abs(diff) < 0.005) {
      audio.volume = targetVol;
      return;
    }

    const intervalStepMs = 50;
    const steps = Math.max(10, Math.floor(durationMs / intervalStepMs));
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        cancelFade();
        return;
      }
      currentStep++;
      const progress = currentStep / steps;
      // Gentle cubic ease-out curve for natural human auditory perception
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const nextVol = Math.max(0, Math.min(1, startVol + diff * easeProgress));
      audioRef.current.volume = nextVol;

      if (currentStep >= steps) {
        audioRef.current.volume = targetVol;
        cancelFade();
      }
    }, intervalStepMs);
  };

  // Helper to load either HLS .m3u8 or standard MP3/AAC streams
  const loadSource = (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              hlsRef.current = null;
              if (currentStationRef.current.fallbackUrl && url !== currentStationRef.current.fallbackUrl) {
                loadSource(currentStationRef.current.fallbackUrl);
              }
            }
          }
        });
        hlsRef.current = hls;
      } else {
        audio.src = url;
        audio.load();
      }
    } else {
      audio.src = url;
      audio.load();
    }
  };

  // Keep refs up-to-date for global listeners and timers
  const isSplashActiveRef = useRef(isSplashActive);
  const isMicActiveRef = useRef(isMicActive);
  const isTourActiveRef = useRef(isTourActive);
  const isVideoPlayingRef = useRef(isVideoPlaying);
  const isSpeechSynthesizingRef = useRef(isSpeechSynthesizing);
  const isHomePageRef = useRef(isHomePage);
  const isWaitingRoomRef = useRef(isWaitingRoom);
  const isUserEnabledRef = useRef(isUserEnabled);
  const currentStationRef = useRef(currentStation);
  const hasLandingDelayFinishedRef = useRef(hasLandingDelayFinished);

  useEffect(() => {
    isSplashActiveRef.current = isSplashActive;
    isMicActiveRef.current = isMicActive;
    isTourActiveRef.current = isTourActive;
    isVideoPlayingRef.current = isVideoPlaying;
    isSpeechSynthesizingRef.current = isSpeechSynthesizing;
    isHomePageRef.current = isHomePage;
    isWaitingRoomRef.current = isWaitingRoom;
    isUserEnabledRef.current = isUserEnabled;
    currentStationRef.current = currentStation;
    hasLandingDelayFinishedRef.current = hasLandingDelayFinished;
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (!isSplashActive) {
      // 10-second delay before radio auto-starts on landing to ensure greetings & announcements play cleanly without sound clash
      timer = setTimeout(() => {
        setHasLandingDelayFinished(true);
      }, 10000);
    } else {
      setHasLandingDelayFinished(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSplashActive]);

  // 4-Minute Auto-Stop Timer to conserve bandwidth and stream calls
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
        setIsUserEnabled(false);
        setIsAutoStopped(true);
      }, 4 * 60 * 1000); // 4 minutes
    } else {
      if (timer) clearTimeout(timer);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying]);

  // Track portal target in Waiting Room
  useEffect(() => {
    if (isWaitingRoom) {
      const el = document.getElementById('radio-lounge-container');
      setPortalContainer(el);
    } else {
      setPortalContainer(null);
    }
  }, [isWaitingRoom]);

  // Listen for speech synthesis / greeting events
  useEffect(() => {
    const handleSpeechStart = () => setIsSpeechSynthesizing(true);
    const handleSpeechEnd = () => setIsSpeechSynthesizing(false);

    const checkSpeech = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setIsSpeechSynthesizing(window.speechSynthesis.speaking);
      }
    };

    const interval = setInterval(checkSpeech, 250);

    window.addEventListener('speech-start', handleSpeechStart);
    window.addEventListener('speech-end', handleSpeechEnd);

    return () => {
      clearInterval(interval);
      window.removeEventListener('speech-start', handleSpeechStart);
      window.removeEventListener('speech-end', handleSpeechEnd);
    };
  }, []);

  // Listen for video play/pause events across the app
  useEffect(() => {
    const handleVideoPlay = () => setIsVideoPlaying(true);
    const handleVideoPause = () => setIsVideoPlaying(false);

    window.addEventListener('video-play', handleVideoPlay);
    window.addEventListener('video-pause', handleVideoPause);

    return () => {
      window.removeEventListener('video-play', handleVideoPlay);
      window.removeEventListener('video-pause', handleVideoPause);
    };
  }, []);

  // Global Audio Element Initialization
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0; // Initialize at 0 to ensure gradual, smooth fade-in on start
    audioRef.current = audio;

    const handleError = () => {
      const station = currentStationRef.current;
      if (audio.src && !audio.src.includes('/api/radio-stream') && station.url) {
        // Try server-side proxy if direct client stream was blocked
        const proxyUrl = `/api/radio-stream?url=${encodeURIComponent(station.url)}`;
        loadSource(proxyUrl);
        if (
          isUserEnabledRef.current &&
          !isSplashActiveRef.current &&
          hasLandingDelayFinishedRef.current &&
          !isMicActiveRef.current &&
          !isTourActiveRef.current &&
          !isVideoPlayingRef.current &&
          !isSpeechSynthesizingRef.current &&
          (isHomePageRef.current || isWaitingRoomRef.current)
        ) {
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      } else if (station.fallbackUrl && audio.src !== station.fallbackUrl) {
        loadSource(station.fallbackUrl);
        if (
          isUserEnabledRef.current &&
          !isSplashActiveRef.current &&
          hasLandingDelayFinishedRef.current &&
          !isMicActiveRef.current &&
          !isTourActiveRef.current &&
          !isVideoPlayingRef.current &&
          !isSpeechSynthesizingRef.current &&
          (isHomePageRef.current || isWaitingRoomRef.current)
        ) {
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('error', handleError);

    // Global user gesture listener to unlock audio without prematurely triggering auto-play before delay finishes
    const unlockAudio = () => {
      if (isSplashActiveRef.current) {
        return;
      }
      if (!isHomePageRef.current && !isWaitingRoomRef.current) {
        return;
      }

      if (audioRef.current) {
        if (!audioRef.current.src && !hlsRef.current) {
          loadSource(currentStationRef.current.url);
        }
        if (audioRef.current.paused && audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
      }

      // Only auto-play on touch/click if the 15-second landing delay has naturally completed
      if (
        audioRef.current &&
        audioRef.current.paused &&
        isUserEnabledRef.current &&
        hasLandingDelayFinishedRef.current &&
        !isMicActiveRef.current &&
        !isTourActiveRef.current &&
        !isVideoPlayingRef.current &&
        !isSpeechSynthesizingRef.current
      ) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      audio.pause();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audio.removeEventListener('error', handleError);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Handle station changes
  useEffect(() => {
    if (audioRef.current) {
      loadSource(currentStation.url);
      if (
        isUserEnabled &&
        !isSplashActive &&
        hasLandingDelayFinished &&
        !isMicActive &&
        !isTourActive &&
        !isVideoPlaying &&
        !isSpeechSynthesizing &&
        (isHomePage || isWaitingRoom)
      ) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (currentStation.fallbackUrl) {
              loadSource(currentStation.fallbackUrl);
              audioRef.current!.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
              setIsPlaying(false);
            }
          });
      }
    }
  }, [currentStationIndex]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current && shouldBeAudible && !fadeIntervalRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Master Volume & Ducking control
  const shouldBeAudible =
    isUserEnabled &&
    !isSplashActive &&
    hasLandingDelayFinished &&
    !isMicActive &&
    !isTourActive &&
    !isVideoPlaying &&
    !isSpeechSynthesizing &&
    (isHomePage || isWaitingRoom);

  // Synchronize audio volume dynamically (5s gentle fade-in on auto-start / un-ducking, soft ducking during speech/tour)
  useEffect(() => {
    if (audioRef.current) {
      if (shouldBeAudible) {
        // Slow, soothing 5-second fade-in so music gently rises into the background without startling the listener
        fadeAudioTo(volume, 5000);
      } else if (isUserEnabled && !isSplashActive && (isHomePage || isWaitingRoom)) {
        // Soft duck down over 400ms when voice assistant, mic, or tour is active
        fadeAudioTo(0, 400);
      }
    }
  }, [shouldBeAudible, isUserEnabled, isSplashActive, isHomePage, isWaitingRoom]);

  // Master Audio Play/Pause state based on user enabled, page, and splash completion
  const shouldBeActive = isUserEnabled && !isSplashActive && hasLandingDelayFinished && (isHomePage || isWaitingRoom);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldBeActive) {
      if (!audio.src && !hlsRef.current) {
        loadSource(currentStation.url);
      }
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          if (err.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
            const handleFirstUserInteraction = () => {
              if (
                audioRef.current && 
                isUserEnabledRef.current && 
                !isSplashActiveRef.current && 
                hasLandingDelayFinishedRef.current &&
                (isHomePageRef.current || isWaitingRoomRef.current)
              ) {
                audioRef.current.play().then(() => {
                  setIsPlaying(true);
                  setAutoplayBlocked(false);
                }).catch(() => {
                  setIsPlaying(false);
                });
              }
              window.removeEventListener('pointerdown', handleFirstUserInteraction);
              window.removeEventListener('click', handleFirstUserInteraction);
            };
            window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true });
            window.addEventListener('click', handleFirstUserInteraction, { once: true });
          } else {
            setIsPlaying(false);
          }
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [
    shouldBeActive,
    currentStationIndex
  ]);

  const toggleUserRadio = () => {
    const nextState = !isUserEnabled;
    setIsUserEnabled(nextState);
    if (!nextState) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsAutoStopped(false);
      setAutoplayBlocked(false);
      setHasLandingDelayFinished(true); // User explicitly clicked turn ON -> start immediately
      if (
        audioRef.current &&
        !isSplashActive &&
        !isMicActive &&
        !isTourActive &&
        !isVideoPlaying &&
        !isSpeechSynthesizing &&
        (isHomePage || isWaitingRoom)
      ) {
        if (!audioRef.current.src && !hlsRef.current) {
          loadSource(currentStation.url);
        }
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleManualPlay = () => {
    setIsAutoStopped(false);
    setAutoplayBlocked(false);
    setIsUserEnabled(true);
    setHasLandingDelayFinished(true); // User explicitly clicked Play -> start immediately
    if (
      audioRef.current &&
      !isSplashActive &&
      !isMicActive &&
      !isTourActive &&
      !isVideoPlaying &&
      !isSpeechSynthesizing &&
      (isHomePage || isWaitingRoom)
    ) {
      if (!audioRef.current.src && !hlsRef.current) {
        loadSource(currentStation.url);
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const isDuckedBySpeech = isUserEnabled && (isMicActive || isTourActive || isSpeechSynthesizing);

  const changeStation = (newIndex: number) => {
    const idx = (newIndex + STATIONS.length) % STATIONS.length;
    setCurrentStationIndex(idx);
    setIsAutoStopped(false);
    setAutoplayBlocked(false);
    setIsUserEnabled(true);
    setHasLandingDelayFinished(true); // User explicitly changed station -> start immediately

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = STATIONS[idx].url;
      audioRef.current.load();
      if (
        !isSplashActive &&
        !isMicActive &&
        !isTourActive &&
        !isVideoPlaying &&
        !isSpeechSynthesizing &&
        (isHomePage || isWaitingRoom)
      ) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (STATIONS[idx].fallbackUrl) {
              audioRef.current!.src = STATIONS[idx].fallbackUrl!;
              audioRef.current!.load();
              audioRef.current!.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            } else {
              setIsPlaying(false);
            }
          });
      }
    }
  };

  const nextStation = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    changeStation(currentStationIndex + 1);
  };

  const prevStation = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    changeStation(currentStationIndex - 1);
  };

  // Waiting Room Rich Radio Panel UI
  const waitingRoomUI = (
    <div className="bg-slate-900/90 border-2 border-teal-500/80 rounded-2xl p-6 my-4 max-w-2xl mx-auto shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-300 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-300 bg-teal-400/10 px-2.5 py-1 rounded border border-teal-400/30">
                Live Radio Lounge
              </span>
              {isPlaying && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-1">
              {currentStation.name}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              {currentStation.desc}
            </p>
          </div>
        </div>

        {/* Toggle / Unmute Button */}
        <button
          onClick={autoplayBlocked ? handleManualPlay : toggleUserRadio}
          className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center gap-2 ${
            autoplayBlocked
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-2 border-amber-300 animate-bounce'
              : isUserEnabled
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-2 border-emerald-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
          }`}
        >
          {autoplayBlocked ? (
            <>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Click To Play Music
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isUserEnabled ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 9l4 4m0-4l-4 4" />
                )}
              </svg>
              {isUserEnabled ? 'Lounge Radio: ON' : 'Lounge Radio: OFF'}
            </>
          )}
        </button>
      </div>

      {/* Auto-pause notice */}
      {isDuckedBySpeech && (
        <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Lounge radio auto-paused for Voice Assistant / Tour. Will resume automatically when finished!
        </div>
      )}

      {/* Auto-stop notice after 4 minutes */}
      {isAutoStopped && !isDuckedBySpeech && (
        <div className="mt-3 p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Lounge radio auto-paused after 4 minutes to conserve bandwidth. Click "Lounge Radio: OFF" above or change station to resume!
        </div>
      )}

      {/* Controls & Volume Slider */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Station:</span>
          
          <button
            onClick={prevStation}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 active:scale-95 transition-transform"
            title="Previous Station"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <select
            value={currentStationIndex}
            onChange={(e) => changeStation(Number(e.target.value))}
            className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-700 outline-none focus:border-teal-400 cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
          >
            {STATIONS.map((st, idx) => (
              <option key={st.id} value={idx}>
                {st.name}
              </option>
            ))}
          </select>

          <button
            onClick={nextStation}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 active:scale-95 transition-transform"
            title="Next Station"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              cancelFade();
              if (audioRef.current && shouldBeAudible) {
                audioRef.current.volume = val;
              }
            }}
            className="w-28 accent-teal-400 cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-mono w-8 text-right font-bold">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );

  if (isWaitingRoom && portalContainer) {
    return createPortal(waitingRoomUI, portalContainer);
  }

  return null;
};
