import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, pageTitle = 'Dashboard' }) => {
  const { role, user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/villages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Sample live notifications preview for BDO / Officer
  const recentAlerts = [
    {
      id: '1',
      title: 'Bamaloi: Drinking Water P(Deficit) > 0.85',
      time: '12m ago',
      type: 'critical',
      desc: 'Bayesian posterior indicates high probability of tube well failure.',
    },
    {
      id: '2',
      title: 'Kumbhari: Storage buffer allocation pending',
      time: '45m ago',
      type: 'warning',
      desc: 'Crop harvesting surge requires temporary grain warehouse.',
    },
    {
      id: '3',
      title: 'Math-III Probability Engine Sync Complete',
      time: '2h ago',
      type: 'info',
      desc: 'All 100 sample points updated from live Supabase ledger.',
    },
  ];

  return (
    <header className="sticky top-0 z-30 surface-glass border-b border-emerald-900/10 transition-all">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left Side: Mobile Menu Button & Breadcrumb / Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-emerald-500/10 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-800 hidden sm:inline-block">
                Gram Setu
              </span>
              <span className="text-stone-300 hidden sm:inline">/</span>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                {pageTitle}
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-xs">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Math-III
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block truncate max-w-xs md:max-w-md">
              Rural Resource-Requirement Prediction Engine
            </p>
          </div>
        </div>

        {/* Right Side: Quick Search, Role Badge, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search with Cmd+K */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-56 lg:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search villages or resources..."
              className="w-full pl-9 pr-14 py-1.5 text-xs bg-stone-100/70 border border-stone-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition placeholder:text-stone-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <kbd className="kbd text-[10px]">⌘K</kbd>
            </div>
          </form>

          {/* Role pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-white/80 border-emerald-900/10 shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'administrator'
                  ? 'bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.5)]'
                  : role === 'coordinator'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(26,163,115,0.5)]'
                  : 'bg-sky-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              }`}
            />
            <span className="capitalize text-stone-700">{role}</span>
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="p-2 text-stone-600 hover:text-emerald-900 hover:bg-emerald-500/10 rounded-xl relative transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Civic Alerts & Notices"
              aria-label="Civic Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 surface-glass border border-emerald-900/10 rounded-2xl shadow-float p-3 z-50 text-xs animate-fade-up">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Civic Alerts & Action Notices</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    3 New
                  </span>
                </div>

                <div className="divide-y divide-stone-100 my-1">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="py-2.5 hover:bg-emerald-50/50 px-2 rounded-xl transition">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {alert.type === 'critical' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          ) : alert.type === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          )}
                          <span className="font-semibold text-stone-800">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">{alert.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 pl-5">{alert.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full flex items-center justify-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold py-1.5 rounded-xl hover:bg-emerald-50 transition"
                  >
                    <span>View all notifications</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-emerald-400/30">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 surface border border-emerald-900/10 rounded-2xl shadow-float py-2 z-50 text-xs animate-fade-up">
                <div className="px-4 py-2.5 border-b border-stone-100">
                  <p className="font-bold text-stone-900 truncate">{user?.fullName}</p>
                  <p className="text-stone-500 truncate text-[11px] font-mono">{user?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      Role: {role}
                    </span>
                  </div>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                >
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Profile & Preferences</span>
                </Link>

                {role === 'administrator' && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-purple-700 hover:bg-purple-50 transition"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                    <span>Administration Panel</span>
                  </Link>
                )}

                <div className="border-t border-stone-100 my-1"></div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Role / Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
