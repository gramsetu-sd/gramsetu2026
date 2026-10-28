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
    <div className="max-w-4xl space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            User Profile & System Preferences
          </h1>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
            Settings
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Manage officer profile, active permission persona, and automated shortage alert thresholds.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings and default threshold successfully updated.</span>
        </div>
      )}

      {/* Role Switcher Card */}
      <div className="surface rounded-card border border-emerald-900/10 p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
          <Shield className="w-5 h-5 text-emerald-700" />
          <span>Active Role & Access Control (RBAC)</span>
        </div>

        <p className="text-xs text-stone-600">
          Switch roles to simulate different user permissions across block administration:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            {
              r: 'administrator' as UserRole,
              title: 'Administrator',
              desc: 'Full administrative rights to add villages, create master resource categories, and manage system access.',
            },
            {
              r: 'coordinator' as UserRole,
              title: 'Village Coordinator',
              desc: 'Maintain assigned village profiles, log daily observations, run risk models, and review action plans.',
            },
            {
              r: 'viewer' as UserRole,
              title: 'Viewer (Read Only)',
              desc: 'View authorized village dashboards, risk insights, and export official reports without modification rights.',
            },
          ].map((item) => (
            <button
              key={item.r}
              type="button"
              onClick={() => setRole(item.r)}
              className={`p-4 rounded-panel border text-left transition space-y-2 ${
                role === item.r
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">{item.title}</span>
                {role === item.r && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              </div>
              <p className="text-stone-500 text-[11px] leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="surface rounded-card border border-emerald-900/10 p-6 shadow-card space-y-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
          <User className="w-5 h-5 text-emerald-700" />
          <span>Officer Profile Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={user?.fullName}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              defaultValue={user?.email}
              className="input w-full bg-stone-100 text-stone-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-stone-700 mb-1">
            Default Preparedness Risk Threshold
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={defaultThreshold}
              onChange={(e) => setDefaultThreshold(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <span className="font-mono font-bold text-stone-800 text-sm w-12 text-right">
              {(defaultThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Global default trigger: When shortage risk exceeds {(defaultThreshold * 100).toFixed(0)}%, high-priority contingency
            alerts will automatically be assigned.
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <Database className="w-3.5 h-3.5 text-stone-400" />
            <span>Database Backend: {isSupabaseLive ? 'Live Supabase PostgreSQL' : 'Demonstration Memory Store'}</span>
          </div>

          <button
            type="submit"
            className="btn-primary px-5 py-2 font-bold shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
