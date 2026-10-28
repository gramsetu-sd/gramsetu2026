import React from 'react';
import { BookOpen, Calculator, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2 border border-forest-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Statistical Architecture & Stochastic Formulations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          System Methodology & Formulations
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Comprehensive technical documentation of the predictive probability theories, algebraic moment derivations,
          and statistical principles powering the GRAM SETU decision-support engine.
        </p>
      </div>

      {/* Module 1: Sample Space and Events */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            1
          </span>
          <h2 className="text-lg font-bold text-slate-900">Sample Space and Events</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          In rural resource assessment, the <strong>Sample Space</strong> <em>S</em> represents the set of all mutually exclusive and collectively exhaustive qualitative states that a village resource channel can experience during an observation window:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
          {'S = { Adequate Supply, Moderate Deficit, Severe Shortage }'}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          An <strong>event</strong> <em>A</em> is a measurable subset of <em>S</em>. For instance, the event of interest {'A = { Moderate Deficit, Severe Shortage } ⊆ S'} represents any scenario where administrative intervention is necessitated.
        </p>
      </section>

      {/* Module 2: Basic Empirical Probability */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            2
          </span>
          <h2 className="text-lg font-bold text-slate-900">Basic Empirical Probability</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Given <em>N</em> verified observation periods, if event <em>A</em> is observed to occur in <em>n(A)</em> instances, the empirical classical probability <em>P(A)</em> is formulated as:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-forest-900 font-bold">
          {'P(A) = n(A) / N, where 0 <= P(A) <= 1'}
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
          <strong>Boundary Conditions:</strong> If <em>N = 0</em>, the calculation is undefined. The engine enforces an analytical guard to prevent division by zero, surfacing a data-gathering alert rather than a numerical error.
        </div>
      </section>

      {/* Section 3: Conditional Probability */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            3
          </span>
          <h2 className="text-lg font-bold text-slate-900">Conditional Probability</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Rural vulnerability frequently depends on external seasonal triggers such as monsoon rainfall deficits. The conditional probability of a resource shortage <em>A</em> given that an adverse climatic state <em>B</em> occurs is:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-teal-900 font-bold">
          {'P(A | B) = P(A ∩ B) / P(B) = n(A ∩ B) / n(B), provided P(B) > 0'}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In our Bamaloi case study, while baseline water shortage <em>P(A)</em> is 38%, under below-normal rainfall <em>P(A | B)</em> jumps to <strong>80.0%</strong>. This conditional divergence signals when pre-emptive relief must be mobilized.
        </p>
      </section>

      {/* Module 4: Bayes' Theorem */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            4
          </span>
          <h2 className="text-lg font-bold text-slate-900">{'Bayes\' Theorem (Belief Updating)'}</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Bayes’ Theorem provides the mathematical framework to update the prior probability of an underlying causal state (such as regional meteorological drought) once concrete evidence (such as borehole failure in the village) is observed:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-purple-900 font-bold">
          {'P(Hypothesis | Evidence) = [P(Evidence | Hypothesis) * P(Hypothesis)] / P(Evidence)'}
        </div>

        <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-950 text-xs">
          <strong>Epistemological Distinction:</strong> {'Bayes\' Theorem'} demonstrates <em>probabilistic belief updating</em>. It proves correlation and posterior alignment under evidence, not deterministic physical causation.
        </div>
      </section>

      {/* Module 5: Random Variables & PMF / CDF */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            5
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Random Variables, PMF, CDF & Moments
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Let <em>X</em> be a discrete random variable denoting the <strong>number of households requiring emergency resource support</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-800 block text-xs">Probability Mass Function (PMF)</strong>
              <div className="font-mono text-xs text-forest-800 font-bold">
                {'P(X = x) = p_i, where sum(p_i) = 1.0'}
              </div>
              <p className="text-[11px] text-slate-500">
                Probability that emergency assistance demand exactly equals <em>x</em> households.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-800 block text-xs">Cumulative Distribution Function (CDF)</strong>
              <div className="font-mono text-xs text-teal-800 font-bold">
                {'F(x) = P(X <= x) = sum_{t <= x} P(X = t)'}
              </div>
              <p className="text-[11px] text-slate-500">
                Probability that demand will not exceed administrative buffer threshold <em>x</em>.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">First and Second Moments</h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>• Expected Value: E(X) = sum(x * P(X = x))</li>
              <li>• Variance: Var(X) = E(X^2) - [E(X)]^2</li>
              <li>• Standard Deviation: sigma = sqrt(Var(X))</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Module 6: Continuous PDF */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <span className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
            6
          </span>
          <h2 className="text-lg font-bold text-slate-900">Continuous Probability Density Function (PDF)</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          When modeling continuous resource volume deficits (such as kilolitres per day of water deficit), Gaussian continuous models are evaluated:
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
          {'f(x) = [1 / (sigma * sqrt(2*pi))] * exp(- (x - mu)^2 / (2 * sigma^2))'}
        </div>

        <div className="p-3 bg-forest-50 border border-forest-200 rounded-lg text-forest-900 text-xs">
          <strong>Fundamental Distinction:</strong> For continuous distributions, <em>P(X = x) = 0</em>. The value <em>f(x)</em> represents probability <em>density</em>, not probability. To obtain an actual probability, integration over an interval is required:
          <div className="font-mono mt-1 font-bold">
            {'P(a <= X <= b) = integral_a^b f(t) dt = F(b) - F(a)'}
          </div>
        </div>
      </section>

      <div className="pt-4 flex items-center justify-between border-t border-slate-200">
        <Link
          to="/probability"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-semibold text-xs hover:bg-forest-900 transition shadow-xs"
        >
          <Calculator className="w-4 h-4" />
          <span>Launch Interactive Probability Lab</span>
        </Link>
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-forest-800 text-xs font-semibold hover:underline"
        >
          <span>View Audit Reports →</span>
        </Link>
      </div>
    </div>
  );
};
