import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Bot, RefreshCw } from 'lucide-react';
import { VideoPanel } from './VideoPanel';

interface FAQRoomProps {
  onScheduleCall: () => void;
  onApplyForm: () => void;
}

export interface FAQItem {
  id: string;
  category: 'tax' | 'life' | 'auto' | 'home' | 'jargon' | 'general';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    categoryLabel: 'Languages & Services',
    question: 'Q. Do you offer services in Spanish?',
    answer: 'Yes, Se Habla Español. On parle Francais et Creole. We serve the diverse community of South Florida with trilingual licensed insurance and tax specialists.'
  },
  {
    id: 'faq-2',
    category: 'tax',
    categoryLabel: 'Tax Preparation',
    question: 'Q. What documents do I need to prepare my taxes?',
    answer: 'You generally need government-issued photo ID, Social Security cards or ITINs for yourself and dependents, W-2s, 1099s, prior year tax returns, and documentation for business expenses or deductions.'
  },
  {
    id: 'faq-3',
    category: 'tax',
    categoryLabel: 'Tax Preparation',
    question: 'Q. Can I file my taxes remotely online?',
    answer: 'Yes! We offer 100% secure electronic filing. You can upload your documents through our encrypted portal, review your return with a specialist, and e-sign from your phone or computer.'
  },
  {
    id: 'faq-4',
    category: 'life',
    categoryLabel: 'Life Insurance',
    question: 'Q. How do Life Insurance Living Benefits work?',
    answer: 'Living Benefits allow you to accelerate a substantial portion of your death benefit cash while you are still alive if you are diagnosed with a qualifying chronic, critical, or terminal illness (such as heart attack, stroke, or cancer).'
  },
  {
    id: 'faq-5',
    category: 'life',
    categoryLabel: 'Life Insurance',
    question: 'Q. What is an Index Universal Life (IUL) policy?',
    answer: 'An IUL is a permanent life insurance policy combining lifelong death benefit protection with cash value growth linked to an equity index (like the S&P 500). It includes a 0% downside floor protecting your principal against market drops.'
  },
  {
    id: 'faq-6',
    category: 'auto',
    categoryLabel: 'Auto Insurance',
    question: 'Q. What are Florida\'s mandatory minimum auto insurance requirements?',
    answer: 'Florida law strictly requires a minimum of $10,000 in Personal Injury Protection (PIP) and $10,000 in Property Damage Liability (PD). PIP covers 80% of necessary medical bills and 60% of lost wages after an accident regardless of fault.'
  },
  {
    id: 'faq-7',
    category: 'home',
    categoryLabel: 'Home Insurance',
    question: 'Q. Is flood insurance included in standard Florida Homeowners policies?',
    answer: 'No. Standard homeowners (HO-3 and HO-6) policies explicitly exclude damage caused by rising flood waters. A separate Flood insurance policy is required to protect your home structure and personal belongings.'
  },
  {
    id: 'faq-8',
    category: 'general',
    categoryLabel: 'Client Wish Room',
    question: 'Q. What is the Client Wish Room?',
    answer: 'The Client Wish Room is an interactive room on our website where existing and prospective clients can communicate unique requests, service feedback, or specific needs directly to company leadership.'
  },
  {
    id: 'faq-9',
    category: 'jargon',
    categoryLabel: 'Insurance Jargon',
    question: 'Q. What is the difference between RCV and ACV?',
    answer: 'Replacement Cost Value (RCV) pays the full current cost to replace damaged property with new materials without deducting for age. Actual Cash Value (ACV) calculates replacement cost minus physical depreciation.'
  },
  {
    id: 'faq-10',
    category: 'jargon',
    categoryLabel: 'Insurance Jargon',
    question: 'Q. What is a Deductible vs. a Premium?',
    answer: 'Your Premium is the set recurring payment (monthly or annually) required to keep your policy active. Your Deductible is the out-of-pocket amount you pay when filing a claim before insurance pays remaining costs.'
  },
  {
    id: 'faq-11',
    category: 'jargon',
    categoryLabel: 'Business Jargon',
    question: 'Q. What is a Certificate of Insurance (COI)?',
    answer: 'A COI is a formal one-page document issued by an insurance broker detailing active policy numbers, limits, and coverage dates, commonly required by landlords, general contractors, or business clients.'
  }
];

export const FAQRoom: React.FC<FAQRoomProps> = ({ onScheduleCall, onApplyForm }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pandora AI Assistant State
  const [pandoraInput, setPandoraInput] = useState<string>('');
  const [pandoraResponse, setPandoraResponse] = useState<string | null>(null);
  const [isPandoraThinking, setIsPandoraThinking] = useState<boolean>(false);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAskPandora = (queryText?: string) => {
    const qText = queryText || pandoraInput;
    if (!qText.trim()) return;

    setIsPandoraThinking(true);
    setPandoraResponse(null);

    setTimeout(() => {
      const q = qText.toLowerCase();
      let answer = "";

      if (q.includes("spanish") || q.includes("language") || q.includes("creole") || q.includes("french") || q.includes("espanol")) {
        answer = "Yes, Se Habla Español. On parle Francais et Creole. We serve the diverse community of South Florida with trilingual licensed specialists.";
      } else if (q.includes("pip") || q.includes("auto") || q.includes("car")) {
        answer = "In Florida, PIP (Personal Injury Protection) pays 80% of necessary medical costs and 60% of lost wages up to $10,000 after an accident regardless of fault.";
      } else if (q.includes("living benefit") || q.includes("life insurance") || q.includes("iul")) {
        answer = "Living Benefits allow you to accelerate money from your policy death benefit while alive if diagnosed with a qualifying chronic, critical, or terminal illness.";
      } else if (q.includes("tax") || q.includes("w2") || q.includes("1099") || q.includes("refund")) {
        answer = "For tax preparation, bring W-2s, 1099s, Photo ID, and Social Security / ITIN cards. We offer maximum refund filing in-person and 100% online.";
      } else if (q.includes("flood") || q.includes("home") || q.includes("roof")) {
        answer = "Standard Florida Homeowners insurance does not cover rising flood waters. A separate Flood policy is required to protect your home and contents.";
      } else {
        answer = `Pandora AI Answer: "${qText}" ,  At Prophete Universal LLC, we specialize in tailored tax strategies, comprehensive auto/home coverage, and life insurance living benefits. Contact our advisors for a personalized quote.`;
      }

      setPandoraResponse(answer);
      setIsPandoraThinking(false);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans max-w-5xl mx-auto">
      
      {/* PINK PANDORA AI PANEL (REPLACED GRAY SEARCH PANEL) */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-pink-950 border-2 border-pink-400/60 rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex items-center gap-3 border-b border-pink-700/50 pb-3">
          <div className="w-10 h-10 rounded-full bg-pink-400/20 border border-pink-300 flex items-center justify-center text-pink-200 shrink-0 shadow-inner">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-pink-200 bg-pink-400/20 px-2.5 py-0.5 rounded border border-pink-300/40">
                Pandora AI Assistant
              </span>
              <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping"></span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Instant AI Questions & Search
            </h3>
          </div>
        </div>

        {/* Input & Ask/Search Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pink-300 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={pandoraInput || searchQuery}
              onChange={(e) => {
                setPandoraInput(e.target.value);
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAskPandora()}
              placeholder="Ask Pandora or search terms (e.g., Do you speak Spanish? PIP, W2)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-pink-300/50 rounded-xl text-white placeholder-pink-200/60 text-sm focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300/30"
            />
          </div>
          <button
            onClick={() => handleAskPandora()}
            disabled={isPandoraThinking}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center shrink-0 disabled:opacity-50 border border-pink-200"
          >
            {isPandoraThinking ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </span>
            ) : (
              <span>ASK PANDORA</span>
            )}
          </button>
        </div>

        {/* Pandora AI Output Box */}
        {pandoraResponse && (
          <div className="p-4 bg-slate-950 border border-pink-400/60 rounded-xl space-y-1.5 animate-fade-in shadow-inner">
            <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Pandora AI Answer:</span>
            </div>
            <p className="text-sm text-pink-50 font-medium leading-relaxed">
              {pandoraResponse}
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 pt-3 border-t border-pink-800/60">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General & Languages' },
            { id: 'tax', label: 'Taxes & IRS' },
            { id: 'life', label: 'Life Insurance' },
            { id: 'auto', label: 'Auto Insurance' },
            { id: 'home', label: 'Home & Flood' },
            { id: 'jargon', label: 'Key Terms' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border whitespace-nowrap ${
                  isActive
                    ? 'bg-pink-400 text-slate-950 border-pink-300 shadow-md font-extrabold'
                    : 'bg-pink-950/80 text-pink-100 border-pink-700/60 hover:bg-pink-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Cards List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="bg-slate-50 p-8 text-center rounded-2xl border border-slate-200 text-slate-600 space-y-2">
            <p className="font-bold text-lg text-teal-900">No matching questions found.</p>
            <p className="text-sm">Try searching for another keyword or select "All Questions".</p>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id}
                className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="cursor-pointer flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="inline-block text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-bold text-xl text-teal-950 leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <button 
                    aria-label="Toggle Question"
                    className="p-1 rounded-lg text-teal-800 hover:bg-slate-200 transition-colors shrink-0 mt-1"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className={`mt-3 pt-3 border-t border-slate-200 ${isExpanded ? 'block' : 'block sm:block'}`}>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Video Panel placed neatly at the bottom */}
      <div className="pt-6 border-t border-slate-200">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-teal-950 uppercase tracking-tight">
            Knowledge Center Video Briefing
          </h3>
          <p className="text-slate-600 text-sm">
            Watch our quick overview on taxes, insurance coverage, and client services.
          </p>
        </div>
        <div className="w-full max-w-3xl mx-auto">
          <VideoPanel
            src="https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c621669460a56209dc09476b7e/Pu%20universal%20spin.mp4"
            title="Proprete Universal LLC"
            subtitle="Tax, Life, Auto & Home Protection Specialist"
            videoHeightClass="h-48 sm:h-64"
            noBorder={false}
            controls={false}
          />
        </div>
      </div>

    </div>
  );
};
