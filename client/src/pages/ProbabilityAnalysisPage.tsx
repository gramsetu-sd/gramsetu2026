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
  const [cdfThresholdQuery, setCdfThresholdQuery] = useState<number>(30);

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
        // Default to Bamaloi drinking water assessment
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Probability Analysis Engine
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800 border border-forest-200">
              Math-III Module 3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive mathematical workbench: Sample space, events, conditional probability, Bayes’ theorem, and random variables
          </p>
        </div>

        {evaluation && (
          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[11px]">Current Case Study Context</span>
            <strong className="text-slate-800 font-semibold">
              {evaluation.villageName} • {evaluation.resourceName}
            </strong>
          </div>
        )}
      </div>

      {/* Module Navigation Tabs */}
      <div className="border-b border-slate-200 flex overflow-x-auto gap-2 text-xs font-semibold">
        {[
          { key: 'basic', label: '1. Basic Probability P(A)' },
          { key: 'conditional', label: '2. Conditional Probability P(A|B)' },
          { key: 'bayes', label: '3. Bayes’ Theorem' },
          { key: 'pmf_cdf', label: '4. Discrete Random Variables (PMF / CDF)' },
          { key: 'continuous_pdf', label: '5. Continuous PDF (Gaussian Model)' },
        ].map((mod) => (
          <button
            key={mod.key}
            onClick={() => setActiveModule(mod.key as any)}
            className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeModule === mod.key
                ? 'border-forest-800 text-forest-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
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
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Empirical Probability Parameters</h3>
              <button
                onClick={() => {
                  setBasicN(100);
                  setBasicFavorable(38);
                  handleRecalculateBasic();
                }}
                className="text-[11px] text-forest-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Bamaloi Baseline</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Total Valid Observations (Sample Size N)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={basicN}
                  onChange={(e) => setBasicN(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Favorable Occurrences n(A) [Shortages Recorded]
                </label>
                <input
                  type="number"
                  min="0"
                  max={basicN}
                  value={basicFavorable}
                  onChange={(e) =>
                    setBasicFavorable(Math.min(basicN, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <button
                onClick={handleRecalculateBasic}
                className="w-full py-2.5 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold shadow-xs transition"
              >
                Compute Basic Probability
              </button>
            </div>

            {/* Sample Space Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Sample Space & Events
              </span>
              <p className="text-slate-600 font-mono text-[11px]">
                S = {'{ Adequate Supply (No Shortage), Resource Shortage Recorded }'}
              </p>
              <p className="text-slate-500 text-[11px]">
                Event A: {'{ Resource Shortage Recorded }'} ⊆ S
              </p>
            </div>
          </div>

          {/* Right: Transparent Mathematical Derivation */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
                Mathematical Transparency Output
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">{basicResult.question}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Formula:</span>
                <span className="text-forest-900 font-bold text-sm">{basicResult.formula}</span>
              </div>

              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">
                  Step-by-Step Substitution:
                </span>
                <span className="text-slate-800">{basicResult.substitution}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-sans">
                <span className="font-semibold text-slate-700">Computed Probability P(A):</span>
                <span className="text-2xl font-black text-forest-800">{basicResult.percentage}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Plain-Language Interpretation</h4>
              <p className="text-slate-600 leading-relaxed bg-forest-50/50 p-3 rounded-lg border border-forest-100">
                {basicResult.interpretation}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <strong>Limitations & Assumptions:</strong> {basicResult.limitations}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CONDITIONAL PROBABILITY */}
      {activeModule === 'conditional' && condResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Conditional Parameters</h3>
              <button
                onClick={() => {
                  setCondTotal(100);
                  setCondJointAB(24);
                  setCondB(30);
                  handleRecalculateConditional();
                }}
                className="text-[11px] text-forest-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Bamaloi Baseline</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Conditioning Event B Count n(B) [Below-Normal Rainfall Cycles]
                </label>
                <input
                  type="number"
                  min="1"
                  max={condTotal}
                  value={condB}
                  onChange={(e) => setCondB(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Joint Occurrence Count n(A ∩ B) [Drought AND Shortage]
                </label>
                <input
                  type="number"
                  min="0"
                  max={condB}
                  value={condJointAB}
                  onChange={(e) => setCondJointAB(Math.min(condB, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Total Observations Window (N)
                </label>
                <input
                  type="number"
                  min="1"
                  value={condTotal}
                  onChange={(e) => setCondTotal(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <button
                onClick={handleRecalculateConditional}
                className="w-full py-2.5 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold shadow-xs transition"
              >
                Compute Conditional Probability P(A|B)
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <strong>Division by Zero Safeguard:</strong>
              <p>
                If conditioning event B has never been observed (n(B) = 0), the calculation returns
                undefined rather than crashing.
              </p>
            </div>
          </div>

          {/* Right: Derivation */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Conditional Analysis
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">{condResult.question}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Formula:</span>
                <span className="text-teal-900 font-bold text-sm">{condResult.formula}</span>
              </div>

              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">
                  Substitution:
                </span>
                <span className="text-slate-800">{condResult.substitution}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-sans">
                <span className="font-semibold text-slate-700">P(Shortage | Drought):</span>
                <span className="text-2xl font-black text-teal-800">{condResult.percentage}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Plain-Language Interpretation</h4>
              <p className="text-slate-600 leading-relaxed bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                {condResult.interpretation}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <strong>Limitations:</strong> {condResult.limitations}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: BAYES' THEOREM */}
      {activeModule === 'bayes' && bayesResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Bayes Inputs */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Bayesian Prior & Likelihood Inputs</h3>
              <button
                onClick={() => {
                  setPriorA(0.30);
                  setLikelihood(0.80);
                  setEvidenceB(0.38);
                  handleRecalculateBayes();
                }}
                className="text-[11px] text-forest-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Baseline</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    Prior Probability P(A) [Drought Frequency]
                  </label>
                  <span className="font-mono font-bold text-slate-800">{(priorA * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  value={priorA}
                  onChange={(e) => setPriorA(parseFloat(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    Likelihood P(B|A) [Shortage given Drought]
                  </label>
                  <span className="font-mono font-bold text-slate-800">{(likelihood * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  value={likelihood}
                  onChange={(e) => setLikelihood(parseFloat(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-medium text-slate-700">
                    Evidence Probability P(B) [Overall Shortage Rate]
                  </label>
                  <span className="font-mono font-bold text-slate-800">{(evidenceB * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.95"
                  step="0.01"
                  value={evidenceB}
                  onChange={(e) => setEvidenceB(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <button
                onClick={handleRecalculateBayes}
                className="w-full py-2.5 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold shadow-xs transition"
              >
                Update Posterior Probability P(A|B)
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-900 text-[11px] space-y-1">
              <strong>Cautionary Scientific Note:</strong>
              <p>{bayesResult.cautionaryNote}</p>
            </div>
          </div>

          {/* Right: Bayes Output */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Bayes’ Law Calculation
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">{bayesResult.question}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Formula:</span>
                <span className="text-purple-900 font-bold text-sm">{bayesResult.formula}</span>
              </div>

              <div className="text-slate-600">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">
                  Substitution:
                </span>
                <span className="text-slate-800">{bayesResult.substitution}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-sans">
                <span className="font-semibold text-slate-700">Updated Posterior P(A|B):</span>
                <span className="text-2xl font-black text-purple-800">{bayesResult.percentage}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Plain-Language Interpretation</h4>
              <p className="text-slate-600 leading-relaxed bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                {bayesResult.interpretation}
              </p>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <strong>Assumptions:</strong> {bayesResult.limitations}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: DISCRETE RANDOM VARIABLES (PMF & CDF) */}
      {activeModule === 'pmf_cdf' && distributionResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PMF Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Probability Mass Function: P(X = x)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    X = Number of households requiring emergency water assistance
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                  ∑ P(X=x) = 1.00
                </span>
              </div>
              <PmfChart
                distribution={distributionResult.distribution}
                expectedValueMean={distributionResult.expectedValueMean}
              />
            </div>

            {/* CDF Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Cumulative Distribution: F(x) = P(X ≤ x)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Probability that demand does not exceed service threshold
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  Step Function
                </span>
              </div>
              <CdfStepChart
                distribution={distributionResult.distribution}
                thresholdX={cdfThresholdQuery}
              />
            </div>
          </div>

          {/* Moments & Derivations Summary Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">
              Moments of the Random Variable: Mean, Variance & Standard Deviation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs font-medium">Expected Value (Mean)</span>
                <p className="text-2xl font-black text-forest-800">
                  E(X) = {distributionResult.expectedValueMean}
                </p>
                <p className="text-[11px] font-mono text-slate-400">Formula: E(X) = ∑ x · P(X = x)</p>
                <p className="text-xs text-slate-600 pt-1 leading-snug">
                  {distributionResult.plainLanguageInterpretation.mean}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs font-medium">Variance</span>
                <p className="text-2xl font-black text-slate-800">
                  Var(X) = {distributionResult.variance}
                </p>
                <p className="text-[11px] font-mono text-slate-400">Formula: Var(X) = E(X²) - [E(X)]²</p>
                <p className="text-xs text-slate-600 pt-1 leading-snug">
                  {distributionResult.plainLanguageInterpretation.variance}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-xs font-medium">Standard Deviation</span>
                <p className="text-2xl font-black text-teal-800">
                  σ = {distributionResult.standardDeviation}
                </p>
                <p className="text-[11px] font-mono text-slate-400">Formula: σ = √Var(X)</p>
                <p className="text-xs text-slate-600 pt-1 leading-snug">
                  {distributionResult.plainLanguageInterpretation.stdDev}
                </p>
              </div>
            </div>

            {/* Complete PMF / CDF Table */}
            <div className="pt-2">
              <h4 className="font-bold text-slate-700 text-xs mb-2">Discrete Probability Distribution Table</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2">x (Households)</th>
                      <th className="px-4 py-2">Frequency n(x)</th>
                      <th className="px-4 py-2">P(X = x) [PMF]</th>
                      <th className="px-4 py-2">F(x) = P(X ≤ x) [CDF]</th>
                      <th className="px-4 py-2">x · P(X = x)</th>
                      <th className="px-4 py-2">x² · P(X = x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {distributionResult.distribution.map((d) => (
                      <tr key={d.x} className="hover:bg-slate-50/80">
                        <td className="px-4 py-2 font-bold text-slate-900">{d.x}</td>
                        <td className="px-4 py-2 text-slate-500">{d.count}</td>
                        <td className="px-4 py-2 text-forest-800 font-semibold">{d.px}</td>
                        <td className="px-4 py-2 text-teal-800 font-semibold">{d.fx}</td>
                        <td className="px-4 py-2 text-slate-600">{d.xTimesPx}</td>
                        <td className="px-4 py-2 text-slate-600">{d.xSquaredTimesPx}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: CONTINUOUS PDF */}
      {activeModule === 'continuous_pdf' && pdfResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Continuous Controls */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Gaussian Continuous Model</h3>
              <button
                onClick={() => {
                  setPdfMean(24.5);
                  setPdfStdDev(8.2);
                  setPdfMin(20);
                  setPdfMax(35);
                  handleRecalculatePdf();
                }}
                className="text-[11px] text-forest-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Continuous Mean μ (e.g. Daily Water Deficit Volume in kL)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={pdfMean}
                  onChange={(e) => setPdfMean(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Standard Deviation σ (Dispersion)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={pdfStdDev}
                  onChange={(e) => setPdfStdDev(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Interval Min [a]</label>
                  <input
                    type="number"
                    step="1"
                    value={pdfMin}
                    onChange={(e) => setPdfMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Interval Max [b]</label>
                  <input
                    type="number"
                    step="1"
                    value={pdfMax}
                    onChange={(e) => setPdfMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleRecalculatePdf}
                className="w-full py-2.5 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold shadow-xs transition"
              >
                Compute Interval Probability
              </button>
            </div>

            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 text-forest-900 text-[11px] space-y-1">
              <strong>Crucial Distinction:</strong>
              <p>{pdfResult.noteOnDensityVsProbability}</p>
            </div>
          </div>

          {/* Right: PDF Plot and Interval Probability */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
                Continuous Density Model
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-0.5">
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
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    Query Interval: P({pdfMin} ≤ X ≤ {pdfMax})
                  </span>
                  <span className="text-xl font-black text-forest-800">
                    {(pdfResult.queryInterval.intervalProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
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
