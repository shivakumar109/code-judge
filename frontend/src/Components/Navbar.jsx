import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { Terminal, Shield, ChevronDown, LogOut, Trophy, Menu, X, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight" onClick={() => setMobileMenuOpen(false)}>
          <div className="rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 shadow-lg shadow-indigo-500/30">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold tracking-wider">
            Code<span className="text-indigo-400">Judge</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {(!isAuthenticated || user?.role !== 'admin') && (
            <>
              <Link
                to="/problems"
                className={`transition-colors duration-200 text-sm ${
                  isActive('/problems') || isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Problems
              </Link>
              <Link
                to="/leaderboard"
                className={`transition-colors duration-200 text-sm ${
                  isActive('/leaderboard') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Leaderboard
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 transition-colors duration-200 text-sm ${
                isActive('/admin') ? 'text-violet-400 font-semibold' : 'text-slate-300 hover:text-violet-350'
              }`}
            >
              <Shield className="h-4 w-4 text-violet-400" />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* User Points Badge */}
              {user?.role !== 'admin' && (
                <div className="flex items-center gap-1.5 rounded-full bg-slate-900/60 border border-amber-500/20 px-3.5 py-1.5 shadow-sm text-xs sm:text-sm">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="font-bold text-amber-300">{user?.points || 0} pts</span>
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl bg-slate-800/40 border border-white/5 pl-2.5 pr-2 py-1.5 hover:bg-slate-800/80 transition-all focus:outline-none cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 shrink-0 shadow-md">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user?.username} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs">
                        {user?.username?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-slate-200">{user?.username}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-[#0c0f17] p-2 shadow-2xl border border-white/10 ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-3.5 py-2.5 border-b border-white/5 text-xxs text-slate-450 font-bold uppercase tracking-wider">
                      Signed in as <span className="text-slate-200 block truncate normal-case mt-0.5 font-semibold text-xs">{user?.email}</span>
                    </div>

                    {isAuthenticated && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 hover:bg-indigo-500/10 hover:text-indigo-200 transition-colors mt-1 font-semibold"
                      >
                        <User className="h-4 w-4 text-indigo-400 shrink-0" />
                        My Profile
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 hover:bg-violet-500/10 hover:text-violet-200 transition-colors mt-1 font-semibold"
                      >
                        <Shield className="h-4 w-4 text-violet-400 shrink-0" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors mt-1 text-left font-bold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile responsive drawer overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full bg-[#0b0f19]/95 border-b border-white/5 p-6 animate-in fade-in slide-in-from-top-4 duration-300 z-40 space-y-4 shadow-2xl backdrop-blur-lg">
          <div className="flex flex-col gap-4 font-semibold text-md">
            {(!isAuthenticated || user?.role !== 'admin') && (
              <>
                <Link
                  to="/problems"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`pb-2 border-b border-white/5 ${isActive('/problems') || isActive('/') ? 'text-indigo-400' : 'text-slate-300'}`}
                >
                  Problems
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`pb-2 border-b border-white/5 ${isActive('/leaderboard') ? 'text-indigo-400' : 'text-slate-300'}`}
                >
                  Leaderboard
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b border-white/5 flex items-center gap-1.5 ${isActive('/profile') ? 'text-indigo-400 font-semibold' : 'text-slate-350'}`}
              >
                <User className="h-4 w-4 text-indigo-400" />
                My Profile
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b border-white/5 flex items-center gap-1.5 ${isActive('/admin') ? 'text-violet-400' : 'text-slate-300'}`}
              >
                <Shield className="h-4 w-4 text-violet-400" />
                Admin Panel
              </Link>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-xl border border-white/10 py-2.5 text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-white shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
