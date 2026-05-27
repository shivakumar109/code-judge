import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import useAdminStore from '../Store/adminStore.js';

// Modular Subcomponents Imports
import AdminSidebar from './AdminSidebar.jsx';
import AdminStatsCards from './AdminStatsCards.jsx';
import ProblemTable from './ProblemTable.jsx';
import UserTable from './UserTable.jsx';
import AddProblemForm from './AddProblemForm.jsx';

// Lucide Icons
import { 
  ShieldAlert, Settings, Users, Trophy, BookOpen, Clock, 
  Search, ShieldCheck, Mail, Calendar, Sparkles, AlertCircle 
} from 'lucide-react';

export const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    stats, fetchAdminProblems, fetchAdminLeaderboard, loading, error, clearState 
  } = useAdminStore();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | problems | add-problem | users | leaderboard

  // Audit Leaderboard Search State
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    clearState();
    fetchAdminProblems();
    fetchAdminLeaderboard();
  }, [isAuthenticated, user, navigate, fetchAdminProblems, fetchAdminLeaderboard, clearState]);

  // Derived Admin Leaderboard list
  const adminLeaderboard = useAdminStore.getState().users;
  const filteredLeaderboard = adminLeaderboard.filter((u) => {
    const searchVal = leaderboardSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchVal) ||
      u.username?.toLowerCase().includes(searchVal) ||
      u.email?.toLowerCase().includes(searchVal)
    );
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] w-full bg-[#080b11]">
      
      {/* 1. Left Sticky Administrative Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Right Main Audit Content Workspace */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-thin">
        
        {/* Top Audit Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Settings className="h-7 w-7 text-indigo-400 shrink-0" />
              Administrative Control Panel
            </h1>
            <p className="text-xs text-slate-450 mt-1 uppercase tracking-wider font-bold">
              Secure Auditing & System Operations Workspace
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 rounded-2xl px-4 py-2 self-start shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse-soft" />
            <span className="text-xxs font-bold text-slate-350 uppercase tracking-widest">Admin Authenticated</span>
          </div>
        </div>

        {/* Global Error Banner if any operations fail */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300 animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Render Views based on Sidebar Selection */}

        {/* VIEW: Dashboard (Overview) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Welcome banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/30 via-indigo-900/30 to-slate-900/30 border border-white/5 p-6 overflow-hidden">
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md">
                  <Sparkles className="h-7 w-7 animate-pulse-soft" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">System Diagnostics</h2>
                  <p className="text-xxs text-slate-450 uppercase tracking-wider font-bold mt-0.5">Real-time statistics & standing audits</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards Component */}
            <AdminStatsCards stats={stats} />

            {/* Performance Insights block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Box 1: Recent audit checks */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Audit and update algorithmic challenges or moderate system access settings instantly.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('add-problem')}
                    className="p-3 text-left rounded-2xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all text-xxs font-bold text-slate-350 cursor-pointer"
                  >
                    + Add New Problem
                  </button>
                  <button
                    onClick={() => setActiveTab('problems')}
                    className="p-3 text-left rounded-2xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all text-xxs font-bold text-slate-350 cursor-pointer"
                  >
                    Audit Problems List
                  </button>
                </div>
              </div>

              {/* Box 2: User management overview */}
              <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">User Standings Moderation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitor coder stats, solve ratios, total reward points, active/blocked accounts.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-3 text-left rounded-2xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all text-xxs font-bold text-slate-350 cursor-pointer"
                  >
                    Moderate User Statuses
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="p-3 text-left rounded-2xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all text-xxs font-bold text-slate-350 cursor-pointer"
                  >
                    Administrative Standings
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW: Problems List */}
        {activeTab === 'problems' && (
          <ProblemTable />
        )}

        {/* VIEW: Add Problem Form */}
        {activeTab === 'add-problem' && (
          <AddProblemForm />
        )}

        {/* VIEW: User Moderation Directory */}
        {activeTab === 'users' && (
          <UserTable />
        )}

        {/* VIEW: Administrative Leaderboard Standings Audit */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Search Audit standings */}
            <div className="relative bg-slate-900/30 border border-white/5 rounded-3xl p-4">
              <Search className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-500 self-center pointer-events-none mt-3" />
              <input
                type="text"
                value={leaderboardSearch}
                onChange={(e) => setLeaderboardSearch(e.target.value)}
                placeholder="Search auditor leaderboard rankings by coder username, name, or email..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input placeholder-slate-550 bg-slate-900/30 font-medium"
              />
            </div>

            {/* Standings Grid */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/35 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="py-4.5 pl-6 w-16 text-center">Rank</th>
                      <th className="py-4.5 px-4 w-16 text-center">Avatar</th>
                      <th className="py-4.5 px-4">Full Coder Name</th>
                      <th className="py-4.5 px-4">Username</th>
                      <th className="py-4.5 px-4">Email</th>
                      <th className="py-4.5 px-4 text-center w-28">Score (PTS)</th>
                      <th className="py-4.5 px-4 text-center w-28">Solved Tasks</th>
                      <th className="py-4.5 px-4 text-center w-36">Joined Date</th>
                      <th className="py-4.5 pr-6 text-center w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-350">
                    {filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-16 text-center text-slate-500 font-medium font-sans">
                          No standings match auditor query.
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.map((u, index) => (
                        <tr key={u._id} className={`hover:bg-slate-900/10 transition-colors ${!u.isActive ? 'opacity-55' : ''}`}>
                          
                          {/* Rank Position */}
                          <td className="py-4 pl-6 text-center font-extrabold text-indigo-400 font-sans">
                            #{index + 1}
                          </td>

                          {/* Avatar */}
                          <td className="py-4 px-4 text-center">
                            <div className="h-7 w-7 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 shadow mx-auto">
                              {u.profileImage ? (
                                <img src={u.profileImage} alt={u.username} className="h-full w-full object-cover" />
                              ) : (
                                <Users className="h-3.5 w-3.5 text-slate-650" />
                              )}
                            </div>
                          </td>

                          {/* Full Name */}
                          <td className="py-4 px-4 font-bold text-slate-200">
                            {u.name || 'Anonymous Coder'}
                          </td>

                          {/* Username */}
                          <td className="py-4 px-4 font-mono text-xs text-indigo-400">
                            @{u.username}
                          </td>

                          {/* Email (Full Visibility to Admin) */}
                          <td className="py-4 px-4 font-mono text-xs text-slate-455">
                            {u.email}
                          </td>

                          {/* Score */}
                          <td className="py-4 px-4 text-center font-extrabold text-amber-400 font-sans">
                            {u.points || 0} pts
                          </td>

                          {/* Solved Count */}
                          <td className="py-4 px-4 text-center font-extrabold text-purple-400 font-sans">
                            {u.solvedCount || 0}
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-4 text-center font-mono text-[10px] text-slate-455">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>

                          {/* Account Status Badge */}
                          <td className="py-4 pr-6 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold leading-5 ${
                              u.isActive
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                              {u.isActive ? 'Active' : 'Blocked'}
                            </span>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminPanel;
