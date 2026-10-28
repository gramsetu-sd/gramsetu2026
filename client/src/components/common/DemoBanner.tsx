import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Info, Database, Users, Shield, Check, X } from 'lucide-react';
import { UserRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { role, setRole, isSupabaseLive } = useAuth();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-b border-emerald-800/60 text-emerald-100 px-4 py-1.5 text-xs relative z-40">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Operational Pilot Status + Info popover */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-200 truncate">
            Operational Pilot — Odisha Rural Resource Management Network
          </span>

          <button
            type="button"
            onClick={() => setInfoOpen(!infoOpen)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 underline hover:text-white shrink-0 ml-1 transition"
          >
            <span>Deployment Info</span>
            <Info className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Data Mode Chip + Pill Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Database Mode Status Chip */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 border border-emerald-700/60 text-[11px] font-mono shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseLive ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-amber-400'
              }`}
            />
            <span className="text-emerald-200">
              {isSupabaseLive ? 'Supabase Live DB' : 'Local Storage Cache'}
            </span>
          </div>

          {/* Pill-style Role Switcher */}
          <div className="flex items-center bg-black/40 p-0.5 rounded-full border border-emerald-700/60 text-[10px] font-semibold shadow-sm">
            {[
              { id: 'administrator' as UserRole, label: 'District Admin' },
              { id: 'coordinator' as UserRole, label: 'Block Officer' },
              { id: 'viewer' as UserRole, label: 'Auditor' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  role === r.id
                    ? 'bg-emerald-500 text-white shadow-xs font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deployment Info Popover Dialog */}
      {infoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-up">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-float space-y-4 relative text-stone-800">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-stone-900 text-sm">
                  System Deployment Notice
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>GRAM SETU</strong> is an automated rural resource-requirement prediction and inventory allocation software platform engineered for Block Development Officers and District Collectors.
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <strong>Pilot Administrative Scope:</strong>
              <p>
                Currently monitoring critical drinking water and grain logistics across pilot gram panchayats in Sambalpur and Jharsuguda districts (including authentic Census units such as <em>Bamaloi</em> in Rengali Block).
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Resource availability data is synchronized with the live PostgreSQL ledger. Stochastic demand forecasting algorithms calculate early warning indicators to eliminate emergency deficits.
            </p>

            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="w-full btn-primary text-xs py-2.5"
            >
              Acknowledge System Notice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
