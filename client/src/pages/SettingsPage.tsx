import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Sliders, Bell, CheckCircle2, Database } from 'lucide-react';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { role, user, setRole, isSupabaseLive } = useAuth();
  const [defaultThreshold, setDefaultThreshold] = useState<number>(0.35);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          User Profile & System Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage officer profile, active permission persona, and algorithm preparedness thresholds
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings and default threshold successfully updated.</span>
        </div>
      )}

      {/* Role Switcher Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
          <Shield className="w-5 h-5 text-forest-700" />
          <span>Active Role & Access Control (RBAC)</span>
        </div>

        <p className="text-xs text-slate-600">
          Switch roles to simulate different user permissions during project presentation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            {
              r: 'administrator' as UserRole,
              title: 'Administrator',
              desc: 'Full administrative rights to add villages, create master resource categories, and manage users.',
            },
            {
              r: 'coordinator' as UserRole,
              title: 'Village Coordinator',
              desc: 'Maintain assigned village profiles, log daily observations, run probability models, and review recommendations.',
            },
            {
              r: 'viewer' as UserRole,
              title: 'Viewer (Read Only)',
              desc: 'View authorized village dashboards, mathematical audits, and export PDF reports without modification rights.',
            },
          ].map((item) => (
            <button
              key={item.r}
              type="button"
              onClick={() => setRole(item.r)}
              className={`p-4 rounded-xl border text-left transition space-y-2 ${
                role === item.r
                  ? 'border-forest-700 bg-forest-50/70 shadow-xs ring-1 ring-forest-700'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                {role === item.r && <CheckCircle2 className="w-4 h-4 text-forest-700" />}
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-forest-700" />
          <span>Officer Profile Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={user?.fullName}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            Default Preparedness Probability Threshold
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={defaultThreshold}
              onChange={(e) => setDefaultThreshold(parseFloat(e.target.value))}
              className="flex-1 accent-forest-800 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-800 text-sm w-12 text-right">
              {(defaultThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Global default trigger: If P(Shortage) &gt; {(defaultThreshold * 100).toFixed(0)}%, contingency
            flags will automatically be assigned.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Database Backend: {isSupabaseLive ? 'Live Supabase PostgreSQL' : 'Demonstration Memory Store'}</span>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-forest-800 text-white font-semibold hover:bg-forest-900 transition shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
