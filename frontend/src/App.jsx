import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './Store/authStore.js';
import Navbar from './Components/Navbar.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Workspace from './Components/Workspace.jsx';
import Leaderboard from './Components/Leaderboard.jsx';
import AdminPanel from './Components/AdminPanel.jsx';
import Profile from './Components/Profile.jsx';
import { Loader2 } from 'lucide-react';

// Route Guard: Require Authentication
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Route Guard: Require Admin Privileges
const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  const { fetchProfile } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Sync user profile statistics on first load if session cookie is present
  useEffect(() => {
    fetchProfile().finally(() => {
      setIsChecking(false);
    });
  }, [fetchProfile]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 shadow-md" />
        <span className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse">
          Initializing Secure Session...
        </span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Floating Glass Navbar */}
        <Navbar />

        {/* Core Page Contents */}
        <main className="flex-1 w-full relative z-10">
          <Routes>
            {/* Public/Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Guarded Student Routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/problems"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/problem/:id"
              element={
                <RequireAuth>
                  <Workspace />
                </RequireAuth>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <RequireAuth>
                  <Leaderboard />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />

            {/* Guarded Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
