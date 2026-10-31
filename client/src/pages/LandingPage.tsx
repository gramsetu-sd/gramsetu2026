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
  Users,
  Handshake,
  Layers,
  Check,
} from 'lucide-react';
import { SunriseWelcome } from '../components/common/SunriseWelcome';
import { FloatingLeaves } from '../components/common/FloatingLeaves';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSunrise, setShowSunrise] = useState(() => {
    const hasSeen = sessionStorage.getItem('gramsetu_sunrise_seen');
    return !hasSeen;
  });
  const [category, setCategory] = useState('all');
  const [village, setVillage] = useState('all');

  // Interactive Live Estimator
  const [calcType, setCalcType] = useState<'tractor' | 'pump' | 'harvester' | 'drone'>('tractor');
  const [calcHours, setCalcHours] = useState(4);

  const rates = {
    tractor: 450,
    pump: 150,
    harvester: 1200,
    drone: 600,
  };

  const handleSunriseComplete = () => {
    sessionStorage.setItem('gramsetu_sunrise_seen', 'true');
    setShowSunrise(false);
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-emerald-950 relative overflow-x-hidden">
      {/* 1. Realistic Sunrise Cinematic Welcome Animation */}
      {showSunrise && <SunriseWelcome onComplete={handleSunriseComplete} />}

      {/* 2. Floating Subtle Green & Golden Leaves Transition Layer */}
      <FloatingLeaves />

      {/* Top Banner: Rural Inter-Village Community Trust */}
      <div className="bg-[#092b1d] border-b border-emerald-800/60 text-emerald-100 text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>🌾 Gram Setu Village Network:</strong> Peer-to-peer equipment and asset sharing network connecting rural communities across Odisha.
        </span>
      </div>

      {/* Navigation Header: Earthy Glass with Elevated Contrast */}
      <header className="border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-md sticky top-0 z-40 transition-colors shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/gramsetu-logo.png"
                alt="GramSetu - Connecting What Villages Have with What Villages Need"
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300/60 hidden sm:inline-block">
              Village Sharing
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Link to="/marketplace" className="hover:text-emerald-800 transition">Browse Equipment</Link>
            <Link to="/list-commodity" className="hover:text-emerald-800 transition">List Your Equipment</Link>
            <Link to="/my-rentals" className="hover:text-emerald-800 transition">My Rentals</Link>
            <Link to="/dashboard" className="hover:text-emerald-800 transition">Village Dashboard</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold px-4 py-2 text-stone-700 hover:text-emerald-800 transition"
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

      {/* Hero Section: Earthy Forest Tone with Radiant Dawn Glow */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-[#04140e] via-[#072a1d] to-[#0d3d28] text-white">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                MULTI-VILLAGE ASSET & HOURLY EQUIPMENT SHARING NETWORK
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Connecting What Villages Have with{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                  What Villages Need.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl font-light">
                Why take heavy loans or let valuable equipment sit idle? Share, rent, and borrow agricultural machinery, transport pickups, generators, event sound sets, and tools across multiple connected villages. Pay only for the exact hours you need.
              </p>

              {/* Quick Search Widget: Warm Earthy Sand Tone */}
              <form onSubmit={handleQuickSearch} className="surface p-3.5 rounded-2xl bg-[#fdfbf7] text-stone-900 shadow-float border border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-500 block px-2 pt-1">
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

                <div className="border-t sm:border-t-0 sm:border-l border-stone-200/80">
                  <label className="text-[10px] font-bold uppercase text-stone-500 block px-2 pt-1">
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
                  className="btn-primary text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Available Assets</span>
                </button>
              </form>

              {/* Trust bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-amber-300 font-bold text-base block">₹150 - ₹1200</span>
                  <span className="text-stone-300 text-[11px]">Fair Hourly Rates</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold text-base block">12 Categories</span>
                  <span className="text-stone-300 text-[11px]">Tractors, Trucks, Power</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold text-base block">Zero Brokers</span>
                  <span className="text-stone-300 text-[11px]">Direct Villager Connect</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold text-base block">Pay After Work</span>
                  <span className="text-stone-300 text-[11px]">Verified Village Trust</span>
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Hourly Cost Estimator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="surface p-6 sm:p-7 rounded-2xl bg-[#faf7f2] text-stone-900 shadow-float border border-stone-200/80 w-full max-w-md space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
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
                          className={`py-2 px-2.5 rounded-xl font-bold text-left border transition ${
                            calcType === item.key
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
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
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
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
                  <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 font-medium">Hourly Rent Total:</span>
                      <span className="text-2xl font-extrabold font-mono text-emerald-800">
                        ₹{rates[calcType] * calcHours}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Standard operator assistance & equipment setup included in this booking.
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

      {/* 4. REDESIGNED: "How Village Sharing Works" Section (Colorful, photo-rich, farmers sharing tools) */}
      <section className="py-20 bg-[#f7f4ee] border-b border-stone-200">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Community In Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a2f1f] tracking-tight">
              How Village Sharing Works
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Real villagers helping neighboring villages with shared machinery, collective tools, and zero middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Farmers sharing tools */}
            <div className="surface rounded-2xl bg-white border border-stone-200/80 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 bg-stone-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
                  alt="Farmers sharing tractors and equipment in field"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  1
                </span>
                <span className="absolute bottom-3 left-3 bg-[#072a1d]/90 text-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  DISCOVER NEARBY
                </span>
              </div>
              <div className="p-6 space-y-2.5 text-xs">
                <h3 className="font-bold text-stone-900 text-base">Browse Nearby Machines & Assets</h3>
                <p className="text-stone-600 leading-relaxed">
                  Look up tractors, water pumps, generators, shamiana event sets, or sprayers available right in your panchayat or neighboring blocks with transparent rates.
                </p>
                <div className="pt-2 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Real-time availability in your block</span>
                </div>
              </div>
            </div>

            {/* Card 2: Helping each other in fields */}
            <div className="surface rounded-2xl bg-white border border-stone-200/80 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 bg-stone-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                  alt="Villagers helping each other with harvest operations"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  2
                </span>
                <span className="absolute bottom-3 left-3 bg-[#072a1d]/90 text-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  HOURLY BOOKING
                </span>
              </div>
              <div className="p-6 space-y-2.5 text-xs">
                <h3 className="font-bold text-stone-900 text-base">Book by the Exact Hour</h3>
                <p className="text-stone-600 leading-relaxed">
                  Select your work date, start time, and duration needed. The total rental bill is automatically calculated with clear operator and fuel details.
                </p>
                <div className="pt-2 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Transparent pay-per-hour billing</span>
                </div>
              </div>
            </div>

            {/* Card 3: Working together in fields */}
            <div className="surface rounded-2xl bg-white border border-stone-200/80 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 bg-stone-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
                  alt="Community members collaborating in agricultural fields"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  3
                </span>
                <span className="absolute bottom-3 left-3 bg-[#072a1d]/90 text-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  DIRECT SETTLEMENT
                </span>
              </div>
              <div className="p-6 space-y-2.5 text-xs">
                <h3 className="font-bold text-stone-900 text-base">Work & Settle Directly</h3>
                <p className="text-stone-600 leading-relaxed">
                  The equipment arrives at your field or work site. Once your job is completed, settle with the machine owner directly with zero middleman deductions.
                </p>
                <div className="pt-2 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>100% peer-to-peer village trust</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REDESIGNED: "Live in Village Network" Section (Community-focused visuals, clear Ready to Hire badge) */}
      <section className="py-20 bg-[#faf8f4] border-b border-stone-200">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                Live in Village Network
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
                Featured Commodities Ready for Hire
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1">
                Verified community-owned assets ready for dispatch across neighboring village clusters.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-stone-200/80 shadow-xs"
            >
              <span>Explore All 12+ Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Mahindra 575 DI 45HP Tractor',
                category: 'Tractor & Tiller',
                rate: 450,
                village: 'Bamaloi Panchayat',
                img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
                feature: 'Rotavator + Operator Included',
                ready: true,
              },
              {
                title: 'Kirloskar 7.5 HP Diesel Water Pump',
                category: 'Water / Irrigation',
                rate: 150,
                village: 'Rengali Village',
                img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
                feature: '300m Pipe Included',
                ready: true,
              },
              {
                title: 'Mahindra Bolero Maxi Pickup Truck',
                category: 'Goods Transport',
                rate: 350,
                village: 'Lapanga Cluster',
                img: 'https://images.unsplash.com/photo-1586191582150-f80e035fc8e7?auto=format&fit=crop&w=800&q=80',
                feature: '1.5 Ton Deck + Driver Included',
                ready: true,
              },
              {
                title: 'Kirloskar 10 kVA Silent Generator',
                category: 'Power & Events',
                rate: 240,
                village: 'Khinda Village',
                img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
                feature: 'Soundproof + 3-Phase Power',
                ready: true,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="surface rounded-2xl bg-white border border-stone-200/90 shadow-card hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  
                  {/* Ready to Hire Status Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#092b1d] text-emerald-200 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ready to Hire
                  </span>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-amber-200 px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-white/20">
                    ₹{item.rate} / hr
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {item.village}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-stone-400">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">✓ {item.feature}</p>

                  <div className="pt-2 border-t border-stone-100">
                    <Link
                      to="/marketplace"
                      className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl shadow-xs"
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

      {/* 6. REDESIGNED: "List Your Equipment" & "Find Equipment" Cards Section */}
      <section className="py-20 bg-[#f4f0e6]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card A: List Your Equipment for Rent */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#072a1d] to-[#04160e] text-white shadow-xl border border-emerald-900/50 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-2xl shadow-sm">
                  🚜
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    FOR ASSET & MACHINE OWNERS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                    List Your Equipment for Rent
                  </h3>
                </div>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Have an idle tractor, pickup truck, water pump, generator, or event sound set? Put it on hourly rent for fellow villagers and generate steady monthly income.
                </p>

                <ul className="space-y-2 text-xs text-emerald-200">
                  <li className="flex items-center gap-2">✓ Keep 100% of your hourly rental rate</li>
                  <li className="flex items-center gap-2">✓ Set your own hours, operator & fuel options</li>
                  <li className="flex items-center gap-2">✓ Direct phone & WhatsApp inquiries from nearby villagers</li>
                </ul>
              </div>

              <div className="pt-4 relative z-10">
                <Link
                  to="/list-commodity"
                  className="btn-primary py-3.5 px-6 text-xs font-bold inline-flex items-center gap-2 rounded-xl shadow-glow-emerald w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your Equipment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card B: Find Equipment Nearby */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white text-stone-900 shadow-xl border border-stone-200 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
                  🔍
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                    FOR VILLAGERS & FARMERS
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
                    Find Equipment Nearby
                  </h3>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Need machinery for urgent field work, event celebrations, or goods transit? Discover verified assets across neighboring clusters ready for hire today.
                </p>

                <ul className="space-y-2 text-xs text-stone-600">
                  <li className="flex items-center gap-2">✓ Transparent hourly pricing with zero hidden charges</li>
                  <li className="flex items-center gap-2">✓ Fast dispatch across connected village clusters</li>
                  <li className="flex items-center gap-2">✓ Pay directly to the owner after your job is completed</li>
                </ul>
              </div>

              <div className="pt-4 relative z-10">
                <Link
                  to="/marketplace"
                  className="py-3.5 px-6 text-xs font-bold inline-flex items-center gap-2 rounded-xl border border-emerald-800 text-emerald-950 bg-emerald-50/60 hover:bg-emerald-100 transition shadow-xs w-full sm:w-auto justify-center"
                >
                  <Search className="w-4 h-4 text-emerald-800" />
                  <span>Find an Equipment Nearby</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: Nature-inspired Dark Emerald Wood Footer */}
      <footer className="bg-[#051c14] text-stone-300 text-xs py-14 border-t border-emerald-900/60">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <img
                src="/images/gramsetu-logo.png"
                alt="GramSetu Logo"
                className="h-16 w-auto object-contain bg-white/95 rounded-xl p-1.5 shadow-md"
              />
            </Link>
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

        <div className="max-w-[1440px] mx-auto px-6 pt-8 mt-8 border-t border-white/10 text-center text-stone-400 text-[11px] font-mono">
          © 2026 GRAM SETU • Connecting What Villages Have with What Villages Need • Multi-Village Community Sharing Network.
        </div>
      </footer>
    </div>
  );
};