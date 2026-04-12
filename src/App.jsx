// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import MobileContainer from './components/MobileContainer';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/Toast';
import HashRedirect from './components/HashRedirect';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapTracker from './pages/MapTracker';
import HelperPublic from './pages/HelperPublic';
import History from './pages/History';
import Settings from './pages/Settings';
// ... add other pages as needed

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = ({ children }) => (
  <>
    {children}
    <BottomNav />
  </>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <HashRedirect />
          <MobileContainer>
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/track/:code" element={<HelperPublic />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout><Dashboard /></MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/map/:id" element={
                <ProtectedRoute>
                  <MapTracker />
                </ProtectedRoute>
              } />

              <Route path="/history" element={
                <ProtectedRoute>
                  <MainLayout><History /></MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout><Settings /></MainLayout>
                </ProtectedRoute>
              } />
              {/* Add other protected routes here */}
            </Routes>
          </MobileContainer>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;