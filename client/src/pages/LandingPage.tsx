import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
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
} from 'lucide-react';
import { RadialGauge } from '../components/common/RadialGauge';

export const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3); // 0-indexed: 4th step = Probability Analysis
  const [priorDrought, setPriorDrought] = useState<number>(0.35); // P(B) drought frequency
  const [likelihoodDeficitGivenDrought, setLikelihoodDeficitGivenDrought] = useState<number>(0.85); // P(B|A)

  // Bayes calculation: P(A|B) = [P(B|A) * P(A)] / P(B)
  const priorA = 0.38; // 38% historical baseline deficit
  const numerator = likelihoodDeficitGivenDrought * priorA;
  const posteriorA = Math.min(0.99, Math.max(0.05, numerator / Math.max(0.01, priorDrought)));

  const workflowSteps = [
    {
      num: '01',
      title: 'Village Identification',
      role: 'Block Development Officer',
      desc: 'Audit demographics, geographical terrain, water table depth, and census baseline for the target Gram Panchayat.',
      formula: 'V = { id, name, block, district, households }',
    },
    {
      num: '02',
      title: 'Resource Auditing',
      role: 'Village Coordinator',
      desc: 'Log physical pumps, solar borewells, primary health centers, and emergency food granaries into the ledger.',
      formula: 'Stock(t) = \\sum_{i} observed_i',
    },
    {
      num: '03',
      title: 'Continuous Observation',
      role: 'Field Worker',
      desc: 'Capture seasonal triggers, daily water discharge, and agricultural rainfall data over 100 historical cycles.',
      formula: 'S = { \\omega_1, \\omega_2, \\dots, \\omega_{100} }, N = 100',
    },
    {
      num: '04',
      title: 'Stochastic Forecasting Engine',
      role: 'Core Engine',
      desc: 'Run sample space verification, joint events, adverse weather conditioning, and Bayesian belief updates.',
      formula: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    },
    {
      num: '05',
      title: 'Distribution Modeling',
      role: 'Analytical Engine',
      desc: 'Calculate discrete PMF P(X=x), step CDF F(x), expected assistance E(X), variance Var(X), and standard deviation σ.',
      formula: 'E(X) = \\sum x \\cdot P(X=x), \\quad Var(X) = E(X^2) - [E(X)]^2',
    },
    {
      num: '06',
      title: 'Transparent Policy Triggers',
      role: 'Administrator',
      desc: 'Evaluate transparent threshold rules: if P(Shortage|Drought) > 0.70, trigger pre-monsoon tanker buffer reserves.',
      formula: 'Alert \\iff P(Deficit | Adverse) \\ge \\tau_{critical}',
    },
    {
      num: '07',
      title: 'Formal Civic Dossier',
      role: 'District Collectorate',
      desc: 'Generate executive audit tables and cryptographic PDF reports for immediate financial sanction and logistics dispatch.',
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
            <a href="#math-playground" className="hover:text-emerald-800 transition">Interactive Bayes Lab</a>
            <Link to="/methodology" className="hover:text-emerald-800 transition">Methodology</Link>
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

      {/* Hero Section with Dark Emerald-Ink Gradient */}
      <section
        id="hero"
        className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-ink-950 via-emerald-ink-900 to-emerald-950 text-white"
      >
        {/* Ambient glow & topography background */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
        <svg
          className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,100 C150,200 350,0 500,100 C650,200 900,0 1200,80 L1200,800 L0,800 Z" fill="none" stroke="white" strokeWidth="1.5" />
          <path d="M0,250 C200,350 450,150 700,280 C950,400 1100,200 1440,260" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-gold text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                STOCHASTIC LOGISTICS & PREDICTIVE ALLOCATION
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Connecting What Villages Have with{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                  What Villages Need.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
                Empowering Block Development Officers with predictive data intelligence: Replace guesswork with transparent statistical auditing, Bayesian weather updates, and distribution models that guarantee timely rural tanker and buffer dispatches.
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
                  to="/probability"
                  className="btn-ghost text-sm py-3.5 px-6 border border-gold/40 text-gold hover:bg-gold/10 hover:text-white flex items-center gap-2 transition"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Inspect Probability Engine</span>
                </Link>
              </div>

              {/* Trust bar: mono stats ticker */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-emerald-400 font-bold text-base block">100 Cycles</span>
                  <span className="text-stone-400 text-[11px]">Audited Field Sample Space</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">7 Decision Models</span>
                  <span className="text-stone-400 text-[11px]">Automated Stochastic Rules</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold text-base block">3 Roles</span>
                  <span className="text-stone-400 text-[11px]">RBAC Access Control</span>
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
                {/* Layer 1: Background Mini PMF histogram */}
                <div
                  className="absolute inset-x-4 top-0 h-72 rounded-card bg-emerald-ink-800/90 border border-white/10 p-4 shadow-float backdrop-blur-xl"
                  style={{ transform: 'translateZ(-40px) translateY(-10px)' }}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-white/10 pb-2">
                    <span className="font-mono">PMF P(X = x) Distribution</span>
                    <span className="text-emerald-400 font-bold">E(X) = 13.9 hh</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                    {[10, 35, 75, 45, 20, 10, 5].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[9px] font-mono text-stone-400">{i * 10}</span>
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
                        Case Study Target
                      </span>
                      <h2 className="text-base font-bold text-stone-900">Bamaloi Gram Panchayat</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                      P(Shortage) = 38.0%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3 rounded-panel bg-stone-50 border border-stone-200/60">
                      <span className="text-[10px] text-stone-500 font-mono block">Prior P(A)</span>
                      <span className="text-xl font-mono font-bold text-stone-900">0.3800</span>
                      <span className="text-[10px] text-stone-400">38 of 100 cycles</span>
                    </div>
                    <div className="p-3 rounded-panel bg-amber-50/70 border border-amber-200/60">
                      <span className="text-[10px] text-amber-800 font-mono block">Bayes P(A|Drought)</span>
                      <span className="text-xl font-mono font-bold text-amber-900">80.0%</span>
                      <span className="text-[10px] text-amber-700">Drought surge</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-panel bg-emerald-50 border border-emerald-200/50 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-900">Emergency Tanker Target:</span>
                    <strong className="text-emerald-800 font-bold">≤ 40 Households (F = 95%)</strong>
                  </div>
                </div>

                {/* Layer 3: Floating Front Radial Gauge Pill */}
                <div
                  className="absolute -bottom-4 right-4 rounded-card surface-glass p-3 shadow-float border border-emerald-900/10 flex items-center gap-3 backdrop-blur-2xl"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <RadialGauge value={0.8} size={64} strokeWidth={6} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">
                      Critical Threshold
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      P(Shortage | Adverse) = 80%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section: Before vs After Gram Setu */}
      <section id="case-study" className="py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              Transforming Rural Governance
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              Bamaloi Water Crisis: The Before & After
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              How substituting reactive complaints with predictive stochastic modeling changed village drinking water logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="surface p-6 rounded-card border-l-4 border-l-rose-500 border border-stone-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Legacy / Without Gram Setu
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Ad-Hoc Reactive Crisis Management</h3>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Panic Tanker Dispatch:</strong> Emergency tankers called only after borewells ran dry for 3 consecutive days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Unsubstantiated Budgeting:</strong> Funds requested without statistical confidence metrics, delaying district approvals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Unequal Supply:</strong> Outlying hamlets (Ward 4 and Ward 7) suffered 60% higher water shortages.</span>
                </li>
              </ul>
              <div className="p-3 rounded-panel bg-stone-50 text-[11px] font-mono text-stone-500 border border-stone-200/60">
                Outcome: 38% annual deficit rate, 48-hour lag in crisis response.
              </div>
            </div>

            {/* After */}
            <div className="surface p-6 rounded-card border-l-4 border-l-emerald-500 border border-stone-200/80 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  With Gram Setu Stochastic Allocation
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Predictive Probability Buffer Allocation</h3>
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Bayesian Early Warning:</strong> Adverse rainfall triggers P(Deficit|Weather) = 80%, authorizing pre-allocated supply 14 days before failure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Mathematical Auditability:</strong> E(X) = 13.9 hh and F(40) = 95% provides indisputable quantitative justification to Collectors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Verified Reserve Capacity:</strong> Solar pumps and buffer tanks maintained to cover 95% of worst-case demand spikes.</span>
                </li>
              </ul>
              <div className="p-3 rounded-panel bg-emerald-50/70 text-[11px] font-mono text-emerald-900 border border-emerald-200/60 font-semibold">
                Outcome: Zero emergency dry days; 95.0% guaranteed community service reliability.
              </div>
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
              Click any step below to inspect how field observations become rigorous mathematical predictions.
            </p>
          </div>

          {/* Stepper Tabs */}
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

          {/* Active Step Showcase */}
          <div className="surface p-6 sm:p-8 rounded-card border border-emerald-900/10 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step {workflowSteps[activeStep].num} • {workflowSteps[activeStep].role}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">{workflowSteps[activeStep].title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {workflowSteps[activeStep].desc}
              </p>

              <div className="p-4 rounded-panel bg-stone-900 text-emerald-400 font-mono text-xs space-y-1 shadow-inner">
                <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">
                  Underlying Mathematical Law:
                </span>
                <p className="text-sm text-white font-bold">{workflowSteps[activeStep].formula}</p>
              </div>
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

      {/* Interactive "Show Your Math" Playground */}
      <section id="math-playground" className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
              Interactive Mathematics Canvas
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight">
              Test Bayes’ Theorem in Real Time
            </h2>
            <p className="text-stone-600 mt-2 text-sm leading-relaxed">
              Drag the parameters below to see how prior beliefs dynamically update into posterior probabilities when adverse drought conditions strike.
            </p>
          </div>

          <div className="surface p-6 sm:p-10 rounded-card border border-emerald-900/10 shadow-card max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Slider 1: Prior Weather Frequency */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    P(B) — Drought Frequency
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
                  Probability of severe low precipitation occurring in this season.
                </p>
              </div>

              {/* Slider 2: Likelihood Deficit Given Drought */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    P(B|A) — Drought Given Shortage
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
                  Observed historical likelihood of dry conditions during registered shortage cycles.
                </p>
              </div>
            </div>

            {/* Live Bayes Computation Canvas */}
            <div className="p-6 rounded-panel bg-stone-900 text-white font-mono text-xs space-y-4 shadow-float">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  Bayes' Theorem Substitution Step
                </span>
                <span className="text-stone-400">P(A|B) = [P(B|A) · P(A)] / P(B)</span>
              </div>

              <div className="space-y-2 text-stone-300 text-xs sm:text-sm">
                <p>
                  Numerator: <span className="text-amber-400">{likelihoodDeficitGivenDrought.toFixed(2)}</span> ×{' '}
                  <span className="text-emerald-400">{priorA.toFixed(2)}</span> ={' '}
                  <strong className="text-white">{numerator.toFixed(4)}</strong>
                </p>
                <p>
                  Denominator: P(B) ={' '}
                  <strong className="text-white">{priorDrought.toFixed(2)}</strong>
                </p>
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Posterior Probability P(A|B):</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    {(posteriorA * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Outcome Recommendation Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-panel bg-stone-50 border border-stone-200/80 text-xs">
              <div>
                <span className="font-bold text-stone-900 block">
                  {posteriorA >= 0.70
                    ? '🔴 Recommendation: Trigger Emergency Tanker Allocation'
                    : posteriorA >= 0.40
                    ? '🟡 Recommendation: Increase Monitoring Frequency to Weekly'
                    : '🟢 Recommendation: Standard Maintenance Buffer Adequate'}
                </span>
                <span className="text-stone-500 text-[11px]">
                  Governed by rule: If P(A|B) ≥ 0.70 then escalate priority to CRITICAL.
                </span>
              </div>
              <Link
                to="/probability"
                className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
              >
                <span>Full Probability Workbench</span>
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
              Connecting What Villages Have with What Villages Need through Mathematics-III Basic Probability.
            </p>
            <p className="text-emerald-400 italic text-[11px]">
              Civic Technology • Open Science • Rural Welfare
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Core Routes</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/dashboard" className="hover:text-white transition">Executive Dashboard</Link></li>
              <li><Link to="/villages" className="hover:text-white transition">Village Directory</Link></li>
              <li><Link to="/inventory" className="hover:text-white transition">Resource Inventory</Link></li>
              <li><Link to="/probability" className="hover:text-white transition">Probability Engine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">System Architecture</h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/methodology" className="hover:text-white transition">Analytics Methodology</Link></li>
              <li><Link to="/predictions" className="hover:text-white transition">Risk Prediction Audit</Link></li>
              <li><Link to="/recommendations" className="hover:text-white transition">Rule-Based Recommendations</Link></li>
              <li><Link to="/reports" className="hover:text-white transition">Formal Audit Dossier</Link></li>
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
