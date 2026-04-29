import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ProfileAdmin from './pages/admin/ProfileAdmin';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import StudyAdmin from './pages/admin/StudyAdmin';
import ExperienceAdmin from './pages/admin/ExperienceAdmin';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/naim-engine-room" replace />;

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/naim-engine-room" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/system-control" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/system-control/profile" element={
        <ProtectedRoute>
          <ProfileAdmin />
        </ProtectedRoute>
      } />
      <Route path="/system-control/projects" element={
        <ProtectedRoute>
          <ProjectsAdmin />
        </ProtectedRoute>
      } />
      <Route path="/system-control/experience" element={
        <ProtectedRoute>
          <ExperienceAdmin />
        </ProtectedRoute>
      } />
      <Route path="/system-control/study" element={
        <ProtectedRoute>
          <StudyAdmin />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-base relative selection:bg-accent-violet/30">
          {/* Global Background Elements */}
          <div className="aurora-container">
            <div className="aurora-orb orb-1" />
            <div className="aurora-orb orb-2" />
            <div className="aurora-orb orb-3" />
          </div>
          <div className="bg-texture" />
          <div className="bg-grid" />
          
          <AppRoutes />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'glass-toast',
              style: {
                background: 'rgba(5, 5, 8, 0.8)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '16px 24px',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: { primary: '#7C3AED', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#EC4899', secondary: '#FFFFFF' },
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
