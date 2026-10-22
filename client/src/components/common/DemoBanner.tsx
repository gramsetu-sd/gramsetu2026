import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Shield, Database, Users } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { role, setRole, isSupabaseLive } = useAuth();

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold uppercase tracking-wider text-amber-800">
              Demonstration Data Notice:
            </strong>{' '}
            Synthetic scenario dataset for academic modeling of <em>Mathematics-III: Basic Probability</em>.
            Location names (e.g., Bamaloi, Sambalpur) reflect real tehsils, but quantitative figures are illustrative.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/80 border border-amber-300 text-xs">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Mode: {isSupabaseLive ? 'Live Supabase DB' : 'Demonstration Store'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-medium text-xs">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-white border border-amber-300 text-xs rounded px-2 py-0.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-800 cursor-pointer"
            >
              <option value="administrator">Administrator</option>
              <option value="coordinator">Village Coordinator</option>
              <option value="viewer">Viewer (Read Only)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
