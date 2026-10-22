import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Shield, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { loginDemo, setRole } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('coordinator');
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
            email,
            password,
            options: {
              data: { full_name: fullName, role: selectedRole },
            },
          });
          if (error) throw error;
          setSuccessMsg('Registration successful! Check your email or login directly.');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          navigate('/dashboard');
        }
      } else {
        // Demonstration Mode login
        loginDemo(selectedRole);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
            GS
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isRegistering ? 'Create Gram Setu Account' : 'Sign in to Gram Setu'}
        </h2>
        <p className="text-xs text-slate-500">
          Probability-Based Rural Resource Requirement Prediction Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200 space-y-6">
          {/* Quick Demo Personas */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Instant Presentation Personas (1-Click Login)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('administrator')}
                className="p-2.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 font-semibold text-center transition"
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('coordinator')}
                className="p-2.5 rounded-lg border border-forest-200 bg-forest-50 text-forest-900 hover:bg-forest-100 font-semibold text-center transition"
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('viewer')}
                className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 font-semibold text-center transition"
              >
                Viewer
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">or sign in with credentials</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
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
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Priyadarshini Sahu"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@gramsetu.org"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">Requested Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800"
                >
                  <option value="coordinator">Village Coordinator</option>
                  <option value="viewer">Viewer</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-lg font-semibold shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>{isRegistering ? 'Register Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-forest-800 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Need an account for field registration?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-forest-800 font-semibold hover:underline"
                >
                  Create account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
