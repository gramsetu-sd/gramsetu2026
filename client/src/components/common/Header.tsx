import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, pageTitle = 'Dashboard' }) => {
  const { role, user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left Side: Mobile Menu Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {pageTitle}
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider bg-forest-50 text-forest-800 px-2 py-0.5 rounded-full border border-forest-200">
                <Sparkles className="w-3 h-3 text-forest-700" />
                Math-III Engine
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Probability-Based Rural Resource Requirement Prediction
            </p>
          </div>
        </div>

        {/* Right Side: Quick Search, Role Badge, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search villages or resources..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-800 focus:bg-white transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/villages?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
              }}
            />
          </div>

          {/* Role badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize border bg-slate-50 text-slate-700 border-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'administrator'
                  ? 'bg-purple-600'
                  : role === 'coordinator'
                  ? 'bg-forest-600'
                  : 'bg-blue-500'
              }`}
            />
            <span>{role}</span>
          </div>

          {/* Notifications Button */}
          <Link
            to="/notifications"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition"
            title="Active Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-medium flex items-center justify-center text-xs shadow-xs">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-800 truncate">{user?.fullName}</p>
                  <p className="text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1 text-[10px] font-medium text-forest-700 uppercase tracking-wider">
                    Role: {role}
                  </div>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile & Preferences</span>
                </Link>

                {role === 'administrator' && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                    <span>Administration Panel</span>
                  </Link>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Reset / Switch User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
