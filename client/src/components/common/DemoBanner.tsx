import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, HelpCircle, Database, Users, Shield, Check, X } from 'lucide-react';
import { UserRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { role, setRole, isSupabaseLive } = useAuth();
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 border-b border-amber-200/80 text-amber-950 px-4 py-1.5 text-xs relative z-40">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Notice + Why popover */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>

          <span className="font-extrabold uppercase tracking-wider text-[11px] text-amber-900 truncate">
            Demonstration Data — Not Verified Statistics
          </span>

          <button
            type="button"
            onClick={() => setWhyOpen(!whyOpen)}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-800 underline hover:text-amber-950 shrink-0"
          >
            <span>Why?</span>
            <HelpCircle className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Data Mode Chip + Pill Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Database Mode Status Chip */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-amber-200 text-[11px] font-medium shadow-2xs">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseLive ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-amber-500'
              }`}
            />
            <span className="text-stone-700">
              {isSupabaseLive ? 'Live Supabase DB' : 'Demo Store Active'}
            </span>
          </div>

          {/* Pill-style Role Switcher */}
          <div className="flex items-center bg-white/90 p-0.5 rounded-full border border-amber-200 text-[10px] font-semibold shadow-2xs">
            {[
              { id: 'administrator' as UserRole, label: 'Admin' },
              { id: 'coordinator' as UserRole, label: 'Coordinator' },
              { id: 'viewer' as UserRole, label: 'Viewer' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  role === r.id
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Why Popover Dialog */}
      {whyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-up">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-float space-y-4 relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-stone-900 text-sm">
                  Academic Modeling Disclosure
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setWhyOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              GRAM SETU was developed as a university engineering capstone to demonstrate the
              practical application of <strong>Mathematics-III Module 3 (Basic Probability)</strong>.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong>Verified Territorial Data:</strong>
              <p>
                Geographic and administrative place names (such as <em>Bamaloi</em> in Rengali Block,
                Sambalpur District, Odisha) represent authentic Indian census/tehsil units.
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Quantitative resource levels, household frequencies, and shortage observations are
              synthetic scenarios configured for algorithm evaluation. This platform is not an
              officially deployed government system.
            </p>

            <button
              type="button"
              onClick={() => setWhyOpen(false)}
              className="w-full btn-primary"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
