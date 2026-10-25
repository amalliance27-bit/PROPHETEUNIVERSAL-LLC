import React, { useState, useEffect, useRef } from 'react';
import { Page } from './types';
import { useGeminiLive } from './hooks/useGeminiLive';
import { NavBar } from './components/NavBar';
import { VoiceIndicator } from './components/VoiceIndicator';
import { ApplicationsRoom, TaxForm, InsuranceForm } from './components/ApplicationsRoom';
import { TourSimulator } from './components/TourSimulator';
import { RadioPlayer } from './components/RadioPlayer';
import { SplashScreen } from './components/SplashScreen';
import { LiveHeaderBar } from './components/LiveHeaderBar';
import { VideoPanel } from './components/VideoPanel';
import { ProtectionCalculator } from './components/ProtectionCalculator';
import { FloridaAutoEstimator } from './components/FloridaAutoEstimator';
import { ShootingArrowReturnButton } from './components/ShootingArrowReturnButton';
import { TestimonialTicker } from './components/TestimonialTicker';
import { HeroRotatingQuote } from './components/HeroRotatingQuote';
import { CheckersGame } from './components/CheckersGame';
import { TheaterRoom } from './components/TheaterRoom';
import { VIPGameRoom } from './components/VIPGameRoom';
import { FAQRoom } from './components/FAQRoom';
import { Projects2027Room } from './components/Projects2027Room';
import { GoogleCalendarUI } from './components/GoogleCalendarUI';
import { getBusinessHoursStatus } from './getBusinessHoursStatus';
import { COMPANY_INFO } from './constants';
import { playRoomTransitionSound, unlockAudioGlobal, speakRoomAnnouncement } from './utils/sound';
import { ArrowRight, MapPin, Clock, Phone, PhoneCall, Mail, Building2, Navigation, Handshake, Share2, Globe, MessageCircle, ShieldCheck, Car, Shield, Scale, AlertTriangle, Truck, Stethoscope, FileText, Activity, Zap, Sun, Home, Building, Droplets, Key, Package, ExternalLink, Sparkles, FolderKanban } from 'lucide-react';

// --- Constants ---
const LOGO_URL = "https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/62cb067b244c96e1a2d7fa688d9121d4f7ec0e2b/pu%20logo%20white.png";
const ROLIN_PIC_URL = "https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/373d76b3b2e07d937a142e8921aa638a6d249581/Rolin%20Prophete.png";

// --- Helper Functions ---
const getPageBackground = (page: Page) => {
 switch(page) {
 case Page.LIFE_INSURANCE: return "bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950"; 
 case Page.TAX_SERVICES: return "bg-slate-950"; 
 case Page.AUTO_INSURANCE: return "bg-blue-50"; 
 case Page.HOME_INSURANCE: return "bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100"; 
 case Page.CLIENT_WISHLIST: return "bg-purple-50"; 
 case Page.CONTACT: return "bg-slate-50";
 case Page.FAQ: return "bg-teal-50"; 
 case Page.SCHEDULE_CALL: return "bg-white"; 
 case Page.WEB_DESIGN: return "bg-black"; 
 case Page.GAME_ROOM: return "bg-slate-900"; 
 case Page.THEATER: return "bg-slate-950";
 case Page.VIP_GAMES: return "bg-slate-950";
 case Page.APPLICATIONS: return "bg-slate-100";
 case Page.PROJECTS_2027: return "bg-slate-950";
 default: return "bg-teal-50"; 
 }
};

// --- Game Components ---

const TicTacToe = () => {
 const [board, setBoard] = useState(Array(9).fill(null));
 const [isXNext, setIsXNext] = useState(true);
 const [winner, setWinner] = useState<string | null>(null);

 const checkWinner = (squares: any[]) => {
 const lines = [
 [0, 1, 2], [3, 4, 5], [6, 7, 8],
 [0, 3, 6], [1, 4, 7], [2, 5, 8],
 [0, 4, 8], [2, 4, 6]
 ];
 for (let i = 0; i < lines.length; i++) {
 const [a, b, c] = lines[i];
 if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
 return squares[a];
 }
 }
 return null;
 };

 const handleClick = (i: number) => {
 if (board[i] || winner || !isXNext) return;
 const newBoard = [...board];
 newBoard[i] = 'X';
 setBoard(newBoard);
 setIsXNext(false);
 const w = checkWinner(newBoard);
 if (w) setWinner(w);
 };

 // AI Turn
 useEffect(() => {
 if (!isXNext && !winner) {
 const timer = setTimeout(() => {
 const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
 if (available.length > 0) {
 let move = available[Math.floor(Math.random() * available.length)];
 // Simple Block/Win Logic
 for (let idx of available) {
 const tempBoard = [...board];
 tempBoard[idx as number] = 'O';
 if (checkWinner(tempBoard) === 'O') { move = idx; break; }
 }
 if (move === null || move === available[Math.floor(Math.random() * available.length)]) {
 for (let idx of available) {
 const tempBoard = [...board];
 tempBoard[idx as number] = 'X';
 if (checkWinner(tempBoard) === 'X') { move = idx; break; }
 }
 }
 const newBoard = [...board];
 newBoard[move as number] = 'O';
 setBoard(newBoard);
 setIsXNext(true);
 const w = checkWinner(newBoard);
 if (w) setWinner(w);
 }
 }, 500);
 return () => clearTimeout(timer);
 }
 }, [isXNext, winner, board]);

 const reset = () => {
 setBoard(Array(9).fill(null));
 setIsXNext(true);
 setWinner(null);
 };

 return (
 <div className="flex flex-col items-center font-sans">
 <h3 className="text-2xl font-extrabold text-[#00FF41] mb-4 tracking-wider uppercase">TIC-TAC-TOE</h3>
 <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-800 p-2 rounded-lg border-2 border-[#00FF41] shadow-[0_0_10px_#00FF41]">
 {board.map((cell, i) => (
 <button 
 key={i} 
 onClick={() => handleClick(i)}
 className={`w-20 h-20 text-4xl font-black flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 transition-colors ${cell === 'X' ? 'text-yellow-400' : 'text-rose-400'}`}
 >
 {cell}
 </button>
 ))}
 </div>
 {winner && <div className="text-2xl font-extrabold text-white mb-4 animate-bounce">{winner === 'X' ? 'YOU WIN!' : 'GAME OVER'}</div>}
 <button onClick={reset} className="px-6 py-2 bg-blue-600 text-white font-extrabold rounded-full hover:bg-blue-500 uppercase tracking-wider text-sm transition-all shadow-md">Restart Game</button>
 </div>
 );
};

const MemoryGame = () => {
 const emojis = ['🚀', '🍕', '🐱', '🎸', '💎', '🍦', '🏝️', '⚡'];
 const [cards, setCards] = useState<{id: number, content: string, flipped: boolean, matched: boolean}[]>([]);
 const [flipped, setFlipped] = useState<number[]>([]);
 const [solved, setSolved] = useState(false);

 useEffect(() => {
 shuffle();
 }, []);

 const shuffle = () => {
 const deck = [...emojis, ...emojis]
 .sort(() => Math.random() - 0.5)
 .map((content, id) => ({ id, content, flipped: false, matched: false }));
 setCards(deck);
 setFlipped([]);
 setSolved(false);
 };

 const handleCardClick = (id: number) => {
 if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
 
 const newCards = [...cards];
 newCards[id].flipped = true;
 setCards(newCards);
 
 const newFlipped = [...flipped, id];
 setFlipped(newFlipped);

 if (newFlipped.length === 2) {
 const [first, second] = newFlipped;
 if (newCards[first].content === newCards[second].content) {
 newCards[first].matched = true;
 newCards[second].matched = true;
 setCards(newCards);
 setFlipped([]);
 if (newCards.every(c => c.matched)) setSolved(true);
 } else {
 setTimeout(() => {
 const resetCards = [...cards]; // Simplified for demo
 resetCards[first].flipped = false;
 resetCards[second].flipped = false;
 setCards([...resetCards]); // Force update
 setFlipped([]);
 }, 1000);
 }
 }
 };

 return (
 <div className="flex flex-col items-center font-sans">
 <h3 className="text-2xl font-extrabold text-pink-400 mb-4 tracking-wider uppercase">MEMORY MATCH</h3>
 <div className="grid grid-cols-4 gap-2 mb-4">
 {cards.map((card, i) => (
 <div 
 key={i} 
 onClick={() => handleCardClick(i)}
 className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl cursor-pointer rounded-lg transition-all duration-300 transform ${card.flipped || card.matched ? 'bg-white rotate-y-180 font-bold' : 'bg-pink-900 border-2 border-pink-500 font-extrabold text-pink-200'}`}
 >
 {(card.flipped || card.matched) ? card.content : '?'}
 </div>
 ))}
 </div>
 {solved && <div className="text-2xl font-extrabold text-white mb-4 animate-pulse">ALL MATCHED!</div>}
 <button onClick={shuffle} className="px-6 py-2 bg-pink-600 text-white font-extrabold rounded-full hover:bg-pink-500 uppercase tracking-wider text-sm transition-all shadow-md">New Game</button>
 </div>
 );
};

const RockPaperScissors = () => {
 const [score, setScore] = useState({ user: 0, cpu: 0 });
 const [result, setResult] = useState<string | null>(null);
 const [choices, setChoices] = useState<{user: string, cpu: string} | null>(null);
 const options = ['👊', '✋', '✌️'];
 
 const play = (choice: string) => {
 const cpuChoice = options[Math.floor(Math.random() * options.length)];
 setChoices({ user: choice, cpu: cpuChoice });
 if (choice === cpuChoice) {
 setResult("IT'S A TIE!");
 } else if ((choice === '👊' && cpuChoice === '✌️') || (choice === '✋' && cpuChoice === '👊') || (choice === '✌️' && cpuChoice === '✋')) {
 setResult("YOU WIN!");
 setScore(s => ({ ...s, user: s.user + 1 }));
 } else {
 setResult("CPU WINS!");
 setScore(s => ({ ...s, cpu: s.cpu + 1 }));
 }
 };

 return (
 <div className="flex flex-col items-center font-sans">
 <h3 className="text-2xl font-extrabold text-cyan-400 mb-4 tracking-wider uppercase">ROCK PAPER SCISSORS</h3>
 <div className="flex gap-8 mb-8 text-white text-xl font-bold">
 <div className="text-center"><p className="text-xs uppercase tracking-widest text-slate-300">YOU</p><p className="text-4xl font-extrabold text-cyan-400">{score.user}</p></div>
 <div className="text-center"><p className="text-xs uppercase tracking-widest text-slate-300">CPU</p><p className="text-4xl font-extrabold text-red-500">{score.cpu}</p></div>
 </div>
 <div className="h-24 flex items-center justify-center mb-6">
 {choices ? (
 <div className="flex items-center gap-4 text-5xl animate-bounce">
 <span>{choices.user}</span><span className="text-sm font-semibold text-slate-400">vs</span><span>{choices.cpu}</span>
 </div>
 ) : <p className="text-slate-300 font-medium animate-pulse text-sm">Choose your move...</p>}
 </div>
 {result && <div className="text-2xl font-extrabold text-yellow-400 mb-6 tracking-wide">{result}</div>}
 <div className="flex gap-4">
 {options.map(opt => (
 <button key={opt} onClick={() => play(opt)} className="w-20 h-20 bg-slate-800 rounded-full text-4xl border-4 border-cyan-600 hover:bg-slate-700 hover:scale-110 transition-all shadow-lg">{opt}</button>
 ))}
 </div>
 </div>
 );
};

// --- Components ---

const ReturnButton = ({ onClick }: { onClick: () => void }) => (
 <ShootingArrowReturnButton onClick={onClick} />
);

const Hero = ({ onCta, onSecondary, onExecutiveRoom }: { onCta: () => void, onSecondary: () => void, onExecutiveRoom?: () => void }) => (
  <div id="hero-section" className="relative bg-black text-white overflow-hidden shadow-2xl">
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/a4e3ea00585efd005fca3bcf846eb3de9f14b2de/PU%20skybuildiong.mp4"
      />
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10 transform-gpu">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex justify-center flex-shrink-0">
          <VideoPanel subtitle="" className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm" videoHeightClass="h-40 sm:h-48 md:h-56" />
        </div>
        <div className="flex flex-col items-center text-center max-w-4xl pt-1 w-full px-2 sm:px-4 transform-gpu">
          {/* Kept Header with the clean font and subtitle styling */}
          <h1 className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-1 text-blue-950 leading-tight uppercase max-w-full break-words drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">
            PROPHETE UNIVERSAL <span className="text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">LLC</span>
          </h1>
          {/* Subtitle & Professional Badges */}
          <div className="mt-2 mb-5 flex flex-col items-center gap-3 w-full max-w-3xl mx-auto px-2">
            <p className="text-[11px] min-[360px]:text-xs min-[400px]:text-sm sm:text-base md:text-xl font-bold tracking-tight min-[380px]:tracking-wide sm:tracking-widest text-cyan-100 uppercase text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
              Tax Preparation <span className="text-yellow-300 mx-1 sm:mx-1.5 opacity-90">•</span> Insurance Protection
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-0.5">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-slate-950/70 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
                Serving South Florida Since 2014
              </span>

              <span className="inline-flex items-center px-4 py-1 rounded-full bg-pink-600/95 text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-[0_2px_14px_rgba(219,39,119,0.5)] backdrop-blur-md">
                <span>{getBusinessHoursStatus()}</span>
              </span>
            </div>
          </div>
          
          {/* Bioluminescent Shimmer Border (Aurora Rim) Outer Container */}
          <div className="mt-3 mb-2 relative rounded-2xl p-[2px] overflow-hidden w-full max-w-3xl sm:max-w-4xl mx-auto shadow-2xl transform-gpu">
            {/* Motorized aura particle line orbiting along the outer glass border */}
            <div className="absolute -inset-full animate-aurora-spin bg-[conic-gradient(from_0deg,#06b6d4_0deg,transparent_70deg,transparent_180deg,#f59e0b_240deg,#a855f7_300deg,#06b6d4_360deg)] opacity-85 blur-[1px] pointer-events-none will-change-transform" />
            
            {/* Inner Glass Content Card - Transparent Glassmorphism */}
            <div className="relative animate-hypnotic-ocean-purple rounded-[14px] p-4 sm:p-6 md:p-10 backdrop-blur-xl bg-slate-950/30 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full text-left transition-colors duration-1000 z-10 transform-gpu">
              <p className="text-lg sm:text-2xl md:text-3xl text-sky-200 leading-relaxed font-medium mb-3.5 sm:mb-4">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black text-yellow-300 leading-none inline-block align-baseline mr-0.5">W</span>elcome faith, family, and friends to Prophete Universal LLC, proudly serving Miami-Dade, Broward, and Palm Beach counties.
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl text-sky-200 leading-relaxed font-medium mb-3.5 sm:mb-4">
                We offer comprehensive, affordable protection tailored to our clients' lifestyle needs. From maximizing your tax savings with expert Tax Preparation to the safeguarding of your family and assets through Life and Home & Auto Insurance Protection.
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl text-sky-200 leading-relaxed font-medium mb-3.5 sm:mb-4">
                As we enter the <span className="text-yellow-300 font-extrabold animate-pulse" style={{ animationDuration: '3s' }}>2026–2027 TAX season</span> our dedicated team of specialists is proud to serve South Florida families and business owners preserving a tradition of trust and integrity since 2014.
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-300 mb-1.5 sm:mb-2 animate-pulse" style={{ animationDuration: '4s' }}>
                Immediate guidance?
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl text-sky-200 leading-relaxed font-medium mb-3.5 sm:mb-4">
                Ask <strong>Pandora AI</strong>, our virtual assistant and web tour guide, available 24/7 to help our visitors navigate options and deliver a faster, easier explained personalized experience.
              </p>
              <span className="font-bold text-yellow-300 mt-2 block text-lg sm:text-2xl md:text-3xl tracking-wide leading-snug">
                We prioritize your family needs above everything else...
              </span>
              <div className="mt-4 sm:mt-5 font-bold">
                <span className="text-base sm:text-xl md:text-2xl block text-[#c48b59]">Rolin Prophete <span className="text-xs sm:text-base ml-1 font-bold">BSME</span></span>
                <span className="text-base sm:text-xl md:text-2xl block font-extrabold text-amber-200">Executive Director</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 w-full max-w-[280px] sm:max-w-xs md:max-w-sm justify-center mx-auto">
            <button onClick={onCta} className="w-full px-4 py-4 sm:py-5 border-2 border-yellow-200 text-sm sm:text-base font-black rounded-lg text-teal-950 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 hover:from-yellow-200 hover:to-yellow-300 transition-all duration-200 hover:scale-105 shadow-[0_4px_20px_rgba(250,204,21,0.45)] uppercase tracking-wider text-center whitespace-nowrap">
              Schedule A Consultation
            </button>
            <button onClick={onSecondary} className="w-full px-4 py-4 sm:py-5 border-2 border-cyan-300 text-base sm:text-lg md:text-xl font-black rounded-lg text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 hover:scale-105 uppercase tracking-wider text-center whitespace-nowrap shadow-[0_4px_25px_rgba(6,182,212,0.45)]">
              APPLICATION ROOM
            </button>
          </div>

          {/* Executive Director Button - Prestige Obsidian & 24K Gold Trim */}
          <div className="mt-4 w-full max-w-[280px] sm:max-w-xs md:max-w-sm flex justify-center mx-auto">
            <button 
              onClick={onExecutiveRoom} 
              className="w-full px-4 py-4 sm:py-5 border-2 border-amber-400 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-amber-300 hover:text-slate-950 text-base sm:text-lg md:text-xl font-black rounded-lg shadow-[0_4px_25px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-105 uppercase tracking-wider text-center whitespace-nowrap"
            >
              EXECUTIVE DIRECTOR
            </button>
          </div>

          <HeroRotatingQuote />
        </div>
      </div>
    </div>
  </div>
);


const Section = ({ title, subtitle, children, className = "", bottomBorder = false, id, py="py-12", bannerImage, center = false }: { title?: string, subtitle?: string, children?: React.ReactNode, className?: string, bottomBorder?: boolean, id?: string, py?: string, bannerImage?: string, center?: boolean }) => (
 <div id={id} className={`${py} px-4 sm:px-6 lg:px-8 ${className}`}>
 <div className="max-w-7xl mx-auto">
 {bannerImage ? (
 <div className="mb-10 flex justify-center">
 <img 
 src={bannerImage} 
 alt={title || "Prophete Universal Banner"} 
 className="w-full max-w-5xl rounded-2xl shadow-xl border border-slate-800 object-cover" 
 />
 </div>
 ) : title ? (
 <div className={`mb-10 ${center ? 'text-center' : ''}`}>
 <h2 className="text-3xl md:text-5xl font-extrabold text-teal-950 tracking-tight">
 {title}
 </h2>
 {subtitle && <p className="mt-3 text-xl sm:text-2xl text-slate-700 font-semibold">{subtitle}</p>}
 </div>
 ) : null}
 <div className="text-lg md:text-xl text-slate-800 font-normal leading-relaxed">
 {children}
 </div>
 </div>
 </div>
);

interface ContentRoomProps {
 title: React.ReactNode;
 subtitle?: string;
 image?: string;
 children?: React.ReactNode;
 onSchedule?: () => void;
 onApplication?: () => void;
 applicationButtonText?: string;
 containerClassName?: string;
 footerClassName?: string;
}

const ContentRoom: React.FC<ContentRoomProps> = ({ title, subtitle, image, children, onSchedule, onApplication, applicationButtonText, containerClassName, footerClassName }) => (
 <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-12 animate-fade-in">
 <div className={containerClassName || "bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"}>
 {image && (
 <div className="h-48 sm:h-64 md:h-96 w-full relative">
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
 <img src={image} alt={typeof title === 'string' ? title : "Header Image"} className="w-full h-full object-cover" />
 <div className="absolute bottom-0 left-0 p-4 sm:p-8 z-20">
 <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">{title}</h2>
 {subtitle && <p className="text-sm sm:text-lg md:text-2xl text-yellow-300 font-medium drop-shadow-md">{subtitle}</p>}
 </div>
 </div>
 )}
 {!image && (
 <div className="p-4 sm:p-8 border-b border-slate-100 bg-slate-50">
 <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-teal-900 mb-1 sm:mb-2">{title}</h2>
 {subtitle && <p className="text-sm sm:text-lg text-slate-600">{subtitle}</p>}
 </div>
 )}
 
 <div className="p-3.5 sm:p-6 md:p-12 text-slate-800 text-base md:text-lg leading-relaxed space-y-6">
 {children}
 </div>

 {(onApplication || onSchedule) && (
 <div className={footerClassName || "bg-slate-50 p-4 sm:p-8 flex flex-col items-center gap-4 border-t border-slate-200"}>
 {onApplication && (
 <button 
 onClick={onApplication} 
 className="w-full max-w-2xl py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg transition-all duration-300 uppercase tracking-wider text-base sm:text-lg md:text-xl flex items-center justify-center gap-3 border-2 border-blue-400 hover:scale-[1.01]"
 >
 <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" />
 <span>{applicationButtonText || "APPLICATION ROOM"}</span>
 </button>
 )}
 {onSchedule && <ScheduleBanner onClick={onSchedule} className="w-full shadow-none border-none py-2" />}
 </div>
 )}
 </div>
 </div>
);

const ServiceCard = ({ title, desc, onClick, gradient, textAccent, image, borderColor, descColor = "text-slate-800", roomLabel, id }: { title: string, desc: string, onClick: () => void, gradient: string, textAccent: string, image?: string, borderColor: string, descColor?: string, roomLabel?: string, id?: string }) => {
 const [isInView, setIsInView] = useState(false);
 const cardRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 ([entry]) => {
 setIsInView(entry.isIntersecting);
 },
 { threshold: 0.4 }
 );
 
 if (cardRef.current) {
 observer.observe(cardRef.current);
 }
 
 return () => {
 if (cardRef.current) {
 observer.unobserve(cardRef.current);
 }
 };
 }, []);

 return (
 <div 
 id={id}
 ref={cardRef}
 onClick={onClick}
 className={`${gradient} rounded-2xl shadow-md border-4 ${borderColor} cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden h-full flex flex-col`}
 >
 {image && (
 <div className="h-48 w-full overflow-hidden relative">
 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
 <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
 </div>
 )}

 <div className="p-8 flex flex-col flex-grow">
 <h3 className={`text-2xl md:text-3xl font-bold mb-4 relative z-10 ${textAccent}`}>{title}</h3>
 <p className={`${descColor} text-lg leading-relaxed relative z-10 font-medium mb-6 flex-grow`}>{desc}</p>
 <div className={`mt-auto flex items-center justify-between font-bold text-base md:text-lg tracking-wider relative z-10 uppercase pt-4 border-t border-black/10 ${textAccent}`}>
 <span>{roomLabel || "EXPLORE ROOM"}</span>
 <div className="relative flex h-6 w-6 items-center justify-center transform group-hover:scale-125 transition-transform duration-300">
 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 transition-colors duration-700 ${isInView ? 'bg-green-500' : 'bg-blue-500'}`}></span>
 <span className={`relative inline-flex rounded-full h-3 w-3 transition-colors duration-700 ${isInView ? 'bg-green-500' : 'bg-blue-500'}`}></span>
 </div>
 </div>
 </div>
 </div>
 );
};

const ScheduleBanner = ({ onClick, onAskPandora, isActive = false, className = "" }: { onClick?: () => void, onAskPandora?: () => void, isActive?: boolean, className?: string }) => (
 <div className={`bg-white border-y border-slate-200 shadow-sm relative z-20 ${className ? className : 'py-3 sm:py-6 md:py-8'}`}>
 <div className="max-w-4xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-12">
 {onAskPandora ? (
 <button 
 onClick={onAskPandora}
 className={`w-full max-w-[280px] sm:max-w-xs md:max-w-sm px-4 py-3 sm:py-4 ${isActive ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-pink-600 ring-4 ring-emerald-400/50' : 'bg-gradient-to-r from-[#C23968] via-pink-600 to-emerald-600'} hover:from-pink-700 hover:to-emerald-700 text-white text-base sm:text-xl font-black rounded-lg shadow-lg shadow-pink-300/40 transition-all transform hover:scale-105 uppercase tracking-wider animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite] text-center`}
 title="Activate Pandora AI Voice Assistant"
 >
 <span>{isActive ? 'PANDORA LISTENING...' : 'ASK PANDORA AI'}</span>
 </button>
 ) : (
 <button 
 onClick={onClick}
 className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm px-4 py-3 sm:py-4 bg-[#C23968] hover:bg-[#A82D57] text-white text-base sm:text-xl font-bold rounded-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all transform hover:scale-105 uppercase text-center"
 >
 SCHEDULE CONSULTATION
 </button>
 )}
 <div className="flex items-center gap-3 sm:gap-4 text-teal-800">
 <div className="bg-teal-900 text-white p-2.5 sm:p-3.5 rounded-full flex-shrink-0 shadow-sm">
 {onAskPandora ? (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
 </svg>
 ) : (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
 </svg>
 )}
 </div>
 <div className="flex flex-col text-center">
 {onAskPandora ? (
 <>
 <span className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-teal-900 whitespace-nowrap">
 24/7 Executive Support
 </span>
 <span className="text-slate-600 font-bold text-sm sm:text-base md:text-lg">
 Live AI Voice Concierge
 </span>
 </>
 ) : (
 <>
 <a href={`tel:${COMPANY_INFO.phone}`} className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#2B7A78] hover:underline whitespace-nowrap">
 {COMPANY_INFO.phone}
 </a>
 <span className="text-slate-600 font-semibold text-xs sm:text-base md:text-lg whitespace-nowrap">Speak to a licensed Agent!</span>
 <span className="text-[#2B7A78] font-bold text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 flex items-center gap-1.5 whitespace-nowrap">
 <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
 <span>Mon - Fri: 9:00 AM - 5:00 PM (EST)</span>
 </span>
 </>
 )}
 </div>
 </div>
 </div>
 </div>
);

const CalendarUI = () => <GoogleCalendarUI LOGO_URL={LOGO_URL} />;


const PAGE_TO_SECTION_ID: Partial<Record<Page, string>> = {
 [Page.LIFE_INSURANCE]: 'card-life-insurance',
 [Page.TAX_SERVICES]: 'card-tax-services',
 [Page.AUTO_INSURANCE]: 'card-auto-insurance',
 [Page.HOME_INSURANCE]: 'card-home-insurance',
 [Page.ABOUT_US]: 'card-about-us',
 [Page.CLIENT_WISHLIST]: 'card-client-wishlist',
 [Page.FAQ]: 'card-faq',
 [Page.GAME_ROOM]: 'card-arcade',
 [Page.VIP_GAMES]: 'card-arcade',
};
// --- Main App Component ---

const App: React.FC = () => {
 const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
 const [applicationTab, setApplicationTab] = useState<'tax' | 'insurance' | 'callback'>('tax');
 const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
 const [showSplash, setShowSplash] = useState<boolean>(true);

 useEffect(() => {
 if (!showSplash && !isSimulatorOpen) {
 let roomName = "";
      switch (currentPage) {
        case Page.HOME: roomName = "The Main Lobby"; break;
        case Page.CONTACT: roomName = "Contact Us"; break;
 case Page.LIFE_INSURANCE: roomName = "Life Insurance"; break;
 case Page.TAX_SERVICES: roomName = "The Tax Room"; break;
 case Page.AUTO_INSURANCE: roomName = "Auto Insurance"; break;
 case Page.HOME_INSURANCE: roomName = "Home Insurance"; break;
 case Page.ABOUT_US: roomName = "About Us"; break;
 case Page.CLIENT_WISHLIST: roomName = "Client Wish Room"; break;
 case Page.FAQ: roomName = "Frequently Asked Questions"; break;
 case Page.SCHEDULE_CALL: roomName = "Schedule A Consultation"; break;
 case Page.WEB_DESIGN: roomName = "The Web Designer Jarvis 27"; break;
 case Page.GAME_ROOM: roomName = "The Lounge"; break;
 case Page.THEATER: roomName = "Movie Theater"; break;
 case Page.VIP_GAMES: roomName = "Mind Palace and Brain Games"; break;
 case Page.APPLICATIONS: roomName = "Applications"; break;
 case Page.PROJECTS_2027: roomName = "Project 2027 Room"; break;
 default: break;
 }
 if (roomName) {
   const timer = setTimeout(() => {
     speakRoomAnnouncement(roomName);
   }, 1000);
   return () => clearTimeout(timer);
 }
 }
 }, [currentPage, showSplash, isSimulatorOpen]);

 

 const handleReturnToLobby = () => {
 const sectionId = PAGE_TO_SECTION_ID[currentPage];
 setCurrentPage(Page.HOME);
 
 if (sectionId) {
 setTimeout(() => {
 const element = document.getElementById(sectionId);
 if (element) {
 element.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }
 }, 100);
 } else {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }
 };
 const scrollToSection = (id: string) => {
 const element = document.getElementById(id);
 if (element) {
 element.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }
 };
 
 const { connect, disconnect, isActive, isSpeaking, sendPageContext } = useGeminiLive({
 onPageChange: (page) => setCurrentPage(page),
 currentPage,
 onScrollToSection: scrollToSection
 });

 const toggleVoice = () => {
 if (isActive) {
 disconnect();
 } else {
 setIsSimulatorOpen(false);
 connect();
 }
 };

 const [isManualScrollPaused, setIsManualScrollPaused] = useState<boolean>(false);

 const scrollRef = useRef<HTMLDivElement>(null);
 const isInitialPageRef = useRef(true);

 // Play transition sound when entering any room/page
 useEffect(() => {
 if (showSplash) return;
 if (isInitialPageRef.current) {
 isInitialPageRef.current = false;
 return;
 }
 playRoomTransitionSound();
 }, [currentPage, showSplash]);

 useEffect(() => {
 if (!showSplash) {
 window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
 document.documentElement.scrollTop = 0;
 document.body.scrollTop = 0;
 if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
 }
 if (isActive) sendPageContext(currentPage);
 }, [currentPage, isActive, showSplash]); 

 // Auto-scroll logic with initial top pause on page load or when splash screen closes
 useEffect(() => {
 if (showSplash || currentPage !== Page.HOME) return; // Do not auto-scroll while splash screen overlay is active or when inside form/service rooms

 let animationFrameId: number;
 let direction = 1;
 let isPaused = true; // Start paused at top
 let resumeTimeout: ReturnType<typeof setTimeout>;
 let lastTimestamp = 0;

 // Pause for 3.5 seconds at top of page on initial load or page switch
 const initialTopPauseTimeout = setTimeout(() => {
 isPaused = false;
 lastTimestamp = performance.now();
 }, 5000);

 const animateScroll = (timestamp: number) => {
 if (!lastTimestamp) lastTimestamp = timestamp;
 const deltaTime = timestamp - lastTimestamp;
 
 // Original hypnotic smooth gliding movement
 if (!isPaused && !isManualScrollPaused && deltaTime > 16) { 
 const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
 const currentScroll = window.scrollY;
 if (direction === 1 && currentScroll >= maxScroll - 2) { 
 direction = -1; isPaused = true; setTimeout(() => { isPaused = false; lastTimestamp = performance.now(); }, 5000);
 } else if (direction === -1 && currentScroll <= 0) {
 direction = 1; isPaused = true; setTimeout(() => { isPaused = false; lastTimestamp = performance.now(); }, 5000);
 } else {
 window.scrollBy(0, direction); 
 }
 lastTimestamp = timestamp;
 }
 animationFrameId = requestAnimationFrame(animateScroll);
 };

 const pauseScroll = () => { isPaused = true; clearTimeout(resumeTimeout); };
 const resumeScroll = () => { 
 if (isManualScrollPaused) return;
 clearTimeout(resumeTimeout); 
 resumeTimeout = setTimeout(() => { isPaused = false; lastTimestamp = performance.now(); }, 5000); 
 };

 window.addEventListener('mousedown', pauseScroll); window.addEventListener('wheel', pauseScroll); window.addEventListener('touchstart', pauseScroll);
 window.addEventListener('touchmove', pauseScroll); window.addEventListener('keydown', pauseScroll); window.addEventListener('mouseup', resumeScroll);
 window.addEventListener('touchend', resumeScroll); window.addEventListener('keyup', resumeScroll);

 animationFrameId = requestAnimationFrame(animateScroll);
 return () => {
 cancelAnimationFrame(animationFrameId);
 clearTimeout(resumeTimeout);
 clearTimeout(initialTopPauseTimeout);
 window.removeEventListener('mousedown', pauseScroll); window.removeEventListener('wheel', pauseScroll); window.removeEventListener('touchstart', pauseScroll);
 window.removeEventListener('touchmove', pauseScroll); window.removeEventListener('keydown', pauseScroll); window.removeEventListener('mouseup', resumeScroll);
 window.removeEventListener('touchend', resumeScroll); window.removeEventListener('keyup', resumeScroll);
 };
 }, [currentPage, showSplash, isManualScrollPaused]);

 const renderContent = () => {
 switch (currentPage) {
 case Page.HOME:
 return (
 <>
 <Hero 
 onCta={() => setCurrentPage(Page.SCHEDULE_CALL)} 
 onSecondary={() => setCurrentPage(Page.APPLICATIONS)} 
 onExecutiveRoom={() => setCurrentPage(Page.ABOUT_US)} 
 />
 <div id="services" className="pt-2 pb-8 bg-gradient-to-b from-teal-50 via-emerald-50 to-teal-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Services Header */}
 <div className="text-center mt-2 mb-5 relative z-10">
 <h2 className="text-3xl md:text-4xl font-black text-teal-950 drop-shadow-sm tracking-tight uppercase">Explore Services</h2>
 </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
   <ServiceCard id="card-client-wishlist" title="Client Wish Room" desc="We are Always here to listen. Tell us what's on your mind? Step inside to leave custom requests, private feedback, and wishlist notes directly for our team." gradient="bg-gradient-to-br from-purple-50 to-purple-100" textAccent="text-purple-800" borderColor="border-purple-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/f01ceb926257271119cb5fb763f9abf3cc32b977/wishlist.png" onClick={() => setCurrentPage(Page.CLIENT_WISHLIST)} roomLabel="WISH ROOM" />
 <ServiceCard id="card-tax-services" title="Tax Services" desc="Professional filing, maximum refunds & year-round support. Step inside to access online tax forms, estimation tools, and expert filing assistance." gradient="bg-gradient-to-br from-emerald-50 to-teal-100" textAccent="text-emerald-800" borderColor="border-emerald-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/251e7610639bbc916d6c4f301194a7a92d7b30fd/tax%20return.jpg" onClick={() => setCurrentPage(Page.TAX_SERVICES)} roomLabel="TAX ROOM" />
 <ServiceCard id="card-life-insurance" title="Life Insurance" desc="Living Benefits policies that protect you while you live. Step inside to calculate policy options, illness safeguards, and family wealth protections." gradient="bg-gradient-to-br from-rose-50 to-pink-100" textAccent="text-rose-800" borderColor="border-rose-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/927b2429f1a5990db087b7b03aa9b37530293328/life%20insure%20pushup.jpg" onClick={() => setCurrentPage(Page.LIFE_INSURANCE)} roomLabel="LIFE POLICY" />
 <ServiceCard id="card-home-insurance" title="Home Insurance" desc="Protecting your property against the unexpected. Step inside to estimate custom Florida homeowner rates, property shields, and disaster safeguards." gradient="bg-gradient-to-br from-orange-50 to-amber-100" textAccent="text-orange-800" borderColor="border-orange-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/931b88d9c973cde99e1b38686a2f1ec3173dd017/rolin%20home%202.png" onClick={() => setCurrentPage(Page.HOME_INSURANCE)} roomLabel="HOME PROTECTION" />
 <ServiceCard id="card-auto-insurance" title="Auto Insurance" desc="Comprehensive coverage for the road ahead. Step inside to run custom Florida vehicle insurance estimates and explore driver protection plans." gradient="bg-gradient-to-br from-blue-50 to-indigo-100" textAccent="text-blue-800" borderColor="border-blue-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/a59d9321c0c20a20b27190053d7fee0db4574a3c/car.png" onClick={() => setCurrentPage(Page.AUTO_INSURANCE)} roomLabel="AUTO PROTECTION" />
 <ServiceCard id="card-arcade" title="Arcade" desc="Play fun games while you wait for your appointment! Step inside to enjoy checkers, memory puzzles, and mental lounge games." gradient="bg-gradient-to-br from-indigo-900 to-purple-900" textAccent="text-yellow-400" borderColor="border-purple-500" image="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800" onClick={() => setCurrentPage(Page.GAME_ROOM)} descColor="text-white" roomLabel="ARCADE LOUNGE" />
 <ServiceCard id="card-faq" title="FAQ" desc="Answers to common questions about our services. Step inside for instant guidance on filing taxes, policies, and office appointments." gradient="bg-gradient-to-br from-cyan-50 to-cyan-100" textAccent="text-cyan-800" borderColor="border-cyan-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/927b2429f1a5990db087b7b03aa9b37530293328/image-12.png" onClick={() => setCurrentPage(Page.FAQ)} roomLabel="Q & A ROOM" />
 <ServiceCard id="card-about-us" title="About Us" desc="Our mission, vision, and commitment to your family. Step inside to meet Executive Director Rolin Prophete and discover our core family values." gradient="bg-gradient-to-br from-slate-100 to-slate-200" textAccent="text-slate-800" borderColor="border-slate-300" image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/927b2429f1a5990db087b7b03aa9b37530293328/image-9.png" onClick={() => setCurrentPage(Page.CONTACT)} roomLabel="CONTACT US" />
 </div>
 </div>
 </div>
 <div id="schedule-banner-section">
 <ScheduleBanner onClick={() => setCurrentPage(Page.SCHEDULE_CALL)} />
 </div>
 <Section id="mission" py="py-6">
 <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-slate-200/80 space-y-4">
 {/* Office Location Section - Moved back to landing page */}
 <div className="w-full">
 <div className="text-center mt-1 mb-3 relative z-10">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-teal-950 drop-shadow-sm tracking-tight uppercase">Miami Location</h2>
 </div>
 
 <div className="w-full bg-gradient-to-br from-[#FFF5F8] via-[#FCE8ED] to-[#FADCE5] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border-2 border-rose-200/90 text-slate-800 text-center">
 <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center">
 {/* Interactive Google Map Embed */}
 <div className="lg:col-span-8 h-64 md:h-80 lg:h-96 w-full rounded-xl overflow-hidden shadow-sm border border-rose-200/80 relative bg-rose-100/50">
 <iframe
 title="Prophete Universal Miami Location"
 src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY_INFO.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
 className="w-full h-full border-0 pointer-events-none"
 allowFullScreen={false}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 ></iframe>
 {/* Overlay preventing map touch gestures/scrolling while allowing Open in Maps button */}
 <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto">
 <a 
 href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`} 
 target="_blank" 
 rel="noopener noreferrer"
 className="absolute top-3 left-3 z-20 bg-white/95 hover:bg-white text-blue-600 hover:text-blue-700 font-bold px-3.5 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all hover:scale-105"
 aria-label="Open Miami Location in Google Maps"
 >
 <span>Open in Maps</span>
 <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
 </a>
 </div>
 </div>

 {/* Info Panel */}
 <div className="lg:col-span-4 space-y-4 md:space-y-6">
 {/* Address */}
 <div className="flex items-start gap-2">
 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-900 text-pink-100 flex items-center justify-center shrink-0 shadow-sm">
 <MapPin className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
 </div>
 <div>
 <div className="text-xs md:text-sm uppercase font-extrabold text-rose-900 tracking-wider">Miami Location</div>
 <div className="text-sm md:text-base font-bold text-slate-900 leading-snug">{COMPANY_INFO.address}</div>
 <a 
 href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`} 
 target="_blank" 
 rel="noopener noreferrer" 
 className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 hover:text-rose-950 hover:underline mt-0.5"
 >
 <Navigation className="w-3 h-3" />
 Get Directions
 </a>
 </div>
 </div>

 {/* Hours */}
 <div className="flex items-start gap-2">
 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-900 text-pink-100 flex items-center justify-center shrink-0 shadow-sm">
 <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
 </div>
 <div>
 <div className="text-xs md:text-sm uppercase font-extrabold text-rose-900 tracking-wider">Business Hours</div>
 <div className="text-sm md:text-base font-bold text-slate-900">Mon – Fri: {COMPANY_INFO.hours}</div>
 </div>
 </div>

 {/* Phone */}
 <div className="flex items-start gap-2">
 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
 <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
 </div>
 <div>
 <div className="text-xs md:text-sm uppercase font-extrabold text-rose-900 tracking-wider">Direct Phone Line</div>
 <a 
 href={`tel:${COMPANY_INFO.phone}`} 
 className="inline-flex items-center gap-2 px-3 py-1.5 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base rounded-xl shadow-md transition-all hover:scale-[1.03] active:scale-95 border border-emerald-400 max-w-full"
 >
 <PhoneCall className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
 <span className="whitespace-nowrap tracking-wide">{COMPANY_INFO.phone}</span>
 <span className="text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0 shadow-sm border border-amber-200">CALL</span>
 </a>
 </div>
 </div>

 {/* Email */}
 <div className="flex items-start gap-2">
 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-900 text-pink-100 flex items-center justify-center shrink-0 shadow-sm">
 <Mail className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
 </div>
 <div>
 <div className="text-xs md:text-sm uppercase font-extrabold text-rose-900 tracking-wider">Email Address</div>
 <a 
 href={`mailto:${COMPANY_INFO.email}`} 
 className="text-xs sm:text-sm md:text-base font-black text-slate-900 hover:text-rose-900 hover:underline block mt-0.5 leading-snug break-words max-w-full"
 >
 {COMPANY_INFO.email}
 </a>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>


 </div>
 </Section>

 {/* Continuous Testimonial Ticker */}
 <TestimonialTicker />

 {/* Bottom Call-To-Action & Voice Assistant */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
 <ScheduleBanner onAskPandora={toggleVoice} isActive={isActive} className="pt-2 pb-0" />
 </div>

 <div className="flex justify-center pt-6 pb-4 m-0 w-full bg-transparent">
 <button 
 onClick={() => setCurrentPage(Page.WEB_DESIGN)} 
 className="px-6 sm:px-8 py-3 bg-[#1e1e1e] text-[#00FF41] font-mono font-bold rounded-xl border border-[#00FF41]/80 hover:bg-black transition-all uppercase text-center flex items-center justify-center cursor-pointer animate-avatar-biopulse text-xs sm:text-sm md:text-base tracking-widest shadow-sm whitespace-nowrap mx-auto"
 >
 Website Designer Jarvis-27
 </button>
 </div>
 </>
 );

 case Page.LIFE_INSURANCE:
 return (
 <ContentRoom 
 title={
 <>
 Life Insurance<br />With Living Benefits
 </>
 } 
 subtitle="Life Protection while you are living" 
 image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/927b2429f1a5990db087b7b03aa9b37530293328/life%20insure%20pushup.jpg" 
 onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplication={() => {
 setApplicationTab('insurance');
 setCurrentPage(Page.APPLICATIONS);
 }}
 applicationButtonText="APPLICATION ROOM"
 containerClassName="bg-slate-900/95 text-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur-md"
 footerClassName="bg-slate-950/80 p-4 sm:p-8 flex flex-col items-center gap-4 border-t border-cyan-500/30"
 >
 <div className="space-y-8">
 {/* Hero / Overview Banner */}
 <div className="bg-gradient-to-br from-cyan-950/90 via-slate-950 to-slate-900 p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4">
 <p className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">Living Benefits Protection</p>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Coverage You Can Rely On While You’re Alive</h3>
 
 <p className="text-cyan-100 text-base sm:text-lg leading-relaxed font-semibold">
 We specialize in living benefit policies, coverage you can rely on while you’re alive.
 </p>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
 Chronic illness benefits provide a lump sum if you’re diagnosed with conditions like cancer, heart attack, stroke, ALS, blindness, kidney failure, or a major organ transplant.
 </p>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
 Critical illness benefits offer monthly payments if you’re unable to perform two or more daily activities.
 </p>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
 Terminal illness benefits pay out if you’re given a life expectancy of less than 12 months. And in the event of death, a lump sum is paid to your beneficiaries from the policy’s face value.
 </p>
 </div>

 {/* 4 Living Benefit Category Cards */}
 <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-md">
 <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3">
 <Stethoscope className="w-5 h-5 text-cyan-300" />
 </div>
 <h4 className="font-extrabold text-cyan-200 text-lg mb-1">Chronic Illness Benefits</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 Provides a lump sum benefit if diagnosed with conditions like cancer, heart attack, stroke, ALS, blindness, kidney failure, or a major organ transplant.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-md">
 <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3">
 <Activity className="w-5 h-5 text-cyan-300" />
 </div>
 <h4 className="font-extrabold text-cyan-200 text-lg mb-1">Critical Illness Benefits</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 Offers monthly payments if you become unable to perform two or more daily activities without assistance.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-md">
 <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3">
 <Clock className="w-5 h-5 text-cyan-300" />
 </div>
 <h4 className="font-extrabold text-cyan-200 text-lg mb-1">Terminal Illness Benefits</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 Pays out an accelerated lump sum benefit if you are given a life expectancy of less than 12 months.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-md">
 <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-3">
 <Shield className="w-5 h-5 text-cyan-300" />
 </div>
 <h4 className="font-extrabold text-cyan-200 text-lg mb-1">Beneficiary Death Benefit</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 In the event of death, a guaranteed lump sum is paid directly to your designated beneficiaries from the policy’s face value.
 </p>
 </div>
 </div>

 {/* Policy Types Section */}
 <div className="pt-4">
 <div className="mb-6">
 <p className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-1">Tailored Solutions</p>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Comprehensive Policy Types Available</h3>
 <p className="text-slate-300 text-base sm:text-lg font-medium">
 We offer a range of policy types tailored to your needs.
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Income Replacement</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Income replacement policies ensure your family has steady financial support.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Whole Life Insurance</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Whole life insurance provides lifelong coverage and a guaranteed cash value.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Mortgage Protection</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Mortgage protection safeguards your home by covering loan payments.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Final Expense Coverage</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Final expense policies help cover end-of-life costs.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Term Policies (20–30 Years)</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Term policies give you coverage for 20 to 30 years, offering flexibility.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Indexed Universal Life (IUL)</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Indexed Universal Life (IUL) policies link your growth to a market index.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Children’s Policies & College Savings</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Children’s policies provide long-term security, and college savings plans help build a fund for education.
 </p>
 </div>

 <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
 <h4 className="font-extrabold text-cyan-300 text-lg mb-1">Retirement Annuities</h4>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Annuities offer a steady income stream in retirement.
 </p>
 </div>
 </div>
 </div>

 {/* Form Container */}
 <div className="mt-10 pt-8 border-t border-cyan-500/30">
 <InsuranceForm />
 </div>
 </div>
 </ContentRoom>
 );

 case Page.TAX_SERVICES:
 return (
 <ContentRoom 
 title="Income Tax Services" 
 subtitle="Maximum Refund Guaranteed." 
 image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/bfcfb5a3eea9dc0c63331bc8fb2bc7e7f38b3d77/tax%20dollars.jpg" 
 onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplication={() => {
 setApplicationTab('tax');
 setCurrentPage(Page.APPLICATIONS);
 }}
 applicationButtonText="APPLICATION ROOM"
 containerClassName="bg-slate-900/95 text-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 backdrop-blur-md"
 footerClassName="bg-slate-950/80 p-4 sm:p-8 flex flex-col items-center gap-4 border-t border-slate-800"
 >
 <div className="space-y-8">
 <div className="bg-slate-950/90 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
 <div className="relative z-10 space-y-4">
 <div className="flex items-center gap-3">
 <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Why Choose Us?</h3>
 </div>
 <p className="text-slate-200 text-lg sm:text-xl font-bold leading-relaxed max-w-3xl">
 We believe you deserve to keep every dollar of your hard-earned income.
 </p>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
 Our dedicated specialists provide expert, year-round tax optimization, delivering maximum legal deductions, precision filing, and complete financial peace of mind.
 </p>
 <div className="grid sm:grid-cols-3 gap-3 pt-2 text-sm font-semibold">
 <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-slate-200">
 <span className="text-teal-400 font-bold">✓</span> Maximum Refund Guarantee
 </div>
 <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-slate-200">
 <span className="text-teal-400 font-bold">✓</span> Dedicated Year-Round Support
 </div>
 <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-2.5 rounded-xl text-slate-200">
 <span className="text-teal-400 font-bold">✓</span> Certified Tax Optimization
 </div>
 </div>
 </div>
 </div>

 {/* PU / LLC Expert Service Team */}
 <div>
 <p className="text-xs font-extrabold text-teal-400 uppercase tracking-widest mb-1">PU / LLC Expert Service Team</p>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">Expert Guidance & Seamless Tax Solutions</h3>
 
 <div className="grid md:grid-cols-2 gap-6">
 {/* Card 1 */}
 <div className="bg-slate-950/80 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-lg flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <img src={ROLIN_PIC_URL} alt="Rolin Prophete" className="w-14 h-14 rounded-full border-2 border-teal-500 object-cover object-top shadow-md bg-slate-900" />
 <div>
 <h4 className="font-extrabold text-slate-100 text-xl">Personal & Business Tax Care</h4>
 <p className="text-xs font-bold text-teal-400 uppercase tracking-wide">Guided Service Every Step</p>
 </div>
 </div>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
 "Our experienced professionals guide you every step of the way, handling both personal and business taxes, and ensuring you fully understand the process as we go."
 </p>
 </div>
 <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
 <span>Rolin Prophete • Executive Director & Lead Specialist</span>
 <span className="text-teal-400 font-extrabold">✓ Year-Round</span>
 </div>
 </div>

 {/* Card 2 */}
 <div className="bg-slate-950/80 p-6 sm:p-7 rounded-2xl border border-slate-800 text-white shadow-lg flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
 <Zap className="w-7 h-7 text-white" />
 </div>
 <div>
 <h4 className="font-extrabold text-slate-100 text-xl">Maximum Refund & Efficiency</h4>
 <p className="text-xs font-bold text-teal-400 uppercase tracking-wide">In-Person or Electronic Submission</p>
 </div>
 </div>
 <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
 "We ensure maximum efficiency and a commitment to the largest refund possible, no waiting in lines. You can submit your documents either in person or electronically, making the process seamless and straightforward."
 </p>
 </div>
 <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
 <span>Fast Track Electronic Filing</span>
 <span className="text-teal-400 font-extrabold">✓ Zero Line Waiting</span>
 </div>
 </div>
 </div>
 </div>

 {/* Forward Tax Planning & Regulatory Context */}
 <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
 <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
 <div className="relative z-10">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
 <div>
 <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-1">Tax Outlook & Regulatory Planning</p>
 <h3 className="text-2xl font-extrabold text-white mt-2">Forward Tax Planning & 2026 Season Updates</h3>
 </div>
 <span className="text-slate-400 text-xs font-semibold">Important Regulatory Context</span>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {/* Standard Deduction */}
 <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
 <div>
 <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block mb-2">2026 Tax Season</span>
 <h4 className="font-bold text-white text-lg mb-2">Standard Deduction Adjustment</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 For the 2026 tax season, the standard deduction is expected to rise, as it adjusts for inflation, providing taxpayers with a greater base exemption.
 </p>
 </div>
 </div>

 {/* Child Tax Credit */}
 <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 hover:border-amber-500/40 transition-all flex flex-col justify-between">
 <div>
 <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-2">Legislative Alert</span>
 <h4 className="font-bold text-white text-lg mb-2">Child Tax Credit Sunset</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 The child tax credit is set to revert to its pre-2021 levels unless Congress acts to extend it, meaning families should plan for a potential drop in benefits.
 </p>
 </div>
 </div>

 {/* BOI Reporting */}
 <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 hover:border-sky-500/40 transition-all flex flex-col justify-between">
 <div>
 <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider block mb-2">Corporate Transparency Act</span>
 <h4 className="font-bold text-white text-lg mb-2">BOI Small Business Reporting</h4>
 <p className="text-slate-300 text-sm leading-relaxed">
 Under the Corporate Transparency Act, more small businesses, including LLCs and corporations, will now be required to submit beneficial ownership reports, ensuring greater transparency and accountability.
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Quick Protection Estimator */}
 <div className="pt-4">
 <ProtectionCalculator 
 onScheduleCall={() => setCurrentPage(Page.SCHEDULE_CALL)} 
 onApplyForm={() => setCurrentPage(Page.APPLICATIONS)} 
 />
 </div>

 <div className="mt-10 pt-8 border-t border-emerald-500/30">
 <TaxForm />
 </div>
 </div>
 </ContentRoom>
 );

 case Page.AUTO_INSURANCE:
 return (
 <ContentRoom 
 title="Auto Insurance" 
 subtitle="Drive with Peace of Mind." 
 image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/a59d9321c0c20a20b27190053d7fee0db4574a3c/car.png" 
 onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplication={() => {
 setApplicationTab('insurance');
 setCurrentPage(Page.APPLICATIONS);
 }}
 applicationButtonText="APPLICATION ROOM"
 containerClassName="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 backdrop-blur-md"
 footerClassName="bg-blue-950/80 p-4 sm:p-8 flex flex-col items-center gap-4 border-t border-slate-800"
 >
 <div className="space-y-8">
 {/* Hero Overview Statement */}
 <div className="bg-gradient-to-br from-blue-900/90 via-blue-950 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
 <div className="flex items-center gap-2 text-xs font-extrabold text-blue-400 uppercase tracking-widest">
 <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
 <span>Florida Personal &amp; Commercial Auto Protection</span>
 </div>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
 Drive with Peace of Mind, At Prophete Universal LLC
 </h3>
 <div className="space-y-4 text-blue-100 text-base sm:text-lg leading-relaxed font-medium">
 <p>
 Drive with peace of mind, at Prophete Universal LLC, we secure the best rates for both personal and commercial drivers.
 </p>
 <div className="bg-blue-900/60 border border-blue-500/30 p-4 sm:p-5 rounded-2xl text-white font-semibold text-base sm:text-lg shadow-inner my-2">
 Our coverage is designed to give you confidence, whether it’s a minor fender-bender or a major accident. In Florida, we help you meet the state minimums with PIP and PD coverage, while also offering full coverage with comprehensive and collision options.
 </div>
 <p>
 For businesses, our commercial auto policies protect your fleet, contractor vehicles, and business operations. Apply today and let us tailor a solution for you.
 </p>
 </div>
 </div>

 {/* Expanded Florida Auto Insurance Jargon Guide for the Layman */}
 <div>
 <div className="mb-6">
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-1">Understanding Your Coverage</p>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
 Auto Insurance Jargon Explained Simply
 </h3>
 <p className="text-blue-200/90 text-base sm:text-lg font-medium mt-1">
 Insurance jargon can be confusing. Here is what each coverage actually means for you on Florida roads:
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {/* PIP */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <Stethoscope className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Personal Injury Protection (PIP)</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Florida No-Fault Mandatory Coverage</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Florida is a "no-fault" state. PIP pays 80% of your medical bills and 60% of lost wages up to $10,000 for you and your passengers after an accident, no matter who caused the crash.
 </p>
 </div>
 </div>
 </div>

 {/* PD */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <Car className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Property Damage Liability (PD)</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Florida Mandatory Liability</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Florida law requires at least $10,000 in PD. This pays for damage you or a driver of your car causes to someone else's vehicle, fence, building, or property in an accident.
 </p>
 </div>
 </div>
 </div>

 {/* BI */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <Scale className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Bodily Injury Liability (BI)</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Essential Asset Protection</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Pays for serious injuries, lost income, pain &amp; suffering, and legal defense fees if you cause an accident that injures or kills someone else. Essential to shield your bank account and savings from lawsuits.
 </p>
 </div>
 </div>
 </div>

 {/* Comprehensive */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <AlertTriangle className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Comprehensive Coverage ("Comp")</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Non-Collision Hazards</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Protects your vehicle against damage NOT caused by a crash, including hurricane storm surges, falling tree branches, windshield cracks, vandalism, theft, or hitting an animal.
 </p>
 </div>
 </div>
 </div>

 {/* Collision */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <ShieldCheck className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Collision Coverage</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Crash &amp; Physical Damage</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Pays to repair or replace your vehicle if you collide with another car, object (guardrail, telephone pole), or flip over, regardless of who was at fault in the crash.
 </p>
 </div>
 </div>
 </div>

 {/* Uninsured Motorist */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <Shield className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Uninsured Motorist Protection (UM)</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Critical Florida Protection</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Over 20% of Florida drivers carry NO insurance. UM covers your medical bills, injuries, and lost wages if an uninsured driver or a hit-and-run driver crashes into you.
 </p>
 </div>
 </div>
 </div>

 {/* Commercial Auto */}
 <div className="bg-slate-900/90 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-md md:col-span-2 flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
 <Truck className="w-5 h-5 text-blue-300" />
 </div>
 <div>
 <h4 className="font-extrabold text-white text-lg leading-snug">Commercial Auto &amp; Fleet Insurance</h4>
 <p className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Business &amp; Contractor Vehicles</p>
 </div>
 </div>
 <div className="mt-2 pt-2 border-t border-slate-800">
 <span className="block font-extrabold text-amber-300 text-xs sm:text-sm mb-1 uppercase tracking-wider">What It Means:</span>
 <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
 Personal auto insurance policies strictly exclude accidents that happen while driving for business. Commercial auto policies protect company cars, delivery vans, contractor trucks, tools in transit, and business fleets with much higher liability limits.
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Installed Florida Auto Estimator Tool */}
 <div className="pt-4">
 <FloridaAutoEstimator 
 onApplyForm={() => {
 setApplicationTab('insurance');
 setCurrentPage(Page.APPLICATIONS);
 }}
 onScheduleCall={() => setCurrentPage(Page.SCHEDULE_CALL)}
 />
 </div>

 {/* Form Container */}
 <div className="mt-10 pt-8 border-t border-blue-500/30">
 <InsuranceForm />
 </div>
 </div>
 </ContentRoom>
 );

 case Page.HOME_INSURANCE:
 return (
 <ContentRoom 
 title="Home Insurance" 
 subtitle="Protecting Your Most Valuable Asset." 
 image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/931b88d9c973cde99e1b38686a2f1ec3173dd017/rolin%20home%202.png" 
 onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplication={() => {
 setApplicationTab('insurance');
 setCurrentPage(Page.APPLICATIONS);
 }}
 applicationButtonText="APPLICATION ROOM"
 containerClassName="bg-gradient-to-br from-amber-500/10 via-amber-50/90 to-yellow-100/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400/80 text-slate-900"
 footerClassName="bg-amber-100/90 p-4 sm:p-8 flex flex-col items-center gap-4 border-t border-amber-300"
 >
 <div className="space-y-8">
 {/* Sunny Florida Hero Banner */}
 <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-300 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
 <div className="relative z-10 space-y-4">
 <div className="inline-flex items-center gap-2 bg-amber-950/10 border border-amber-950/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-950">
 <Sun className="w-4 h-4 text-amber-950 shrink-0" /> <span>Sunshine Peace of Mind</span>
 </div>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
 Protecting Your Home & Happy Florida Lifestyle
 </h3>
 <p className="text-slate-900 text-base sm:text-lg font-bold leading-relaxed">
 Your home is one of your most valuable investments, and we at Prophete Universal are dedicated to protecting it. We offer comprehensive coverage for Florida homeowners.
 </p>
 <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
 Having the right insurance policy ensures that your physical structure, personal belongings, and financial security are completely safeguarded against Florida's unique coastal weather and everyday risks.
 </p>
 </div>
 </div>

 {/* Policy Type Grid - Expanded for the layman */}
 <div>
 <div className="mb-6">
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-widest mb-1">Tailored Coverage Options</p>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tailored Policy Solutions Explained Simply</h3>
 <p className="text-slate-600 text-base sm:text-lg font-medium mt-1">
 Each policy type has a clear function and a specific reason for being chosen:
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {/* HO-3 */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-sm"><Home className="w-6 h-6 text-amber-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug"><span className="whitespace-nowrap">HO&#8209;3</span> Policy</h4>
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Standard Homeowners Insurance</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> Standard coverage for single-family homes that protects both the physical structure (roof, walls, foundation) and your personal belongings inside against perils like fire, theft, lightning, and hurricane windstorms.
 </p>
 <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> It is the standard, essential protection required for single-family homeowners.
 </p>
 </div>
 </div>
 </div>

 {/* HO-6 */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-sm"><Building2 className="w-6 h-6 text-amber-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug"><span className="whitespace-nowrap">HO&#8209;6</span> Policy</h4>
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Condo Unit Owners Coverage</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> Designed for condo owners, focusing on "walls-in" coverage, ensuring your interior walls, upgraded fixtures, custom cabinets, appliances, flooring, and personal items are protected.
 </p>
 <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> Your condo HOA master policy only covers exterior common areas. HO-6 fills the essential gap to protect your individual unit interior.
 </p>
 </div>
 </div>
 </div>

 {/* Flood Coverage */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-800 flex items-center justify-center shrink-0 shadow-sm"><Droplets className="w-6 h-6 text-cyan-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug">Flood Coverage</h4>
 <p className="text-xs font-extrabold text-cyan-700 uppercase tracking-wider">Essential Florida Protection</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> Pays for structural damage and personal property destruction caused by rising floodwaters, storm surges, or heavy rainfall accumulation.
 </p>
 <p className="text-cyan-900 bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> Standard homeowners policies strictly exclude flood damage. Given South Florida’s coastal risks (especially in Miami), flood insurance is essential.
 </p>
 </div>
 </div>
 </div>

 {/* HO-4 Renter */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-sm"><Package className="w-6 h-6 text-amber-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug"><span className="inline-block">Renter Coverage</span> <span className="inline-block whitespace-nowrap">(HO&#8209;4)</span></h4>
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Tenant Personal Property Protection</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> Protects your personal property inside a leased house or apartment (furniture, electronics, clothing) and provides personal liability protection.
 </p>
 <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> Your landlord’s policy only covers the building structure, not your personal possessions inside.
 </p>
 </div>
 </div>
 </div>

 {/* DP-3 Landlord */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-sm"><Key className="w-6 h-6 text-amber-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug"><span className="whitespace-nowrap">DP&#8209;3</span> Policy</h4>
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Comprehensive Landlord & Dwelling Fire</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> Offers broad "open perils" protection for residential rental properties owned by landlords, including physical structure coverage, liability, and lost rental income.
 </p>
 <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> If a covered loss forces tenants out, DP-3 reimburses lost rental income while repairs are underway.
 </p>
 </div>
 </div>
 </div>

 {/* DP-1 & DP-2 Investment */}
 <div className="bg-white/90 p-6 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-sm"><Building2 className="w-6 h-6 text-amber-800" /></div>
 <div>
 <h4 className="font-extrabold text-amber-950 text-lg sm:text-xl leading-snug"><span className="whitespace-nowrap">DP&#8209;1</span> &amp; <span className="whitespace-nowrap">DP&#8209;2</span> Policies</h4>
 <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Investment Property Options</p>
 </div>
 </div>
 <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
 <p>
 <strong>Clear Function:</strong> DP-1 provides basic "named peril" coverage (fire, lightning, explosion) at lower rates, while DP-2 offers broad form protection covering additional hazards like falling objects and plumbing leaks.
 </p>
 <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
 <strong>Why Choose This:</strong> Ideal for seasonal, vacant, or budget-conscious investment properties needing basic or broad form options depending on your budget.
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Form Container */}
 <div className="mt-10 pt-8 border-t border-amber-300">
 <InsuranceForm />
 </div>
 </div>
 </ContentRoom>
 );

 case Page.ABOUT_US:
 return (
 <ContentRoom title="About Us & Leadership" subtitle="Trustworthy. Dedicated. Family First." image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/927b2429f1a5990db087b7b03aa9b37530293328/image-9.png">
 <div className="space-y-6 sm:space-y-8 text-slate-800 text-base sm:text-lg leading-relaxed">
 {/* Rolin Prophete Room Spotlight */}
 <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 border border-teal-800 relative overflow-hidden">
 <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-8 relative z-10">
 {/* Executive Portrait Container */}
 <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
 <div className="w-full max-w-[280px] sm:w-60 md:w-72 h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-teal-600/80 bg-slate-950 flex items-center justify-center shadow-lg">
 <img 
 src={ROLIN_PIC_URL} 
 alt="Rolin Prophete - Executive Director" 
 className="w-full h-full object-cover object-top" 
 />
 </div>
 </div>

 {/* Info & Quote Section */}
 <div className="text-center md:text-left flex-1 w-full">
 <div className="inline-flex items-center text-yellow-400 font-bold uppercase tracking-widest mb-2 sm:mb-3 px-3.5 py-1.5 bg-yellow-400/10 rounded-xl border border-yellow-400/30">
 <span className="text-xs sm:text-sm md:text-base text-yellow-300 font-black">EXECUTIVE DIRECTOR</span>
 </div>
 <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
 Rolin Prophete, BSME
 </h3>

 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-emerald-300 font-bold text-xs sm:text-sm md:text-base mb-3">
 <span className="flex items-center gap-1.5">
 <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
 Licensed Insurance Agent
 </span>
 <span className="text-teal-400/60 hidden sm:inline">•</span>
 <span className="flex items-center gap-1.5">
 <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
 Certified Tax Professional
 </span>
 </div>
 
 <blockquote className="p-3.5 sm:p-4 my-2.5 sm:my-3 bg-white/5 rounded-xl text-teal-100 italic text-sm sm:text-base md:text-lg leading-relaxed text-center">
 <span className="text-[#c48b59] font-extrabold mr-1">“</span>My mission is simple: prioritize family needs above everything else and build lasting security through trusted tax, financial, and wealth preservation strategy...<span className="text-[#c48b59] font-extrabold ml-1">”</span>
 </blockquote>

 <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center md:justify-start pt-3 w-full">
 <button onClick={() => setCurrentPage(Page.SCHEDULE_CALL)} className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-teal-950 font-black rounded-xl shadow-lg hover:from-yellow-300 hover:to-amber-300 transition-all text-xs sm:text-sm uppercase tracking-wide text-center">
 SCHEDULE CONSULTATION
 </button>
 <button onClick={() => setCurrentPage(Page.APPLICATIONS)} className="w-full sm:w-auto px-5 py-3 bg-teal-800/90 text-white font-extrabold rounded-xl hover:bg-teal-700 transition-all text-xs sm:text-sm uppercase border border-teal-500/80 shadow-md text-center">
 Fill Application Form
 </button>
 </div>
 </div>
 </div>
 </div>

 <div className="px-1 sm:px-2 space-y-3">
 <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-900">Welcome to Prophete Universal</h3>
 <p className="font-bold text-base sm:text-xl text-yellow-600">...where protecting your family is our number one priority!</p>
 <p className="font-medium text-sm sm:text-base md:text-lg">Since 2014, we are a one-stop shop service in our community, in South Florida, offering a wide array of services:</p>
 <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 mb-4 font-medium text-sm sm:text-base md:text-lg">
 <li>Life insurance with living benefits</li>
 <li>Professional tax services</li>
 <li>Income replacement</li>
 <li>Final expense insurance</li>
 <li>IUL – tax free retirement with guaranteed no loss protection plan</li>
 <li>Children college saving plan</li>
 <li>Annuities</li>
 <li>Home & auto insurance</li>
 </ul>
 </div>

 <div className="px-1 sm:px-2 space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg">
 <p>
 Life insurance is extremely important, yet most people tend to avoid the discussion until it’s too late. Life insurance is critical to cover life’s unplanned events such as death, accident or illness. We have multiple carriers and we can work with just about any budgets to fit your needs.
 </p>
 <p>
 Prophete Universal has been providing excellent tax preparation service in our community for many years. We make sure our clients understand their tax contents before proceeding to e-file. The filing process is easy with us, No waiting in line! Maximum refund guaranteed!
 </p>
 <p>
 In addition, we also offer home and auto insurance at great rates.
 </p>
 <p>
 Our business growth is heavily depended on our existing clients’ referring their friends and family to us. Prophete Universal has grown year after year strictly on maintaining great relationship with our clients. We have and will continue to go the extra miles to keep earning our clients’ trust with great customer service.
 </p>
 <p className="font-bold text-teal-900 text-lg sm:text-xl mt-4 sm:mt-6">
 Thanks for visiting our website!
 </p>
 </div>

 {/* Dedicated Community & Wellness Projects Room Block */}
 <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 border-2 border-emerald-400/70 shadow-2xl text-white relative overflow-hidden my-6">
   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
   <div className="relative z-10 space-y-4">
     <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-400 text-slate-950 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
       <FolderKanban className="w-4 h-4 text-slate-950 shrink-0" />
       <span>Community & Wellness Projects Room</span>
     </div>
     <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-yellow-300 uppercase tracking-tight">
       Projects & Active Family Wellness
     </h3>
     <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl font-medium">
       At Prophete Universal LLC, we believe that true wealth begins with healthy living, community teamwork, and active family wellness. Step inside our Projects Room to explore our featured presentations, health initiatives, and community programs.
     </p>

     <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm">
       <div className="p-3 bg-slate-900/80 border border-emerald-400/30 rounded-xl text-emerald-200 font-bold flex items-center gap-2">
         <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
         <span>Community Initiatives</span>
       </div>
       <div className="p-3 bg-slate-900/80 border border-teal-400/30 rounded-xl text-teal-200 font-bold flex items-center gap-2">
         <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0 animate-pulse"></span>
         <span>Active Living & Health</span>
       </div>
       <div className="p-3 bg-slate-900/80 border border-yellow-400/30 rounded-xl text-yellow-200 font-bold flex items-center gap-2">
         <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0 animate-pulse"></span>
         <span>Media & Presentations</span>
       </div>
     </div>

     <div className="pt-2 flex flex-wrap gap-3 items-center justify-between">
       <button
         onClick={() => setCurrentPage(Page.THEATER)}
         className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-300 text-slate-950 font-black rounded-xl text-sm sm:text-base uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer border border-emerald-200"
       >
         <span>Explore Projects Room</span>
         <ArrowRight className="w-5 h-5" />
       </button>
       <span className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider">
         Prophete Universal LLC • Community First
       </span>
     </div>
   </div>
 </div>

 {/* Official Executive Flyer & Core Services Cards */}
 <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 space-y-4">
 <div className="text-center max-w-2xl mx-auto space-y-2 pb-4 border-b border-slate-200">
 <span className="inline-block px-3 py-1 bg-teal-100 text-teal-950 rounded-full text-sm font-extrabold tracking-wide uppercase">
 Official Executive Credentials & Flyer
 </span>
 <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
 Comprehensive Insurance & Tax Protection
 </h3>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
 {/* Insurance Protection Card */}
 <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
 <div className="relative z-10 space-y-3">
 <div className="inline-block px-3 py-1 bg-yellow-400 text-slate-950 font-bold text-sm uppercase tracking-wider rounded">
 Comprehensive Coverage
 </div>
 <h4 className="text-xl font-bold text-white">
 Is Your Family Protected From Unexpected Burdens?
 </h4>
 <p className="text-teal-100 text-sm leading-relaxed">
 Whether facing death, disability, or critical illness, does your policy offer <strong>living benefits</strong>, orphan benefits, and scholarship protection? Regardless of medical condition, <strong>we can get you covered!</strong>
 </p>
 
 <div className="pt-2">
 <h5 className="text-yellow-300 font-bold text-sm uppercase tracking-wider mb-2">Key Policies & Plans:</h5>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-slate-200">
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Life w/ Living Benefits
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Tax-Free IUL Retirement
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Guaranteed Annuities
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Mortgage Protection
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Final Expense Coverage
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> College Savings Plans
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Children Policies
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-yellow-400 font-bold">✓</span> Home & Auto Insurance
 </li>
 </ul>
 </div>
 </div>

 <div className="pt-4 relative z-10">
 <button 
 onClick={() => setCurrentPage(Page.SCHEDULE_CALL)}
 className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-lg transition-all text-center shadow-md uppercase tracking-wide text-sm"
 >
 Schedule FREE Policy Review
 </button>
 </div>
 </div>

 {/* Tax Professional Card */}
 <div className="bg-gradient-to-br from-slate-50 to-teal-50 border border-teal-200/60 rounded-xl p-5 flex flex-col justify-between shadow-md">
 <div className="space-y-3">
 <div className="inline-block px-3 py-1 bg-teal-800 text-white font-bold text-sm uppercase tracking-wider rounded">
 Certified Tax Professional
 </div>
 <h4 className="text-xl font-bold text-slate-900">
 Maximize Your Deductions & Protect Your Wealth
 </h4>
 <p className="text-slate-700 text-sm leading-relaxed">
 Tax filing can be complicated. We maximize your tax return deductions and ensure you get every dollar you deserve with total peace of mind.
 </p>
 
 <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-emerald-900 space-y-1">
 <div className="font-extrabold text-sm flex items-center gap-1.5">
 <svg className="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
 Maximum Refund Guarantee
 </div>
 <p className="text-sm font-medium text-slate-700">
 Professional, accurate filing backed by certified expertise and year-round support.
 </p>
 </div>

 <div className="pt-1">
 <h5 className="text-teal-900 font-bold text-sm uppercase tracking-wider mb-1.5">Why Clients Trust Us:</h5>
 <ul className="space-y-1 text-sm text-slate-800 font-medium">
 <li className="flex items-center gap-1.5">
 <span className="text-teal-700 font-bold">✓</span> Personalized One-on-One Consultations
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-teal-700 font-bold">✓</span> Federal & State Return Optimization
 </li>
 <li className="flex items-center gap-1.5">
 <span className="text-teal-700 font-bold">✓</span> 100% Confidential & Secure E-Filing
 </li>
 </ul>
 </div>
 </div>

 <div className="pt-4">
 <button 
 onClick={() => setCurrentPage(Page.TAX_SERVICES)}
 className="w-full py-2.5 bg-teal-900 hover:bg-teal-800 text-white font-bold rounded-lg transition-all text-center shadow-md uppercase tracking-wide text-sm"
 >
 Explore Tax Services
 </button>
 </div>
 </div>

 {/* Community & Wellness Projects Card */}
 <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border border-teal-400/50 rounded-xl p-5 flex flex-col justify-between shadow-md text-white md:col-span-2 lg:col-span-1">
 <div className="space-y-3">
 <div className="inline-block px-3 py-1 bg-emerald-400 text-slate-950 font-bold text-sm uppercase tracking-wider rounded">
 Community & Wellness
 </div>
 <h4 className="text-xl font-bold text-white">
 Projects & Active Living
 </h4>
 <p className="text-emerald-100 text-sm leading-relaxed">
 At Prophete Universal LLC, we believe that true wealth begins with healthy living, community teamwork, and active family wellness.
 </p>

 <div className="p-3 bg-emerald-900/60 border border-emerald-400/30 rounded-lg text-emerald-200 space-y-1">
 <div className="font-extrabold text-sm flex items-center gap-1.5 text-yellow-300">
 <FolderKanban className="w-4 h-4 text-yellow-300 shrink-0" />
 Featured Initiatives & Video Room
 </div>
 <p className="text-xs font-medium text-slate-200 leading-relaxed">
 Explore upcoming community projects, active living media, and wellness presentations in our Projects Room.
 </p>
 </div>
 </div>

 <div className="pt-4">
 <button 
 onClick={() => setCurrentPage(Page.THEATER)}
 className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-lg transition-all text-center shadow-md uppercase tracking-wide text-sm flex items-center justify-center gap-2 cursor-pointer"
 >
 <span>Explore Projects Room</span>
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Flyer Banner Image */}
 <div className="pt-8 pb-4 flex justify-center w-full relative z-20">
 <img 
 src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/373d76b3b2e07d937a142e8921aa638a6d249581/PU%20banner%20black.png" 
 alt="Prophete Universal - Protecting Your Family Is Our #1 Priority" 
 className="w-full max-w-4xl rounded-xl shadow-md border border-slate-800 object-cover" 
 />
 </div>
 </div>
 </ContentRoom>
 );
 
 case Page.CONTACT:
 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
 <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-4 sm:p-6">
 <div className="w-full flex justify-center mb-6">
 <VideoPanel subtitle="" />
 </div>
 <div className="text-center mb-8">
 <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide mb-2">Contact Us</h2>
 <p className="text-lg sm:text-xl font-bold text-teal-700 mb-4">We are here to help.</p>
 <div className="flex flex-col items-center justify-center mt-3 mb-2">
 <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-teal-600 shadow-xl relative group shrink-0 mx-auto">
 <img 
 src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/251e7610639bbc916d6c4f301194a7a92d7b30fd/PU.jpg" 
 alt="Rolin Prophete - Executive Director" 
 className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
 />
 </div>
 <p className="text-sm font-bold text-slate-800 uppercase tracking-wide mt-2">Rolin Prophete</p>
 <p className="text-xs font-extrabold text-teal-700 uppercase mb-3">Executive Director</p>
                             <div className="max-w-2xl w-full mx-auto mt-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white border-2 border-yellow-400/80 shadow-xl relative overflow-hidden text-center">
                                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>
                                 <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-extrabold text-xs uppercase tracking-wider mb-3">
                                     <ShieldCheck className="w-4 h-4 text-yellow-300" />
                                     <span>Core Commitment</span>
                                 </div>
                                 <h4 className="text-xl sm:text-2xl font-black text-yellow-300 uppercase tracking-wide mb-3">
                                     A Legacy Built On Trust & Protection
                                 </h4>
                                 <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed max-w-xl mx-auto">
                                     Thank you for visiting Prophete Universal LLC. From customized tax strategies and living life insurance benefits to home & auto protection, we are committed to guiding your family toward lifelong financial security. Reach out to our team today, we are always here for you!
                                 </p>
                                 <div className="mt-4 pt-3 border-t border-yellow-400/30 flex flex-col items-center justify-center">
                                     <p className="text-2xl sm:text-3xl font-black italic tracking-widest text-yellow-300 font-serif drop-shadow-md">
                                         R. Prophete
                                     </p>
                                     <p className="text-xs font-bold text-teal-200 uppercase tracking-widest mt-0.5">
                                         Executive Director
                                     </p>
                                 </div>
                             </div>
 </div>
 </div>

 <div className="p-8 md:p-12 text-slate-800 text-lg leading-relaxed space-y-6">
 <div className="grid md:grid-cols-2 gap-12">
 <div className="space-y-6">
 <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-teal-900 text-yellow-300 flex items-center justify-center shrink-0 shadow-sm"><MapPin className="w-5 h-5" /></div><div className="min-w-0 flex-1"><h3 className="font-bold text-xl mb-1">Visit Us</h3><p className="text-lg">{COMPANY_INFO.address}</p></div></div>
 <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-teal-900 text-yellow-300 flex items-center justify-center shrink-0 shadow-sm"><Phone className="w-5 h-5" /></div><div className="min-w-0 flex-1"><h3 className="font-bold text-xl mb-1">Call Us</h3><a href={`tel:${COMPANY_INFO.phone}`} className="text-lg text-teal-700 font-bold hover:underline">{COMPANY_INFO.phone}</a></div></div>
 <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-teal-900 text-yellow-300 flex items-center justify-center shrink-0 shadow-sm"><Mail className="w-5 h-5" /></div><div className="min-w-0 flex-1 overflow-hidden"><h3 className="font-bold text-xl mb-1">Email Us</h3><a href={`mailto:${COMPANY_INFO.email}`} className="text-xs sm:text-sm md:text-base font-bold text-teal-800 hover:underline break-words max-w-full block">{COMPANY_INFO.email}</a></div></div>
 <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-teal-900 text-yellow-300 flex items-center justify-center shrink-0 shadow-sm"><Clock className="w-5 h-5" /></div><div className="min-w-0 flex-1"><h3 className="font-bold text-xl mb-1">Business Hours</h3><p className="text-lg">{COMPANY_INFO.hours}</p></div></div>
 </div>
 
 <div className="hidden md:flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
 <div className="text-center">
 <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-teal-600 shadow-lg relative group shrink-0 mx-auto mb-3">
 <img 
 src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/251e7610639bbc916d6c4f301194a7a92d7b30fd/PU.jpg" 
 alt="Executive Director Rolin Prophete" 
 className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
 />
 </div>
 <h4 className="text-xl font-black text-slate-900 uppercase">Rolin Prophete</h4>
 <p className="text-xs font-bold text-teal-700 uppercase mb-2">Executive Director</p>
 <p className="text-xl font-medium text-slate-600">"We prioritize your family needs above everything else."</p>
 </div>
 </div>
 </div>
 </div>

  {/* Dedicated Grand PROJECT 2027 Showcase Block */}
  <div className="my-6 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
    <div className="grid md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-8 space-y-3 text-left">
        <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest inline-block shadow-sm whitespace-nowrap">
          PROJECT 2027
        </span>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-300 uppercase">
          Step Inside Project 2027 Room
        </h3>
        <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
          Explore our strategic 2027 roadmap, active family living initiatives, and submit your own community project proposals directly to leadership. Together, we build a healthier, stronger future.
        </p>
      </div>
      <div className="md:col-span-4 flex items-center justify-center md:justify-end">
        <button
          onClick={() => setCurrentPage(Page.PROJECTS_2027)}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-300 hover:to-amber-200 text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-yellow-200 group whitespace-nowrap"
        >
          <FolderKanban className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
          <span>Project Room</span>
        </button>
      </div>
    </div>
  </div>

 {/* Community & Active Lifestyle Showcase Section (soccer.jpg) */}
 <div className="my-6 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg overflow-hidden relative">
 <div className="grid md:grid-cols-12 gap-6 items-center">
 <div className="md:col-span-7 space-y-3">
 <span className="bg-yellow-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block shadow-sm">
 COMMUNITY & WELLNESS
 </span>
 <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-yellow-300 uppercase">
 Health is Wealth & Active Living
 </h3>
 <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
 At Prophete Universal LLC, we believe that true wealth begins with healthy living, community teamwork, and active family wellness. Protecting your future means empowering every aspect of your life.
 </p>
 </div>
 <div className="md:col-span-5 flex justify-center">
 <div className="w-full max-w-xs h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-yellow-400/80 shadow-2xl relative">
 <img 
 src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/62cb067b244c96e1a2d7fa688d9121d4f7ec0e2b/soccer.jpg" 
 alt="Active Community Lifestyle" 
 className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
 />
 </div>
 </div>
 </div>
 </div>



 <div className="bg-slate-50 p-6 flex justify-center">
 <ScheduleBanner onClick={() => setCurrentPage(Page.SCHEDULE_CALL)} className="w-full shadow-none border-none py-2" />
 </div>
 </div>
 </div>
 );

 case Page.FAQ:
 return (
 <ContentRoom 
 title="Frequently Asked Questions" 
 subtitle="Comprehensive guide to your tax, insurance, and service questions." 
 onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplication={() => setCurrentPage(Page.APPLICATIONS)}
 >
 <FAQRoom 
 onScheduleCall={() => setCurrentPage(Page.SCHEDULE_CALL)}
 onApplyForm={() => setCurrentPage(Page.APPLICATIONS)}
 />
 </ContentRoom>
 );
 
 case Page.CLIENT_WISHLIST:
 return (
 <ContentRoom title="Client Wish Room" subtitle="Tell us what you need, and we'll make it happen." image="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/f01ceb926257271119cb5fb763f9abf3cc32b977/wishlist.png" onSchedule={() => setCurrentPage(Page.SCHEDULE_CALL)}>
 <div className="space-y-6">
 
 <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
 <h3 className="text-xl sm:text-2xl font-bold text-teal-900 mb-2">Your Request Panel</h3>
 <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
 Submit your requests, wishlist items, or direct messages to our leadership team choosing your preferred option below:
 </p>
 
 <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-8">
 {/* Option 1 */}
 <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-2 mb-3">
 <span className="bg-emerald-600 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Option One</span>
 <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Interactive AI</span>
 </div>
 <h4 className="text-lg sm:text-xl font-extrabold text-teal-950 mb-2">Connect with Pandora</h4>
 <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
 Option one: Connect with Pandora, tap the microphone in the bottom right to speak with our AI agent. She’s ready to answer your questions or help you dictate your personalized message.
 </p>
 </div>
 <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800">
 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
 <span>Voice & AI Assistance Enabled</span>
 </div>
 </div>
 
 {/* Option 2 */}
 <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100/60 p-6 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-2 mb-3">
 <span className="bg-sky-600 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Option Two</span>
 <span className="text-sky-700 text-xs font-bold uppercase tracking-wider">Direct Form</span>
 </div>
 <h4 className="text-lg sm:text-xl font-extrabold text-teal-950 mb-2">Manual Submission</h4>
 <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
 Option two: Manual submission, complete the form below, then click 'Send Email' to open your mail client with your request ready. This ensures your message goes directly to our leadership team.
 </p>
 </div>
 <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center gap-2 text-xs font-bold text-sky-800">
 <span className="w-2 h-2 rounded-full bg-sky-500"></span>
 <span>Direct Executive Inbox Access</span>
 </div>
 </div>
 </div>
 
 <div className="border-t border-slate-200 pt-8 mt-4">
 <h3 className="text-xl sm:text-2xl font-bold text-center text-teal-900 mb-2">Send us a Request</h3>
 <p className="text-center text-slate-600 mb-6 text-base sm:text-lg">Direct communication to the LLC leadership.</p>
 
 <form className="space-y-5" onSubmit={(e) => {
 e.preventDefault();
 const form = e.target as HTMLFormElement;
 const formData = new FormData(form);
 const name = formData.get('name');
 const contact = formData.get('contact');
 const wish = formData.get('wish');
 
 const subject = `Client Wish Room Request from ${name}`;
 const body = `Name: ${name}%0D%0AContact: ${contact}%0D%0A%0D%0AWish Room/Request:%0D%0A${wish}`;
 
 window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
 }}>
 <div>
 <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Full Name</label>
 <input name="name" type="text" placeholder="John Doe" className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg" required />
 </div>
 
 <div>
 <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Contact Phone/Email</label>
 <input name="contact" type="text" placeholder="(555) 555-5555" className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg" required />
 </div>
 
 <div>
 <label className="block text-slate-700 font-bold mb-1.5 text-base sm:text-lg">Your Wish Room / Request</label>
 <textarea name="wish" rows={4} placeholder="I would like to request..." className="w-full p-3 sm:p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-base sm:text-lg resize-none" required></textarea>
 </div>
 
 <button className="w-full py-3 sm:py-4 bg-teal-800 hover:bg-teal-700 text-white font-extrabold text-lg sm:text-xl rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 sm:gap-3">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 </svg> Send Email
 </button>
 </form>
 </div>
 </div>
 </div>
 </ContentRoom>
 );

 case Page.WEB_DESIGN:
 return (
 <div className="min-h-screen bg-black text-[#00FF41] font-mono p-4 sm:p-8 md:p-12 relative overflow-hidden">
 <div className="max-w-4xl mx-auto z-10 relative mt-4 space-y-10 text-center">
 {/* Top Commercial Video Showcase */}
 <div className="w-full">
 <VideoPanel 
 src="https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c609d5af7ef0f08b59b912b340/Jarvis-27complete%20flash.mp4" 
 subtitle="Jarvis-27 @ your Service" 
 subtitleColor="text-[#00FF41] font-sans font-black tracking-widest text-xl sm:text-2xl md:text-3xl uppercase drop-shadow-[0_0_12px_rgba(0,255,65,0.7)]" 
 />
 </div>
 
 {/* Main Content - Commercial Sales Atmosphere */}
 <div className="space-y-10 text-left font-sans">
 
 {/* Main Title */}
 <div className="space-y-3">
 <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#00FF41] leading-tight">
 <span>Web Designs</span> <span className="inline-block whitespace-nowrap">Jarvis-27</span>
 </h1>
 <p className="text-xl sm:text-2xl text-yellow-300 font-bold max-w-2xl pt-2">
 We Upgrade Existing Website or Build From Scratch with AI Agent Power Enhancements at Most Affordable Rates.
 </p>
 </div>

 {/* Commercial Pitch & Mission */}
 <div className="text-emerald-200 text-base sm:text-lg leading-relaxed space-y-4">
 <p className="text-lg sm:text-xl font-semibold text-white">
 Is your website complex, slow, or outdated? <strong className="text-yellow-300">AMA Ask Morpheus Alliance Jarvis-27</strong> and <strong className="text-yellow-300">Pandora Lee</strong> are AI Agents engineered specifically to enhance visitor engagement, making complex browsing smoother, faster, and stress-free for every visitor.
 </p>
 <p>
 Spawned during the pandemic as a forward-thinking SaaS innovation, our core mission is <strong className="text-yellow-300">EEEE: To Educate, Enlighten, and Empower through Entertainment and AI Support</strong>. We take the friction out of digital tasks and make web experiences effortless.
 </p>
 </div>

 {/* Feature Highlights / What We Offer */}
 <div className="space-y-6">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#00FF41] tracking-wider">
 What We Deliver
 </h2>
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-[#00FF41]/40 rounded-full text-xs font-mono text-[#00FF41] uppercase tracking-widest">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
 </span>
 AI Agents Active
 </div>
 </div>

 <div className="space-y-4 text-emerald-100">
 <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
 <div className="relative flex items-center justify-center shrink-0 mt-1.5 w-4 h-4">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
 </div>
 <div className="space-y-1">
 <h3 className="text-lg sm:text-xl font-bold text-white">Meet Pandora & Jarvis – Your Companion Agents</h3>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 Pandora and Jarvis-27 are our resident tour guides and AI assistant bots equipped with browsing capabilities. They guide visitors, take notes, answer questions, and direct queries to management.
 </p>
 </div>
 </div>

 <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
 <div className="relative flex items-center justify-center shrink-0 mt-1.5 w-4 h-4">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
 </div>
 <div className="space-y-1">
 <h3 className="text-lg sm:text-xl font-bold text-white">Repair & Resurrect Websites, Photos, Sounds & Videos</h3>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 We repair and resurrect old websites, resolve technical issues, restore old photos, fix audio recordings, and refine videos , just Ask Morpheus! Great rates whether repairing old assets or building new ones.
 </p>
 </div>
 </div>

 <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
 <div className="relative flex items-center justify-center shrink-0 mt-1.5 w-4 h-4">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
 </div>
 <div className="space-y-1">
 <h3 className="text-lg sm:text-xl font-bold text-white">AI Tool Training & Custom Companion Bots</h3>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 We love the challenge! We are ready to teach anyone who wants to learn AI tools , including setting up customized companion bots tailored specifically for your work. Get your own <strong className="text-yellow-300">Jarvis</strong> or <strong className="text-yellow-300">Pandora Lee @ Your Service</strong>. Masterclass sessions available , just ask!
 </p>
 </div>
 </div>

 <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
 <div className="relative flex items-center justify-center shrink-0 mt-1.5 w-4 h-4">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
 </div>
 <div className="space-y-1">
 <h3 className="text-lg sm:text-xl font-bold text-white">Affordable Custom Mockups & Web Upgrades</h3>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 Get quick, stunning mockup designs created to visualize your vision before full production.
 </p>
 </div>
 </div>

 <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all">
 <div className="relative flex items-center justify-center shrink-0 mt-1.5 w-4 h-4">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF41] shadow-[0_0_10px_#00FF41]"></span>
 </div>
 <div className="space-y-1">
 <h3 className="text-lg sm:text-xl font-bold text-white">Ask & Ye Shall Receive</h3>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 Seek and ye shall find. No project is too small, and no task is too complex. We love every technical challenge and bring your ideas to life.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Starting Rate Offer Banner */}
 <div className="p-6 sm:p-8 bg-slate-950 border-2 border-[#00FF41] rounded-2xl space-y-4 shadow-[0_0_25px_rgba(0,255,65,0.2)]">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/40 pb-4">
 <div>
 <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 block mb-2">Exclusive Start Package</span>
 <h3 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">Just $100 USD Down</h3>
 </div>
 <span className="inline-block px-4 py-2 bg-[#00FF41] text-black font-black uppercase tracking-wider text-sm sm:text-base rounded-lg self-start sm:self-center animate-pulse shadow-[0_0_20px_rgba(0,255,65,0.7)] whitespace-nowrap">
 No Job Too Small
 </span>
 </div>
 <p className="text-emerald-200 text-base sm:text-lg leading-relaxed">
 If you agree on the template design, put just a <strong className="text-yellow-300">$100 USD deposit</strong> until the site is complete , covering simple to complex projects! Great rates for repairing old sites, resurrecting photo assets, fixing website issues, or building a brand new custom website from scratch.
 </p>
 </div>

 {/* Contact Dean */}
 <div className="pt-6 border-t border-[#00FF41]/40 space-y-6">
 <div>
 <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider mb-1">
 Contact Dean
 </h2>
 <p className="text-emerald-300 text-base sm:text-lg">
 Ready to enhance your website or get an affordable mock design quote? Reach out now.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
 <a 
 href="https://wa.me/17789535496" 
 target="_blank" 
 rel="noopener noreferrer" 
 className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#00FF41] hover:bg-emerald-400 text-black font-black text-lg sm:text-xl rounded-xl transition-all shadow-md text-center"
 >
 <span className="whitespace-nowrap">WhatsApp: 778-953-5496</span>
 </a>

 <a 
 href="mailto:Askmorpheus@gmail.com" 
 className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-yellow-300 border border-emerald-500/50 font-bold text-base sm:text-lg rounded-xl transition-all text-center"
 >
 <span className="whitespace-nowrap">Askmorpheus@gmail.com</span>
 </a>
 </div>

 <div className="text-sm text-emerald-400 pt-2 space-y-1 font-mono text-center">
 <p><strong>AMA Web Developer:</strong> Dean</p>
 <p className="text-xs sm:text-sm leading-relaxed flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
 <span className="font-bold">Business Hours:</span>
 <span className="whitespace-nowrap">11 AM – 9 PM EST</span>
 <span className="hidden sm:inline text-emerald-600">|</span>
 <span className="whitespace-nowrap">8 AM – 7 PM PST</span>
 </p>
 <p className="text-xs uppercase text-emerald-500 tracking-widest pt-2">AMA - Ask Morpheus Alliance</p>
 <p className="text-xs uppercase text-emerald-500 tracking-widest">All Rights Reserved ®</p>
 </div>
 </div>

 </div>
 </div>
 </div>
 );

 case Page.SCHEDULE_CALL:
 return <Section title="Calendar Schedule" subtitle="Find a time that works best for you." center={true}><CalendarUI /></Section>;

 case Page.APPLICATIONS:
 return <ApplicationsRoom initialTab={applicationTab} />;

 case Page.GAME_ROOM:
 return (
 <div className="min-h-screen p-4 md:p-10 text-center text-white relative pb-20 font-sans">
 <div className="max-w-6xl mx-auto">
 <div className="w-full flex justify-center mb-6">
 <VideoPanel subtitle="" />
 </div>
 <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 tracking-wider uppercase">THE LOUNGE</h2>
 <p className="text-base sm:text-lg md:text-xl text-teal-100/90 font-medium mb-6 max-w-3xl mx-auto leading-relaxed">Welcome to the waiting room. Watch videos or play mental games while you wait. Thank you for visiting!</p>
 
 {/* Target portal container for Live Radio in Waiting Room */}
 <div id="radio-lounge-container" className="my-6"></div>

 <h3 className="text-2xl sm:text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 tracking-wider uppercase">THE TUBE</h3>
 <div className="w-full max-w-2xl mx-auto mb-12 flex flex-col items-center">
 <VideoPanel 
 subtitle="" 
 noBorder={true} 
 controls={false} 
 onClick={() => setCurrentPage(Page.THEATER)}
 />
 <button 
 onClick={() => setCurrentPage(Page.THEATER)}
 className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-300"
 >
 Open Movie Theater Lounge
 </button>
 </div>

 <h3 className="text-2xl sm:text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 tracking-wider uppercase">THE ARCADE</h3>
 
 <div className="mb-8 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 rounded-3xl border-2 border-cyan-400/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="text-center">
 <h4 className="text-xl font-black text-cyan-300 uppercase tracking-wider">MIND PALACE & EXTRA BRAIN GAMES</h4>
 <p className="text-xs sm:text-sm text-slate-300">Simon Sequence, Stroop Focus, Word Unscramble, Math Sprint & Wisdom Trivia!</p>
 </div>
 <button
 onClick={() => setCurrentPage(Page.VIP_GAMES)}
 className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 shrink-0"
 >
 Enter Game Room & Lounge →
 </button>
 </div>
 <div className="grid md:grid-cols-2 gap-8">
 <div className="bg-slate-800/80 backdrop-blur border-4 border-teal-500 rounded-xl p-6 hover:scale-[1.01] transition-transform flex flex-col items-center justify-center">
 <TicTacToe />
 </div>
 <div className="bg-slate-800/80 backdrop-blur border-4 border-amber-500 rounded-xl p-6 hover:scale-[1.01] transition-transform flex flex-col justify-center items-center"><CheckersGame /></div>
 <div className="bg-slate-800/80 backdrop-blur border-4 border-pink-500 rounded-xl p-6 hover:scale-[1.01] transition-transform flex flex-col items-center justify-center"><MemoryGame /></div>
 <div className="bg-slate-800/80 backdrop-blur border-4 border-cyan-500 rounded-xl p-6 hover:scale-[1.01] transition-transform flex flex-col justify-center items-center"><RockPaperScissors /></div>
 </div>
 </div>
 </div>
 );

 case Page.THEATER:
 return (
 <TheaterRoom onReturnToArcade={() => setCurrentPage(Page.GAME_ROOM)} />
 );

 case Page.VIP_GAMES:
 return (
 <VIPGameRoom 
 onReturnToArcade={() => setCurrentPage(Page.GAME_ROOM)}
 onReturnToLobby={handleReturnToLobby}
 onOpenTheater={() => setCurrentPage(Page.THEATER)}
 />
 );

 case Page.PROJECTS_2027:
 return (
 <Projects2027Room onReturnToContactUs={() => setCurrentPage(Page.CONTACT)} onReturnToLobby={handleReturnToLobby} />
 );

 default: return null;
 }
 };

 const bgClass = getPageBackground(currentPage);

 return (
 <div className={`min-h-screen flex flex-col font-sans text-slate-900 transition-colors duration-1000 w-full ${bgClass}`}>
 {showSplash && <SplashScreen onEnter={() => setShowSplash(false)} />}
 <header className="fixed w-full top-0 z-50 shadow-md">
 <LiveHeaderBar />
 <NavBar currentPage={currentPage} setPage={setCurrentPage} onLogoClick={handleReturnToLobby} />
 </header>
 <main className={`pt-[116px] flex-grow transition-opacity duration-300 ease-in-out ${currentPage === Page.HOME ? 'pb-0' : 'pb-10'}`}>
 <div ref={scrollRef} className="h-0 w-full absolute top-0" />
 {renderContent()}
 {currentPage !== Page.HOME && (
 <div className="flex flex-col items-center gap-3 mt-8 z-30 relative">
 {currentPage !== Page.VIP_GAMES && (
 <button
 onClick={() => setCurrentPage(Page.VIP_GAMES)}
 className="px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] sm:text-sm uppercase tracking-wider rounded-full shadow-2xl border-2 border-yellow-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 max-w-[90vw] text-center"
 >
 <span>GAME ROOM & LOUNGE</span>
 </button>
 )}
 <ReturnButton onClick={handleReturnToLobby} />
 </div>
 )}
 </main>
 <VoiceIndicator 
 isActive={isActive} 
 isSpeaking={isSpeaking} 
 toggle={toggleVoice} 
 onOpenSimulator={() => {
 unlockAudioGlobal();
 setIsSimulatorOpen(true);
 }}
 isScrollPaused={isManualScrollPaused}
 onToggleScrollPause={() => setIsManualScrollPaused(prev => !prev)}
 />
 <RadioPlayer 
 isMicActive={isActive || isSpeaking} 
 isTourActive={isSimulatorOpen} 
 isWaitingRoom={currentPage === Page.GAME_ROOM} 
 isSplashActive={showSplash} 
 isHomePage={currentPage === Page.HOME} 
 />
 <TourSimulator 
 isOpen={isSimulatorOpen} 
 onClose={() => setIsSimulatorOpen(false)} 
 setPage={setCurrentPage} 
 />
 <footer className="bg-[#0b3d35] text-white pt-10 pb-20 sm:pt-12 sm:pb-24 border-t border-teal-800 mt-auto relative z-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-6">
 {/* Social Media Icons */}
 <div className="flex items-center justify-center gap-4 text-teal-200">
 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
 </a>
 <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
 </a>
 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
 </a>
 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
 </a>
 <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
 </a>
 <a href={`tel:${COMPANY_INFO.phone}`} aria-label="Phone" className="relative group w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <Phone className="w-5 h-5 animate-bounce" />
 </a>
 <a href={`mailto:${COMPANY_INFO.email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center hover:bg-teal-700 hover:text-yellow-300 transition-all shadow-sm">
 <Mail className="w-5 h-5" />
 </a>
 </div>

 {/* Navigation Site Links */}
 <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-base font-medium text-teal-100 uppercase tracking-tight">
 <button onClick={() => setCurrentPage(Page.HOME)} className="hover:text-white hover:underline transition-all">Home</button>
 <button onClick={() => setCurrentPage(Page.ABOUT_US)} className="hover:text-white hover:underline transition-all">About</button>
 <button onClick={() => setCurrentPage(Page.CONTACT)} className="hover:text-white hover:underline transition-all">Contact</button>
 <button onClick={() => setCurrentPage(Page.CLIENT_WISHLIST)} className="hover:text-white hover:underline transition-all">Wish Room</button>
 </div>

 {/* Logo and Company Details */}
 <div className="flex flex-col items-center text-center py-2 space-y-1">
 <h3 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase">PROPHETE UNIVERSAL LLC</h3>
 <p className="text-teal-300 text-sm md:text-base font-bold">{COMPANY_INFO.address}</p>
 <p className="text-teal-400 text-xs md:text-sm font-bold opacity-90 pt-2 pb-6 whitespace-nowrap">Website Designer Jarvis-27</p>
 
 <div className="flex items-center justify-center my-3">
 <button 
 onClick={handleReturnToLobby} 
 className="hover:scale-105 transition-transform mx-auto focus:outline-none group flex items-center justify-center"
 aria-label="Prophete Universal Logo"
 >
 <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-teal-950/80 border-2 border-teal-400/80 ring-4 ring-teal-500/20 flex items-center justify-center shadow-lg overflow-hidden relative p-1 group-hover:border-teal-300 transition-colors shrink-0">
 <img src={LOGO_URL} alt="Prophete Universal Logo" className="w-full h-full object-contain block mx-auto my-auto" />
 </div>
 </button>
 </div>
 </div>
 </div>
 </footer>
 </div>
 );
};

export default App;