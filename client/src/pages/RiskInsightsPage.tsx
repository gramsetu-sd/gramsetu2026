import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  HelpCircle,
  TrendingUp,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import {
  Assessment,
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

export const RiskInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'shortage' | 'dry_spell' | 'early_warning' | 'relief_planner' | 'supply_gap'
  >('shortage');

  // Assessments list for dropdown selector
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');

  // Loaded evaluation from selected assessment
  const [evaluation, setEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Interactive Live Scratchpad States ---
  // 1. Shortage Risk (Basic Empirical)
  const [basicN, setBasicN] = useState<number>(100);
  const [basicFavorable, setBasicFavorable] = useState<number>(38);
  const [basicResult, setBasicResult] = useState<BasicProbabilityCalculation | null>(null);

  // 2. Dry-Spell Impact (Conditional)
  const [condTotal, setCondTotal] = useState<number>(100);
  const [condJointAB, setCondJointAB] = useState<number>(24);
  const [condB, setCondB] = useState<number>(30);
  const [condResult, setCondResult] = useState<ConditionalProbabilityCalculation | null>(null);

  // 3. Early Warning (Bayesian Updating)
  const [priorA, setPriorA] = useState<number>(0.30);
  const [likelihood, setLikelihood] = useState<number>(0.80);
  const [evidenceB, setEvidenceB] = useState<number>(0.38);
  const [bayesResult, setBayesResult] = useState<BayesTheoremCalculation | null>(null);

  // 4. Relief Planner (Discrete distribution)
  const [distributionResult, setDistributionResult] = useState<DiscreteDistributionCalculation | null>(null);
  const [bufferThreshold, setBufferThreshold] = useState<number>(40);

  // 5. Supply Gap (Continuous Shortfall)
  const [pdfMean, setPdfMean] = useState<number>(24.5);
  const [pdfStdDev, setPdfStdDev] = useState<number>(8.2);
  const [pdfMin, setPdfMin] = useState<number>(20);
  const [pdfMax, setPdfMax] = useState<number>(35);
  const [pdfResult, setPdfResult] = useState<ContinuousPDFCalculation | null>(null);

  // Load assessments list on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchAssessmentsList() {
      try {
        const list = await api.getAssessments();
        if (isMounted) {
          setAssessments(list);
          if (list.length > 0 && !selectedAssessmentId) {
            setSelectedAssessmentId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      }
    }
    fetchAssessmentsList();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch evaluation when selectedAssessmentId changes
  const loadEvaluation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAssessmentEvaluation(id);
      setEvaluation(data);

      // Populate baselines
      if (data.basicProbability) {
        setBasicN(data.basicProbability.sampleSize || 100);
        setBasicFavorable(data.basicProbability.favorableCount || 38);
        setBasicResult(data.basicProbability);
      }
      if (data.conditionalProbability) {
        setCondTotal(data.conditionalProbability.totalObservations || 100);
        setCondJointAB(data.conditionalProbability.jointCountAB || 24);
        setCondB(data.conditionalProbability.conditioningCountB || 30);
        setCondResult(data.conditionalProbability);
      }
      if (data.bayesTheorem) {
        setPriorA(data.bayesTheorem.priorProbability || 0.30);
        setLikelihood(data.bayesTheorem.likelihood || 0.80);
        setEvidenceB(data.bayesTheorem.evidenceProbability || 0.38);
        setBayesResult(data.bayesTheorem);
      }
      if (data.discreteDistribution) {
        setDistributionResult(data.discreteDistribution);
        const mean = data.discreteDistribution.expectedValueMean || 33.4;
        const std = data.discreteDistribution.standardDeviation || 8.1;
        setBufferThreshold(Math.round(mean + std));
      }
      if (data.continuousPdf) {
        setPdfMean(data.continuousPdf.mean || 24.5);
        setPdfStdDev(data.continuousPdf.standardDeviation || 8.2);
        setPdfMin(20);
        setPdfMax(35);
        setPdfResult(data.continuousPdf);
      }
    } catch (err) {
      console.error('Error loading evaluation:', err);
      setError((err as Error).message || 'Failed to load risk data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssessmentId) {
      loadEvaluation(selectedAssessmentId);
    }
  }, [selectedAssessmentId]);

  // Debounced live calculation for Basic Probability
  const basicTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!evaluation) return;
    if (basicTimer.current) clearTimeout(basicTimer.current);
    basicTimer.current = window.setTimeout(async () => {
      try {
        const res = await api.calculateBasicProbability(
          basicN,
          basicFavorable,
          `${evaluation.resourceName} Shortage`
        );
        setBasicResult(res);
      } catch (err) {
        console.error('Failed to update shortage calculation:', err);
      }
    }, 300);
    return () => {
      if (basicTimer.current) clearTimeout(basicTimer.current);
    };
  }, [basicN, basicFavorable, evaluation?.resourceName]);

  // Debounced live calculation for Conditional Probability
  const condTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!evaluation) return;
    if (condTimer.current) clearTimeout(condTimer.current);
    condTimer.current = window.setTimeout(async () => {
      try {
        const res = await api.calculateConditionalProbability(
          condTotal,
          condJointAB,
          condB,
          `${evaluation.resourceName} Shortage`,
          'Below-Normal Rainfall'
        );
        setCondResult(res);
      } catch (err) {
        console.error('Failed to update dry-spell calculation:', err);
      }
    }, 300);
    return () => {
      if (condTimer.current) clearTimeout(condTimer.current);
    };
  }, [condTotal, condJointAB, condB, evaluation?.resourceName]);

  // Debounced live calculation for Bayes
  const bayesTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!evaluation) return;
    if (bayesTimer.current) clearTimeout(bayesTimer.current);
    bayesTimer.current = window.setTimeout(async () => {
      try {
        const res = await api.calculateBayes(
          priorA,
          likelihood,
          evidenceB,
          'Below-Normal Rainfall (Drought Phase)',
          `${evaluation.resourceName} Shortage`
        );
        setBayesResult(res);
      } catch (err) {
        console.error('Failed to update early warning calculation:', err);
      }
    }, 300);
    return () => {
      if (bayesTimer.current) clearTimeout(bayesTimer.current);
    };
  }, [priorA, likelihood, evidenceB, evaluation?.resourceName]);

  // Debounced live calculation for Continuous PDF
  const pdfTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!evaluation) return;
    if (pdfTimer.current) clearTimeout(pdfTimer.current);
    pdfTimer.current = window.setTimeout(async () => {
      try {
        const res = await api.getContinuousPdf(pdfMean, pdfStdDev, evaluation.unit || 'kL / Day', pdfMin, pdfMax);
        setPdfResult(res);
      } catch (err) {
        console.error('Failed to update supply gap calculation:', err);
      }
    }, 300);
    return () => {
      if (pdfTimer.current) clearTimeout(pdfTimer.current);
    };
  }, [pdfMean, pdfStdDev, pdfMin, pdfMax, evaluation?.unit]);

  // Helper for risk badge
  const getRiskBadge = (percentage: number) => {
    if (percentage >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          Critical Risk
        </span>
      );
    }
    if (percentage >= 40) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Moderate Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Low Risk
      </span>
    );
  };

  // Buffer coverage computation from CDF
  const bufferCoveragePercent = useMemo(() => {
    if (!distributionResult) return 85;
    // Find closest CDF entry <= bufferThreshold
    const dist = distributionResult.distribution;
    const match = dist.find((d) => d.x >= bufferThreshold);
    if (match) {
      return Math.round(match.fx * 100);
    }
    const last = dist[dist.length - 1];
    if (last && bufferThreshold >= last.x) return 100;
    return Math.round((dist[0]?.fx || 0.1) * 100);
  }, [distributionResult, bufferThreshold]);

  // Loading skeleton state
  if (loading && !evaluation) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-stone-200 rounded-lg" />
            <div className="h-4 w-96 bg-stone-100 rounded" />
          </div>
          <div className="h-10 w-48 bg-stone-200 rounded-lg" />
        </div>
        <div className="h-12 w-full bg-stone-200 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-stone-100 rounded-2xl" />
          <div className="lg:col-span-7 h-96 bg-stone-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error fallback with Retry button
  if (error && !evaluation) {
    return (
      <div className="surface p-8 rounded-card border border-rose-200/60 shadow-card text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Unable to load risk insights</h3>
        <p className="text-xs text-stone-600">{error}</p>
        <button
          onClick={() => selectedAssessmentId && loadEvaluation(selectedAssessmentId)}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Assessment Load</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header with Village/Resource Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Risk Insights
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Know how likely a shortage is, what triggers it, and how much help to line up.
          </p>
        </div>

        {/* Assessment Selector */}
        <div className="flex items-center gap-2 bg-white/90 p-2 rounded-panel border border-emerald-900/10 shadow-xs">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="flex flex-col text-left">
            <label htmlFor="assessment-select" className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Active Village & Resource
            </label>
            <select
              id="assessment-select"
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="text-xs font-bold text-stone-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.villageName || 'Village'} — {a.resourceName || 'Resource'} ({a.block || a.district || 'Block'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5 Question-Led Navigation Tabs */}
      <div className="surface p-1.5 rounded-2xl border border-emerald-900/10 shadow-card flex overflow-x-auto gap-1">
        {[
          { key: 'shortage', label: '1. Shortage Risk', hint: 'How often does this village run short?' },
          { key: 'dry_spell', label: '2. Dry-Spell Impact', hint: 'What happens when rainfall falls short?' },
          { key: 'early_warning', label: '3. Early Warning', hint: 'A borehole just failed. Is drought starting?' },
          { key: 'relief_planner', label: '4. Relief Planner', hint: 'How many households may need help?' },
          { key: 'supply_gap', label: '5. Supply Gap', hint: 'How big can the daily shortfall get?' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 px-3.5 rounded-xl text-left transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <div className="text-xs font-bold">{tab.label}</div>
            <div className={`text-[10px] ${activeTab === tab.key ? 'text-emerald-100' : 'text-stone-400'}`}>
              {tab.hint}
            </div>
          </button>
        ))}
      </div>

      {/* TAB 1: SHORTAGE RISK */}
      {activeTab === 'shortage' && basicResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Visual Dot Grid */}
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Survey Cycle History</h3>
                <p className="text-[11px] text-stone-500">Recorded deficit events in this village</p>
              </div>
              <button
                onClick={() => {
                  setBasicN(100);
                  setBasicFavorable(38);
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to baseline</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Survey cycles reviewed</label>
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
                  <label className="font-semibold text-stone-700">Cycles that ended in shortage</label>
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
            </div>

            {/* 100-Dot Grid */}
            <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-stone-800 uppercase tracking-wider">
                  100-Cycle View (Each dot = 1 in 100 cycles)
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {Math.round((basicFavorable / basicN) * 100)} / 100 cycles
                </span>
              </div>

              <div className="grid grid-cols-10 gap-1.5 p-2.5 bg-white rounded-lg border border-stone-200/50">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const isShortage = idx < Math.round((basicFavorable / basicN) * 100);
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                        isShortage
                          ? 'bg-rose-500 shadow-xs scale-105'
                          : 'bg-emerald-100 hover:bg-emerald-200'
                      }`}
                      title={isShortage ? `Cycle ${idx + 1}: Shortage observed` : `Cycle ${idx + 1}: Normal supply`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-[10px] text-stone-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span>Shortage cycle ({Math.round((basicFavorable / basicN) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-100 inline-block" />
                  <span>Normal supply ({100 - Math.round((basicFavorable / basicN) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plain Answer Card & Collapsible Math */}
          <div className="lg:col-span-7 space-y-4">
            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Field Finding
                </span>
                {getRiskBadge(Math.round((basicFavorable / basicN) * 100))}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  Shortage happened in about{' '}
                  <span className="text-emerald-700 font-mono font-extrabold">
                    {Math.round((basicFavorable / basicN) * 100)} of every 100
                  </span>{' '}
                  survey cycles.
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Based on {basicN} recorded field observations in {evaluation?.villageName || 'this village'}, supply fell below basic needs in {basicFavorable} cycles. Village coordinators should maintain standby capacity for at least this frequency.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-panel bg-stone-50 border border-stone-200/50">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Shortage Likelihood</div>
                  <div className="text-lg font-mono font-extrabold text-stone-900">
                    {basicResult.percentage}
                  </div>
                </div>
                <div className="p-3 rounded-panel bg-stone-50 border border-stone-200/50">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Adequate Supply</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700">
                    {(100 - parseFloat(basicResult.percentage)).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-panel bg-stone-50 border border-stone-200/50 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Confidence Level</div>
                  <div className="text-lg font-mono font-extrabold text-stone-900">
                    {basicN >= 100 ? 'High (N≥100)' : 'Moderate'}
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Math Drawer */}
            <details className="group surface p-4 rounded-card border border-emerald-900/10 shadow-card">
              <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                  Show the math
                </span>
                <span className="text-[10px] font-mono text-stone-400">Classical empirical ratio</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <FormulaCard
                  title="Shortage Frequency Calculation"
                  formula={basicResult.formula}
                  substitution={basicResult.substitution}
                  result={basicResult.percentage}
                  percentage={basicResult.percentage}
                  interpretation={basicResult.interpretation}
                  limitations={basicResult.limitations}
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* TAB 2: DRY-SPELL IMPACT */}
      {activeTab === 'dry_spell' && condResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Weather Condition Parameters</h3>
                <p className="text-[11px] text-stone-500">Impact of dry weather on village supply</p>
              </div>
              <button
                onClick={() => {
                  setCondTotal(100);
                  setCondJointAB(24);
                  setCondB(30);
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Total survey cycles</label>
                  <span className="font-mono font-bold text-stone-900">{condTotal}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="5"
                  value={condTotal}
                  onChange={(e) => setCondTotal(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Cycles with below-normal rainfall</label>
                  <span className="font-mono font-bold text-amber-800">{condB} cycles</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={Math.min(condTotal - 5, 80)}
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
                  <label className="font-semibold text-stone-700">Shortage occurred DURING dry spell</label>
                  <span className="font-mono font-bold text-rose-800">{condJointAB} cycles</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={condB}
                  value={condJointAB}
                  onChange={(e) => setCondJointAB(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Weather Correlation
                </span>
                {getRiskBadge(Math.round(condResult.conditionalProbability * 100))}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  Shortage is{' '}
                  <span className="text-rose-700 font-mono font-extrabold">
                    {(
                      condResult.conditionalProbability /
                      (condResult.pA > 0 ? condResult.pA : 0.38)
                    ).toFixed(1)}
                    x more likely
                  </span>{' '}
                  when rainfall falls below normal.
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  During dry spells, the chance of running short jumps from the baseline {Math.round(condResult.pA * 100)}% to {Math.round(condResult.conditionalProbability * 100)}%. Block authorities should pre-position water tankers whenever the meteorological office flags a dry window.
                </p>
              </div>

              {/* Side-by-side comparison bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                    <span>Normal seasonal conditions</span>
                    <span className="font-mono text-stone-900">{Math.round(condResult.pA * 100)}% chance</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${Math.round(condResult.pA * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-rose-900 mb-1">
                    <span>During a below-normal rainfall period</span>
                    <span className="font-mono font-extrabold text-rose-700">
                      {Math.round(condResult.conditionalProbability * 100)}% chance
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-rose-600 transition-all duration-300 rounded-full"
                      style={{ width: `${Math.round(condResult.conditionalProbability * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Math Drawer */}
            <details className="group surface p-4 rounded-card border border-emerald-900/10 shadow-card">
              <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                  Show the math
                </span>
                <span className="text-[10px] font-mono text-stone-400">Sub-sample ratio P(A|B)</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <FormulaCard
                  title="Rainfall Sensitivity Breakdown"
                  formula={condResult.formula}
                  substitution={condResult.substitution}
                  result={condResult.percentage}
                  percentage={condResult.percentage}
                  interpretation={condResult.interpretation}
                  limitations={condResult.limitations}
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* TAB 3: EARLY WARNING */}
      {activeTab === 'early_warning' && bayesResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Early Warning Signal Inputs</h3>
                <p className="text-[11px] text-stone-500">Updating risk when field signals arrive</p>
              </div>
              <button
                onClick={() => {
                  setPriorA(0.30);
                  setLikelihood(0.80);
                  setEvidenceB(0.38);
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">How often a drought phase is under way</label>
                  <span className="font-mono font-bold text-stone-900">{(priorA * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={priorA}
                  onChange={(e) => setPriorA(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Chance of shortage when drought is under way</label>
                  <span className="font-mono font-bold text-amber-800">{(likelihood * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.99"
                  step="0.05"
                  value={likelihood}
                  onChange={(e) => setLikelihood(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Chance of shortage in general</label>
                  <span className="font-mono font-bold text-stone-900">{(evidenceB * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.02"
                  value={evidenceB}
                  onChange={(e) => setEvidenceB(parseFloat(e.target.value))}
                  className="w-full accent-stone-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Updated Assessment
                </span>
                {getRiskBadge(Math.round(bayesResult.posteriorProbability * 100))}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  A borehole failure raises drought likelihood from{' '}
                  <span className="text-stone-600 font-mono">{(priorA * 100).toFixed(0)}%</span> to{' '}
                  <span className="text-rose-700 font-mono font-extrabold">{bayesResult.percentage}</span>.
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Before the failure report arrived, regional drought probability was estimated at {(priorA * 100).toFixed(0)}%. Factoring in this verified ground shortage event sharpens our outlook to {bayesResult.percentage}.
                </p>
              </div>

              {/* Before vs After Bars */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-panel bg-stone-50 border border-stone-200/60 text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Before field report
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-stone-700">
                    {(priorA * 100).toFixed(0)}%
                  </div>
                  <p className="text-[11px] text-stone-500">Initial regional assessment</p>
                </div>

                <div className="p-4 rounded-panel bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    After verified failure
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-emerald-800">
                    {bayesResult.percentage}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">Sharp 2x risk surge</p>
                </div>
              </div>
            </div>

            {/* Collapsible Math Drawer */}
            <details className="group surface p-4 rounded-card border border-emerald-900/10 shadow-card">
              <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                  Show the math
                </span>
                <span className="text-[10px] font-mono text-stone-400">Evidence revision theorem</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <FormulaCard
                  title="Evidence Revision Formulation"
                  formula={bayesResult.formula}
                  substitution={bayesResult.substitution}
                  result={bayesResult.percentage}
                  percentage={bayesResult.percentage}
                  interpretation={bayesResult.interpretation}
                  cautionaryNote={bayesResult.cautionaryNote}
                  limitations={bayesResult.limitations}
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* TAB 4: RELIEF PLANNER */}
      {activeTab === 'relief_planner' && distributionResult && (
        <div className="space-y-6">
          {/* Top 4 KPI Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Typical Demand</div>
              <div className="text-2xl font-mono font-extrabold text-stone-900 mt-1">
                ~{Math.round(distributionResult.expectedValueMean)} hh
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">Average households needing aid</p>
            </div>

            <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Normal Swing</div>
              <div className="text-2xl font-mono font-extrabold text-amber-700 mt-1">
                ±{Math.round(distributionResult.standardDeviation)} hh
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">Day-to-day fluctuation band</p>
            </div>

            <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Recommended Buffer</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-800 mt-1">
                {Math.round(distributionResult.expectedValueMean + distributionResult.standardDeviation)} hh
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">Typical demand + one swing</p>
            </div>

            <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Buffer Coverage</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-1">
                {bufferCoveragePercent}%
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">For buffer of {bufferThreshold} hh</p>
            </div>
          </div>

          {/* Buffer Testing Slider */}
          <div className="surface p-5 rounded-panel border border-emerald-900/10 shadow-card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Test Your Buffer Capacity</h4>
                <p className="text-[11px] text-stone-500">
                  Slide to see how many days will be covered without emergency replenishment
                </p>
              </div>
              <div className="font-mono text-xs font-bold bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                Buffer: {bufferThreshold} households ({bufferCoveragePercent}% protected)
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={bufferThreshold}
              onChange={(e) => setBufferThreshold(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card">
              <h4 className="text-xs font-bold text-stone-900 mb-2">
                Households needing help on a typical bad day
              </h4>
              <PmfChart
                distribution={distributionResult.distribution}
                expectedValueMean={distributionResult.expectedValueMean}
              />
            </div>

            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card">
              <h4 className="text-xs font-bold text-stone-900 mb-2">
                How safe is a buffer of N households?
              </h4>
              <CdfStepChart
                distribution={distributionResult.distribution}
                thresholdX={bufferThreshold}
              />
            </div>
          </div>

          {/* Collapsible Math Drawer with Table */}
          <details className="group surface p-4 rounded-card border border-emerald-900/10 shadow-card">
            <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                Show the math
              </span>
              <span className="text-[10px] font-mono text-stone-400">Distribution table & moments</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-stone-200/60 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Households (x)</th>
                      <th className="p-2">Recorded Days</th>
                      <th className="p-2">Share P(x)</th>
                      <th className="p-2">Cumulative F(x)</th>
                      <th className="p-2">x • P(x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {distributionResult.distribution.map((row) => (
                      <tr key={row.x} className={row.x === bufferThreshold ? 'bg-emerald-50/60 font-bold' : ''}>
                        <td className="p-2 text-stone-900">{row.x}</td>
                        <td className="p-2 text-stone-600">{row.count}</td>
                        <td className="p-2 text-stone-800">{row.px.toFixed(3)}</td>
                        <td className="p-2 text-emerald-800">{(row.fx * 100).toFixed(1)}%</td>
                        <td className="p-2 text-stone-600">{row.xTimesPx.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-lg text-stone-600 font-mono">
                <div>Expected Value E(X) = {distributionResult.expectedValueMean.toFixed(2)}</div>
                <div>Variance Var(X) = {distributionResult.variance.toFixed(2)} (σ = {distributionResult.standardDeviation.toFixed(2)})</div>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* TAB 5: SUPPLY GAP */}
      {activeTab === 'supply_gap' && pdfResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Tanker Sizing Parameters</h3>
                <p className="text-[11px] text-stone-500">Continuous daily deficit range</p>
              </div>
              <button
                onClick={() => {
                  setPdfMean(24.5);
                  setPdfStdDev(8.2);
                  setPdfMin(20);
                  setPdfMax(35);
                }}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Typical daily shortfall ({evaluation?.unit || 'kL'})</label>
                  <span className="font-mono font-bold text-stone-900">{pdfMean.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="0.5"
                  value={pdfMean}
                  onChange={(e) => setPdfMean(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-stone-700">Day-to-day swing (±{evaluation?.unit || 'kL'})</label>
                  <span className="font-mono font-bold text-amber-800">{pdfStdDev.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={pdfStdDev}
                  onChange={(e) => setPdfStdDev(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="font-semibold text-stone-700 block mb-2">Planning Band ({evaluation?.unit || 'kL'})</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block">From</span>
                    <input
                      type="number"
                      value={pdfMin}
                      onChange={(e) => setPdfMin(parseFloat(e.target.value) || 0)}
                      className="input w-full font-mono text-xs py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">To</span>
                    <input
                      type="number"
                      value={pdfMax}
                      onChange={(e) => setPdfMax(parseFloat(e.target.value) || 0)}
                      className="input w-full font-mono text-xs py-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Target Band Outlook
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Sizing Guidance
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  Chance the daily shortfall lands between {pdfMin} and {pdfMax} {evaluation?.unit || 'kL'}:{' '}
                  <span className="text-emerald-700 font-mono font-extrabold">
                    {pdfResult.queryInterval
                      ? Math.round(pdfResult.queryInterval.intervalProbability * 100)
                      : 44}
                    %
                  </span>.
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Contracting tankers for this volume band will meet daily requirements about{' '}
                  {pdfResult.queryInterval ? Math.round(pdfResult.queryInterval.intervalProbability * 100) : 44}% of the time during an active shortage period.
                </p>
              </div>

              <div className="pt-2">
                <ContinuousPdfChart
                  points={pdfResult.points}
                  mean={pdfMean}
                  unit={evaluation?.unit || 'kL / Day'}
                  intervalMin={pdfMin}
                  intervalMax={pdfMax}
                />
              </div>
            </div>

            {/* Collapsible Math Drawer */}
            <details className="group surface p-4 rounded-card border border-emerald-900/10 shadow-card">
              <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                  Show the math
                </span>
                <span className="text-[10px] font-mono text-stone-400">Area under the density curve</span>
              </summary>
              <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs text-stone-600 space-y-2 font-mono">
                <div>f(x) = {pdfResult.formula}</div>
                <div className="text-stone-500 text-[11px] font-sans">
                  {pdfResult.noteOnDensityVsProbability}
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
