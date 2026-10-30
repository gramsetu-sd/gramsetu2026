import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, Phone, MapPin, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { loginDemo, setRole } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [village, setVillage] = useState('Bamaloi');
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'owner' | 'both'>('farmer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isRegistering) {
          const { error } = await supabase.auth.signUp({
            email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@gramsetu.in`,
            password,
            options: {
              data: { full_name: fullName, village, role: selectedRole },
            },
          });
          if (error) throw error;
          setSuccessMsg('Farmer account created successfully! Signing you in...');
          setTimeout(() => navigate('/marketplace'), 1000);
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@gramsetu.in`,
            password,
          });
          if (error) throw error;
          navigate('/marketplace');
        }
      } else {
        // Demonstration Mode login
        loginDemo('coordinator');
        navigate('/marketplace');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleType: 'renter' | 'owner') => {
    loginDemo(roleType === 'renter' ? 'coordinator' : 'administrator');
    navigate(roleType === 'renter' ? '/marketplace' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white animate-fade-up">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-950 text-white flex items-center justify-center font-bold text-xl shadow-glow-emerald">
            GS
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {isRegistering ? 'Join Village Network' : 'Villager Sign In'}
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          Connecting What Villages Have with What Villages Need
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="surface py-8 px-6 sm:px-8 shadow-card rounded-card border border-emerald-900/10 space-y-6">
          {/* Quick Demo Personas */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block text-center">
              1-Click Fast Villager Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('renter')}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100 font-bold text-center transition flex flex-col items-center gap-1 shadow-xs"
              >
                <span>🌾 Suresh Bhoi</span>
                <span className="text-[10px] font-normal text-emerald-700">Villager (Looking to Rent)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('owner')}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-900 font-bold text-center transition flex flex-col items-center gap-1 shadow-xs"
              >
                <span>🚜 Ramesh Patel</span>
                <span className="text-[10px] font-normal text-stone-600">Asset Owner (Machinery & Trucks)</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-stone-400 text-[11px] font-medium">
                or continue with credentials
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegistering && (
              <>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Suresh Bhoi"
                      className="input w-full pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Village / Gram Panchayat *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="input w-full pl-9 cursor-pointer font-semibold"
                    >
                      <option value="Bamaloi">📍 Bamaloi (Panchayat Center)</option>
                      <option value="Lapanga">📍 Lapanga (Transport & Machinery)</option>
                      <option value="Khinda">📍 Khinda (Energy & Agriculture)</option>
                      <option value="Rengali">📍 Rengali (Block Hub)</option>
                      <option value="Durgapali">📍 Durgapali (Command Area)</option>
                      <option value="Thebra">📍 Thebra (Highland Cluster)</option>
                      <option value="Katarbaga">📍 Katarbaga (Farming Cluster)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">I am joining as: *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('farmer')}
                      className={`p-2.5 rounded-lg border text-left font-bold text-[11px] transition ${
                        selectedRole === 'farmer'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-emerald-700'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      🌾 Villager (Renter)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('owner')}
                      className={`p-2.5 rounded-lg border text-left font-bold text-[11px] transition ${
                        selectedRole === 'owner'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-emerald-700'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      🚜 Asset Owner
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Mobile Number or Email *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="+91 98610 23412 or email"
                  className="input w-full pl-9 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input w-full pl-9 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{isRegistering ? 'Register as Farmer' : 'Sign in to Marketplace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-emerald-700 hover:underline font-bold"
            >
              {isRegistering
                ? 'Already have a farmer account? Sign in'
                : "New to Gram Setu? Register your farm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
