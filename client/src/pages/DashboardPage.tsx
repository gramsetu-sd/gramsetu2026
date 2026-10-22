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
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Sparkles,
  Calculator,
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

export const DashboardPage: React.FC = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('q1_2026');
  const [resourceSummaries, setResourceSummaries] = useState<VillageResourceSummary[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeEvaluation, setActiveEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <MapPin className="w-4 h-4 text-forest-700" />
            <span>Target Village:</span>
          </div>
          <select
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="flex-1 md:w-64 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.block}, {v.district})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Observation Window:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-800"
          >
            <option value="q1_2026">Pre-Monsoon Season (Jan - Apr 2026)</option>
            <option value="rabi_2025">Rabi Sowing Window (Oct - Dec 2025)</option>
            <option value="full_year">100-Day Historical Baseline</option>
          </select>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Villages
            </span>
            <MapPin className="w-4 h-4 text-forest-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalVillages}</p>
          <p className="text-[11px] text-slate-500 truncate">Sambalpur & Jharsuguda</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Households
            </span>
            <Home className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalHouseholds.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Under rural monitoring</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Resources
            </span>
            <Package className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalResourcesTracked}</p>
          <p className="text-[11px] text-slate-500">Water, health, agriculture</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assessments
            </span>
            <ClipboardList className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeAssessmentsCount}</p>
          <p className="text-[11px] text-slate-500">Active probability runs</p>
        </div>

        {/* Card 5: Probability of Shortage */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Shortage Risk P(A)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {activeEvaluation?.basicProbability.percentage || '38.0%'}
          </p>
          <p className="text-[11px] text-amber-700 truncate">
            {activeEvaluation?.resourceName || 'Potable Water'}
          </p>
        </div>

        {/* Card 6: Expected Households in Need E(X) */}
        <div className="bg-forest-50 p-4 rounded-xl border border-forest-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-forest-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Expected E(X)
            </span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <p className="text-2xl font-bold text-forest-900">
            {activeEvaluation ? `~${Math.round(activeEvaluation.discreteDistribution.expectedValueMean)} hh` : '~14 hh'}
          </p>
          <p className="text-[11px] text-forest-700">
            σ = {activeEvaluation?.discreteDistribution.standardDeviation || '14.6'} hh
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Resource Availability vs Estimated Demand (Grouped Bar Chart) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-800 text-base">
                Resource Availability vs. Estimated Demand
              </h2>
              <p className="text-xs text-slate-500">
                Audited quantities vs. projected demand in {selectedVillage?.name || 'Selected Village'}
              </p>
            </div>
            <Link
              to="/inventory"
              className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResourceAvailabilityChart data={resourceSummaries} />
        </div>

        {/* Right: Resource Category Allocation (Donut Chart) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-800 text-base">Resource Categorization</h2>
            <p className="text-xs text-slate-500">Tracked essential domains</p>
          </div>
          <CategoryDonutChart data={donutData} />
        </div>
      </div>

      {/* Probability Modeling Visuals: PMF & CDF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Probability Mass Function (PMF) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800 text-base">
                  Probability Mass Function: P(X = x)
                </h2>
                <span className="text-[10px] font-bold uppercase bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded">
                  Discrete PMF
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Random Variable X = Households needing emergency water delivery
              </p>
            </div>
            <Link
              to="/probability"
              className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore Math</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeEvaluation ? (
            <PmfChart
              distribution={activeEvaluation.discreteDistribution.distribution}
              expectedValueMean={activeEvaluation.discreteDistribution.expectedValueMean}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Loading distribution...
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>
              Expected Value <strong>E(X) = {activeEvaluation?.discreteDistribution.expectedValueMean || 13.9}</strong>
            </span>
            <span>
              Variance <strong>Var(X) = {activeEvaluation?.discreteDistribution.variance || 213.8}</strong>
            </span>
            <span>
              Std Dev <strong>σ = {activeEvaluation?.discreteDistribution.standardDeviation || 14.6}</strong>
            </span>
          </div>
        </div>

        {/* Cumulative Distribution Function (CDF) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800 text-base">
                  Cumulative Distribution Function: F(x) = P(X ≤ x)
                </h2>
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                  CDF Step
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Probability that emergency requirements remain within buffer limit x
              </p>
            </div>
            <Link
              to="/predictions"
              className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Prediction Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeEvaluation ? (
            <CdfStepChart
              distribution={activeEvaluation.discreteDistribution.distribution}
              thresholdX={40}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Loading CDF...
            </div>
          )}

          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-lg text-xs text-teal-900">
            <strong>Practical Insight:</strong> F(40) = 95.0% means there is a 95% probability that emergency assistance demand will not exceed 40 households.
          </div>
        </div>
      </div>

      {/* Bottom Section: Priority Attention & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Attention Panel (Transparent Rule Triggers) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-slate-800 text-base">
                Priority Attention Panel (Rule-Based Alerts)
              </h2>
            </div>
            <Link to="/recommendations" className="text-xs text-forest-700 font-semibold hover:underline">
              View All ({recommendations.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">
                    {rec.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rec.priority === 'critical'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : rec.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                  <span>Rule: {rec.ruleTriggered}</span>
                  <span className="text-slate-500">Status: {rec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <h2 className="font-bold text-slate-800 text-base">Recent Field Activity</h2>
            </div>
            <Link to="/reports" className="text-xs text-forest-700 font-semibold hover:underline">
              Audit Log →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
              <div className="w-2 h-2 rounded-full bg-forest-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Observation Recorded in Bamaloi</p>
                <p className="text-slate-500 text-[11px]">
                  Borewell pump discharge recorded at 130 kL/day (Estimated demand: 190 kL/day).
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Yesterday, 14:30</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Conditional Probability Evaluated</p>
                <p className="text-slate-500 text-[11px]">
                  P(Shortage | Low Rainfall) recomputed to 80.0% for summer preparedness window.
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">2 days ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Executive Report Exported</p>
                <p className="text-slate-500 text-[11px]">
                  PDF report generated for Bamaloi Summer Drinking Water contingency.
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
