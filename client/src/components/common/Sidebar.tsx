import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Package,
  ClipboardList,
  Calculator,
  TrendingUp,
  Lightbulb,
  FileText,
  Bell,
  Settings,
  Shield,
  BookOpen,
  Home,
  X,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Village Directory', to: '/villages', icon: MapPin },
    { name: 'Resource Inventory', to: '/inventory', icon: Package },
    { name: 'Requirement Assessment', to: '/assessments', icon: ClipboardList },
    { name: 'Probability Engine', to: '/probability', icon: Calculator, badge: 'Math-III' },
    { name: 'Prediction Results', to: '/predictions', icon: TrendingUp },
    { name: 'Recommendations', to: '/recommendations', icon: Lightbulb },
    { name: 'Reports & Export', to: '/reports', icon: FileText },
    { name: 'Civic Alerts', to: '/notifications', icon: Bell },
    { name: 'Mathematical Methodology', to: '/methodology', icon: BookOpen },
    { name: 'User Profile & Settings', to: '/settings', icon: Settings },
  ];

  if (role === 'administrator') {
    navigation.push({ name: 'Admin Panel', to: '/admin', icon: Shield });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1b4332] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
              GS
            </div>
            <div>
              <div className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                GRAM SETU
              </div>
              <p className="text-[10px] text-emerald-200/80 tracking-tight leading-tight">
                Rural Resource Decision Support
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200/60 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tagline */}
        <div className="px-6 py-2.5 bg-black/15 text-[11px] text-emerald-100/70 border-b border-white/5 italic">
          “Connecting What Villages Have with What Villages Need.”
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1.5 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold shadow-xs'
                      : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-emerald-300" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Public Landing Link & Footer Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-emerald-100 transition mb-3"
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>Public Landing Page</span>
          </Link>
          <div className="text-[11px] text-emerald-200/60 leading-relaxed">
            University Engineering Project Demo
            <br />
            Sambalpur Cluster • Odisha
          </div>
        </div>
      </aside>
    </>
  );
};
