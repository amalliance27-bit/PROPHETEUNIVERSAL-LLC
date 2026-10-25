import React, { useState } from 'react';

interface ProtectionCalculatorProps {
  onScheduleCall: () => void;
  onApplyForm: () => void;
}

export const ProtectionCalculator: React.FC<ProtectionCalculatorProps> = ({
  onScheduleCall,
  onApplyForm,
}) => {
  const [coverageType, setCoverageType] = useState<'life' | 'tax' | 'auto'>('life');
  const [coverageAmount, setCoverageAmount] = useState<number>(250000);

  const estimatedMonthly = Math.round((coverageAmount / 10000) * (coverageType === 'life' ? 1.2 : coverageType === 'tax' ? 0.8 : 1.5));

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 my-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-widest">
            ESTIMATE YOUR COVERAGE
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Quick Protection Estimator
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Get an instant estimate for life, tax preparation, or business protection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setCoverageType('life')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              coverageType === 'life'
                ? 'bg-yellow-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Life Insurance
          </button>
          <button
            onClick={() => setCoverageType('tax')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              coverageType === 'tax'
                ? 'bg-yellow-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tax Protection
          </button>
          <button
            onClick={() => setCoverageType('auto')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              coverageType === 'auto'
                ? 'bg-yellow-400 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Commercial / Auto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-800/80 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-slate-300">Target Coverage / Protection Level:</span>
            <span className="text-yellow-400 font-bold font-mono">
              ${coverageAmount.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="1000000"
            step="25000"
            value={coverageAmount}
            onChange={(e) => setCoverageAmount(Number(e.target.value))}
            className="w-full accent-yellow-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block uppercase font-mono">Estimated Start From</span>
          <span className="text-3xl font-black text-yellow-400 font-mono">${estimatedMonthly}</span>
          <span className="text-xs text-slate-500 block">/ month</span>
          
          <button
            onClick={onApplyForm}
            className="w-full mt-3 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95"
          >
            REQUEST OFFICIAL QUOTE
          </button>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
            ✓ Free Consultation • No Hidden Fees
          </span>
        </div>
      </div>
    </div>
  );
};
