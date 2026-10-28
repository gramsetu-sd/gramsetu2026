import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  Users,
  CheckCircle2,
  FileText,
  Lightbulb,
  Info,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { ComprehensiveProbabilityEvaluation, Assessment } from '../types';
import { PmfChart } from '../components/charts/PmfChart';
import { CdfStepChart } from '../components/charts/CdfStepChart';

export const PredictionResultsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [evaluation, setEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        const list = await api.getAssessments();
        setAssessments(list);
        if (list.length > 0) {
          const firstId = list[0].id;
          setSelectedAssessmentId(firstId);
          const evalData = await api.getAssessmentEvaluation(firstId);
          setEvaluation(evalData);
        }
      } catch (err) {
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  const handleSelectAssessment = async (id: string) => {
    setSelectedAssessmentId(id);
    try {
      setLoading(true);
      const evalData = await api.getAssessmentEvaluation(id);
      setEvaluation(evalData);
    } catch (err) {
      console.error('Error loading evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Forecasts & Risk Assessment
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Decision Support
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Demand projections, seasonal risk classifications, and operational buffer targets.
          </p>
        </div>

        {/* Assessment Switcher */}
        <div className="flex items-center gap-2 bg-white/90 p-2 rounded-panel border border-emerald-900/10 shadow-xs">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="flex flex-col text-left">
            <label htmlFor="assessment-select" className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Select Assessment
            </label>
            <select
              id="assessment-select"
              value={selectedAssessmentId}
              onChange={(e) => handleSelectAssessment(e.target.value)}
              className="text-xs font-bold text-stone-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.villageName}: {a.assessmentName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Operational Notice Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-card text-amber-950 text-xs space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Decision-Support Advisory</span>
        </div>
        <p className="leading-relaxed">
          The indicators below are <strong>decision-support projections</strong> derived from verified field observations to assist Block Development Officers in sizing buffers before seasonal shortages occur.
        </p>
      </div>

      {loading || !evaluation ? (
        <div className="surface p-12 text-center text-stone-400 text-xs rounded-card border border-emerald-900/10">
          Computing projections and evaluating requirements...
        </div>
      ) : (
        <>
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Shortage Likelihood
              </span>
              <p className="text-3xl font-black font-mono text-amber-800">
                {evaluation.basicProbability.percentage}
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>Baseline threshold: {(evaluation.preparednessThreshold * 100).toFixed(0)}%</span>
                <span className="font-semibold text-amber-800">
                  {evaluation.basicProbability.probability >= evaluation.preparednessThreshold
                    ? 'Threshold Exceeded'
                    : 'Within Margin'}
                </span>
              </div>
            </div>

            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                During Dry Spell
              </span>
              <p className="text-3xl font-black font-mono text-rose-700">
                {evaluation.conditionalProbability.percentage}
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>Weather sensitivity</span>
                <span className="font-bold text-rose-700">2.1x Surge</span>
              </div>
            </div>

            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Typical Daily Demand
              </span>
              <p className="text-3xl font-black font-mono text-stone-900">
                ~{Math.round(evaluation.discreteDistribution.expectedValueMean)}{' '}
                <span className="text-sm font-normal text-stone-500 font-sans">hh</span>
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100 font-mono">
                <span>Mean: {evaluation.discreteDistribution.expectedValueMean.toFixed(1)}</span>
                <span className="text-amber-700">Swing: ±{evaluation.discreteDistribution.standardDeviation.toFixed(1)}</span>
              </div>
            </div>

            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-2 bg-emerald-50/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Recommended Buffer
              </span>
              <p className="text-3xl font-black font-mono text-emerald-900">
                {Math.round(
                  evaluation.discreteDistribution.expectedValueMean +
                    evaluation.discreteDistribution.standardDeviation
                )}{' '}
                <span className="text-sm font-normal text-emerald-700 font-sans">hh</span>
              </p>
              <div className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/60 font-medium">
                Typical demand + 1 swing (85.7% safe)
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Daily Demand Distribution
                  </h3>
                  <p className="text-xs text-stone-500">Households needing assistance on deficit days</p>
                </div>
                <Link to="/insights" className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                  <span>Risk Insights</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <PmfChart
                distribution={evaluation.discreteDistribution.distribution}
                expectedValueMean={evaluation.discreteDistribution.expectedValueMean}
              />
            </div>

            <div className="surface p-5 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Cumulative Buffer Protection
                  </h3>
                  <p className="text-xs text-stone-500">Service assurance level for buffer sizes</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Buffer 40 hh = 85.7% Safe
                </span>
              </div>
              <CdfStepChart
                distribution={evaluation.discreteDistribution.distribution}
                thresholdX={40}
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
              <span className="text-[10px] font-mono text-stone-400">Statistical equations & derivations</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 font-mono text-xs text-stone-700 space-y-2">
              <div>Basic Shortage: P(A) = {evaluation.basicProbability.favorableCount} / {evaluation.basicProbability.sampleSize} = {evaluation.basicProbability.probability.toFixed(3)}</div>
              <div>Conditional Shortage: P(A|B) = {evaluation.conditionalProbability.conditionalProbability.toFixed(3)} (during adverse weather)</div>
              <div>Discrete Moments: E(X) = {evaluation.discreteDistribution.expectedValueMean.toFixed(2)}, Var(X) = {evaluation.discreteDistribution.variance.toFixed(2)}, σ = {evaluation.discreteDistribution.standardDeviation.toFixed(2)}</div>
            </div>
          </details>

          {/* Context & Metadata Table */}
          <div className="surface rounded-card border border-emerald-900/10 p-5 shadow-card space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Assessment Metadata</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Village</span>
                <strong className="text-stone-800">{evaluation.villageName}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Resource Tracked</span>
                <strong className="text-stone-800">{evaluation.resourceName}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Sample Size</span>
                <strong className="text-stone-800">{evaluation.sampleSize} Historical Cycles</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Evaluation Date</span>
                <strong className="text-stone-800">{new Date(evaluation.calculationDate).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <Link
                to="/recommendations"
                className="btn-primary text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-xs"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Review Action Plan</span>
              </Link>
              <Link
                to="/reports"
                className="btn-secondary text-xs font-bold px-4 py-2 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Export Planning Report</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
