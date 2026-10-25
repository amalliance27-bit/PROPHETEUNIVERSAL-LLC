import React, { useState } from 'react';
import { Car, ShieldCheck, Calculator, Sparkles, MapPin, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface FloridaAutoEstimatorProps {
  onApplyForm: () => void;
  onScheduleCall: () => void;
}

const VEHICLE_MAKES_MODELS: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner', 'Prius', 'Sienna', 'Crown', 'Grand Highlander'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Passport'],
  Ford: ['F-150', 'Explorer', 'Escape', 'Mustang', 'Bronco', 'Bronco Sport', 'Edge', 'Maverick', 'Super Duty'],
  Chevrolet: ['Silverado 1500', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Colorado', 'Suburban', 'Corvette', 'Trax', 'Blazer'],
  Nissan: ['Altima', 'Rogue', 'Sentra', 'Frontier', 'Pathfinder', 'Murano', 'Versa', 'Kicks', 'Armada'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venice', 'IONIQ 5'],
  Kia: ['Forte', 'Optima/K5', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'Carnival'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', '4 Series', 'M3', 'M5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'CLA', 'A-Class'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Gladiator', 'Renegade'],
  Ram: ['1500', '2500', '3500', 'ProMaster'],
  Lexus: ['RX', 'ES', 'NX', 'IS', 'GX', 'GX 550', 'TX'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'Q3', 'e-tron'],
  Dodge: ['Charger', 'Challenger', 'Durango', 'Hornet'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'WRX', 'Ascent'],
  Mazda: ['Mazda3', 'CX-5', 'CX-30', 'CX-50', 'CX-90', 'MX-5 Miata'],
  GMC: ['Sierra 1500', 'Acadia', 'Yukon', 'Terrain', 'Canyon'],
  Volkswagen: ['Jetta', 'Tiguan', 'Atlas', 'Golf', 'Taos', 'ID.4'],
  Infiniti: ['Q50', 'QX60', 'QX80', 'QX50'],
  Cadillac: ['Escalade', 'CT4', 'CT5', 'XT5', 'LYRIQ'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S60'],
  Acura: ['MDX', 'RDX', 'TLX', 'Integra'],
  Chrysler: ['Pacificia', '300'],
  Buick: ['Encore', 'Envision', 'Enclave'],
  Mitsubishi: ['Outlander', 'Eclipse Cross', 'Mirage'],
  Genesis: ['G70', 'G80', 'GV70', 'GV80'],
  Other: ['Custom Model / Unlisted Vehicle']
};

const FL_COUNTIES = [
  { name: 'Miami-Dade County', riskFactor: 1.25, note: 'High density & traffic area' },
  { name: 'Broward County (Ft. Lauderdale)', riskFactor: 1.18, note: 'South FL Metro region' },
  { name: 'Palm Beach County', riskFactor: 1.12, note: 'Coastal South FL region' },
  { name: 'Orange County (Orlando)', riskFactor: 1.08, note: 'Central FL tourism corridor' },
  { name: 'Hillsborough County (Tampa)', riskFactor: 1.10, note: 'Tampa Bay Metro' },
  { name: 'Duval County (Jacksonville)', riskFactor: 1.02, note: 'North FL region' },
  { name: 'Pinellas County (St. Pete)', riskFactor: 1.05, note: 'Tampa Bay coastal' },
  { name: 'Lee County (Fort Myers)', riskFactor: 1.04, note: 'Southwest FL' },
  { name: 'Polk County (Lakeland)', riskFactor: 0.98, note: 'Central FL inland' },
  { name: 'Brevard County (Space Coast)', riskFactor: 0.96, note: 'East Coast FL' },
  { name: 'Monroe County (FL Keys)', riskFactor: 1.15, note: 'Coastal hazard region' },
  { name: 'Other Florida County', riskFactor: 1.00, note: 'Standard Florida rate' }
];

export const FloridaAutoEstimator: React.FC<FloridaAutoEstimatorProps> = ({
  onApplyForm,
  onScheduleCall
}) => {
  const [make, setMake] = useState<string>('Toyota');
  const [model, setModel] = useState<string>('Camry');
  const [customMakeModel, setCustomMakeModel] = useState<string>('');
  const [year, setYear] = useState<number>(2022);
  const [driverAgeGroup, setDriverAgeGroup] = useState<string>('30-49');
  const [drivingRecord, setDrivingRecord] = useState<string>('clean');
  const [county, setCounty] = useState<string>('Miami-Dade County');
  const [coverageTier, setCoverageTier] = useState<'minimum' | 'standard' | 'full' | 'commercial'>('full');
  const [deductible, setDeductible] = useState<number>(500);
  const [usage, setUsage] = useState<string>('commute');

  // Handle Make change
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const modelsForMake = VEHICLE_MAKES_MODELS[newMake] || [];
    if (modelsForMake.length > 0) {
      setModel(modelsForMake[0]);
    } else {
      setModel('Custom Model');
    }
  };

  // Base calculation logic tailored to Florida market
  const calculateRate = () => {
    let base = 95; // Base Florida rate

    // Vehicle Tier Assessment
    const isLuxury = ['BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Lexus', 'Porsche', 'Cadillac', 'Infiniti', 'Genesis', 'Jaguar', 'Land Rover'].includes(make);
    const isTruckOrLargeSUV = ['Silverado 1500', 'F-150', 'Ram 1500', 'Tahoe', 'Suburban', 'Yukon', 'Escalade', 'Sierra 1500', 'Tundra', 'Grand Highlander', 'Cybertruck', '3500', '2500'].includes(model);

    if (isLuxury) base += 45;
    if (isTruckOrLargeSUV) base += 25;

    // Year factor (newer cars cost slightly more for physical damage)
    if (year >= 2023) base += 20;
    else if (year >= 2018) base += 10;
    else if (year < 2010) base -= 15;

    // Driver Age Group
    if (driverAgeGroup === '16-21') base *= 1.8;
    else if (driverAgeGroup === '22-29') base *= 1.35;
    else if (driverAgeGroup === '30-49') base *= 1.0;
    else if (driverAgeGroup === '50-64') base *= 0.92;
    else if (driverAgeGroup === '65+') base *= 1.1;

    // Driving History
    if (drivingRecord === 'minor') base *= 1.25;
    else if (drivingRecord === 'accident') base *= 1.5;
    else if (drivingRecord === 'dui') base *= 2.1;

    // County Risk Factor
    const selectedCountyObj = FL_COUNTIES.find(c => c.name === county);
    if (selectedCountyObj) {
      base *= selectedCountyObj.riskFactor;
    }

    // Vehicle Usage
    if (usage === 'rideshare') base *= 1.25;
    if (usage === 'commercial') base *= 1.45;
    if (usage === 'pleasure') base *= 0.88;

    // Coverage Level
    if (coverageTier === 'minimum') base *= 0.65; // PIP + PD only
    else if (coverageTier === 'standard') base *= 1.0; // Standard + Bodily Injury
    else if (coverageTier === 'full') base *= 1.45; // Comprehensive + Collision + High Limits
    else if (coverageTier === 'commercial') base *= 1.85; // Commercial policy

    // Deductible discount
    if (coverageTier === 'full' || coverageTier === 'commercial') {
      if (deductible === 250) base += 15;
      if (deductible === 1000) base -= 15;
    }

    const monthlyRate = Math.round(Math.max(45, base));
    const annualRate = monthlyRate * 12;

    return { monthlyRate, annualRate };
  };

  const { monthlyRate, annualRate } = calculateRate();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 my-8 shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 border-b border-blue-500/30 pb-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300 mb-2 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
            <Calculator className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Interactive Florida Rate Estimator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Car className="w-7 h-7 text-yellow-400 shrink-0" />
            Florida Auto Insurance Quote Calculator
          </h3>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Estimate coverage costs for any vehicle make, model, year, and county across Florida in seconds.
          </p>
        </div>

        <button
          onClick={onScheduleCall}
          className="self-stretch md:self-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
        >
          Speak with Agent
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        {/* Form Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Vehicle Selection */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 space-y-4">
            <h4 className="text-sm font-extrabold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
              <Car className="w-4 h-4" /> 1. Select Vehicle Make & Model
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Make */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Vehicle Make</label>
                <select
                  value={make}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  {Object.keys(VEHICLE_MAKES_MODELS).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Model</label>
                {make === 'Other' ? (
                  <input
                    type="text"
                    placeholder="Enter custom model"
                    value={customMakeModel}
                    onChange={(e) => setCustomMakeModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                  />
                ) : (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                  >
                    {(VEHICLE_MAKES_MODELS[make] || []).map((mod) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Model Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  {Array.from({ length: 27 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Driver & Location Profile */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 space-y-4">
            <h4 className="text-sm font-extrabold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 2. Driver & Florida Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* County */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Florida County / City</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  {FL_COUNTIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Driver Age */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Driver Age</label>
                <select
                  value={driverAgeGroup}
                  onChange={(e) => setDriverAgeGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  <option value="16-21">16 – 21 yrs (Young Driver)</option>
                  <option value="22-29">22 – 29 yrs</option>
                  <option value="30-49">30 – 49 yrs (Standard)</option>
                  <option value="50-64">50 – 64 yrs (Experienced)</option>
                  <option value="65+">65+ yrs (Senior)</option>
                </select>
              </div>

              {/* Driving Record */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Driving Record History</label>
                <select
                  value={drivingRecord}
                  onChange={(e) => setDrivingRecord(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  <option value="clean">Clean Record (No Accidents/Tickets)</option>
                  <option value="minor">1 Minor Ticket / Infraction</option>
                  <option value="accident">1 At-Fault Accident</option>
                  <option value="dui">SR-22 or Major Violation</option>
                </select>
              </div>

              {/* Vehicle Usage */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Vehicle Use</label>
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-semibold focus:border-yellow-400 focus:outline-none"
                >
                  <option value="commute">Personal Commute to Work/School</option>
                  <option value="pleasure">Pleasure / Low Mileage</option>
                  <option value="rideshare">Rideshare (Uber / Lyft / Delivery)</option>
                  <option value="commercial">Commercial / Business / Fleet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Coverage Tier & Deductible */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-blue-500/30 space-y-4">
            <h4 className="text-sm font-extrabold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 3. Select Coverage Level
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setCoverageTier('minimum')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  coverageTier === 'minimum'
                    ? 'bg-blue-600/30 border-yellow-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-yellow-400 uppercase">FL Minimum</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">PIP + PD</div>
              </button>

              <button
                type="button"
                onClick={() => setCoverageTier('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  coverageTier === 'standard'
                    ? 'bg-blue-600/30 border-yellow-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-yellow-400 uppercase">Standard</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">State + BI</div>
              </button>

              <button
                type="button"
                onClick={() => setCoverageTier('full')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  coverageTier === 'full'
                    ? 'bg-blue-600/30 border-yellow-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-yellow-400 uppercase">Full Coverage</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">Comp & Collision</div>
              </button>

              <button
                type="button"
                onClick={() => setCoverageTier('commercial')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  coverageTier === 'commercial'
                    ? 'bg-blue-600/30 border-yellow-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-extrabold text-xs text-yellow-400 uppercase">Commercial</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">Fleet / Business</div>
              </button>
            </div>

            {(coverageTier === 'full' || coverageTier === 'commercial') && (
              <div className="pt-2 flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Deductible Amount (Comp & Collision):</span>
                <div className="flex gap-2">
                  {[250, 500, 1000].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDeductible(d)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        deductible === d
                          ? 'bg-yellow-400 text-slate-950 font-extrabold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ${d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results & Action Column (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Estimated Card */}
          <div className="bg-gradient-to-b from-blue-900/90 to-slate-950 p-6 rounded-3xl border-2 border-yellow-400/80 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-4">
              <div>
                <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-widest block">
                  Estimated Rate Result
                </span>
                <h4 className="text-xl font-black text-white">
                  {year} {make} {make === 'Other' ? (customMakeModel || 'Vehicle') : model}
                </h4>
              </div>
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0">
                {county.replace(' County', '')}
              </span>
            </div>

            {/* Price Numbers */}
            <div className="text-center bg-slate-950/80 p-5 rounded-2xl border border-blue-400/30 shadow-inner">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Monthly Premium
              </span>
              <div className="text-4xl sm:text-5xl font-black text-yellow-400 tracking-tight">
                ${monthlyRate} <span className="text-lg font-bold text-slate-300">/ mo</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-2 block">
                Approx. ${annualRate} / year paid annually
              </span>
            </div>

            {/* Coverage Highlights Breakdown */}
            <div className="space-y-2 text-xs font-medium text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> FL PIP ($10k Medical/Lost Wages)</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Property Damage (PD) $10k+</span>
                <span className="text-emerald-400 font-bold">Included</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${coverageTier !== 'minimum' ? 'text-emerald-400' : 'text-slate-600'}`} />
                  Bodily Injury Liability (BI)
                </span>
                <span className={coverageTier !== 'minimum' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {coverageTier !== 'minimum' ? 'Included' : 'Optional'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${coverageTier === 'full' || coverageTier === 'commercial' ? 'text-emerald-400' : 'text-slate-600'}`} />
                  Comp & Collision Physical Damage
                </span>
                <span className={coverageTier === 'full' || coverageTier === 'commercial' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {coverageTier === 'full' || coverageTier === 'commercial' ? `$${deductible} Ded.` : 'Not Incl.'}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onApplyForm}
                className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black py-3.5 px-4 sm:px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">Apply for Exact Rate Now</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                *Estimates are calculated based on Florida insurance benchmarks. Final binding rates are subject to carrier underwriting and verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
