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
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute>
          <ProfileAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/projects" element={
        <ProtectedRoute>
          <ProjectsAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/experience" element={
        <ProtectedRoute>
          <ExperienceAdmin />
        </ProtectedRoute>
      } />
      <Route path="/admin/study" element={
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
        <div className="selection:bg-accent-primary/30 selection:text-accent-primary">
          <AppRoutes />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#13131F',
                color: '#F0F0FF',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
