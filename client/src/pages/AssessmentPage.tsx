import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Calendar,
  MapPin,
  Package,
  Calculator,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Assessment, Village, Resource } from '../types';
import { useAuth } from '../context/AuthContext';

export const AssessmentPage: React.FC = () => {
  const { role } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    villageId: '',
    resourceId: '',
    assessmentName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    preparednessThreshold: 0.35,
    dataStatus: 'demonstration_sample' as const,
  });

  const canEdit = role === 'administrator' || role === 'coordinator';

  async function loadData() {
    try {
      setLoading(true);
      const [aList, vList, rList] = await Promise.all([
        api.getAssessments(),
        api.getVillages(),
        api.getResources(),
      ]);
      setAssessments(aList);
      setVillages(vList);
      setResources(rList);

      if (vList.length > 0 && rList.length > 0 && !formData.villageId) {
        setFormData((prev) => ({
          ...prev,
          villageId: vList[0].id,
          resourceId: rList[0].id,
          assessmentName: `Seasonal Resource Review (${vList[0].name} 2026)`,
        }));
      }
    } catch (err) {
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.villageId || !formData.resourceId || !formData.assessmentName) return;

    try {
      await api.createAssessment({
        villageId: formData.villageId,
        resourceId: formData.resourceId,
        assessmentName: formData.assessmentName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        preparednessThreshold: Number(formData.preparednessThreshold),
        dataStatus: formData.dataStatus,
        status: 'active',
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(`Error initiating assessment: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Resource Requirement Assessments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Initiate and audit structured probability evaluation cycles for gram panchayats
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-forest-800 text-white text-xs sm:text-sm font-semibold hover:bg-forest-900 transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Assessment</span>
          </button>
        )}
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Info className="w-4 h-4 text-forest-700" />
          <span>Understanding Assessment Lifecycles</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Each assessment couples an administrative village with a key resource category across a defined
          temporal window. Raw field observations feeding an assessment undergo mathematical evaluation
          via <strong>Mathematics-III Module 3 (Basic Probability)</strong> to calculate shortage risks, Bayes’
          posterior updates, and discrete distribution moments.
        </p>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-forest-600 transition p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-50 text-forest-800 border border-forest-200">
                  {a.status}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Threshold: {(a.preparednessThreshold * 100).toFixed(0)}%
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {a.assessmentName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span>
                    {a.villageName} ({a.district})
                  </span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Resource:</span>
                  <strong className="text-slate-800">{a.resourceName}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Category:</span>
                  <span className="capitalize">{a.resourceCategory?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Date Window:</span>
                  <span>
                    {a.startDate} to {a.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                to="/probability"
                className="flex-1 py-2 px-3 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Run Analysis</span>
              </Link>
              <Link
                to="/predictions"
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                title="View Prediction Results"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Initiate Assessment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Initiate Requirement Assessment</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Assessment Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.assessmentName}
                  onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                  placeholder="e.g., Summer Drinking Water Shortage Assessment (Bamaloi 2026)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Village *</label>
                  <select
                    required
                    value={formData.villageId}
                    onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Resource Tracked *</label>
                  <select
                    required
                    value={formData.resourceId}
                    onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  >
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Preparedness Threshold (Probability Trigger: 0.10 to 0.90)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.10"
                    max="0.90"
                    step="0.05"
                    value={formData.preparednessThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, preparednessThreshold: parseFloat(e.target.value) })
                    }
                    className="flex-1 accent-forest-800 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-slate-800 w-12 text-right">
                    {(formData.preparednessThreshold * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  If calculated shortage probability exceeds this threshold, high-priority contingency
                  recommendations are automatically generated.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
