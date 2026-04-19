// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import MobileContainer from './components/MobileContainer';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/Toast';
import SplashScreen from './components/SplashScreen';
import SafeIcon from './components/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Pages
import Login from './pages/Login';
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
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import ErrorPage from './pages/ErrorPage';
import About from './pages/About';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = (event) => {
      if (location.pathname === '/login') return;

      event.preventDefault();

      if (location.pathname.startsWith('/map/')) {
        navigate('/', { replace: true });
      } else if (location.pathname !== '/') {
        navigate(-1);
      } else {
        if (window.confirm("Are you sure you want to exit Tulia Tag?")) {
          window.close();
        }
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [location, navigate]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <SafeIcon icon={FiIcons.FiLoader} className="animate-spin text-4xl text-brand-500" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    {children}
    <BottomNav />
  </div>
);

function AppContent() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <MobileContainer>
      <ToastContainer />
      <BackButtonHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/track/:code" element={<HelperPublic />} />
        <Route path="/about" element={<About />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/map/:id" element={<ProtectedRoute><MapTracker /></ProtectedRoute>} />
        <Route path="/history" element={
          <ProtectedRoute><MainLayout><History /></MainLayout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>
        } />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/privacy-security" element={<ProtectedRoute><PrivacySecurity /></ProtectedRoute>} />
        <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
        <Route path="/add-device" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}