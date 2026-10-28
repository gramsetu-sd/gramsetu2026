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
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
        <Shield className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-800 text-lg">Administrator Access Required</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The administration panel is restricted to users with the Administrator role. You can switch
          personas via the banner dropdown or in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Administration Panel</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          System governance, database status, user authorization, and master resource catalogs
        </p>
      </div>

      {/* Database Diagnostic Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-800 text-base">Database Architecture Status</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isSupabaseLive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isSupabaseLive ? 'Supabase PostgreSQL Connected' : 'In-Memory Demo Store Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Primary Engine</span>
            <strong className="text-slate-800">PostgreSQL Relational Schema</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Security Model</span>
            <strong className="text-slate-800">Row Level Security (RLS) Active</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Migration State</span>
            <strong className="text-slate-800">001_initial_schema.sql Loaded</strong>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-800 text-base">Authorized System Users</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Full Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Department / Organization</th>
                <th className="px-4 py-2.5">System Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demoUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.dept}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-forest-100 text-forest-800">
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
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-800 text-base">Master Resource Categories</h3>
          </div>
          <button
            onClick={() => setNewResModal(true)}
            className="px-3 py-1.5 rounded-lg bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Resource Name</th>
                <th className="px-4 py-2.5">Category Domain</th>
                <th className="px-4 py-2.5">Physical Unit</th>
                <th className="px-4 py-2.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-800">{r.name}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {r.category.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 font-semibold">{r.unit}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-sm truncate">{r.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Resource Modal */}
      {newResModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Master Resource</h3>
              <button
                onClick={() => setNewResModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Resource Name *</label>
                <input
                  type="text"
                  required
                  value={resForm.name}
                  onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                  placeholder="e.g., Community Mobile Water Tanker"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Category Domain</label>
                <select
                  value={resForm.category}
                  onChange={(e) => setResForm({ ...resForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
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
                <label className="block font-medium text-slate-700 mb-1">Unit of Measurement *</label>
                <input
                  type="text"
                  required
                  value={resForm.unit}
                  onChange={(e) => setResForm({ ...resForm, unit: e.target.value })}
                  placeholder="e.g., kL / Day, Quintals, Medical Kits"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={resForm.description}
                  onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewResModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest-800 text-white rounded-lg hover:bg-forest-900 font-semibold"
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
