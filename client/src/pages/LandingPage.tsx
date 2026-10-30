import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Search,
  Star,
  Plus,
  HelpCircle,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { SunriseWelcome } from '../components/common/SunriseWelcome';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSunrise, setShowSunrise] = useState(() => {
    // Only show once per session or fresh visit
    const hasSeen = sessionStorage.getItem('gramsetu_sunrise_seen');
    return !hasSeen;
  });
  const [category, setCategory] = useState('all');
  const [village, setVillage] = useState('all');

  const handleSunriseComplete = () => {
    sessionStorage.setItem('gramsetu_sunrise_seen', 'true');
    setShowSunrise(false);
  };

  // Calculator
  const [calcType, setCalcType] = useState<'tractor' | 'pump' | 'harvester' | 'drone'>('tractor');
  const [calcHours, setCalcHours] = useState(4);

  const rates = {
    tractor: 450,
    pump: 150,
    harvester: 1200,
    drone: 600,
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Sunrise Welcome Animation (2-3s cinematic intro) */}
      {showSunrise && <SunriseWelcome onComplete={handleSunriseComplete} />}

      {/* Top Banner */}
      <div className="bg-emerald-950 border-b border-emerald-800/80 text-emerald-200 text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>🌾 Gram Setu Farmer Network:</strong> Peer-to-peer agricultural commodity & equipment sharing on an hourly rental basis across Odisha.
        </span>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-emerald-900/10 bg-white/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-950 text-white flex items-center justify-center font-bold text-lg shadow-glow-emerald border border-emerald-400/30">
              GS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950">GRAM SETU</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Hourly Rentals
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Connecting What Villages Have with What Villages Need
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-stone-600">
            <Link to="/marketplace" className="hover:text-emerald-800 transition">Browse Equipment</Link>
            <Link to="/list-commodity" className="hover:text-emerald-800 transition">List & Earn ₹/hr</Link>
            <Link to="/my-rentals" className="hover:text-emerald-800 transition">My Rentals</Link>
            <Link to="/dashboard" className="hover:text-emerald-800 transition">Farmer Dashboard</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold px-4 py-2 text-stone-700 hover:text-emerald-800"
            >
              Sign In
            </Link>
            <Link
              to="/marketplace"
              className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-xs"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-ink-950 via-emerald-ink-900 to-emerald-950 text-white">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                MULTI-VILLAGE ASSET & HOURLY EQUIPMENT SHARING NETWORK
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Connecting What Villages Have with{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                  What Villages Need.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
                Why take heavy loans or let valuable equipment sit idle? Share, rent, and borrow agricultural machinery, transport pickups, generators, event sound sets, and tools across multiple connected villages. Pay only for the exact hours you need.
              </p>

              {/* Quick Search Widget */}
              <form onSubmit={handleQuickSearch} className="surface p-3 rounded-2xl bg-white text-stone-900 shadow-float border border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 block px-2 pt-1">
                    Asset / Equipment
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border-0 text-xs font-bold text-stone-900 p-2 focus:ring-0 cursor-pointer"
                  >
                    <option value="all">✨ All Village Assets</option>
                    <option value="transport">🚚 Transport Pickup (₹350/hr)</option>
                    <option value="tractor">🚜 Tractor + Rotavator (₹450/hr)</option>
                    <option value="power_energy">⚡ Silent Generator (₹240/hr)</option>
                    <option value="community_events">🎪 Shamiana & Sound (₹180/hr)</option>
                    <option value="construction">🏗️ Cement Mixer (₹220/hr)</option>
                    <option value="water_pump">💧 Water Pump (₹150/hr)</option>
                    <option value="harvester">🌾 Harvester (₹1,200/hr)</option>
                    <option value="drone">🛸 Drone Sprayer (₹600/hr)</option>
                  </select>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-stone-100">
                  <label className="text-[10px] font-bold uppercase text-stone-400 block px-2 pt-1">
                    Village / Cluster
                  </label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-transparent border-0 text-xs font-bold text-stone-900 p-2 focus:ring-0 cursor-pointer"
                  >
                    <option value="all">🌐 All Connected Villages</option>
                    <option value="Bamaloi">📍 Bamaloi</option>
                    <option value="Lapanga">📍 Lapanga</option>
                    <option value="Khinda">📍 Khinda</option>
                    <option value="Rengali">📍 Rengali</option>
                    <option value="Durgapali">📍 Durgapali</option>
                    <option value="Thebra">📍 Thebra</option>
                    <option value="Katarbaga">📍 Katarbaga</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-glow-emerald"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Available Assets</span>
                </button>
              </form>

              {/* Trust bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-emerald-400 font-bold text-base block">₹150 - ₹1200</span>
                  <span className="text-stone-400 text-[11px]">Fair Hourly Rates</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">8 Categories</span>
                  <span className="text-stone-400 text-[11px]">Tractors, Pumps, Drones</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">Zero Brokers</span>
                  <span className="text-stone-400 text-[11px]">Direct Farmer Connect</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">Pay After Work</span>
                  <span className="text-stone-400 text-[11px]">Verified Village Trust</span>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Hourly Cost Calculator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="surface p-6 sm:p-7 rounded-card bg-white text-stone-900 shadow-float border border-white/20 w-full max-w-md space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Hourly Calculator
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      See How Much You Save
                    </h3>
                  </div>
                  <span className="text-2xl">💰</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Select Equipment Needed:
                    </label>
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
                          onClick={() => setCalcType(item.key as any)}
                          className={`py-2 px-2.5 rounded-lg font-bold text-left border transition ${
                            calcType === item.key
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
                      <label className="font-bold text-stone-700">Hours Needed:</label>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {calcHours} Hours
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={calcHours}
                      onChange={(e) => setCalcHours(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                    />
                  </div>

                  {/* Result Box */}
                  <div className="p-4 rounded-panel bg-stone-50 border border-emerald-900/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-medium">Hourly Rent Total:</span>
                      <span className="text-2xl font-extrabold font-mono text-emerald-800">
                        ₹{rates[calcType] * calcHours}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Operator & standard equipment setup included in this slot.
                    </p>
                  </div>

                  <Link
                    to="/marketplace"
                    className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Rent This Machine Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              Simple & Transparent
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              How Hourly Sharing Works for Farmers
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              No paper contracts, no middleman commissions. Just neighbor farmers helping neighbor farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200">
                1
              </div>
              <h3 className="font-bold text-stone-900 text-base">Browse Nearby Machines</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Check available tractors, water pumps, harvesters, or sprayers in your village or neighboring panchayats with clear hourly rates.
              </p>
            </div>

            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200">
                2
              </div>
              <h3 className="font-bold text-stone-900 text-base">Book by the Hour</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pick your date, select your starting time slot, and set how many hours you need. The total cost is calculated automatically.
              </p>
            </div>

            <div className="surface p-6 rounded-card border border-emerald-900/10 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200">
                3
              </div>
              <h3 className="font-bold text-stone-900 text-base">Work & Pay Directly</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The equipment is dispatched to your field. Upon work completion, pay the owner directly with zero platform deductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment Grid Preview */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
                Live in Village Network
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
                Featured Commodities Ready for Hire
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore All Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Mahindra 575 DI 45HP Tractor',
                category: 'Tractor',
                rate: 450,
                village: 'Bamaloi',
                img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
                feature: 'Rotavator + Diesel Included',
              },
              {
                title: 'Kirloskar 7.5 HP Diesel Water Pump',
                category: 'Water Pump',
                rate: 150,
                village: 'Rengali',
                img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
                feature: '300m Pipe Included',
              },
              {
                title: 'Swaraj 8100 Combine Harvester',
                category: 'Harvester',
                rate: 1200,
                village: 'Lapanga',
                img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
                feature: 'Experienced Crew Included',
              },
              {
                title: 'DJI Agras T40 Spraying Drone',
                category: 'Spraying Drone',
                rate: 600,
                village: 'Katarbaga',
                img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
                feature: 'Certified Pilot Included',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="surface rounded-card border border-emerald-900/10 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-stone-100">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/95 text-emerald-900">
                    {item.category}
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 bg-emerald-950/90 text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
                    ₹{item.rate} / hr
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-stone-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {item.village}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">✓ {item.feature}</p>

                  <div className="pt-2 border-t border-stone-100">
                    <Link
                      to="/marketplace"
                      className="btn-primary w-full py-2 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <span>Rent by Hour</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Call to Action / Banner */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-emerald-900/10 bg-[#0d2a1d]">
            <img
              src="/images/idle-equipment-banner.png"
              alt="Have Idle Equipment on Your Farm? List Your Equipment for Rent or Find Equipment Nearby"
              className="w-full h-auto block select-none"
            />

            {/* Clickable interactive hotspots matching the banner buttons */}
            <div className="absolute inset-0">
              <Link
                to="/list-commodity"
                aria-label="List Your Equipment for Rent"
                title="List Your Equipment for Rent"
                className="absolute left-[5.4%] top-[61.6%] w-[20.5%] h-[13.2%] rounded-full cursor-pointer transition-all duration-150 hover:bg-white/15 hover:ring-2 hover:ring-emerald-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <Link
                to="/marketplace"
                aria-label="Find Equipment Nearby"
                title="Find Equipment Nearby"
                className="absolute left-[26.9%] top-[61.6%] w-[16.1%] h-[13.2%] rounded-full cursor-pointer transition-all duration-150 hover:bg-white/20 hover:ring-2 hover:ring-white/80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* Accessible buttons on small/mobile screens */}
          <div className="flex sm:hidden flex-col gap-2.5 mt-4">
            <Link
              to="/list-commodity"
              className="btn-primary text-xs font-bold py-3 px-5 w-full flex items-center justify-center gap-2 rounded-xl shadow-glow-emerald"
            >
              <Plus className="w-4 h-4" />
              <span>List Your Equipment for Rent</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
            <Link
              to="/marketplace"
              className="w-full py-3 px-5 text-xs font-bold rounded-xl border border-emerald-800/30 text-emerald-950 bg-white hover:bg-emerald-50 flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>Find Equipment Nearby</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-ink-950 text-stone-300 text-xs py-12 mt-auto border-t border-emerald-900/40">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-glow-emerald">
                GS
              </div>
              <span>GRAM SETU</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Connecting What Villages Have with What Villages Need through peer-to-peer hourly asset and equipment sharing across village clusters.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Rent Village Assets</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/marketplace" className="hover:text-white transition">Transport & Pickup Trucks</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Tractors & Rotavators</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Silent Diesel Generators</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Shamiana & Sound Systems</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Cement Concrete Mixers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Asset Owners</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/list-commodity" className="hover:text-white transition">List an Asset or Tool</Link></li>
              <li><Link to="/my-rentals" className="hover:text-white transition">Booking Requests</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Hourly Earnings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Connected Clusters</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Serving Bamaloi, Lapanga, Khinda, Rengali, Durgapali, Katarbaga, and Thebra Gram Panchayats.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 pt-8 mt-8 border-t border-white/10 text-center text-stone-500 text-[11px] font-mono">
          © 2026 GRAM SETU • Connecting What Villages Have with What Villages Need • Multi-Village Community Sharing Network.
        </div>
      </footer>
    </div>
  );
};
