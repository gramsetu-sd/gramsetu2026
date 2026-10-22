import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Executive Dashboard',
  '/villages': 'Village Directory',
  '/inventory': 'Resource Inventory & Availability',
  '/assessments': 'Resource Requirement Assessment',
  '/probability': 'Probability Analysis Engine',
  '/predictions': 'Prediction Results & Risk Assessment',
  '/recommendations': 'Actionable Recommendations',
  '/reports': 'Reports & Formal Export',
  '/notifications': 'Civic Alerts & Notices',
  '/settings': 'User Profile & Preferences',
  '/admin': 'Administration & Governance Panel',
  '/methodology': 'Mathematical Methodology (Module 3)',
};

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Find matching title or default
  const currentPath = '/' + location.pathname.split('/')[1];
  const pageTitle = PAGE_TITLES[currentPath] || 'Gram Setu Portal';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoBanner />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header onToggleSidebar={() => setSidebarOpen(true)} pageTitle={pageTitle} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
