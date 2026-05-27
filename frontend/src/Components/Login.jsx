import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { KeyRound, User, AlertTriangle, ArrowRight, Loader2, Code2 } from 'lucide-react';

export const Login = () => {
  const { login, loading, error, isAuthenticated, setError, user } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [formError, setFormError] = useState('');

  // Clear errors on load and redirect if already authenticated
  useEffect(() => {
    setError(null);
    setFormError('');
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, setError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError(null);

    const { emailOrUsername, password } = formData;

    if (!emailOrUsername.trim() || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const res = await login(emailOrUsername, password);
      if (res?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Handled by store
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Decorative ambient bloom */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-4 shadow-xl shadow-indigo-500/20 mb-4 animate-pulse">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to compile, submit, and benchmark your solutions.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/5 glow-indigo">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Global Errors */}
            {(formError || error) && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                <span>{formError || error}</span>
              </div>
            )}

            {/* Email or Username Field */}
            <div className="space-y-2">
              <label htmlFor="emailOrUsername" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="john_doe or john@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-indigo-500/35 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Redirection */}
          <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Register Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
