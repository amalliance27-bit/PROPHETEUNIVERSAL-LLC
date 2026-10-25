import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Calendar, Film, Sparkles, CheckCircle } from 'lucide-react';
import { ShootingArrowReturnButton } from './ShootingArrowReturnButton';

interface TheaterRoomProps {
  onReturnToArcade: () => void;
}

interface VideoItem {
  id: string;
  day: string;
  title: string;
  subtitle: string;
  duration: string;
  src: string;
  category: string;
}

const WEEKLY_VIDEOS: VideoItem[] = [
  {
    id: 'community-wellness',
    day: 'Community & Wellness',
    title: 'Health is Wealth & Active Living',
    subtitle: 'At Prophete Universal LLC, we believe that true wealth begins with healthy living, community teamwork, and active family wellness. Protecting your future means empowering every aspect of your life.',
    duration: '3:00',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4',
    category: 'Community & Wellness'
  },
  {
    id: 'mon',
    day: 'Monday',
    title: 'Mindful Beginnings & Financial Clarity',
    subtitle: 'Start your week with peaceful focus and smart tax planning insights.',
    duration: '2:45',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4',
    category: 'Monday Focus'
  },
  {
    id: 'tue',
    day: 'Tuesday',
    title: 'Understanding Florida PIP & Auto Protection',
    subtitle: 'A guide to staying protected on Florida roads with optimal coverage.',
    duration: '3:10',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c621669460a56209dc09476b7e/Pu%20universal%20spin.mp4',
    category: 'Tuesday Auto'
  },
  {
    id: 'wed',
    day: 'Wednesday',
    title: 'Life Insurance Living Benefits Breakdown',
    subtitle: 'How modern policies pay out benefits while you are still living.',
    duration: '2:30',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4',
    category: 'Wednesday Life'
  },
  {
    id: 'thu',
    day: 'Thursday',
    title: 'Homeowners & Flood Coverage Essential Blueprint',
    subtitle: 'Protecting your South Florida property and valuable possessions.',
    duration: '3:45',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c621669460a56209dc09476b7e/Pu%20universal%20spin.mp4',
    category: 'Thursday Home'
  },
  {
    id: 'fri',
    day: 'Friday',
    title: 'Max Tax Refund & Year-Round Deductions',
    subtitle: 'Top strategies to optimize your annual tax return legally and securely.',
    duration: '2:15',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4',
    category: 'Friday Wealth'
  },
  {
    id: 'sat',
    day: 'Saturday',
    title: 'Commercial Fleet & Business Risk Management',
    subtitle: 'Safeguarding your vehicles, employees, and commercial enterprise.',
    duration: '4:00',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c621669460a56209dc09476b7e/Pu%20universal%20spin.mp4',
    category: 'Saturday Fleet'
  },
  {
    id: 'sun',
    day: 'Sunday',
    title: 'Family Retirement & Legacy Wealth Planning',
    subtitle: 'Building enduring peace of mind and tax-free retirement solutions.',
    duration: '3:20',
    src: 'https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4',
    category: 'Sunday Legacy'
  }
];

export const TheaterRoom: React.FC<TheaterRoomProps> = ({ onReturnToArcade }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentVideo = WEEKLY_VIDEOS[activeVideoIndex];

  const handleSelectVideo = (index: number) => {
    setActiveVideoIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-10 relative pb-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500/10 via-teal-500/10 to-amber-500/10 border border-pink-500/30 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-300 max-w-full overflow-hidden">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-teal-200 to-amber-300 whitespace-nowrap">Prophete Universal Movie Theater Lounge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-teal-300 to-amber-400 tracking-wider uppercase">
            Movie Theater Lounge
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            <span className="text-pink-300">Relax in our lounge theater.</span> <span className="text-teal-300">Enjoy our featured video presentations</span> or <span className="text-amber-300">pick any video from our weekly premiere list below.</span>
          </p>
        </div>

        {/* Main Video Stage */}
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="relative w-full h-56 sm:h-72 md:h-[380px] lg:h-[440px] bg-black rounded-xl overflow-hidden group shadow-inner">
            <video
              ref={videoRef}
              src={currentVideo.src}
              className="w-full h-full object-contain bg-slate-950"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Watermark Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>NOW SHOWING • {currentVideo.day.toUpperCase()} FEATURE</span>
            </div>

            {/* Overlay Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-700/80 p-1.5 rounded-lg z-10">
              <button
                onClick={togglePlay}
                className="px-2.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all shadow flex items-center gap-1 text-xs uppercase"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={toggleMute}
                className={`px-2.5 py-1.5 rounded-md font-black transition-all shadow flex items-center gap-1 text-xs uppercase ${
                  isMuted ? 'bg-slate-800 text-amber-300 border border-amber-500/30' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isMuted ? 'Unmute' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Off-video Action Controls Bar */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded border border-pink-500/30">
                  {currentVideo.category}
                </span>
                <span className="text-xs text-teal-300 font-mono">Duration: {currentVideo.duration}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-teal-200 to-amber-300">{currentVideo.title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {currentVideo.subtitle}
              </p>
            </div>

            {/* Direct Play Action Button */}
            <button
              onClick={togglePlay}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-teal-400 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Video' : 'Start Video'}</span>
            </button>
          </div>
        </div>

        {/* 7 Days of the Week Video Lounge List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-teal-300 to-amber-400">7-Day Weekly Feature Reel</span>
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click any title to play</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {WEEKLY_VIDEOS.map((item, index) => {
              const isActive = index === activeVideoIndex;
              const isFeatured = index === 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectVideo(index)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    isActive
                      ? 'bg-slate-900/90 border-pink-400 ring-1 ring-pink-400/50 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isFeatured
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.day}
                      </span>
                      <span className="text-xs text-teal-300 font-mono">{item.duration}</span>
                    </div>

                    <h4 
                      className={`font-bold text-sm sm:text-base leading-snug hover:underline ${
                        isActive ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-pink-300 font-semibold">{item.category}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVideo(index);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        isActive 
                          ? 'bg-amber-400 text-slate-950' 
                          : 'bg-slate-800 text-teal-300 hover:bg-teal-500 hover:text-slate-950'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Button back to Arcade */}
        <div className="pt-8 flex justify-center">
          <ShootingArrowReturnButton
            onClick={onReturnToArcade}
            label="Return to Arcade"
            direction="left"
          />
        </div>

      </div>
    </div>
  );
};
