import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MobileContainer from './components/MobileContainer';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/Toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapTracker from './pages/MapTracker';
import HelperPublic from './pages/HelperPublic';
import History from './pages/History';
import Settings from './pages/Settings';

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
      
      <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/map/:id" element={<ProtectedRoute><MapTracker /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><MainLayout><History /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <MobileContainer>
          <ToastContainer />
          <AppRoutes />
        </MobileContainer>
      </HashRouter>
    </AuthProvider>
  );
}