import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Database,
  Users,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Droplets,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { RadialGauge } from '../components/common/RadialGauge';

export const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3);
  const [priorDrought, setPriorDrought] = useState<number>(0.35); // drought frequency
  const [likelihoodDeficitGivenDrought, setLikelihoodDeficitGivenDrought] = useState<number>(0.85);

  // Bayes calculation: P(A|B) = [P(B|A) * P(A)] / P(B)
  const priorA = 0.38; // 38% historical baseline deficit
  const numerator = likelihoodDeficitGivenDrought * priorA;
  const posteriorA = Math.min(0.99, Math.max(0.05, numerator / Math.max(0.01, priorDrought)));

  const workflowSteps = [
    {
      num: '01',
      title: 'Village Identification',
      role: 'Block Development Officer',
      desc: 'Audit demographics, geographical terrain, water table depth, and population baseline for the target Gram Panchayat.',
      formula: 'V = { id, name, block, district, households }',
    },
    {
      num: '02',
      title: 'Resource Stock Auditing',
      role: 'Village Coordinator',
      desc: 'Log physical pumps, solar borewells, primary health centers, and emergency granaries into the ledger.',
      formula: 'Stock(t) = \\sum_{i} observed_i',
    },
    {
      num: '03',
      title: 'Field Surveys & Observations',
      role: 'Field Worker',
      desc: 'Capture seasonal triggers, daily water discharge, and agricultural rainfall data over 100 historical cycles.',
      formula: 'S = { \\omega_1, \\omega_2, \\dots, \\omega_{100} }, N = 100',
    },
    {
      num: '04',
      title: 'Early Warning & Risk Intelligence',
      role: 'Core Engine',
      desc: 'Check shortage frequency across seasons, weather impacts, and early warning failure signals to sharpen risk alerts.',
      formula: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    },
    {
      num: '05',
      title: 'Relief Planning & Buffer Sizing',
      role: 'Analytical Engine',
      desc: 'Calculate typical daily demand, normal day-to-day swing, and safe buffer coverage to avoid stockouts on bad days.',
      formula: 'E(X) = \\sum x \\cdot P(X=x), \\quad Var(X) = E(X^2) - [E(X)]^2',
    },
    {
      num: '06',
      title: 'Transparent Action Triggers',
      role: 'Administrator',
      desc: 'Evaluate transparent threshold rules: if shortage risk during a dry spell exceeds 70%, trigger pre-monsoon tanker reserves.',
      formula: 'Alert \\iff P(Deficit | Adverse) \\ge \\tau_{critical}',
    },
    {
      num: '07',
      title: 'Executive Planning Dossier',
      role: 'District Collectorate',
      desc: 'Generate executive planning tables, buffer targets, and official PDF reports for immediate financial sanction and dispatch.',
      formula: 'Dossier_{sanction} = \\{ \\mu, \\sigma, F(x_{cap}), P_{bayes} \\}',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top System Pilot Bar */}
      <div className="bg-emerald-950 border-b border-emerald-800/80 text-emerald-200 text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>Operational Pilot Deployment:</strong> Rural Infrastructure & Drinking Water Allocation System • Participating Gram Panchayats across Sambalpur & Jharsuguda Districts.
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
                  GovTech Core
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Connecting What Villages Have with What Villages Need
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <a href="#hero" className="hover:text-emerald-800 transition">Overview</a>
            <a href="#case-study" className="hover:text-emerald-800 transition">Case Study</a>
            <a href="#how-it-works" className="hover:text-emerald-800 transition">7-Step Workflow</a>
            <a href="#early-warning" className="hover:text-emerald-800 transition">Early Warning Simulator</a>
            <Link to="/how-it-works" className="hover:text-emerald-800 transition">How It Works</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
            >
              <span>Launch Planning Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-ink-950 via-emerald-ink-900 to-emerald-950 text-white"
      >
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-gold text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                EARLY WARNING & RESOURCE BUFFER INTELLIGENCE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Connecting What Villages Have with{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                  What Villages Need.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
                Empowering Block Development Officers with predictive field intelligence: Replace guesswork with transparent historical auditing, seasonal risk multipliers, and buffer-sizing calculations that guarantee timely tanker dispatches.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm py-3.5 px-6 flex items-center gap-2.5 shadow-glow-emerald"
                >
                  <span>Launch Planning Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/insights"
                  className="btn-ghost text-sm py-3.5 px-6 border border-gold/40 text-gold hover:bg-gold/10 hover:text-white flex items-center gap-2 transition"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Risk Insights</span>
                </Link>
              </div>

              {/* Trust bar */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-emerald-400 font-bold text-base block">100 Cycles</span>
                  <span className="text-stone-400 text-[11px]">Audited Field Sample Space</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">5 Risk Lenses</span>
                  <span className="text-stone-400 text-[11px]">Predictive Planning Models</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">3 Roles</span>
                  <span className="text-stone-400 text-[11px]">Role-Based Access Control</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">Live SQL</span>
                  <span className="text-stone-400 text-[11px]">Supabase Relational DB</span>
                </div>
              </div>
            </div>

            {/* Right: CSS 3D Floating Perspective Stack */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="relative w-full max-w-md h-[420px] transition-transform duration-500 hover:[transform:perspective(1000px)_rotateY(-4deg)_rotateX(2deg)]"
                style={{
                  perspective: '1200px',
                  transform: 'perspective(1200px) rotateY(-8deg) rotateX(4deg)',
                }}
              >
                {/* Layer 1: Background Demand Distribution */}
                <div
                  className="absolute inset-x-4 top-0 h-72 rounded-card bg-emerald-ink-800/90 border border-white/10 p-4 shadow-float backdrop-blur-xl"
                  style={{ transform: 'translateZ(-40px) translateY(-10px)' }}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-white/10 pb-2">
                    <span className="font-mono">Daily Demand Distribution</span>
                    <span className="text-emerald-400 font-bold">Typical: ~33 hh</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                    {[10, 35, 75, 45, 20, 10, 5].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] font-mono text-stone-400">{(i + 1) * 10}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer 2: Main Bamaloi Case Study Card */}
                <div
                  className="absolute inset-x-0 top-16 rounded-card bg-white text-stone-900 p-6 shadow-float border border-white/20 transition-transform duration-300 hover:translate-z-10"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                        Case Study Benchmark
                      </span>
                      <h2 className="text-base font-bold text-stone-900">Bamaloi Gram Panchayat</h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Rengali Block
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3 rounded-panel bg-stone-50 border border-stone-200/50">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Shortage Likelihood
                      </span>
                      <span className="text-2xl font-extrabold font-mono text-stone-900">38.0%</span>
                      <span className="text-[10px] text-stone-500 block">38 in 100 cycles</span>
                    </div>
                    <div className="p-3 rounded-panel bg-rose-50 border border-rose-200/50">
                      <span className="text-[10px] uppercase font-bold text-rose-600 block">
                        During Dry Spell
                      </span>
                      <span className="text-2xl font-extrabold font-mono text-rose-700">80.0%</span>
                      <span className="text-[10px] text-rose-600 font-medium block">2.1x Risk Surge</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-panel bg-emerald-50 border border-emerald-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                        Safe Recommended Buffer
                      </span>
                      <span className="text-xs font-semibold text-stone-700">
                        41 Households (Typical + 1 Swing)
                      </span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-200">
                      85.7% Safe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section id="case-study" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              Field Benchmark
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              Bamaloi Village Case Study
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              How predictive resource modeling converted chronic seasonal summer water deficits into a proactive, zero-runout logistics program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="surface p-6 sm:p-8 rounded-card border border-stone-200/80 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>The Historical Problem</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900">Reactive firefighting during summer dry spells</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Before GRAM SETU, relief tankers were dispatched only after villagers walked 3 km or local wells dried up completely. Block authorities had no way to anticipate which borewells were vulnerable or how many households would need daily tanker deliveries.
              </p>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Unpredicted 80% water shortage spikes during below-normal rainfall windows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>4 to 6 day administrative delay between well failure and tanker deployment.</span>
                </li>
              </ul>
            </div>

            <div className="surface p-6 sm:p-8 rounded-card border border-emerald-900/10 shadow-card space-y-4 bg-emerald-50/20">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>The GRAM SETU Solution</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900">Early warning triggers & data-backed buffer reserves</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                By tracking 100 survey cycles, GRAM SETU calculates the village's baseline shortage rate, flags the 2.1x dry spell multiplier, and prescribes a 41-household buffer reserve that covers 85.7% of deficit days.
              </p>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Early Warning: Borehole failure alert raises drought likelihood to 63.2%, mobilizing tankers 10 days early.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>Buffer Security: Contracting tankers for 20 to 35 kL/day covers 44% of daily volume swings safely.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Interactive Workflow */}
      <section id="how-it-works" className="py-20 bg-stone-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              The Seven Steps of Decision Support
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              Click any step below to inspect how field observations become clear operational forecasts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
            {workflowSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-panel text-left transition-all border ${
                  activeStep === idx
                    ? 'bg-white border-emerald-600 shadow-lift ring-2 ring-emerald-500/20'
                    : 'bg-stone-100/70 border-stone-200/70 hover:bg-white text-stone-500'
                }`}
              >
                <span
                  className={`text-xs font-mono font-bold block mb-1 ${
                    activeStep === idx ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                >
                  {step.num}
                </span>
                <span className="font-bold text-xs text-stone-900 block truncate">{step.title}</span>
                <span className="text-[10px] text-stone-400 block truncate">{step.role}</span>
              </button>
            ))}
          </div>

          <div className="surface p-6 sm:p-8 rounded-card border border-emerald-900/10 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Step {workflowSteps[activeStep].num} • {workflowSteps[activeStep].role}
              </span>
              <h3 className="text-2xl font-bold text-stone-900">{workflowSteps[activeStep].title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {workflowSteps[activeStep].desc}
              </p>

              <details className="group border border-emerald-900/10 rounded-xl p-3 bg-white/70">
                <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                  <span className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                    Show the math
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">Formal mathematical law</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-stone-100 font-mono text-xs text-emerald-900">
                  {workflowSteps[activeStep].formula}
                </div>
              </details>
            </div>

            <div className="lg:col-span-5 p-6 rounded-panel surface-glass border border-emerald-900/10 space-y-4 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Civic Impact in Field Deployment
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Block Development Officers inspect this stage directly inside the web interface without writing code or performing manual calculator arithmetic.
              </p>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <Link
                  to="/dashboard"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>View in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-stone-400 font-mono text-[11px]">Verified & Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Warning Simulator */}
      <section id="early-warning" className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              Interactive Simulator
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              Early Warning Simulator
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              Drag the sliders below to see how a verified field failure signal automatically sharpens regional drought likelihood.
            </p>
          </div>

          <div className="surface p-6 sm:p-10 rounded-card border border-emerald-900/10 shadow-card max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Drought Phase Frequency
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-800">
                    {(priorDrought * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={priorDrought}
                  onChange={(e) => setPriorDrought(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-stone-500">
                  Estimated baseline chance of a severe low-precipitation season.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Chance of Shortage During Drought
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-800">
                    {(likelihoodDeficitGivenDrought * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.99"
                  step="0.05"
                  value={likelihoodDeficitGivenDrought}
                  onChange={(e) => setLikelihoodDeficitGivenDrought(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-stone-500">
                  Observed historical likelihood of supply deficits when drought conditions are active.
                </p>
              </div>
            </div>

            {/* Plain Outcome Result */}
            <div className="surface-dark p-6 rounded-panel text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  Updated Early Warning Assessment
                </span>
                <span className="text-xs font-mono text-stone-400">Live Field Revision</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-stone-300">
                    With an early tube well failure reported, revised drought likelihood is:
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                    {(posteriorA * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    posteriorA >= 0.70 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {posteriorA >= 0.70 ? 'CRITICAL ALERT' : 'ELEVATED MONITORING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Collapsible Math Drawer */}
            <details className="group border border-emerald-900/10 rounded-xl p-4 bg-stone-50">
              <summary className="text-xs font-bold text-emerald-800 cursor-pointer hover:underline flex items-center justify-between list-none">
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-emerald-600" />
                  Show the math
                </span>
                <span className="text-[10px] font-mono text-stone-400">Evidence revision substitution</span>
              </summary>
              <div className="mt-3 pt-3 border-t border-stone-200 font-mono text-xs text-stone-700 space-y-2">
                <div>Formula: P(A|B) = [P(B|A) • P(A)] / P(B)</div>
                <div>
                  Substitution: [{likelihoodDeficitGivenDrought.toFixed(2)} • {priorA.toFixed(2)}] / {priorDrought.toFixed(2)} = {numerator.toFixed(4)} / {priorDrought.toFixed(2)} = {posteriorA.toFixed(4)} ({(posteriorA * 100).toFixed(1)}%)
                </div>
              </div>
            </details>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-panel bg-stone-50 border border-stone-200/80 text-xs">
              <div>
                <span className="font-bold text-stone-900 block">
                  {posteriorA >= 0.70
                    ? '🔴 Priority Action: Trigger Emergency Tanker Allocation'
                    : '🟡 Priority Action: Increase Field Survey Frequency'}
                </span>
                <span className="text-stone-500 text-[11px]">
                  Guided by transparent rule: If risk ≥ 70%, trigger emergency logistical reserve.
                </span>
              </div>
              <Link
                to="/insights"
                className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
              >
                <span>Full Risk Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-ink-950 text-stone-300 text-xs py-14 mt-auto border-t border-emerald-900/40">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-glow-emerald">
                GS
              </div>
              <span>GRAM SETU</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Connecting What Villages Have with What Villages Need through data-driven resource planning and early warning intelligence.
            </p>
            <p className="text-emerald-400 italic text-[11px]">
              Civic Technology • Open Science • Rural Welfare
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Core Routes</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/villages" className="hover:text-white transition">Villages</Link></li>
              <li><Link to="/inventory" className="hover:text-white transition">Resource Stock</Link></li>
              <li><Link to="/insights" className="hover:text-white transition">Risk Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Decision Support</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/predictions" className="hover:text-white transition">Forecasts</Link></li>
              <li><Link to="/recommendations" className="hover:text-white transition">Action Plan</Link></li>
              <li><Link to="/reports" className="hover:text-white transition">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Pilot Deployment</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Bamaloi Gram Panchayat, Rengali Block, Sambalpur District, Odisha, India.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-emerald-200">
              Operational pilot deployment across designated rural administrative blocks.
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 pt-8 mt-8 border-t border-white/10 text-center text-stone-500 text-[11px] font-mono">
          © 2026 GRAM SETU • Panchayati Raj & Rural Resource Management Platform. Cloudflare Pages + Render + Supabase Live.
        </div>
      </footer>
    </div>
  );
};
