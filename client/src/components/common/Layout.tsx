import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Executive Dashboard',
  '/villages': 'Village Directory',
  '/inventory': 'Resource Stock',
  '/assessments': 'Field Surveys',
  '/insights': 'Risk Insights',
  '/probability': 'Risk Insights',
  '/predictions': 'Resource Forecasts',
  '/recommendations': 'Action Plan',
  '/reports': 'Planning Reports',
  '/notifications': 'Alerts & Notices',
  '/settings': 'User Profile & Settings',
  '/admin': 'Administration & Governance',
  '/how-it-works': 'How It Works',
  '/methodology': 'How It Works',
};

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Find matching title or default
  const currentPath = '/' + location.pathname.split('/')[1];
  const pageTitle = PAGE_TITLES[currentPath] || 'Gram Setu Portal';

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Ambient background glow blooms */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed top-1/2 right-0 w-[600px] h-[600px] bg-emerald-700/5 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      {/* Demo Banner */}
      <DemoBanner />

      {/* Main app frame */}
      <div className="flex-1 flex overflow-hidden relative z-10 lg:p-3 lg:gap-3">
        {/* Floating Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Primary Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-900/10 shadow-card">
          <Header onToggleSidebar={() => setSidebarOpen(true)} pageTitle={pageTitle} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full transition-all">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
