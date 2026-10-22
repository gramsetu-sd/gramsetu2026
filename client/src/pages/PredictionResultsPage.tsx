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

  const selectedAssessment = assessments.find((a) => a.id === selectedAssessmentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Prediction Results & Risk Assessment
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800 border border-forest-200">
              Decision Support
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Probability-weighted requirements, risk classifications, and operational buffer targets
          </p>
        </div>

        {/* Assessment Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Assessment:</span>
          <select
            value={selectedAssessmentId}
            onChange={(e) => handleSelectAssessment(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.villageName}: {a.assessmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Disclaimers & Model Ethics */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Decision-Support Modeling Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          The indicators below are <strong>decision-support suggestions</strong> derived from statistical
          probability, not guaranteed deterministic predictions or automatic government administrative orders.
          All estimates should be verified by block-level development officers against real-time physical
          field conditions.
        </p>
      </div>

      {loading || !evaluation ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Computing prediction moments and evaluating rules...
        </div>
      ) : (
        <>
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Shortage Probability */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Probability of Shortage P(A)
              </span>
              <p className="text-3xl font-black text-amber-900">
                {evaluation.basicProbability.percentage}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Baseline threshold: {(evaluation.preparednessThreshold * 100).toFixed(0)}%</span>
                <span className="font-semibold text-amber-800">
                  {evaluation.basicProbability.probability >= evaluation.preparednessThreshold
                    ? 'Threshold Exceeded'
                    : 'Within Margin'}
                </span>
              </div>
            </div>

            {/* Metric 2: Conditional Shortage under Drought */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                P(Shortage | Drought Phase)
              </span>
              <p className="text-3xl font-black text-red-600">
                {evaluation.conditionalProbability.percentage}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Conditional vulnerability</span>
                <span className="font-semibold text-red-700">Elevated</span>
              </div>
            </div>

            {/* Metric 3: Expected Households in Need E(X) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Expected Demand E(X)
              </span>
              <p className="text-3xl font-black text-forest-800">
                ~{Math.round(evaluation.discreteDistribution.expectedValueMean)} <span className="text-sm font-normal text-slate-500">Households</span>
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Exact mean: {evaluation.discreteDistribution.expectedValueMean}</span>
                <span className="font-mono text-slate-700">σ = {evaluation.discreteDistribution.standardDeviation}</span>
              </div>
            </div>

            {/* Metric 4: Recommended Buffer Target */}
            <div className="bg-forest-50 p-5 rounded-xl border border-forest-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800 block">
                Target Buffer Stock
              </span>
              <p className="text-3xl font-black text-forest-900">
                {Math.round(
                  evaluation.discreteDistribution.expectedValueMean +
                    evaluation.discreteDistribution.standardDeviation
                )}{' '}
                <span className="text-sm font-normal text-forest-700">hh buffer</span>
              </p>
              <div className="text-[11px] text-forest-700 pt-1 border-t border-forest-200/60">
                Calculated at Mean + 1σ safety margin
              </div>
            </div>
          </div>

          {/* Charts Row: PMF & CDF */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Requirement PMF: P(X = x)
                  </h3>
                  <p className="text-xs text-slate-500">Discrete probability mass distribution</p>
                </div>
                <Link to="/probability" className="text-xs text-forest-700 font-semibold hover:underline">
                  Math Lab →
                </Link>
              </div>
              <PmfChart
                distribution={evaluation.discreteDistribution.distribution}
                expectedValueMean={evaluation.discreteDistribution.expectedValueMean}
              />
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Coverage Level CDF: F(x) = P(X ≤ x)
                  </h3>
                  <p className="text-xs text-slate-500">Cumulative service assurance threshold</p>
                </div>
                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  F(40) = 95%
                </span>
              </div>
              <CdfStepChart
                distribution={evaluation.discreteDistribution.distribution}
                thresholdX={40}
              />
            </div>
          </div>

          {/* Context & Metadata Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Assessment Metadata & Audit Trail</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Village</span>
                <strong className="text-slate-800">{evaluation.villageName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Resource Tracked</span>
                <strong className="text-slate-800">{evaluation.resourceName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sample Size</span>
                <strong className="text-slate-800">{evaluation.sampleSize} Historical Cycles</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Evaluation Timestamp</span>
                <strong className="text-slate-800">{new Date(evaluation.calculationDate).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/recommendations"
                className="px-4 py-2 rounded-lg bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Review Generated Action Items</span>
              </Link>
              <Link
                to="/reports"
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Export Formal PDF Report</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
