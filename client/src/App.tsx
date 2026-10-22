import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VillageDirectoryPage } from './pages/VillageDirectoryPage';
import { VillageDetailPage } from './pages/VillageDetailPage';
import { ResourceInventoryPage } from './pages/ResourceInventoryPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ProbabilityAnalysisPage } from './pages/ProbabilityAnalysisPage';
import { PredictionResultsPage } from './pages/PredictionResultsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { MethodologyPage } from './pages/MethodologyPage';
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

          {/* Portal Application Routes (within Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/villages" element={<VillageDirectoryPage />} />
            <Route path="/villages/:id" element={<VillageDetailPage />} />
            <Route path="/inventory" element={<ResourceInventoryPage />} />
            <Route path="/assessments" element={<AssessmentPage />} />
            <Route path="/probability" element={<ProbabilityAnalysisPage />} />
            <Route path="/predictions" element={<PredictionResultsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
          </Route>

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
