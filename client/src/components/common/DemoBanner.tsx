import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Info, Tractor, Check, X } from 'lucide-react';
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
            🌐 Gram Setu • Connecting What Villages Have with What Villages Need • Multi-Village Network
          </span>

          <button
            type="button"
            onClick={() => setInfoOpen(!infoOpen)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 underline hover:text-white shrink-0 ml-1 transition"
          >
            <span>Platform Info</span>
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
              {isSupabaseLive ? 'Live DB' : 'Instant Demo Cache'}
            </span>
          </div>

          {/* Pill-style Role Switcher */}
          <div className="flex items-center bg-black/40 p-0.5 rounded-full border border-emerald-700/60 text-[10px] font-semibold shadow-sm">
            {[
              { id: 'coordinator' as UserRole, label: 'Farmer (Renter)' },
              { id: 'administrator' as UserRole, label: 'Equipment Owner' },
              { id: 'viewer' as UserRole, label: 'Coordinator' },
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
                <Tractor className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-stone-900 text-sm">
                  Farmer Commodity Sharing System
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
              <strong>GRAM SETU</strong> ("Connecting What Villages Have with What Villages Need") is a multi-village commodity and equipment sharing network. Villagers across neighboring gram panchayats can rent and share expensive machinery, transport pickups, soundproof generators, event tents, and construction tools by the hour.
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <strong>Connected Multi-Village Clusters:</strong>
              <p>
                Currently serving connected rural communities across Bamaloi, Lapanga, Khinda, Rengali, Durgapali, Thebra, and Katarbaga clusters in Sambalpur district with verified asset owners and instant inter-village booking.
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Transparent hourly rates (₹/hour), operator verification, and direct phone contact for smooth inter-village transit and coordination.
            </p>

            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="w-full btn-primary text-xs py-2.5"
            >
              Continue to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
