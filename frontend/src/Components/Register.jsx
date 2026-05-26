import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { User, Mail, KeyRound, AlertTriangle, CheckCircle2, ArrowRight, Loader2, Code2, Users } from 'lucide-react';

export const Register = () => {
  const { register, loading, error, isAuthenticated, setError } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clear errors on load
  useEffect(() => {
    setError(null);
    setFormError('');
    setSuccessMsg('');
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, setError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError(null);
    setSuccessMsg('');

    const { firstName, lastName, username, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (username.trim().length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await register(firstName.trim(), lastName.trim(), username.trim(), email.trim(), password);
      setSuccessMsg('Account created successfully! Redirecting you to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Handled by store
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-lg z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Decorative background bloom */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-4 shadow-xl shadow-indigo-500/20 mb-4">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join the global arena of competitive programmers.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/5 glow-purple">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Feedback Alerts */}
            {formError && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* First Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="John"
                  disabled={loading || !!successMsg}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="Doe"
                  disabled={loading || !!successMsg}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="john_doe"
                  disabled={loading || !!successMsg}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                  placeholder="name@example.com"
                  disabled={loading || !!successMsg}
                />
              </div>
            </div>

            {/* Password Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
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
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                    placeholder="••••••••"
                    disabled={loading || !!successMsg}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
                    placeholder="••••••••"
                    disabled={loading || !!successMsg}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-indigo-500/35 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mt-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Redirection */}
          <div className="mt-6 text-center border-t border-white/5 pt-5 text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
