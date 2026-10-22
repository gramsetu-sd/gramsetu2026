import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Home,
  Users,
  Briefcase,
  Package,
  ClipboardList,
  Calculator,
  Lightbulb,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import {
  Village,
  VillageResourceSummary,
  Assessment,
  Recommendation,
  ComprehensiveProbabilityEvaluation,
} from '../types';
import { ResourceAvailabilityChart } from '../components/charts/ResourceAvailabilityChart';
import { PmfChart } from '../components/charts/PmfChart';
import { CdfStepChart } from '../components/charts/CdfStepChart';

export const VillageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [village, setVillage] = useState<Village | null>(null);
  const [resources, setResources] = useState<VillageResourceSummary[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [evaluation, setEvaluation] = useState<ComprehensiveProbabilityEvaluation | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inventory' | 'assessments' | 'probability' | 'recommendations' | 'reports'
  >('overview');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        const v = await api.getVillageById(id!);
        setVillage(v);

        const res = await api.getVillageResources(id!);
        setResources(res);

        const asmList = await api.getAssessments(id!);
        setAssessments(asmList);

        if (asmList.length > 0) {
          const evalData = await api.getAssessmentEvaluation(asmList[0].id);
          setEvaluation(evalData);

          const recs = await api.getRecommendations(asmList[0].id);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error loading village details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading village profile...</div>;
  }

  if (!village) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800">Village Not Found</h3>
        <Link to="/villages" className="text-forest-700 text-sm underline mt-2 block">
          Return to Village Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/villages" className="hover:text-forest-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Village Directory</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{village.name}</span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{village.name}</h2>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                Gram Panchayat
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <span>
                {village.block} Block, {village.district} District, {village.state}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/assessments"
              className="px-4 py-2 rounded-lg bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initiate New Assessment</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Population</span>
              <strong className="text-slate-800 text-sm">
                {village.population ? village.population.toLocaleString() : 'Unspecified'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Households</span>
              <strong className="text-slate-800 text-sm">
                {village.householdCount || 'Unspecified'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Main Occupation</span>
              <strong className="text-slate-800 text-sm truncate block max-w-[140px]">
                {village.mainOccupation || 'Agrarian'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assessments</span>
              <strong className="text-slate-800 text-sm">{assessments.length} Recorded</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <div className="border-b border-slate-200 flex overflow-x-auto gap-2 text-xs font-semibold">
        {[
          { key: 'overview', label: 'Overview & Profile', icon: Home },
          { key: 'inventory', label: 'Resource Inventory', icon: Package },
          { key: 'assessments', label: 'Demand Assessments', icon: ClipboardList },
          { key: 'probability', label: 'Probability Analysis', icon: Calculator },
          { key: 'recommendations', label: 'Recommendations', icon: Lightbulb },
          { key: 'reports', label: 'History & Reports', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-forest-800 text-forest-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Resource Status Overview</h3>
              <ResourceAvailabilityChart data={resources} />
            </div>

            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Geographic & Field Context</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {village.description ||
                  'Field observation unit subject to seasonal weather variations and groundwater dynamics in the Mahanadi river basin.'}
              </p>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <strong>Data Separation Notice:</strong>
                <p>
                  Geographic location details are verified administrative identifiers. Quantitative
                  resource stock levels are demonstration samples for algorithm evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resource Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Village Resource Audit</h3>
              <p className="text-xs text-slate-500">Tracked essential resources and latest audited quantities</p>
            </div>
            <Link
              to="/inventory"
              className="px-3 py-1.5 rounded-lg bg-forest-800 text-white text-xs font-medium hover:bg-forest-900"
            >
              Record New Observation
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Resource Category</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Observed Available</th>
                  <th className="px-4 py-3">Estimated Demand</th>
                  <th className="px-4 py-3">Balance / Deficit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.resource.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{item.resource.unit}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.latestObservation?.observedAvailableQuantity ?? 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.latestObservation?.estimatedDemand ?? 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {item.latestObservation ? (
                        item.deficitQuantity > 0 ? (
                          <span className="text-amber-700 font-semibold">
                            -{item.deficitQuantity} {item.resource.unit}
                          </span>
                        ) : (
                          <span className="text-forest-700 font-medium">Surplus</span>
                        )
                      ) : (
                        <span className="text-slate-400">No data</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          item.status === 'deficit'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'adequate'
                            ? 'bg-forest-100 text-forest-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {item.latestObservation?.observationDate || 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Demand Assessments */}
      {activeTab === 'assessments' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Registered Requirement Assessments</h3>
            <Link
              to="/assessments"
              className="text-xs text-forest-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Create Assessment</span>
              <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-forest-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{a.assessmentName}</h4>
                  <p className="text-slate-500 mt-0.5">
                    Resource: <strong className="text-slate-700">{a.resourceName}</strong> • Window: {a.startDate} to {a.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-forest-100 text-forest-800 font-bold uppercase text-[10px]">
                    Threshold: {(a.preparednessThreshold * 100).toFixed(0)}%
                  </span>
                  <Link
                    to="/probability"
                    className="px-3 py-1.5 rounded-lg bg-forest-800 text-white font-semibold hover:bg-forest-900"
                  >
                    Run Math Engine
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Probability Analysis */}
      {activeTab === 'probability' && evaluation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">PMF Demand Distribution P(X = x)</h3>
              <PmfChart
                distribution={evaluation.discreteDistribution.distribution}
                expectedValueMean={evaluation.discreteDistribution.expectedValueMean}
              />
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">CDF Service Level Curve F(x) = P(X ≤ x)</h3>
              <CdfStepChart
                distribution={evaluation.discreteDistribution.distribution}
                thresholdX={40}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Analytical Moments Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Expected Value E(X)</span>
                <strong className="text-forest-800 text-base">{evaluation.discreteDistribution.expectedValueMean} Households</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Variance Var(X)</span>
                <strong className="text-slate-800 text-base">{evaluation.discreteDistribution.variance}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Standard Deviation σ</span>
                <strong className="text-slate-800 text-base">{evaluation.discreteDistribution.standardDeviation} Households</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Triggered Civic Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rec.description}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Trigger Rule: {rec.ruleTriggered}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: History & Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm">Village Assessment Reports</h3>
          <p className="text-slate-500">
            Export comprehensive PDF or CSV summaries with full mathematical derivation steps.
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-800 text-white font-semibold hover:bg-forest-900"
          >
            <FileText className="w-4 h-4" />
            <span>Open Report Generation Hub</span>
          </Link>
        </div>
      )}
    </div>
  );
};
