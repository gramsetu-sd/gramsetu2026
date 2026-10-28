import React from 'react';
import {
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Droplets,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 font-sans animate-fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Operational Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          How It Works
        </h1>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
          From field survey to action plan: how GRAM SETU turns village reports into early warnings, buffer sizes, and targeted relief operations.
        </p>
      </div>

      {/* 5-Step Explainer */}
      <div className="space-y-6">
        {/* Step 1: Field Tracking & Shortage Frequency */}
        <section className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              01
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Field Tracking & Shortage Frequency
              </h2>
              <p className="text-[11px] text-stone-500">
                How often does a village run short of essential resources?
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Village coordinators log resource levels during routine fortnightly field surveys. By checking how many survey periods fell below minimum safe thresholds, the system calculates the historical shortage frequency for each village and resource channel.
          </p>

          <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Bamaloi Village Field Finding:</strong> In 100 reviewed survey cycles, Bamaloi experienced drinking water deficits in 38 cycles. The village has a baseline <strong>38% shortage likelihood</strong> during standard operating conditions.
            </div>
          </div>

          <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Classical empirical ratio</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 space-y-1">
              <div>Formula: P(A) = n(A) / N</div>
              <div>Substitution: P(Water Shortage) = 38 / 100 = 0.380 (38.0%)</div>
              <p className="text-[11px] font-sans text-stone-500 mt-1">
                Valid sample space constraint: 0 ≤ P(A) ≤ 1. Guaranteed non-negative divisor via field data validation guards.
              </p>
            </div>
          </details>
        </section>

        {/* Step 2: Weather & Seasonal Risk Multipliers */}
        <section className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              02
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Weather & Seasonal Risk Multipliers
              </h2>
              <p className="text-[11px] text-stone-500">
                What happens to village supply when rainfall falls short?
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Resource shortages do not occur in isolation—monsoon deficits, heat waves, and seasonal peaks trigger severe stress. GRAM SETU isolates survey periods that coincided with below-normal rainfall to measure how much weather multiplies vulnerability.
          </p>

          <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <Droplets className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Bamaloi Sensitivity Finding:</strong> Out of 30 dry-spell survey cycles, 24 suffered water shortages. The shortage chance jumps from 38% under normal weather to <strong>80.0% during a dry spell</strong> (a 2.1x increase).
            </div>
          </div>

          <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Sub-sample ratio</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 space-y-1">
              <div>Formula: P(A | B) = P(A ∩ B) / P(B) = n(A ∩ B) / n(B)</div>
              <div>Substitution: P(Shortage | Dry Spell) = 24 / 30 = 0.800 (80.0%)</div>
              <p className="text-[11px] font-sans text-stone-500 mt-1">
                Risk multiplier: P(A | B) / P(A) = 0.800 / 0.380 = 2.11x elevated likelihood.
              </p>
            </div>
          </details>
        </section>

        {/* Step 3: Early Warning from Field Reports */}
        <section className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              03
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Early Warning from Field Signals
              </h2>
              <p className="text-[11px] text-stone-500">
                A borehole just failed. Is an active drought starting?
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Block Development Officers cannot afford to wait until every household has run out of water before declaring an emergency. When a sentinel event occurs (such as a deep borehole running dry), GRAM SETU immediately revises the regional drought likelihood.
          </p>

          <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Early Warning in Action:</strong> Before a field report, regional drought likelihood was estimated at 30.0%. Once a verified tube well failure is submitted, our revised drought assessment jumps to <strong>63.2%</strong>, triggering pre-emptive tanker mobilization.
            </div>
          </div>

          <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Evidence revision theorem</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 space-y-1">
              <div>Formula: P(A | B) = [P(B | A) • P(A)] / P(B)</div>
              <div>Substitution: P(Drought | Failure) = [0.800 • 0.300] / 0.380 = 0.240 / 0.380 = 0.6316 (63.2%)</div>
              <p className="text-[11px] font-sans text-stone-500 mt-1">
                Transforms static prior estimates into dynamic, live operational intelligence upon arrival of concrete field evidence.
              </p>
            </div>
          </details>
        </section>

        {/* Step 4: Relief Planning & Buffer Sizing */}
        <section className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              04
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Relief Planning & Buffer Sizing
              </h2>
              <p className="text-[11px] text-stone-500">
                How many households may need help, and how big should our buffer be?
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Planning for the average is dangerous: if 33 households need water on average, an average delivery leaves half the village thirsty on bad days. GRAM SETU calculates both the typical demand and the normal day-to-day swing to determine a safe buffer.
          </p>

          <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Buffer Recommendation:</strong> Typical demand in Bamaloi is ~33 households with a normal swing of ±8 households. Setting a buffer of <strong>41 households</strong> (typical + 1 swing) protects against shortages in <strong>85.7%</strong> of deficit events.
            </div>
          </div>

          <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Distribution moments & cumulative sum</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 space-y-1">
              <div>Mean: E(X) = Σ [x • P(x)] = 33.38 households</div>
              <div>Variance: Var(X) = E(X²) - [E(X)]² = 1180.20 - (33.38)² = 65.77 (σ = 8.11 households)</div>
              <div>Safe Buffer: k = E(X) + 1σ ≈ 41.5 households</div>
              <div>Coverage: F(40) = P(X ≤ 40) = 0.857 (85.7% cumulative protection)</div>
            </div>
          </details>
        </section>

        {/* Step 5: Supply Gap & Tanker Sizing */}
        <section className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              05
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Supply Gap & Tanker Sizing
              </h2>
              <p className="text-[11px] text-stone-500">
                How big can the daily volume shortfall get?
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            When dispatching physical tankers or bulk supplies, volume is continuous rather than discrete headcounts. GRAM SETU models the daily volume deficit curve to find the exact probability of landing in specific contract bands (e.g. 20 to 35 kL per day).
          </p>

          <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <Layers className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Contract Band Guidance:</strong> Daily shortfall centers at 24.5 kL with an 8.2 kL swing. Contracting supply tankers for 20 to 35 kL / day covers <strong>44% of deficit scenarios</strong> without excessive surplus or run-outs.
            </div>
          </div>

          <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Continuous density interval</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 space-y-1">
              <div>f(x) = (1 / [σ√(2π)]) • exp(-0.5 • ((x - μ)/σ)²)</div>
              <div>Interval P(20 ≤ X ≤ 35): Area under curve = 0.4404 (44.0%)</div>
              <p className="text-[11px] font-sans text-stone-500 mt-1">
                Enables district procurement to price standard contracts against risk-hedged volumetric bounds.
              </p>
            </div>
          </details>
        </section>
      </div>

      {/* Action Footer */}
      <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Ready to explore village forecasts?</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Test what-if scenarios in Risk Insights or review automated priority tasks in Action Plan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/insights" className="btn-primary text-xs font-bold px-4 py-2 inline-flex items-center gap-1.5 shadow-xs">
            <span>Explore Risk Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/recommendations" className="btn-secondary text-xs font-bold px-4 py-2 inline-flex items-center gap-1.5">
            <span>View Action Plan</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
