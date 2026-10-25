import React, { useState, useEffect } from 'react';
import { VideoPanel } from './VideoPanel';
import {
  Play,
  RefreshCw,
  Trophy,
  Zap,
  Brain,
  Sparkles,
  Award,
  Check,
  X,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Info,
  Grid,
  Shield,
  Heart,
  Lock,
  Building,
  DollarSign,
  FileText,
  Type,
  Calculator,
  HelpCircle,
  Flame,
  RotateCcw
} from 'lucide-react';

interface VIPGameRoomProps {
  onReturnToArcade: () => void;
  onReturnToLobby: () => void;
  onOpenTheater?: () => void;
}

// --- SHARED OFFICIAL GAME RULES & INSTRUCTIONS COMPONENT ---
const GameRulesCard = ({
  title,
  objective,
  rules,
  cognitiveTarget
}: {
  title: string;
  objective: string;
  rules: string[];
  cognitiveTarget: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-2xl mb-6 bg-slate-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Official Game Rules & How To Play ,  {title}</span>
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          {isOpen ? 'Hide Rules' : 'View Rules'}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm text-slate-300">
          <div>
            <span className="font-black text-cyan-200 uppercase tracking-wider block mb-1">Objective</span>
            <p className="text-slate-300 leading-relaxed">{objective}</p>
          </div>

          <div>
            <span className="font-black text-cyan-200 uppercase tracking-wider block mb-1">Step-by-Step Rules</span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              {rules.map((rule, idx) => (
                <li key={idx} className="leading-snug">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-teal-300 font-semibold">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Cognitive Target: <strong className="text-white">{cognitiveTarget}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAME 1: SIMON COLOR SEQUENCE MEMORY ---
const SimonMemoryGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('Press Start to begin sequence!');
  const [highScore, setHighScore] = useState<number>(0);

  const colors = [
    { id: 0, color: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300 shadow-[0_0_20px_#10b981]', active: 'bg-emerald-300 scale-105 shadow-[0_0_35px_#10b981]', label: 'Green' },
    { id: 1, color: 'bg-rose-500 hover:bg-rose-400 border-rose-300 shadow-[0_0_20px_#f43f5e]', active: 'bg-rose-300 scale-105 shadow-[0_0_35px_#f43f5e]', label: 'Red' },
    { id: 2, color: 'bg-amber-500 hover:bg-amber-400 border-amber-300 shadow-[0_0_20px_#f59e0b]', active: 'bg-amber-300 scale-105 shadow-[0_0_35px_#f59e0b]', label: 'Yellow' },
    { id: 3, color: 'bg-cyan-500 hover:bg-cyan-400 border-cyan-300 shadow-[0_0_20px_#06b6d4]', active: 'bg-cyan-300 scale-105 shadow-[0_0_35px_#06b6d4]', label: 'Blue' },
  ];

  const startGame = () => {
    const firstNum = Math.floor(Math.random() * 4);
    setSequence([firstNum]);
    setUserSequence([]);
    setIsPlaying(true);
    setMessage('Watch the pattern carefully...');
    playSequence([firstNum]);
  };

  const playSequence = (seq: number[]) => {
    setUserSequence([]);
    seq.forEach((num, index) => {
      setTimeout(() => {
        setActiveBtn(num);
        setTimeout(() => {
          setActiveBtn(null);
          if (index === seq.length - 1) {
            setMessage('Your turn! Repeat the pattern.');
          }
        }, 400);
      }, (index + 1) * 700);
    });
  };

  const handleBtnClick = (id: number) => {
    if (!isPlaying || activeBtn !== null) return;

    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 250);

    const newUserSeq = [...userSequence, id];
    setUserSequence(newUserSeq);

    const currentIndex = newUserSeq.length - 1;
    if (newUserSeq[currentIndex] !== sequence[currentIndex]) {
      setIsPlaying(false);
      setMessage(`Game Over! Final sequence length reached: ${sequence.length}.`);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      const pts = sequence.length * 15;
      onAddPoints(pts);
      if (sequence.length > highScore) setHighScore(sequence.length);

      setMessage(`Great job! Round ${sequence.length} complete (+${pts} pts)!`);
      const nextNum = Math.floor(Math.random() * 4);
      const nextSeq = [...sequence, nextNum];
      setSequence(nextSeq);
      setTimeout(() => {
        playSequence(nextSeq);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Simon Pattern Recall"
        objective="Memorize and reproduce an expanding sequence of flashing color pads."
        rules={[
          'Click Start Pattern Game to initiate the sequence.',
          'Watch the order of light pads demonstrated by the system.',
          'Click the color pads in the exact same sequence once the playback completes.',
          'Each successfully repeated round adds a new step and earns 15 points per level.'
        ]}
        cognitiveTarget="Short-Term Working Memory & Pattern Recognition"
      />

      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-6 h-6 text-emerald-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-emerald-300 uppercase tracking-wider">SIMON PATTERN RECALL</h3>
      </div>

      <div className="bg-slate-950 p-4 rounded-full border-4 border-slate-800 shadow-2xl mb-4">
        <div className="grid grid-cols-2 gap-4 w-48 h-48 sm:w-60 sm:h-60">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => handleBtnClick(c.id)}
              disabled={!isPlaying}
              className={`rounded-2xl border-2 transition-all duration-200 transform active:scale-95 ${
                activeBtn === c.id ? c.active : c.color
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm sm:text-base font-bold text-yellow-300 mb-3 text-center min-h-[24px]">
        {message}
      </p>

      <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-300 mb-4">
        <span>Current Sequence: <strong className="text-emerald-400 text-base">{sequence.length}</strong></span>
        <span>High Record: <strong className="text-yellow-400 text-base">{highScore}</strong></span>
      </div>

      <button
        onClick={startGame}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 border border-emerald-300"
      >
        {isPlaying ? 'Restart Pattern Game' : 'Start Pattern Game'}
      </button>
    </div>
  );
};

// --- GAME 2: STROOP COLOR FOCUS TEST ---
const StroopColorGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const colorNames = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
  const colorHexes: Record<string, string> = {
    RED: '#f43f5e',
    BLUE: '#38bdf8',
    GREEN: '#34d399',
    YELLOW: '#facc15',
    PURPLE: '#c084fc',
    ORANGE: '#fb923c',
  };

  const [currentWord, setCurrentWord] = useState('RED');
  const [currentColor, setCurrentColor] = useState('#f43f5e');
  const [isMatch, setIsMatch] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateRound = () => {
    const word = colorNames[Math.floor(Math.random() * colorNames.length)];
    const shouldMatch = Math.random() > 0.5;
    let colorName = word;
    if (!shouldMatch) {
      const otherColors = colorNames.filter((c) => c !== word);
      colorName = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
    setCurrentWord(word);
    setCurrentColor(colorHexes[colorName]);
    setIsMatch(word === colorName);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (userChoiceMatches: boolean) => {
    if (userChoiceMatches === isMatch) {
      const added = 20 + streak * 5;
      setScore((s) => s + added);
      setStreak((s) => s + 1);
      onAddPoints(added);
      setFeedback('CORRECT! + ' + added + ' pts');
    } else {
      setStreak(0);
      setFeedback('INCORRECT! Focus on word vs ink color.');
    }
    setTimeout(() => setFeedback(null), 800);
    generateRound();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Stroop Color Focus"
        objective="Determine whether the literal color word matches the ink color in which it is displayed."
        rules={[
          'Examine the written word name displayed in the center panel.',
          'Observe the visual ink color of the text.',
          'Click MATCHES (YES) if the written word name equals the ink color.',
          'Click DIFFERS (NO) if the word name is different from the ink color.',
          'Build consecutive accurate responses to earn streak multipliers.'
        ]}
        cognitiveTarget="Executive Function, Selective Attention, & Interference Control"
      />

      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-cyan-300 uppercase tracking-wider">STROOP COLOR FOCUS</h3>
      </div>

      <div className="bg-slate-950/90 border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-8 w-full max-w-sm text-center mb-4 shadow-xl">
        <span
          className="text-4xl sm:text-5xl font-black tracking-widest block transition-colors duration-200"
          style={{ color: currentColor }}
        >
          {currentWord}
        </span>
      </div>

      {feedback && (
        <div
          className={`text-sm font-extrabold mb-3 animate-bounce ${
            feedback.includes('CORRECT') ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="flex gap-4 mb-4 w-full max-w-sm justify-center">
        <button
          onClick={() => handleAnswer(true)}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg border border-emerald-400 transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>MATCHES (YES)</span>
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg border border-rose-400 transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
        >
          <X className="w-4 h-4" />
          <span>DIFFERS (NO)</span>
        </button>
      </div>

      <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-300 font-semibold">
        <span>Score: <strong className="text-cyan-400 text-base">{score}</strong></span>
        <span className="flex items-center gap-1">Streak: <Flame className="w-4 h-4 text-amber-400" /> <strong className="text-yellow-400 text-base">{streak}</strong></span>
      </div>
    </div>
  );
};

// --- GAME 3: WORD UNSCRAMBLE MASTER ---
const WordUnscrambleGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const WORDS = [
    { word: 'INSURANCE', hint: 'Financial safety net protecting against unexpected risks' },
    { word: 'PROTECTION', hint: 'Keeping your family and financial assets secure' },
    { word: 'PROPHETE', hint: 'Universal leadership serving South Florida' },
    { word: 'DEDUCTION', hint: 'Reduces your taxable income baseline' },
    { word: 'ANNUITY', hint: 'Guaranteed lifetime income stream for retirement' },
    { word: 'COVERAGE', hint: 'Scope of protection provided by policy terms' },
    { word: 'BENEFIT', hint: 'Cash payout received from an insurance claim' },
    { word: 'FLORIDA', hint: 'The Sunshine State' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const scrambleWord = (str: string) => {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const result = arr.join('');
    return result === str ? scrambleWord(str) : result;
  };

  const loadWord = (idx: number) => {
    setCurrentIndex(idx);
    setScrambled(scrambleWord(WORDS[idx].word));
    setInputVal('');
    setShowHint(false);
    setStatus(null);
  };

  useEffect(() => {
    loadWord(0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim().toUpperCase() === WORDS[currentIndex].word) {
      const pts = showHint ? 15 : 30;
      onAddPoints(pts);
      setStatus(`EXCELLENT! Correct word: ${WORDS[currentIndex].word} (+${pts} pts)`);
      setTimeout(() => {
        const nextIdx = (currentIndex + 1) % WORDS.length;
        loadWord(nextIdx);
      }, 1200);
    } else {
      setStatus('Not quite right. Try again!');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Word Unscramble Master"
        objective="Unscramble jumbled letters to form key financial, tax, and insurance terms."
        rules={[
          'Examine the scrambled letter tiles shown in the display box.',
          'Type the unscrambled word into the text input field.',
          'Press Check Answer or hit Enter to submit.',
          'Use the Hint button for a clue if needed (awards 15 pts instead of 30 pts).'
        ]}
        cognitiveTarget="Anagram Processing, Lexical Retrieval, & Vocabulary Retention"
      />

      <div className="flex items-center gap-2 mb-2">
        <Type className="w-6 h-6 text-amber-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-wider">WORD UNSCRAMBLE</h3>
      </div>

      <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 w-full max-w-md text-center mb-4 shadow-xl">
        <div className="text-3xl sm:text-4xl font-black tracking-widest text-yellow-300 font-mono mb-2">
          {scrambled}
        </div>
        {showHint && (
          <p className="text-xs sm:text-sm text-amber-200/90 italic mt-2 bg-amber-950/60 p-2 rounded-lg border border-amber-800/40">
            Hint: {WORDS[currentIndex].hint}
          </p>
        )}
      </div>

      {status && (
        <div
          className={`text-sm font-extrabold mb-3 ${
            status.includes('EXCELLENT') ? 'text-emerald-400 animate-bounce' : 'text-rose-400'
          }`}
        >
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="TYPE UNSCRAMBLED WORD..."
          className="w-full px-4 py-3 bg-slate-900 border-2 border-amber-500/40 text-yellow-300 placeholder-amber-500/40 font-black text-center text-lg uppercase tracking-widest rounded-xl focus:border-amber-400 focus:outline-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md border border-yellow-300 transition-all"
          >
            Check Answer
          </button>
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-amber-500/40 transition-all flex items-center gap-1"
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>Hint</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// --- GAME 4: MATH SPRINT CHALLENGE ---
const MathSprintGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const [num1, setNum1] = useState(10);
  const [num2, setNum2] = useState(5);
  const [operator, setOperator] = useState('+');
  const [userAns, setUserAns] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const generateProblem = () => {
    const ops = ['+', '-', '*'];
    const selectedOp = ops[Math.floor(Math.random() * ops.length)];
    setOperator(selectedOp);

    if (selectedOp === '*') {
      setNum1(Math.floor(Math.random() * 9) + 2);
      setNum2(Math.floor(Math.random() * 9) + 2);
    } else if (selectedOp === '-') {
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * a);
      setNum1(a);
      setNum2(b);
    } else {
      setNum1(Math.floor(Math.random() * 50) + 5);
      setNum2(Math.floor(Math.random() * 50) + 5);
    }
    setUserAns('');
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const getCorrectAns = () => {
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    return num1 * num2;
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAns, 10) === getCorrectAns()) {
      const added = 25;
      setScore((s) => s + added);
      onAddPoints(added);
      setMessage(`CORRECT! +${added} pts`);
      setTimeout(() => setMessage(null), 800);
      generateProblem();
    } else {
      setMessage(`Incorrect! Expected ${getCorrectAns()}`);
      setTimeout(() => setMessage(null), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Math Speed Sprint"
        objective="Perform rapid mental calculation to solve arithmetic equations."
        rules={[
          'Observe the math equation presented on screen.',
          'Calculate the solution in your mind.',
          'Enter the numerical answer into the input field.',
          'Press Submit or hit Enter. Each correct answer awards 25 points.'
        ]}
        cognitiveTarget="Numerical Calculation Agility & Mental Speed"
      />

      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-6 h-6 text-purple-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-purple-300 uppercase tracking-wider">MATH SPEED SPRINT</h3>
      </div>

      <div className="bg-slate-950 border-2 border-purple-500/50 rounded-2xl p-6 w-full max-w-xs text-center mb-4 shadow-xl">
        <span className="text-4xl sm:text-5xl font-mono font-black text-purple-300">
          {num1} {operator === '*' ? '×' : operator} {num2} = ?
        </span>
      </div>

      {message && (
        <div className={`text-sm font-extrabold mb-3 ${message.includes('CORRECT') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleCheck} className="flex gap-2 w-full max-w-xs">
        <input
          type="number"
          value={userAns}
          onChange={(e) => setUserAns(e.target.value)}
          placeholder="Answer"
          className="w-full px-4 py-2.5 bg-slate-900 border-2 border-purple-500/40 text-purple-200 font-mono text-xl font-bold rounded-xl text-center focus:border-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border border-purple-300 transition-all shrink-0"
        >
          Submit
        </button>
      </form>

      <div className="mt-4 text-xs sm:text-sm text-slate-300 font-semibold">
        Total Math Score: <strong className="text-purple-300 text-base">{score} pts</strong>
      </div>
    </div>
  );
};

// --- GAME 5: WISDOM & TRIVIA QUIZ ---
const WisdomTriviaGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const QUESTIONS = [
    {
      q: 'What is mandatory for all automobile drivers in the state of Florida?',
      options: ['PIP (Personal Injury Protection) & Property Damage', 'Comprehensive Only', 'Collision Only', 'No Insurance Needed'],
      ans: 0,
      explain: 'Florida law mandates at least $10,000 PIP and $10,000 Property Damage liability.'
    },
    {
      q: 'When does official Florida tax season filing typically peak each year?',
      options: ['January to April', 'August to October', 'November Only', 'December 31st'],
      ans: 0,
      explain: 'Federal and state tax filing deadlines run from mid-January through mid-April.'
    },
    {
      q: 'What type of insurance covers hurricane storm surges and rising water damage?',
      options: ['Separate Flood Insurance Policy', 'Standard Homeowners Insurance', 'Auto Collision', 'Health Insurance'],
      ans: 0,
      explain: 'Standard homeowners insurance policies exclude flood damage. A separate flood policy is essential in South Florida!'
    },
    {
      q: 'Which life insurance feature allows accessing money while living for severe medical events?',
      options: ['Living Benefits Rider', 'Term Expiry', 'Accidental Only', 'Mortgage Tax'],
      ans: 0,
      explain: 'Living benefits allow policyholders to receive cash benefits for critical or chronic illnesses while still living.'
    }
  ];

  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === QUESTIONS[qIndex].ans) {
      onAddPoints(25);
      setFeedback('CORRECT! ' + QUESTIONS[qIndex].explain);
    } else {
      setFeedback('INCORRECT. ' + QUESTIONS[qIndex].explain);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setQIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Wisdom & Trivia Quiz"
        objective="Test your knowledge on South Florida tax, insurance, and life protection solutions."
        rules={[
          'Read the scenario question in the central display.',
          'Select the best answer from four choices.',
          'Review the explanation to learn about Florida laws and protections.',
          'Earn 25 points for every correct response.'
        ]}
        cognitiveTarget="Semantic Memory Retrieval & Regulatory Literacy"
      />

      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-6 h-6 text-yellow-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-yellow-300 uppercase tracking-wider">WISDOM & TRIVIA</h3>
      </div>

      <div className="bg-slate-950 border-2 border-yellow-500/40 rounded-2xl p-5 w-full max-w-lg mb-4 shadow-xl">
        <p className="text-sm sm:text-base font-bold text-white mb-4 leading-snug">
          Q{qIndex + 1}. {QUESTIONS[qIndex].q}
        </p>

        <div className="space-y-2">
          {QUESTIONS[qIndex].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selectedOption !== null}
              className={`w-full p-3 text-left rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                selectedOption === i
                  ? i === QUESTIONS[qIndex].ans
                    ? 'bg-emerald-900/80 text-emerald-200 border-emerald-400 font-bold'
                    : 'bg-rose-900/80 text-rose-200 border-rose-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/60'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="bg-slate-900 p-3 rounded-xl border border-yellow-500/30 max-w-lg text-xs sm:text-sm text-yellow-200 mb-4">
          {feedback}
        </div>
      )}

      {selectedOption !== null && (
        <button
          onClick={nextQuestion}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all"
        >
          Next Question
        </button>
      )}
    </div>
  );
};

// --- GAME 6: SPATIAL CARD MATCH PAIRS (NEW GAME) ---
const CardMatchGame = ({ onAddPoints }: { onAddPoints: (pts: number) => void }) => {
  const PAIRS_DATA = [
    { pairId: 1, label: 'Asset Shield', icon: Shield, color: 'text-cyan-400' },
    { pairId: 2, label: 'Living Benefits', icon: Heart, color: 'text-rose-400' },
    { pairId: 3, label: 'Policy Lock', icon: Lock, color: 'text-amber-400' },
    { pairId: 4, label: 'Corporate BOI', icon: Building, color: 'text-teal-400' },
    { pairId: 5, label: 'Tax Refund', icon: DollarSign, color: 'text-emerald-400' },
    { pairId: 6, label: 'Estate Plan', icon: FileText, color: 'text-purple-400' },
  ];

  interface CardItem {
    uniqueId: number;
    pairId: number;
    label: string;
    icon: React.ElementType;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let count = 0;
    PAIRS_DATA.forEach((item) => {
      deck.push({
        uniqueId: count++,
        pairId: item.pairId,
        label: item.label,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uniqueId: count++,
        pairId: item.pairId,
        label: item.label,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setMatchesCount(0);
    setIsProcessing(false);
    setIsGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: CardItem) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;

    // Flip clicked card
    const updatedCards = cards.map((c) =>
      c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);

      const [first, second] = newSelected;
      if (first.pairId === second.pairId) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setIsProcessing(false);
          const newMatches = matchesCount + 1;
          setMatchesCount(newMatches);
          onAddPoints(20);

          if (newMatches === PAIRS_DATA.length) {
            setIsGameWon(true);
            onAddPoints(50); // Completion Bonus
          }
        }, 500);
      } else {
        // Not a match - flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameRulesCard
        title="Spatial Card Match Pairs"
        objective="Find and match pairs of financial security icons in as few moves as possible."
        rules={[
          'Click any face-down card to flip it and reveal its hidden symbol.',
          'Select a second card to search for its matching pair.',
          'If the symbols match, both cards stay revealed (+20 pts).',
          'If they differ, both cards flip back face-down after a moment. Remember their positions!',
          'Match all 6 pairs (12 cards) to complete the grid and claim a 50-point completion bonus.'
        ]}
        cognitiveTarget="Visual-Spatial Working Memory & Location Recall"
      />

      <div className="flex items-center gap-2 mb-2">
        <Grid className="w-6 h-6 text-teal-400 animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-black text-teal-300 uppercase tracking-wider">SPATIAL CARD MATCH PAIRS</h3>
      </div>

      <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-300 font-semibold mb-4">
        <span>Total Moves: <strong className="text-teal-300 text-base">{moves}</strong></span>
        <span>Pairs Matched: <strong className="text-emerald-400 text-base">{matchesCount} / {PAIRS_DATA.length}</strong></span>
      </div>

      {isGameWon && (
        <div className="bg-emerald-950/80 border-2 border-emerald-400 p-4 rounded-2xl max-w-md text-center mb-4 text-emerald-200 animate-bounce">
          <p className="text-base font-black uppercase tracking-wider">Congratulations! Memory Grid Cleared!</p>
          <p className="text-xs">Completed in {moves} moves. Bonus +50 pts awarded!</p>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-md mb-6">
        {cards.map((card) => {
          const IconComp = card.icon;
          const showFace = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(card)}
              disabled={showFace || isProcessing}
              className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 transform active:scale-95 shadow-xl ${
                showFace
                  ? 'bg-slate-900 border-teal-400/80 scale-100'
                  : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-700/80 hover:border-teal-500/50 hover:scale-105'
              }`}
            >
              {showFace ? (
                <>
                  <IconComp className={`w-8 h-8 sm:w-10 sm:h-10 mb-1 ${card.color}`} />
                  <span className="text-[10px] font-extrabold text-slate-200 text-center leading-tight uppercase">
                    {card.label}
                  </span>
                </>
              ) : (
                <Shield className="w-8 h-8 text-slate-700/60" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={initGame}
        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-lg transition-all flex items-center gap-2 border border-teal-300"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Card Matrix</span>
      </button>
    </div>
  );
};

// --- MAIN VIP GAME ROOM COMPONENT ---
export const VIPGameRoom: React.FC<VIPGameRoomProps> = ({
  onReturnToArcade,
  onReturnToLobby,
  onOpenTheater
}) => {
  const [activeTab, setActiveTab] = useState<'simon' | 'stroop' | 'word' | 'math' | 'trivia' | 'memory'>('simon');
  const [totalBrainPoints, setTotalBrainPoints] = useState(120);

  const addPoints = (pts: number) => {
    setTotalBrainPoints((prev) => prev + pts);
  };

  const getBrainRank = (pts: number) => {
    if (pts > 500) return 'GRANDMASTER MIND';
    if (pts > 300) return 'SHARP SCHOLAR';
    if (pts > 150) return 'ACTIVE THINKER';
    return 'MENTAL FITTER';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-10 font-sans relative pb-24">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 rounded-3xl border-2 border-cyan-500/40 shadow-2xl">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-yellow-300 uppercase tracking-wider whitespace-nowrap">
                MIND & BRAIN PALACE
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/80 font-medium">
                Six specialized cognitive games crafted for focus, working memory, and mental agility!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-2xl border border-yellow-400/40 shadow-inner shrink-0 w-full sm:w-auto justify-center sm:justify-start">
            <Award className="w-6 h-6 text-yellow-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">Brain Rank</div>
              <div className="text-xs sm:text-sm font-extrabold text-yellow-300 whitespace-nowrap">{getBrainRank(totalBrainPoints)} ({totalBrainPoints} pts)</div>
            </div>
          </div>
        </div>

        {/* Featured VIP Video Panel */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 flex justify-center">
            <VideoPanel subtitle="Relaxing Mind Guidance & Universal Vision" className="w-full max-w-md" />
          </div>
          <div className="w-full md:w-1/2 space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Cognitive Wellness Suite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Keep Your Mind Sharp & Active Every Day</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Scientific research indicates that routine engagement with working memory, interference suppression, and mental math puzzles enhances cognitive reserve. Select any of our six games below to begin!
            </p>
            {onOpenTheater && (
              <button
                onClick={onOpenTheater}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all border border-yellow-300"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Visit Movie Theater Lounge</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Navigation Tabs - Clean Icons, No Emojis */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'simon', label: 'Simon Pattern', icon: Brain },
            { id: 'stroop', label: 'Stroop Focus', icon: Zap },
            { id: 'word', label: 'Word Unscramble', icon: Type },
            { id: 'math', label: 'Math Sprint', icon: Calculator },
            { id: 'trivia', label: 'Wisdom Trivia', icon: HelpCircle },
            { id: 'memory', label: 'Spatial Card Match', icon: Grid },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all border flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 border-cyan-200 shadow-lg scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Game Area */}
        <div className="bg-slate-900/80 backdrop-blur border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl min-h-[420px] flex flex-col justify-center items-center">
          {activeTab === 'simon' && <SimonMemoryGame onAddPoints={addPoints} />}
          {activeTab === 'stroop' && <StroopColorGame onAddPoints={addPoints} />}
          {activeTab === 'word' && <WordUnscrambleGame onAddPoints={addPoints} />}
          {activeTab === 'math' && <MathSprintGame onAddPoints={addPoints} />}
          {activeTab === 'trivia' && <WisdomTriviaGame onAddPoints={addPoints} />}
          {activeTab === 'memory' && <CardMatchGame onAddPoints={addPoints} />}
        </div>

        {/* Extra Bottom Quick Links */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReturnToArcade}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-teal-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-teal-500/40 transition-all flex items-center gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Arcade Lounge</span>
          </button>

          {onOpenTheater && (
            <button
              onClick={onOpenTheater}
              className="px-6 py-3 bg-amber-950/80 hover:bg-amber-900 text-yellow-300 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-amber-500/40 transition-all shadow-md"
            >
              Open Theater Lounge
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
