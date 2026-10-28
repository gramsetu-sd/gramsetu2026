import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Calendar,
  MapPin,
  Package,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Info,
  Compass,
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
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Field Surveys & Assessments
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Field Cycles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Initiate and track structured resource surveys across Gram Panchayats.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Survey Assessment</span>
          </button>
        )}
      </div>

      {/* Explanatory Banner */}
      <div className="surface p-4 rounded-card border border-emerald-900/10 shadow-card text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Understanding Assessment Lifecycles</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          Each assessment couples an administrative village with a key resource category across a defined
          temporal window. Raw field observations feeding an assessment undergo automated evaluation
          via the <strong>Risk Insights & Early Warning Engine</strong> to calculate shortage risks, weather sensitivities, and recommended buffer sizes.
        </p>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="surface rounded-card border border-emerald-900/10 shadow-card hover:shadow-lift transition p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {a.status}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Threshold: {(a.preparednessThreshold * 100).toFixed(0)}%
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900 leading-snug">
                  {a.assessmentName}
                </h3>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {a.villageName} ({a.district})
                  </span>
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-panel space-y-1 text-xs border border-stone-200/50">
                <div className="flex justify-between text-stone-600">
                  <span>Resource:</span>
                  <strong className="text-stone-800">{a.resourceName}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Category:</span>
                  <span className="capitalize">{a.resourceCategory?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Date Window:</span>
                  <span>
                    {a.startDate} to {a.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
              <Link
                to="/insights"
                className="btn-primary flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Risk Insights</span>
              </Link>
              <Link
                to="/predictions"
                className="btn-secondary py-2 px-3 text-xs font-bold"
                title="View Forecasts"
              >
                <TrendingUp className="w-3.5 h-3.5 text-stone-600" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="surface rounded-card max-w-lg w-full p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Initiate Requirement Assessment</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Assessment Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.assessmentName}
                  onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                  placeholder="e.g., Summer Drinking Water Shortage Assessment (Bamaloi 2026)"
                  className="input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Target Village *</label>
                  <select
                    required
                    value={formData.villageId}
                    onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                    className="input w-full cursor-pointer"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Resource Tracked *</label>
                  <select
                    required
                    value={formData.resourceId}
                    onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                    className="input w-full cursor-pointer"
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
                  <label className="block font-medium text-stone-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Preparedness Threshold (Shortage Trigger: 0.10 to 0.90)
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
                    className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  />
                  <span className="font-mono font-bold text-stone-800 w-12 text-right">
                    {(formData.preparednessThreshold * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  If shortage likelihood exceeds this threshold, high-priority contingency
                  recommendations are automatically generated.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary px-4 py-2 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 font-bold shadow-xs"
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
