import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, Check } from 'lucide-react';

export interface FormulaCardProps {
  title: string;
  formula: string;
  substitution: string;
  result: string | number;
  percentage?: string;
  interpretation?: string;
  limitations?: string;
  assumptions?: string;
  cautionaryNote?: string;
  badge?: string;
  step?: 1 | 2 | 3 | number;
  accentColor?: 'emerald' | 'amber' | 'purple' | 'teal';
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  formula,
  substitution,
  result,
  percentage,
  interpretation,
  limitations,
  assumptions,
  cautionaryNote,
  badge,
  step = 3,
  accentColor = 'emerald',
}) => {
  const [activeStep, setActiveStep] = useState<number>(step);
  const effectiveLimitations = assumptions || limitations;

  return (
    <div className="surface-dark p-6 space-y-5 rounded-2xl relative">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-sm tracking-wide">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
              {badge}
            </span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Math-III Module 3
          </span>
        </div>
      </div>

      {/* 3-Step Stepper Navigation */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        {[
          { num: 1, label: '1. Formula Law' },
          { num: 2, label: '2. Substitution' },
          { num: 3, label: '3. Computed Result' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setActiveStep(s.num)}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center border ${
              activeStep === s.num
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold shadow-xs'
                : 'bg-white/5 text-stone-400 border-white/5 hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step Contents */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono relative z-10">
        {activeStep === 1 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
              Mathematical Law / Theorem:
            </span>
            <div className="text-emerald-300 font-bold text-base sm:text-lg tracking-wide py-1">
              {formula}
            </div>
            <p className="text-[11px] text-stone-400 font-sans">
              Kolmogorov Axioms • Rigorous non-negative probability function P(E) ∈ [0, 1]
            </p>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
              Arithmetic Substitution from Field Ledger:
            </span>
            <div className="text-white text-sm sm:text-base py-1 leading-relaxed">
              {substitution}
            </div>
            <p className="text-[11px] text-stone-400 font-sans">
              Direct evaluation against audited empirical observations without score tweaking
            </p>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
                  Computed Output P(E):
                </span>
                <span className="text-white text-sm font-bold font-mono">
                  Standard Numerical: {result}
                </span>
              </div>
              {percentage && (
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight shadow-glow-emerald">
                    {percentage}
                  </span>
                </div>
              )}
            </div>

            {interpretation && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 block font-sans font-semibold mb-1">
                  Plain-Language Civil Interpretation:
                </span>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {interpretation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assumptions & Safeguard Notes */}
      {(effectiveLimitations || cautionaryNote) && (
        <div className="text-[11px] text-stone-400 pt-2 border-t border-white/10 space-y-1 relative z-10">
          {effectiveLimitations && (
            <p>
              <strong className="text-stone-300">Methodological Assumptions:</strong>{' '}
              {effectiveLimitations}
            </p>
          )}
          {cautionaryNote && (
            <p className="text-amber-300/90">
              <strong>Cautionary Note:</strong> {cautionaryNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
