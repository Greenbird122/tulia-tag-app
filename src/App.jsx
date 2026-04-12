import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MobileContainer from './components/MobileContainer';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/Toast';
import HashRedirect from './components/HashRedirect';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import MapTracker from './pages/MapTracker';
import HelperPublic from './pages/HelperPublic';
import History from './pages/History';

import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import AddDevice from './pages/AddDevice';
import { ThemeProvider } from './context/ThemeContext';   // ← NEW

import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/track/:code" element={<HelperPublic />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/error" element={<ErrorPage />} />

      <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/map/:id" element={<ProtectedRoute><MapTracker /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><MainLayout><History /></MainLayout></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
<Route path="/privacy-security" element={<ProtectedRoute><PrivacySecurity /></ProtectedRoute>} />
<Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
<Route path="/add-device" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
    </Routes>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>                     {/* ← NEW WRAPPER */}
        <HashRouter>
          <HashRedirect />
          <MobileContainer>
            <ToastContainer />
            <AppRoutes />
          </MobileContainer>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}