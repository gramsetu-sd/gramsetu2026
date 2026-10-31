import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Database,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { signInWithPassword, signUp, loginDemo, isSupabaseLive, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Switch between 'login' and 'register'
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Bamaloi');
  const [selectedRole, setSelectedRole] = useState<UserRole>('coordinator');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await signInWithPassword(emailOrPhone, password);
      if (error) {
        if (error.toLowerCase().includes('email not confirmed')) {
          setErrorMsg(
            'Email not confirmed yet. In your Supabase Dashboard: go to Authentication -> Providers -> Email and uncheck "Confirm email", or click "Confirm User" in the Users table.'
          );
        } else if (error.toLowerCase().includes('invalid login credentials')) {
          setErrorMsg('Invalid email or password. Please verify your credentials or create a new account.');
        } else {
          setErrorMsg(error);
        }
      } else {
        setSuccessMsg('Signed in successfully! Redirecting to marketplace...');
        setTimeout(() => {
          navigate('/marketplace');
        }, 600);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const { error, message } = await signUp({
        email: emailOrPhone,
        password,
        fullName,
        phone,
        village,
        role: selectedRole,
      });

      if (error) {
        if (error.toLowerCase().includes('user already registered')) {
          setErrorMsg('An account with this email already exists. Please sign in instead.');
        } else {
          setErrorMsg(error);
        }
      } else {
        setSuccessMsg(message || 'Account registered successfully!');
        if (message?.includes('check your email')) {
          // Requires email confirmation
        } else {
          setTimeout(() => {
            navigate('/marketplace');
          }, 800);
        }
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (roleType: 'renter' | 'owner' | 'admin') => {
    if (roleType === 'renter') {
      loginDemo('coordinator', 'Suresh Bhoi (Farmer Renter)', 'Bamaloi');
      navigate('/marketplace');
    } else if (roleType === 'owner') {
      loginDemo('administrator', 'Ramesh Patel (Asset Owner)', 'Lapanga');
      navigate('/dashboard');
    } else {
      loginDemo('administrator', 'Shri R. K. Mohapatra (District Admin)', 'Sambalpur');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-amber-200 selection:text-emerald-950 animate-fade-up">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <img
            src="/images/gramsetu-logo.png"
            alt="Gram Setu"
            className="h-14 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {activeTab === 'login' ? 'Welcome Back to Gram Setu' : 'Join Gram Setu Village Network'}
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          Connecting What Villages Have with What Villages Need
        </p>

        {/* Supabase Connection Status Pill */}
        <div className="pt-1 flex items-center justify-center">
          {isSupabaseLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Supabase PostgreSQL Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Demo Mode Active (Add keys to client/.env for Supabase)</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="surface py-7 px-6 sm:px-8 shadow-card rounded-2xl border border-emerald-900/10 space-y-6 bg-white">
          {/* Tab Selector: Sign In vs Create Account */}
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition ${
                activeTab === 'register'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Notice</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="farmer@gramsetu.in or +91 98610 23412"
                    className="input w-full pl-9 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700">Password *</label>
                  <span className="text-[10px] text-stone-400 font-mono">Min 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input w-full pl-9 pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Gram Setu</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Test Personas */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block text-center">
                  1-Click Instant Evaluation Logins
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('renter')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100 font-bold text-center transition flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>🌾 Suresh</span>
                    <span className="text-[9px] font-normal text-emerald-700">Renter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('owner')}
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 font-bold text-center transition flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>🚜 Ramesh</span>
                    <span className="text-[9px] font-normal text-stone-600">Asset Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 font-bold text-center transition flex flex-col items-center gap-0.5 shadow-xs"
                  >
                    <span>🏛️ Admin</span>
                    <span className="text-[9px] font-normal text-purple-700">District HQ</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Ramesh Patel or Priyadarshini Sahu"
                    className="input w-full pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="user@example.com"
                      className="input w-full pl-9 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mobile Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98610 23412"
                      className="input w-full pl-9 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Gram Panchayat / Village *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="input w-full pl-9 cursor-pointer font-semibold"
                  >
                    <option value="Bamaloi">📍 Bamaloi (Panchayat Center)</option>
                    <option value="Lapanga">📍 Lapanga (Machinery & Transport Hub)</option>
                    <option value="Khinda">📍 Khinda (Energy & Agriculture)</option>
                    <option value="Rengali">📍 Rengali (Block Center)</option>
                    <option value="Durgapali">📍 Durgapali (Canal Irrigated)</option>
                    <option value="Thebra">📍 Thebra (Highland Crop Cluster)</option>
                    <option value="Katarbaga">📍 Katarbaga (Farming Cluster)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Account Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('coordinator')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition flex flex-col items-center gap-0.5 ${
                      selectedRole === 'coordinator'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>🌾 Villager</span>
                    <span className="text-[9px] font-normal text-stone-500">Rent Assets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('administrator')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition flex flex-col items-center gap-0.5 ${
                      selectedRole === 'administrator'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>🚜 Asset Owner</span>
                    <span className="text-[9px] font-normal text-stone-500">List Machinery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('viewer')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition flex flex-col items-center gap-0.5 ${
                      selectedRole === 'viewer'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>👁️ Observer</span>
                    <span className="text-[9px] font-normal text-stone-500">Public Viewer</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="input w-full pl-9 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="input w-full pl-9 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Free Farmer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switcher */}
          <div className="text-center pt-2 border-t border-stone-100">
            {activeTab === 'login' ? (
              <p className="text-xs text-stone-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-xs text-stone-500 hover:text-emerald-800 transition font-medium"
          >
            ← Return to Village Sharing Home
          </Link>
        </div>
      </div>
    </div>
  );
};
