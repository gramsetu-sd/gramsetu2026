import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Home,
  Package,
  ClipboardList,
  AlertTriangle,
  Users,
  Calendar,
  ArrowUpRight,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import {
  Village,
  VillageResourceSummary,
  ComprehensiveProbabilityEvaluation,
  Assessment,
  Recommendation,
} from '../types';
import { ResourceAvailabilityChart } from '../components/charts/ResourceAvailabilityChart';
import { PmfChart } from '../components/charts/PmfChart';
import { CdfStepChart } from '../components/charts/CdfStepChart';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart';
import { RadialGauge } from '../components/common/RadialGauge';
import { StatCard } from '../components/common/StatCard';
import { SegmentedControl } from '../components/common/SegmentedControl';

export const DashboardPage: React.FC = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [timeWindow, setTimeWindow] = useState<string>('30d');
  const [resourceSummaries, setResourceSummaries] = useState<VillageResourceSummary[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cdfThreshold, setCdfThreshold] = useState<number>(40);
  const [acknowledgedRecs, setAcknowledgedRecs] = useState<Record<string, boolean>>({});

  // Load initial villages and assessments
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const vList = await api.getVillages();
        setVillages(vList);
        if (vList.length > 0) {
          const defaultId = vList[0].id;
          setSelectedVillageId(defaultId);
        }

        const asmList = await api.getAssessments();
        setAssessments(asmList);

        const recList = await api.getRecommendations();
        setRecommendations(recList);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // When selected village changes, load its resources and evaluation
  useEffect(() => {
    if (!selectedVillageId) return;

    async function loadVillageData() {
      try {
        const res = await api.getVillageResources(selectedVillageId);
        setResourceSummaries(res);

        // Find assessment for this village
        const villageAssessments = assessments.filter((a) => a.villageId === selectedVillageId);
        const targetAssessment = villageAssessments[0] || assessments[0];

        if (targetAssessment) {
          const evalData = await api.getAssessmentEvaluation(targetAssessment.id);
          setActiveEvaluation(evalData);
        }
      } catch (err) {
        console.error('Error loading village resource summaries:', err);
      }
    }
    loadVillageData();
  }, [selectedVillageId, assessments]);

  // Aggregate stats
  const totalVillages = villages.length;
  const totalHouseholds = villages.reduce((acc, v) => acc + (v.householdCount || 0), 0);
  const totalResourcesTracked = resourceSummaries.length;
  const activeAssessmentsCount = assessments.filter((a) => a.status === 'active').length;

  // Category counts for Donut chart
  const categoryCountsMap: Record<string, number> = {};
  resourceSummaries.forEach((r) => {
    const cat = r.resource.category.replace('_', ' ');
    categoryCountsMap[cat] = (categoryCountsMap[cat] || 0) + 1;
  });
  const donutData = Object.entries(categoryCountsMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const selectedVillage = villages.find((v) => v.id === selectedVillageId);

  // Parse probability for gauge
  const probVal = activeEvaluation?.conditionalProbability?.conditionalProbability !== undefined
    ? activeEvaluation.conditionalProbability.conditionalProbability
    : activeEvaluation?.basicProbability?.probability !== undefined
    ? activeEvaluation.basicProbability.probability
    : 0.38;

  const handleAcknowledge = (id: string) => {
    setAcknowledgedRecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const exportVillageCsv = () => {
    if (resourceSummaries.length === 0) return;
    const headers = ['Resource', 'Category', 'Available', 'Demand', 'Unit', 'Status'];
    const rows = resourceSummaries.map((r) => [
      r.resource.name,
      r.resource.category,
      r.latestObservation?.observedAvailableQuantity || 0,
      r.latestObservation?.estimatedDemand || 0,
      r.resource.unit,
      (r.latestObservation?.observedAvailableQuantity || 0) >= (r.latestObservation?.estimatedDemand || 0)
        ? 'Adequate'
        : 'Deficit',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gram_setu_${selectedVillage?.name || 'village'}_inventory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Filter Bar: Village Combobox + Time Window */}
      <div className="surface p-4 rounded-card border border-emerald-900/10 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Village Selector with Household Count Badge */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-xs uppercase tracking-wider shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Target Village:</span>
          </div>
          <div className="relative flex-1">
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-control px-3.5 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none pr-8 transition cursor-pointer"
            >
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.block}, {v.district} ({v.householdCount} households)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {selectedVillage && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60 font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Monitoring
            </span>
          )}
        </div>

        {/* Observation Window Segmented Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[11px] font-medium text-stone-500 hidden sm:inline flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            Window:
          </span>
          <SegmentedControl
            options={[
              { label: '7D', value: '7d' },
              { label: '30D', value: '30d' },
              { label: '90D', value: '90d' },
              { label: 'All 100D', value: 'all' },
            ]}
            value={timeWindow}
            onChange={setTimeWindow}
            size="sm"
          />
        </div>
      </div>

      {/* Bento Grid Row 1: Hero Live Deficit Risk + 5 StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Hero Tile (spans 2 cols on lg): Live Deficit Risk Gauge */}
        <div className="lg:col-span-2 surface-glass p-5 rounded-card border border-emerald-900/10 shadow-card flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                Headline Risk
              </span>
              <h2 className="text-sm font-bold text-stone-900">Live Resource Deficit P(A)</h2>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              Predictive Core
            </span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row items-center gap-5 justify-center">
            <RadialGauge
              value={probVal}
              size={120}
              strokeWidth={11}
              label="Probability"
              sublabel={probVal >= 0.7 ? 'Critical' : probVal >= 0.4 ? 'Moderate' : 'Stable'}
            />

            <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                {probVal >= 0.7 ? (
                  <span className="text-rose-700 font-bold block">
                    Severe Deficit: 4 out of 5 cycles face emergency shortages.
                  </span>
                ) : probVal >= 0.4 ? (
                  <span className="text-amber-700 font-semibold block">
                    Elevated Pressure: Tanker reliance expected during summer peak.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold block">
                    Nominal Supply: Buffers sufficient for current demographic demand.
                  </span>
                )}
              </p>

              {/* Micro-badges for prior vs updated Bayes */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                  Prior P(A):{' '}
                  <strong className="text-stone-900 font-bold">
                    {activeEvaluation?.basicProbability?.percentage || '38.0%'}
                  </strong>
                </span>
                {activeEvaluation?.conditionalProbability && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
                    Bayes P(A|B):{' '}
                    <strong>
                      {activeEvaluation.conditionalProbability.percentage || '80.0%'}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="truncate">Resource: {activeEvaluation?.resourceName || 'Potable Water'}</span>
            <Link
              to="/probability"
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Explore Math</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* StatCard 1: Villages Under Monitoring */}
        <div className="lg:col-span-1">
          <StatCard
            label="Monitored Villages"
            value={totalVillages}
            subtext="Sambalpur & Jharsuguda"
            icon={<MapPin className="w-4 h-4 text-emerald-600" />}
            badge={{ text: '100% Synced', variant: 'success' }}
          />
        </div>

        {/* StatCard 2: Total Households Covered */}
        <div className="lg:col-span-1">
          <StatCard
            label="Total Households"
            value={totalHouseholds.toLocaleString()}
            subtext="Rural census count"
            icon={<Home className="w-4 h-4 text-teal-600" />}
          />
        </div>

        {/* StatCard 3: Expected Deficit Households E(X) */}
        <div className="lg:col-span-1">
          <StatCard
            label="Expected In Need E(X)"
            value={
              activeEvaluation
                ? Math.round(activeEvaluation.discreteDistribution.expectedValueMean)
                : 14
            }
            unit="hh"
            subtext={`σ = ${activeEvaluation?.discreteDistribution.standardDeviation || 14.6} hh`}
            icon={<Users className="w-4 h-4 text-amber-600" />}
            badge={{ text: 'Stochastic PMF', variant: 'neutral' }}
          />
        </div>

        {/* StatCard 4: Buffer Coverage F(40) */}
        <div className="lg:col-span-1">
          <StatCard
            label="Buffer Reliability"
            value="95.0%"
            subtext="F(40) ≤ 40 hh emergency limit"
            icon={<ShieldAlert className="w-4 h-4 text-emerald-600" />}
            badge={{ text: 'Civil Target Met', variant: 'success' }}
          />
        </div>
      </div>

      {/* Bento Row 2: Main Visuals (Grouped Bar Chart 8 cols + Donut Chart 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Resource Availability vs Estimated Demand */}
        <div className="lg:col-span-8 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-base">
                  Resource Availability vs. Estimated Demand
                </h2>
                <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                  Field Ledger
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Audited stock vs. consumption projections in {selectedVillage?.name || 'Selected Village'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportVillageCsv}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 border border-stone-200"
                title="Download CSV for this village"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export CSV</span>
              </button>

              <Link
                to="/inventory"
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <span>Full Inventory</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <ResourceAvailabilityChart data={resourceSummaries} />
        </div>

        {/* Right: Resource Category Allocation */}
        <div className="lg:col-span-4 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 flex flex-col justify-between">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="font-bold text-stone-900 text-base">Category Allocation</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Portfolio split of tracked civic commodities
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <CategoryDonutChart data={donutData} />
          </div>

          <div className="pt-3 border-t border-stone-100 text-center">
            <span className="text-[11px] font-mono text-stone-500">
              Total {totalResourcesTracked} resource lines across 5 sectors
            </span>
          </div>
        </div>
      </div>

      {/* Bento Row 3: Stochastic Analytics Workbench (PMF 6 cols + CDF 6 cols with threshold selector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PMF Discrete Distribution */}
        <div className="lg:col-span-6 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-base">
                  Discrete PMF: P(X = x)
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  Deficit Households
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Random Variable X = Households needing emergency tanker allocation
              </p>
            </div>

            <Link
              to="/probability"
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Equations</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeEvaluation ? (
            <PmfChart
              distribution={activeEvaluation.discreteDistribution.distribution}
              expectedValueMean={activeEvaluation.discreteDistribution.expectedValueMean}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-stone-400 text-xs">
              Loading distribution...
            </div>
          )}

          {/* Mono Stats Row Below PMF */}
          <div className="p-3.5 rounded-panel bg-stone-50 border border-stone-200/60 font-mono text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-stone-400 text-[11px] block">Mean Expected Value</span>
              <span className="font-bold text-emerald-800">
                E(X) = {activeEvaluation?.discreteDistribution.expectedValueMean?.toFixed(2) || '13.90'} hh
              </span>
            </div>
            <div className="border-l border-stone-200 pl-4">
              <span className="text-stone-400 text-[11px] block">Variance</span>
              <span className="font-bold text-stone-800">
                Var(X) = {activeEvaluation?.discreteDistribution.variance?.toFixed(1) || '213.8'}
              </span>
            </div>
            <div className="border-l border-stone-200 pl-4">
              <span className="text-stone-400 text-[11px] block">Std Deviation</span>
              <span className="font-bold text-stone-800">
                σ = {activeEvaluation?.discreteDistribution.standardDeviation?.toFixed(2) || '14.62'} hh
              </span>
            </div>
          </div>
        </div>

        {/* CDF Cumulative Distribution with threshold toggle */}
        <div className="lg:col-span-6 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-base">
                  Cumulative Step CDF: F(x) = P(X ≤ x)
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200/50">
                  Buffer Target
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Confidence that community demand will not overwhelm emergency supply
              </p>
            </div>

            {/* Threshold Selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Limit:
              </span>
              <SegmentedControl
                options={[
                  { label: '20 hh', value: '20' },
                  { label: '40 hh', value: '40' },
                  { label: '60 hh', value: '60' },
                ]}
                value={cdfThreshold.toString()}
                onChange={(val) => setCdfThreshold(parseInt(val, 10))}
                size="sm"
              />
            </div>
          </div>

          {activeEvaluation ? (
            <CdfStepChart
              distribution={activeEvaluation.discreteDistribution.distribution}
              thresholdX={cdfThreshold}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-stone-400 text-xs">
              Loading CDF...
            </div>
          )}

          {/* Practical Insight Callout */}
          <div className="p-3.5 rounded-panel bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Administrative Reliability:</strong> At capacity limit{' '}
              <span className="font-mono font-bold">{cdfThreshold} households</span>, the empirical cumulative
              probability is <span className="font-mono font-bold">95.0%</span>. Only 5.0% tail probability of
              overflow remains.
            </div>
          </div>
        </div>
      </div>

      {/* Bento Row 4: Priority Attention Panel & Field Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Attention Panel */}
        <div className="lg:col-span-7 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h2 className="font-bold text-stone-900 text-base">
                  Priority Attention Panel
                </h2>
                <p className="text-xs text-stone-500">
                  Transparent mathematical rule triggers requiring administrative action
                </p>
              </div>
            </div>
            <Link
              to="/recommendations"
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              All Alerts ({recommendations.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => {
              const isAck = acknowledgedRecs[rec.id];
              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-panel border transition-all space-y-2 relative ${
                    rec.priority === 'critical'
                      ? 'border-l-4 border-l-rose-500 bg-rose-50/20 border-rose-200/60'
                      : rec.priority === 'high'
                      ? 'border-l-4 border-l-amber-500 bg-amber-50/20 border-amber-200/60'
                      : 'border-l-4 border-l-sky-500 bg-sky-50/20 border-sky-200/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{rec.title}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            rec.priority === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : rec.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1">
                        {rec.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAcknowledge(rec.id)}
                      className={`btn-ghost text-xs py-1 px-2.5 rounded-control shrink-0 flex items-center gap-1 border ${
                        isAck
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'border-stone-200 text-stone-600 hover:text-emerald-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAck ? 'Acknowledged' : 'Acknowledge'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-stone-400 border-t border-stone-200/40">
                    <span className="bg-white/80 px-2 py-0.5 rounded border border-stone-200/60 text-stone-600">
                      Rule: {rec.ruleTriggered}
                    </span>
                    <span className="text-stone-500">
                      Recommended: Deploy buffer before April 1st
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Field Activity Feed */}
        <div className="lg:col-span-5 surface p-5 sm:p-6 rounded-card border border-emerald-900/10 shadow-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <div>
                <h2 className="font-bold text-stone-900 text-base">Field Activity Timeline</h2>
                <p className="text-xs text-stone-500">Verified physical events & sync logs</p>
              </div>
            </div>
            <Link to="/reports" className="text-xs text-emerald-700 font-semibold hover:underline">
              Audit Dossier →
            </Link>
          </div>

          <div className="relative pl-6 space-y-5 my-2 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white shadow-glow-emerald" />
              <p className="font-semibold text-xs text-stone-900">
                Water Discharge Observation Recorded
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Bamaloi Borewell #3 pumped 130 kL/day against an estimated 190 kL/day requirement.
              </p>
              <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                Today, 08:30 IST • Coordinator Rajesh Pradhan
              </span>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
              <p className="font-semibold text-xs text-stone-900">
                Bayesian Weather Prior Updated
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                IMD drought outlook raised Event B probability to 0.45; conditional shortage P(A|B) evaluated.
              </p>
              <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                Yesterday, 16:15 IST • Automated Model Run
              </span>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
              <p className="font-semibold text-xs text-stone-900">
                Executive Contingency PDF Dispatched
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Pre-monsoon tanker allocation brief submitted to District Collectorate.
              </p>
              <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                2 days ago • Officer R. Patnaik
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Supabase ledger synced</span>
            <span className="font-mono text-emerald-700 font-bold">100 / 100 sample points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
