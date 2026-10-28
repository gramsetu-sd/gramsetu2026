import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import {
  ComprehensiveProbabilityEvaluation,
  BasicProbabilityCalculation,
  ConditionalProbabilityCalculation,
  BayesTheoremCalculation,
  DiscreteDistributionCalculation,
  ContinuousPDFCalculation,
} from '../types';
import { PmfChart } from '../components/charts/PmfChart';
import { CdfStepChart } from '../components/charts/CdfStepChart';
import { ContinuousPdfChart } from '../components/charts/ContinuousPdfChart';
import { FormulaCard } from '../components/common/FormulaCard';
import { SegmentedControl } from '../components/common/SegmentedControl';

export const ProbabilityAnalysisPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<
    'basic' | 'conditional' | 'bayes' | 'pmf_cdf' | 'continuous_pdf'
  >('basic');

  // Loaded evaluation from Bamaloi baseline
  const [evaluation, setEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Interactive Scratchpad States ---
  // Basic Probability
  const [basicN, setBasicN] = useState<number>(100);
  const [basicFavorable, setBasicFavorable] = useState<number>(38);
  const [basicResult, setBasicResult] = useState<BasicProbabilityCalculation | null>(null);

  // Conditional Probability
  const [condTotal, setCondTotal] = useState<number>(100);
  const [condJointAB, setCondJointAB] = useState<number>(24);
  const [condB, setCondB] = useState<number>(30);
  const [condResult, setCondResult] = useState<ConditionalProbabilityCalculation | null>(null);

  // Bayes Theorem
  const [priorA, setPriorA] = useState<number>(0.30);
  const [likelihood, setLikelihood] = useState<number>(0.80);
  const [evidenceB, setEvidenceB] = useState<number>(0.38);
  const [bayesResult, setBayesResult] = useState<BayesTheoremCalculation | null>(null);

  // Discrete Distribution
  const [distributionResult, setDistributionResult] = useState<DiscreteDistributionCalculation | null>(null);
  const [cdfThresholdQuery, setCdfThresholdQuery] = useState<number>(40);

  // Continuous PDF
  const [pdfMean, setPdfMean] = useState<number>(24.5);
  const [pdfStdDev, setPdfStdDev] = useState<number>(8.2);
  const [pdfMin, setPdfMin] = useState<number>(20);
  const [pdfMax, setPdfMax] = useState<number>(35);
  const [pdfResult, setPdfResult] = useState<ContinuousPDFCalculation | null>(null);

  // Load baseline evaluation on mount
  useEffect(() => {
    async function loadBaseline() {
      try {
        setLoading(true);
        const data = await api.getAssessmentEvaluation('44444444-4444-4444-4444-444444444401');
        setEvaluation(data);
        setBasicResult(data.basicProbability);
        setCondResult(data.conditionalProbability);
        setBayesResult(data.bayesTheorem);
        setDistributionResult(data.discreteDistribution);
        if (data.continuousPdf) setPdfResult(data.continuousPdf);
      } catch (err) {
        console.error('Error loading baseline evaluation:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBaseline();
  }, []);

  // Handlers to re-calculate interactively
  const handleRecalculateBasic = async () => {
    try {
      const res = await api.calculateBasicProbability(basicN, basicFavorable, 'Drinking Water Shortage');
      setBasicResult(res);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleRecalculateConditional = async () => {
    try {
      const res = await api.calculateConditionalProbability(
        condTotal,
        condJointAB,
        condB,
        'Drinking Water Shortage',
        'Below-Normal Rainfall'
      );
      setCondResult(res);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleRecalculateBayes = async () => {
    try {
      const res = await api.calculateBayes(
        priorA,
        likelihood,
        evidenceB,
        'Below-Normal Rainfall (Drought Phase)',
        'Drinking Water Shortage'
      );
      setBayesResult(res);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleRecalculatePdf = async () => {
    try {
      const res = await api.getContinuousPdf(pdfMean, pdfStdDev, 'kL / Day', pdfMin, pdfMax);
      setPdfResult(res);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Probability Analysis Engine
            </h2>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Predictive Risk Core
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Predictive Probability Architecture: Sample Space Verification, Conditional Risk, Bayes' Law, and Distribution Models
          </p>
        </div>

        {evaluation && (
          <div className="text-right text-xs bg-white/80 p-2.5 rounded-panel border border-emerald-900/10 shadow-xs hidden sm:block">
            <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">
              Field Benchmark
            </span>
            <strong className="text-stone-900 font-bold">
              {evaluation.villageName} • {evaluation.resourceName}
            </strong>
          </div>
        )}
      </div>

      {/* Module Navigation Tabs (Segmented style) */}
      <div className="surface p-1.5 rounded-2xl border border-emerald-900/10 shadow-card flex overflow-x-auto gap-1">
        {[
          { key: 'basic', label: '1. Basic P(A)' },
          { key: 'conditional', label: '2. Conditional P(A|B)' },
          { key: 'bayes', label: '3. Bayes’ Theorem' },
          { key: 'pmf_cdf', label: '4. Discrete PMF / CDF' },
          { key: 'continuous_pdf', label: '5. Continuous PDF' },
        ].map((mod) => (
          <button
            key={mod.key}
            onClick={() => setActiveModule(mod.key as any)}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeModule === mod.key
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* MODULE 1: BASIC PROBABILITY */}
      {activeModule === 'basic' && basicResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Controls */}
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Empirical Probability Parameters</h3>
              <button
                onClick={() => {
                  setBasicN(100);
                  setBasicFavorable(38);
                  handleRecalculateBasic();
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Bamaloi</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Total Valid Sample Observations (N)
                  </label>
                  <span className="font-mono font-bold text-stone-900">{basicN} cycles</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={basicN}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBasicN(val);
                    if (basicFavorable > val) setBasicFavorable(val);
                  }}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Favorable Occurrences n(A) [Deficit Events]
                  </label>
                  <span className="font-mono font-bold text-emerald-800">{basicFavorable} cycles</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={basicN}
                  step="1"
                  value={basicFavorable}
                  onChange={(e) => setBasicFavorable(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <button
                onClick={handleRecalculateBasic}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs"
              >
                Compute Empirical P(A)
              </button>
            </div>

            {/* Visual 100-Dot Sample Space Grid */}
            <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-800 uppercase tracking-wider">
                  Visual Sample Space S (100 Sample Points)
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {basicFavorable} Deficits / {basicN} Total
                </span>
              </div>

              <div className="grid grid-cols-10 gap-1.5 p-2 bg-white rounded-lg border border-stone-200/50">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const isFavorable = idx < Math.round((basicFavorable / basicN) * 100);
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isFavorable
                          ? 'bg-emerald-500 shadow-glow-emerald scale-105'
                          : 'bg-stone-200'
                      }`}
                      title={isFavorable ? `Cycle ${idx + 1}: Deficit Event A` : `Cycle ${idx + 1}: Adequate Supply`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[10px] text-stone-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Deficit Event A ({( (basicFavorable/basicN)*100 ).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-200 inline-block" />
                  <span>Adequate Supply (A')</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FormulaCard Science Canvas */}
          <div className="lg:col-span-7">
            <FormulaCard
              title="Classical Relative Frequency Definition"
              formula={basicResult.formula}
              substitution={basicResult.substitution}
              result={basicResult.probability.toFixed(4)}
              percentage={basicResult.percentage}
              interpretation={basicResult.interpretation}
              assumptions={basicResult.limitations}
              badge="Axiomatic Probability Model"
              step={3}
            />
          </div>
        </div>
      )}

      {/* MODULE 2: CONDITIONAL PROBABILITY */}
      {activeModule === 'conditional' && condResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Conditional Parameters</h3>
              <button
                onClick={() => {
                  setCondTotal(100);
                  setCondJointAB(24);
                  setCondB(30);
                  handleRecalculateConditional();
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Bamaloi</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Conditioning Event B Count n(B) [Drought Days]
                  </label>
                  <span className="font-mono font-bold text-amber-800">{condB} days</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={condB}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCondB(val);
                    if (condJointAB > val) setCondJointAB(val);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Joint Intersection Count n(A ∩ B) [Drought & Deficit]
                  </label>
                  <span className="font-mono font-bold text-emerald-800">{condJointAB} days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={condB}
                  step="1"
                  value={condJointAB}
                  onChange={(e) => setCondJointAB(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <button
                onClick={handleRecalculateConditional}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs"
              >
                Compute Conditional P(A|B)
              </button>
            </div>

            {/* Venn Overlap Visual */}
            <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-3">
              <span className="font-bold text-stone-800 uppercase tracking-wider block text-[11px]">
                Venn Diagram Overlap Model
              </span>
              <div className="relative h-32 bg-white rounded-lg border border-stone-200/60 flex items-center justify-center overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-600 flex items-center justify-start pl-2 text-[10px] font-bold text-emerald-900 -mr-6">
                  Event A
                </div>
                <div className="w-16 h-20 rounded-full bg-emerald-600/30 border border-emerald-800 z-10 flex items-center justify-center text-[10px] font-mono font-bold text-stone-900">
                  A ∩ B
                </div>
                <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-600 flex items-center justify-end pr-2 text-[10px] font-bold text-amber-900 -ml-6">
                  Event B
                </div>
              </div>
              <p className="text-[11px] text-stone-500 text-center font-mono">
                P(A|B) narrows universe of discourse exclusively to circle B.
              </p>
            </div>
          </div>

          {/* Right: FormulaCard */}
          <div className="lg:col-span-7">
            <FormulaCard
              title="Conditional Probability Theorem"
              formula={condResult.formula}
              substitution={condResult.substitution}
              result={condResult.conditionalProbability.toFixed(4)}
              percentage={condResult.percentage}
              interpretation={condResult.interpretation}
              assumptions={condResult.limitations}
              badge="Conditional Likelihood Model"
              step={3}
            />
          </div>
        </div>
      )}

      {/* SECTION 3: BAYES' THEOREM */}
      {activeModule === 'bayes' && bayesResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Bayes Inputs */}
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Prior Belief & Likelihood</h3>
              <button
                onClick={() => {
                  setPriorA(0.30);
                  setLikelihood(0.80);
                  setEvidenceB(0.38);
                  handleRecalculateBayes();
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Prior Probability P(Hypothesis)
                  </label>
                  <span className="font-mono font-bold text-stone-900">{(priorA * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  value={priorA}
                  onChange={(e) => setPriorA(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Likelihood P(Evidence | Hypothesis)
                  </label>
                  <span className="font-mono font-bold text-amber-800">{(likelihood * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  value={likelihood}
                  onChange={(e) => setLikelihood(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">
                    Marginal Evidence P(Evidence)
                  </label>
                  <span className="font-mono font-bold text-sky-800">{(evidenceB * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.95"
                  step="0.01"
                  value={evidenceB}
                  onChange={(e) => setEvidenceB(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <button
                onClick={handleRecalculateBayes}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs"
              >
                Update Posterior Probability
              </button>
            </div>

            {/* Prior-to-Posterior Bar Comparison */}
            <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-3">
              <span className="font-bold text-stone-800 uppercase tracking-wider block text-[11px]">
                Prior vs Posterior Shift
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-1">
                    <span>Prior P(Drought):</span>
                    <span>{(priorA * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-stone-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${priorA * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-emerald-800 font-bold mb-1">
                    <span>Updated Posterior P(Drought | Shortage):</span>
                    <span>{bayesResult.percentage}</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-full rounded-full shadow-glow-emerald transition-all duration-300"
                      style={{ width: bayesResult.percentage }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FormulaCard */}
          <div className="lg:col-span-7">
            <FormulaCard
              title="Bayes' Theorem for Subjective Probability Updating"
              formula={bayesResult.formula}
              substitution={bayesResult.substitution}
              result={bayesResult.posteriorProbability.toFixed(4)}
              percentage={bayesResult.percentage}
              interpretation={bayesResult.interpretation}
              assumptions={bayesResult.cautionaryNote}
              badge="Bayesian Inference Model"
              step={3}
            />
          </div>
        </div>
      )}

      {/* MODULE 4: DISCRETE RANDOM VARIABLES (PMF & CDF) */}
      {activeModule === 'pmf_cdf' && distributionResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PMF Chart */}
            <div className="surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Probability Mass Function: P(X = x)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    X = Households requiring emergency water delivery
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                  ∑ P(X=x) = 1.00
                </span>
              </div>
              <PmfChart
                distribution={distributionResult.distribution}
                expectedValueMean={distributionResult.expectedValueMean}
              />
            </div>

            {/* CDF Chart */}
            <div className="surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Cumulative Distribution: F(x) = P(X ≤ x)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Step function indicating buffer coverage confidence
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-stone-400">Limit:</span>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    step="5"
                    value={cdfThresholdQuery}
                    onChange={(e) => setCdfThresholdQuery(parseInt(e.target.value) || 40)}
                    className="w-16 px-2 py-0.5 text-xs font-mono border border-stone-200 rounded-md"
                  />
                </div>
              </div>
              <CdfStepChart
                distribution={distributionResult.distribution}
                thresholdX={cdfThresholdQuery}
              />
            </div>
          </div>

          {/* Complete Distribution Table with Alternating Tints */}
          <div className="surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Discrete Probability Moments: E(X), Var(X) and σ
                </h3>
                <p className="text-xs text-stone-500">
                  Full arithmetic ledger for 100 empirical sampling cycles
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200/80 rounded-panel">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">x (Households)</th>
                    <th className="px-4 py-2.5">Frequency n(x)</th>
                    <th className="px-4 py-2.5">P(X = x) [PMF]</th>
                    <th className="px-4 py-2.5">F(x) = P(X ≤ x) [CDF]</th>
                    <th className="px-4 py-2.5">x · P(X = x)</th>
                    <th className="px-4 py-2.5">x² · P(X = x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {distributionResult.distribution.map((d, index) => (
                    <tr
                      key={d.x}
                      className={`hover:bg-emerald-50/40 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                      }`}
                    >
                      <td className="px-4 py-2 font-bold text-stone-900">{d.x}</td>
                      <td className="px-4 py-2 text-stone-500">{d.count}</td>
                      <td className="px-4 py-2 text-emerald-800 font-bold">{d.px}</td>
                      <td className="px-4 py-2 text-teal-800 font-bold">{d.fx}</td>
                      <td className="px-4 py-2 text-stone-600">{d.xTimesPx}</td>
                      <td className="px-4 py-2 text-stone-600">{d.xSquaredTimesPx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: CONTINUOUS PDF */}
      {activeModule === 'continuous_pdf' && pdfResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Continuous Controls */}
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Gaussian Continuous Model</h3>
              <button
                onClick={() => {
                  setPdfMean(24.5);
                  setPdfStdDev(8.2);
                  setPdfMin(20);
                  setPdfMax(35);
                  handleRecalculatePdf();
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Continuous Mean μ (Daily Deficit Volume in kL)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={pdfMean}
                  onChange={(e) => setPdfMean(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-control font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Standard Deviation σ (Dispersion)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={pdfStdDev}
                  onChange={(e) => setPdfStdDev(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-control font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-stone-100">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Interval Min [a]</label>
                  <input
                    type="number"
                    step="1"
                    value={pdfMin}
                    onChange={(e) => setPdfMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-control font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Interval Max [b]</label>
                  <input
                    type="number"
                    step="1"
                    value={pdfMax}
                    onChange={(e) => setPdfMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-control font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleRecalculatePdf}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-xs"
              >
                Compute Interval Probability P(a ≤ X ≤ b)
              </button>
            </div>
          </div>

          {/* Right: PDF Plot */}
          <div className="lg:col-span-7 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                Continuous Density Model
              </span>
              <h3 className="font-bold text-stone-900 text-base mt-0.5">
                Gaussian Probability Density Function f(x)
              </h3>
            </div>

            <ContinuousPdfChart
              points={pdfResult.points}
              mean={pdfResult.mean}
              unit={pdfResult.unit}
              intervalMin={pdfMin}
              intervalMax={pdfMax}
            />

            {pdfResult.queryInterval && (
              <div className="p-4 rounded-panel bg-emerald-50/70 border border-emerald-200/60 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-stone-900">
                    Query Interval: P({pdfMin} ≤ X ≤ {pdfMax})
                  </span>
                  <span className="text-xl font-bold text-emerald-800">
                    {(pdfResult.queryInterval.intervalProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {pdfResult.queryInterval.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
