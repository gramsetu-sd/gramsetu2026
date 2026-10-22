import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Calculator,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Database,
  Users,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-slate-800 flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="bg-amber-100/80 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 text-center">
        <strong>Academic Demonstration Platform:</strong> Developed for engineering project presentation
        applying <em>Mathematics-III Module 3: Basic Probability</em>. All sample village metrics are illustrative.
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              GS
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-forest-900">GRAM SETU</span>
              <p className="text-[11px] text-slate-500 font-medium">
                Probability-Based Rural Resource Requirement Prediction
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-forest-800 transition">How It Works</a>
            <a href="#features" className="hover:text-forest-800 transition">Features</a>
            <a href="#mathematics" className="hover:text-forest-800 transition">Probability Engine</a>
            <Link to="/methodology" className="hover:text-forest-800 transition">Methodology</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 shadow-xs hover:shadow transition flex items-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-forest-50/50 via-white to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100/70 border border-forest-200 text-forest-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                Mathematics-III • Module 3 Applied Probability
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Connecting What Villages Have with What Villages Need.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Understand community needs, estimate resource requirements, and support better rural development decisions through probability-based analysis and transparent mathematical modeling.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-forest-800 text-white font-semibold text-base hover:bg-forest-900 shadow-md transition flex items-center gap-2"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 transition"
                >
                  How It Works
                </a>
                <Link
                  to="/probability"
                  className="px-6 py-3 rounded-xl bg-sage-100 border border-sage-300 text-forest-900 font-semibold text-base hover:bg-sage-200 transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-forest-700" />
                  <span>Interactive Math Lab</span>
                </Link>
              </div>

              {/* Badges / Guarantees */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Bayes’ Updating Model</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Discrete PMF & CDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                  <span>Actionable Logistics Buffer</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xl relative space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Case Study Example</span>
                    <h2 className="text-lg font-bold text-slate-800">Bamaloi Village, Sambalpur</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800">
                    Active Assessment
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Baseline Shortage P(A)</span>
                    <span className="text-xl font-bold text-slate-800 mt-1 block">38.0%</span>
                    <span className="text-[11px] text-slate-400">38 of 100 historical cycles</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 font-medium block">P(Shortage | Drought)</span>
                    <span className="text-xl font-bold text-amber-900 mt-1 block">80.0%</span>
                    <span className="text-[11px] text-amber-700">Conditional probability</span>
                  </div>
                </div>

                <div className="p-4 bg-forest-50/60 rounded-xl border border-forest-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-forest-900">Expected Assistance E(X)</span>
                    <span className="font-bold text-forest-800">13.9 Households</span>
                  </div>
                  <div className="w-full bg-forest-200/50 rounded-full h-2 overflow-hidden">
                    <div className="bg-forest-700 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-forest-700">
                    <span>Variance: 213.8</span>
                    <span>Std Dev σ: 14.6 hh</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-forest-700" />
                    Supabase PostgreSQL Relational Schema
                  </span>
                  <Link to="/villages" className="text-forest-700 font-semibold hover:underline">
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-forest-700">End-to-End Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              The Seven Steps of Decision Support
            </h2>
            <p className="text-slate-600 mt-3 text-sm">
              GRAM SETU bridges field observations with rigorous mathematical probability to generate transparent, verifiable development recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { num: '01', title: 'Select Village', desc: 'Identify target gram panchayat and district' },
              { num: '02', title: 'Record Resources', desc: 'Audit water, healthcare, agriculture stocks' },
              { num: '03', title: 'Enter Observations', desc: 'Capture seasonal triggers and historical records' },
              { num: '04', title: 'Probability Analysis', desc: 'Calculate sample space, conditional & Bayes probabilities' },
              { num: '05', title: 'Understand Results', desc: 'Inspect PMF, CDF, expected value E(X) and variance' },
              { num: '06', title: 'Review Recommendations', desc: 'Examine threshold-triggered civic action plans' },
              { num: '07', title: 'Generate Report', desc: 'Export executive audit tables and PDF reports' },
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center relative group hover:border-forest-600 transition">
                <span className="text-xs font-black text-forest-700 block mb-2">{step.num}</span>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-1">{step.title}</h3>
                <p className="text-[11px] text-slate-500 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-forest-700">Core Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Designed for Non-Technical Administrators & University Modeling
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 mb-5">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Mathematics-III Probability Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full programmatic implementation of Sample Space, Conditional Probability, Bayes’ Theorem, PMF, CDF, Mean, and Variance with step-by-step arithmetic transparency.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Intuitive Data Visualizations</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Interactive Recharts for Resource Availability vs Demand, PMF bar distributions, CDF threshold step plots, and Gaussian continuous density curves.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Supabase PostgreSQL & RBAC</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Multi-role access control for Administrators, Village Coordinators, and Viewers. Supports both live Supabase DB and local Demonstration Store mode.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Section */}
      <section id="mathematics" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-forest-700">Module 3 Deep Dive</span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Strict Adherence to Engineering Probability Concepts
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                The engine never invents arbitrary risk scores. Every metric traces to foundational probability laws:
              </p>

              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span><strong>Basic Probability:</strong> P(A) = n(A) / N with denominator safeguards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span><strong>Conditional Probability:</strong> P(A|B) = P(A ∩ B) / P(B) with adverse weather conditioning.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span><strong>Bayes’ Theorem:</strong> P(Hypothesis | Evidence) updating prior belief upon observed shortage.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span><strong>Expected Value & Variance:</strong> E(X) = ∑ x·P(X=x), Var(X) = E(X²) - [E(X)]², σ = √Var(X).</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/methodology"
                  className="inline-flex items-center gap-2 text-forest-800 font-semibold hover:underline text-sm"
                >
                  <span>Read Full Mathematical Methodology</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-emerald-400 font-bold">engine/probability.ts</span>
                <span className="text-slate-400">TypeScript 5.7</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className="text-slate-400">// Bayes' Theorem Implementation</p>
                <p>const numerator = likelihoodBgivenA * priorA;</p>
                <p>const posterior = numerator / evidenceB;</p>
                <p className="text-slate-400 mt-2">// Discrete Distribution Moments</p>
                <p>const mean = sum(x * P(X=x)); // E(X)</p>
                <p>const variance = E(X²) - Math.pow(mean, 2);</p>
                <p>const stdDev = Math.sqrt(variance);</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg text-emerald-300 text-[11px]">
                ✓ All 7 automated mathematical tests passing (0 failures).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 text-slate-300 text-xs py-12 mt-auto border-t border-forest-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                GS
              </div>
              GRAM SETU
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Probability-Based Rural Resource Requirement Prediction Platform.
            </p>
            <p className="text-emerald-300/80 italic text-[11px]">
              “Connecting What Villages Have with What Villages Need.”
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Core Modules</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/dashboard" className="hover:text-white">Executive Dashboard</Link></li>
              <li><Link to="/villages" className="hover:text-white">Village Directory</Link></li>
              <li><Link to="/inventory" className="hover:text-white">Resource Inventory</Link></li>
              <li><Link to="/probability" className="hover:text-white">Probability Lab</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Documentation & Science</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/methodology" className="hover:text-white">Mathematics-III Syllabus</Link></li>
              <li><Link to="/predictions" className="hover:text-white">Prediction Methodology</Link></li>
              <li><Link to="/reports" className="hover:text-white">Formal Audit Export</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Case Study Location</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bamaloi Gram Panchayat, Rengali Tehsil, Sambalpur District, Odisha, India.
            </p>
            <div className="mt-3 p-2 rounded bg-white/5 border border-white/10 text-[10px] text-amber-200/80">
              Demonstration data only. Not an official government deployment.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-forest-900 text-center text-slate-500 text-[11px]">
          © 2026 GRAM SETU Project. University Engineering Capstone Presentation.
        </div>
      </footer>
    </div>
  );
};
