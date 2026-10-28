import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LucideIcon,
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
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  badgeGold?: boolean;
  count?: number;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('gramsetu_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('gramsetu_sidebar_collapsed', String(next));
  };

  const navGroups: SidebarGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Villages', to: '/villages', icon: MapPin },
      ],
    },
    {
      label: 'DATA',
      items: [
        { name: 'Inventory', to: '/inventory', icon: Package },
        { name: 'Assessments', to: '/assessments', icon: ClipboardList },
      ],
    },
    {
      label: 'ANALYSIS',
      items: [
        { name: 'Probability Engine', to: '/probability', icon: Calculator, badge: 'Predictive', badgeGold: true },
        { name: 'Predictions', to: '/predictions', icon: TrendingUp },
        { name: 'Recommendations', to: '/recommendations', icon: Lightbulb },
      ],
    },
    {
      label: 'OUTPUT',
      items: [
        { name: 'Reports', to: '/reports', icon: FileText },
        { name: 'Alerts', to: '/notifications', icon: Bell, count: 2 },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Methodology Whitepaper', to: '/methodology', icon: BookOpen },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Settings', to: '/settings', icon: Settings },
        ...(role === 'administrator'
          ? [{ name: 'Admin', to: '/admin', icon: Shield }]
          : []),
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Floating rounded-3xl dark emerald-ink card */}
      <aside
        className={`fixed top-3 bottom-3 left-3 z-50 bg-gradient-to-b from-emerald-ink-950 via-emerald-ink-900 to-emerald-ink-950 text-white flex flex-col rounded-3xl border border-white/10 shadow-float transition-all duration-300 ease-in-out lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'} overflow-hidden`}
        style={{
          boxShadow: '0 24px 48px -12px rgba(4, 20, 14, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Subtle Topographic Background Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Brand Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-white/10 relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            {/* 3D Beveled Emerald Tile */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-glow-emerald shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #3CC391 0%, #12805A 100%)',
                boxShadow: '0 4px 12px rgba(26, 163, 115, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              }}
            >
              GS
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                  <span>GRAM SETU</span>
                </div>
                <p className="text-[10px] text-emerald-300/80 leading-tight truncate">
                  Connecting village needs
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4 text-xs font-medium relative z-10">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] uppercase font-mono font-bold tracking-widest text-stone-400/80 mb-1">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center ${
                        collapsed ? 'justify-center px-2' : 'justify-between px-3'
                      } py-2 rounded-xl transition-all duration-150 group relative ${
                        isActive
                          ? 'bg-white/15 text-white font-semibold shadow-inner-dark-highlight'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Active glowing indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-400 shadow-glow-emerald" />
                          )}
                          <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                          {!collapsed && <span className="truncate">{item.name}</span>}
                        </div>

                        {!collapsed && (
                          <div className="flex items-center gap-1 shrink-0">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                                  item.badgeGold
                                    ? 'bg-gold/20 text-gold-light border border-gold/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.count !== undefined && item.count > 0 && (
                              <span className="text-[10px] font-mono font-bold w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                                {item.count}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer User Profile Card */}
        <div className="p-3 border-t border-white/10 bg-black/20 relative z-10">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.fullName.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">
                    {user?.fullName || 'Active Officer'}
                  </p>
                  <p className="text-[10px] text-emerald-300/80 capitalize truncate">
                    {role}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                {user?.fullName.charAt(0) || 'U'}
              </div>
            </div>
          )}

          {!collapsed && (
            <p className="text-[9px] font-mono text-stone-400/60 text-center mt-2 truncate">
              Sambalpur Cluster • Odisha
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
