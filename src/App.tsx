/**
 * MedVisit Connect – Main App Router
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Bundles } from './pages/pharma/Bundles';
import { Subordinates } from './pages/pharma/Subordinates';
import { BookVisit } from './pages/rep/BookVisit';
import { Analytics } from './pages/shared/Analytics';
import { ManageDoctors } from './pages/shared/ManageDoctors';
import { AllBookings } from './pages/shared/AllBookings';
import { Schedule } from './pages/doctor/Schedule';
import { Settings } from './pages/shared/Settings';
import { Notifications } from './pages/shared/Notifications';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bundles" element={<Bundles />} />
        <Route path="subordinates" element={<Subordinates />} />
        <Route path="book" element={<BookVisit />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="bookings" element={<AllBookings />} />
        <Route path="visits" element={<AllBookings />} />
        <Route path="history" element={<AllBookings />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p className="text-5xl font-bold mb-3">404</p>
            <p className="text-lg">Page not found</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}
