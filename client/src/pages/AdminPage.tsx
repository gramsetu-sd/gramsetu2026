import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Package,
  Database,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { Resource, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { role, isSupabaseLive } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResModal, setNewResModal] = useState(false);
  const [resForm, setResForm] = useState({
    name: '',
    category: 'drinking_water' as const,
    unit: '',
    description: '',
  });

  const demoUsers = [
    { name: 'Shri R. K. Mohapatra', email: 'administrator@gramsetu.org', role: 'administrator', dept: 'District Rural Development Agency (DRDA)' },
    { name: 'Priyadarshini Sahu', email: 'coordinator@gramsetu.org', role: 'coordinator', dept: 'Rengali Block Development Office' },
    { name: 'A. N. Dash', email: 'auditor@gramsetu.gov.in', role: 'viewer', dept: 'District Planning Directorate' },
  ];

  async function loadResources() {
    try {
      const list = await api.getResources();
      setResources(list);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.name || !resForm.unit) return;

    try {
      await api.createResource(resForm);
      setNewResModal(false);
      setResForm({ name: '', category: 'drinking_water', unit: '', description: '' });
      loadResources();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (role !== 'administrator') {
    return (
      <div className="surface p-12 text-center rounded-card border border-stone-200 shadow-card space-y-3">
        <Shield className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="font-bold text-stone-800 text-lg">Administrator Access Required</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          The administration panel is restricted to users with the Administrator role. You can switch
          personas via the banner dropdown or in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Administration Panel
          </h1>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
            System Admin
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          System governance, database status, user authorization, and master resource catalogs.
        </p>
      </div>

      {/* Database Diagnostic Card */}
      <div className="surface rounded-card border border-emerald-900/10 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-base">Database Architecture Status</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isSupabaseLive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {isSupabaseLive ? 'Supabase PostgreSQL Connected' : 'In-Memory Demo Store Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
            <span className="text-stone-400 block text-[11px]">Primary Engine</span>
            <strong className="text-stone-900">PostgreSQL Relational Schema</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
            <span className="text-stone-400 block text-[11px]">Security Model</span>
            <strong className="text-stone-900">Row Level Security (RLS) Active</strong>
          </div>
          <div className="p-3 bg-stone-50 rounded-panel border border-stone-200/50">
            <span className="text-stone-400 block text-[11px]">Migration State</span>
            <strong className="text-stone-900">001_initial_schema.sql Loaded</strong>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="surface rounded-card border border-emerald-900/10 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-base">Authorized System Users</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
              <tr>
                <th className="px-4 py-2.5">Full Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Department / Organization</th>
                <th className="px-4 py-2.5">System Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {demoUsers.map((u, i) => (
                <tr key={i} className="hover:bg-stone-50/70">
                  <td className="px-4 py-3 font-semibold text-stone-800">{u.name}</td>
                  <td className="px-4 py-3 text-stone-500 font-mono">{u.email}</td>
                  <td className="px-4 py-3 text-stone-600">{u.dept}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Resource Catalog */}
      <div className="surface rounded-card border border-emerald-900/10 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-base">Master Resource Categories</h3>
          </div>
          <button
            onClick={() => setNewResModal(true)}
            className="btn-primary text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] font-bold border-b border-stone-200">
              <tr>
                <th className="px-4 py-2.5">Resource Name</th>
                <th className="px-4 py-2.5">Category Domain</th>
                <th className="px-4 py-2.5">Physical Unit</th>
                <th className="px-4 py-2.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70">
                  <td className="px-4 py-3 font-semibold text-stone-800">{r.name}</td>
                  <td className="px-4 py-3 capitalize text-stone-600">
                    {r.category.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-mono text-stone-700 font-semibold">{r.unit}</td>
                  <td className="px-4 py-3 text-stone-500 max-w-sm truncate">{r.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Resource Modal */}
      {newResModal && (
        <div className="fixed inset-0 bg-stone-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="surface rounded-card max-w-md w-full p-6 shadow-float space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Add Master Resource</h3>
              <button
                onClick={() => setNewResModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Resource Name *</label>
                <input
                  type="text"
                  required
                  value={resForm.name}
                  onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                  placeholder="e.g., Community Mobile Water Tanker"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Category Domain</label>
                <select
                  value={resForm.category}
                  onChange={(e) => setResForm({ ...resForm, category: e.target.value as any })}
                  className="input w-full cursor-pointer"
                >
                  <option value="drinking_water">Drinking Water</option>
                  <option value="irrigation_water">Irrigation Water</option>
                  <option value="healthcare_supplies">Healthcare Supplies</option>
                  <option value="agricultural_inputs">Agricultural Inputs</option>
                  <option value="emergency_supplies">Emergency Supplies</option>
                  <option value="renewable_energy">Renewable Energy</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Unit of Measurement *</label>
                <input
                  type="text"
                  required
                  value={resForm.unit}
                  onChange={(e) => setResForm({ ...resForm, unit: e.target.value })}
                  placeholder="e.g., kL / Day, Quintals, Medical Kits"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={resForm.description}
                  onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewResModal(false)}
                  className="btn-secondary px-4 py-2 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 font-bold shadow-xs"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
