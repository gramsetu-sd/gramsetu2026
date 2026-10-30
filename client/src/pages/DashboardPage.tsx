import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Tag,
  Phone,
  Layers,
  ChevronRight,
  Calculator,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { Commodity, HourlyRental } from '../types';

export const DashboardPage: React.FC = () => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [rentals, setRentals] = useState<HourlyRental[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Calculator state
  const [calcCategory, setCalcCategory] = useState<'tractor' | 'pump' | 'harvester' | 'drone'>('tractor');
  const [calcHours, setCalcHours] = useState<number>(4);

  const rates: Record<string, number> = {
    tractor: 450,
    pump: 150,
    harvester: 1200,
    drone: 600,
  };

  const estimatedCost = (rates[calcCategory] || 450) * calcHours;
  const estimatedBuyCost = calcCategory === 'tractor' ? 750000 : calcCategory === 'harvester' ? 2400000 : calcCategory === 'drone' ? 550000 : 45000;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [cmds, rents] = await Promise.all([
          api.getCommodities(),
          api.getRentals(),
        ]);
        setCommodities(cmds);
        setRentals(rents);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const activeRentals = rentals.filter((r) => r.status === 'active');
  const totalHours = rentals.reduce((acc, r) => acc + (r.durationHours || 0), 0);
  const totalAmount = rentals.reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome Banner */}
      <div className="surface-dark p-6 sm:p-8 rounded-card text-white relative overflow-hidden shadow-float">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              GRAM SETU • MULTI-VILLAGE ASSET & EQUIPMENT SHARING
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Connecting What Villages Have with{' '}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                What Villages Need.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Why let valuable assets sit idle or take heavy loans? Share, rent, and borrow tractors, transport pickups, diesel generators, event sound sets, and construction tools across multiple connected villages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/marketplace"
              className="btn-primary text-xs font-bold py-3 px-5 flex items-center justify-center gap-2 shadow-glow-emerald"
            >
              <span>Browse Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/list-commodity"
              className="btn-secondary text-xs font-bold py-3 px-5 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>List My Commodity</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-4 sm:p-5 rounded-card border border-emerald-900/10 shadow-card space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Available Equipment Nearby
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-stone-900">
            {commodities.length} Machines
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Ready for hourly hire in block</p>
        </div>

        <div className="surface p-4 sm:p-5 rounded-card border border-emerald-900/10 shadow-card space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Active Jobs in Field
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-800">
            {activeRentals.length} Active
          </div>
          <p className="text-[11px] text-stone-500">Currently operating in fields</p>
        </div>

        <div className="surface p-4 sm:p-5 rounded-card border border-emerald-900/10 shadow-card space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Hours Booked This Season
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-stone-900">
            {totalHours} Hours
          </div>
          <p className="text-[11px] text-stone-500">Plowing, harvesting & pumping</p>
        </div>

        <div className="surface p-4 sm:p-5 rounded-card border border-emerald-900/10 shadow-card space-y-1 bg-emerald-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Total Value Generated
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-900">
            ₹{totalAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Kept within village economy</p>
        </div>
      </div>

      {/* 2-Column: Quick Cost Estimator + Active Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quick Hourly Cost Calculator */}
        <div className="lg:col-span-5 surface rounded-card border border-emerald-900/10 p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-sm">
              Quick Hourly Rental Cost Estimator
            </h3>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Estimate your farm operation costs before booking. No hidden charges or maintenance liabilities.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Equipment Needed:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'tractor', label: 'Tractor (₹450/hr)' },
                  { key: 'pump', label: 'Water Pump (₹150/hr)' },
                  { key: 'harvester', label: 'Harvester (₹1,200/hr)' },
                  { key: 'drone', label: 'Drone (₹600/hr)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCalcCategory(item.key as any)}
                    className={`py-2 px-2.5 rounded-lg font-bold text-left border transition ${
                      calcCategory === item.key
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-700">Estimated Duration:</label>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {calcHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={calcHours}
                onChange={(e) => setCalcHours(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
            </div>

            {/* Calculated box */}
            <div className="p-4 rounded-panel bg-stone-50 border border-emerald-900/10 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Hourly Rental Cost:</span>
                <span className="text-xl font-extrabold font-mono text-emerald-800">
                  ₹{estimatedCost}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 border-t border-stone-200 pt-1.5">
                <span>Cost to buy this machine:</span>
                <span className="font-mono font-semibold text-stone-700">₹{estimatedBuyCost.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-medium">
                ✓ You save 99% of capital expense by renting only when needed.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Book in Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Operations & Nearby Equipment Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">
              Popular Equipment Ready in Your Block
            </h3>
            <Link to="/marketplace" className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1">
              <span>View All ({commodities.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commodities.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="surface rounded-card border border-emerald-900/10 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-32 bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase text-emerald-900">
                    {item.category.replace('_', ' ')}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-950/90 text-emerald-300 font-mono font-extrabold text-xs px-2 py-0.5 rounded">
                    ₹{item.ratePerHour} / hr
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{item.village}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-stone-500">Owner: {item.ownerName}</p>

                  <div className="pt-2 border-t border-stone-100">
                    <Link
                      to="/marketplace"
                      className="btn-secondary w-full py-1.5 text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <span>Rent by Hour</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="surface p-4 rounded-card border border-emerald-900/10 shadow-card flex items-center gap-3.5 text-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-stone-900 font-bold block">
                Direct Farmer-to-Farmer Hourly Network
              </strong>
              <p className="text-stone-500 text-[11px]">
                Transparent rates per hour. Fuel and trained operators can be included. No brokers or dealer commission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
