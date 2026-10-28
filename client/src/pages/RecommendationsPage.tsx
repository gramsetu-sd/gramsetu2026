import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Recommendation, Assessment } from '../types';
import { useAuth } from '../context/AuthContext';

export const RecommendationsPage: React.FC = () => {
  const { role } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const canUpdate = role === 'administrator' || role === 'coordinator';

  async function loadData() {
    try {
      setLoading(true);
      const [recList, asmList] = await Promise.all([
        api.getRecommendations(),
        api.getAssessments(),
      ]);
      setRecommendations(recList);
      setAssessments(asmList);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Recommendation['status']) => {
    try {
      await api.updateRecommendationStatus(id, newStatus);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filtered = recommendations.filter((r) => {
    if (selectedAssessmentId !== 'all' && r.assessmentId !== selectedAssessmentId) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Action Plan
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              Logistics Directives
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Priority logistics tasks and buffer directives triggered by field risk metrics.
          </p>
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-card text-amber-950 text-xs flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-900">Action Plan Advisory:</strong>
          <p className="leading-relaxed text-amber-900">
            Action items are generated whenever verified field surveys detect elevated shortage risk (e.g. risk &gt; 70% during dry spells) to ensure timely buffer dispatches.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="surface p-4 rounded-panel border border-emerald-900/10 shadow-card flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-600">
          <Filter className="w-4 h-4 text-stone-400" />
          <span>Filters:</span>
        </div>

        {/* Assessment Filter */}
        <select
          value={selectedAssessmentId}
          onChange={(e) => setSelectedAssessmentId(e.target.value)}
          className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-control focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold text-stone-800 cursor-pointer"
        >
          <option value="all">All Villages</option>
          {assessments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.villageName}: {a.assessmentName}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-control focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold text-stone-800 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <span className="ml-auto text-stone-400 font-mono text-[11px]">
          Showing {filtered.length} active directives
        </span>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const assessment = assessments.find((a) => a.id === rec.assessmentId);
          return (
            <div
              key={rec.id}
              className="surface rounded-card border border-emerald-900/10 p-5 sm:p-6 shadow-card hover:shadow-lift transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      rec.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : rec.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <h3 className="font-bold text-stone-900 text-base">{rec.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 font-medium">Status:</span>
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      rec.status === 'acted_upon'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : rec.status === 'acknowledged'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {rec.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {rec.description}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] bg-stone-50 px-2 py-0.5 rounded border border-stone-200 text-stone-600">
                    Rule Trigger: {rec.ruleTriggered}
                  </span>
                  {rec.actionDeadline && (
                    <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Target Action Deadline: {rec.actionDeadline}
                    </span>
                  )}
                  {assessment && (
                    <span className="text-[11px] text-stone-500">
                      Village: <strong className="text-stone-800">{assessment.villageName}</strong>
                    </span>
                  )}
                </div>

                {/* Status Switcher for Authorized Users */}
                {canUpdate && (
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {rec.status !== 'acknowledged' && rec.status !== 'acted_upon' && (
                      <button
                        onClick={() => handleUpdateStatus(rec.id, 'acknowledged')}
                        className="btn-secondary px-3 py-1 text-[11px] font-bold"
                      >
                        Acknowledge
                      </button>
                    )}
                    {rec.status !== 'acted_upon' && (
                      <button
                        onClick={() => handleUpdateStatus(rec.id, 'acted_upon')}
                        className="btn-primary px-3 py-1 text-[11px] font-bold"
                      >
                        Mark as Acted Upon
                      </button>
                    )}
                    {rec.status === 'acted_upon' && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
