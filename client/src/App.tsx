import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CommodityMarketplacePage } from './pages/CommodityMarketplacePage';
import { ListCommodityPage } from './pages/ListCommodityPage';
import { MyRentalsPage } from './pages/MyRentalsPage';
import { VillageDirectoryPage } from './pages/VillageDirectoryPage';
import { VillageDetailPage } from './pages/VillageDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Farmer Portal Application Routes (within Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/marketplace" element={<CommodityMarketplacePage />} />
            <Route path="/list-commodity" element={<ListCommodityPage />} />
            <Route path="/my-rentals" element={<MyRentalsPage />} />
            <Route path="/villages" element={<VillageDirectoryPage />} />
            <Route path="/villages/:id" element={<VillageDetailPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Backward-compatible redirects */}
            <Route path="/inventory" element={<Navigate to="/marketplace" replace />} />
            <Route path="/assessments" element={<Navigate to="/marketplace" replace />} />
            <Route path="/insights" element={<Navigate to="/dashboard" replace />} />
            <Route path="/probability" element={<Navigate to="/dashboard" replace />} />
            <Route path="/methodology" element={<Navigate to="/how-it-works" replace />} />
            <Route path="/predictions" element={<Navigate to="/dashboard" replace />} />
            <Route path="/recommendations" element={<Navigate to="/dashboard" replace />} />
            <Route path="/reports" element={<Navigate to="/my-rentals" replace />} />
          </Route>

          {/* Fallback to Marketplace */}
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
