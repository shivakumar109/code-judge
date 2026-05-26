import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import submissionService from '../Services/submissionService.js';
import { Trophy, Award, Sparkles, Medal, User, Loader2, HelpCircle } from 'lucide-react';

export const Leaderboard = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const data = await submissionService.getLeaderboard();
        setUsers(data.leaderboard || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard statistics');
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [isAuthenticated, navigate]);

  // Podiums definitions for top 3
  const topThree = users.slice(0, 3);
  const otherUsers = users.slice(3);

  const getRankLevel = (points) => {
    if (points >= 1000) return { title: 'Grandmaster', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (points >= 500) return { title: 'Master', style: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    if (points >= 200) return { title: 'Expert', style: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    if (points >= 50) return { title: 'Pupil', style: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    return { title: 'Newbie', style: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-bold text-indigo-400 mb-4 tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Global Programming Arena
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Leaderboard Rankings
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Honoring the fastest compilation runs and most accurate code architectures.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-sm text-slate-400 font-medium">Processing developer standings...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl p-8">
          <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-355 font-semibold">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl p-8 text-slate-500">
          <User className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="font-semibold text-slate-400">No active coders</p>
          <p className="text-xs text-slate-500 mt-1">Register and solve problems to set up ranks!</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Top 3 Visual Podiums */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 max-w-4xl mx-auto">
              
              {/* 2nd Place Podium */}
              {topThree[1] && (
                <div className="order-2 md:order-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  <div className="mb-4 text-center">
                    <Medal className="h-10 w-10 text-slate-350 mx-auto filter drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]" />
                    <span className="font-bold text-slate-200 text-lg mt-2 block">{topThree[1].username}</span>
                    <span className="text-xs text-slate-400 block mt-1">{topThree[1].solvedCount || 0} Solved</span>
                  </div>
                  <div className="w-full bg-slate-900/60 border border-white/5 rounded-t-3xl p-6 text-center shadow-lg h-36 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-500/5 to-transparent" />
                    <span className="text-slate-300 font-extrabold text-4xl mt-2 block">2</span>
                    <span className="text-sm font-bold text-slate-450 bg-slate-955/40 py-1 rounded-xl block border border-white/5">{topThree[1].points} PTS</span>
                  </div>
                </div>
              )}

              {/* 1st Place Podium (Grand Champion) */}
              {topThree[0] && (
                <div className="order-1 md:order-2 flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="mb-4 text-center scale-110">
                    <Trophy className="h-12 w-12 text-amber-400 mx-auto filter drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse" />
                    <span className="font-extrabold text-white text-xl mt-2 block">{topThree[0].username}</span>
                    <span className="text-xs text-amber-300/80 font-semibold block mt-1">{topThree[0].solvedCount || 0} Solved</span>
                  </div>
                  <div className="w-full bg-gradient-to-t from-indigo-950/60 to-slate-900/60 border border-indigo-500/20 rounded-t-3xl p-6 text-center shadow-2xl h-44 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                    <span className="text-amber-400 font-extrabold text-5xl mt-2 block font-sans">1</span>
                    <span className="text-md font-extrabold text-amber-300 bg-amber-500/10 py-1.5 rounded-xl block border border-amber-500/20">{topThree[0].points} PTS</span>
                  </div>
                </div>
              )}

              {/* 3rd Place Podium */}
              {topThree[2] && (
                <div className="order-3 flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                  <div className="mb-4 text-center">
                    <Medal className="h-10 w-10 text-amber-700 mx-auto filter drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]" />
                    <span className="font-bold text-slate-200 text-lg mt-2 block">{topThree[2].username}</span>
                    <span className="text-xs text-slate-400 block mt-1">{topThree[2].solvedCount || 0} Solved</span>
                  </div>
                  <div className="w-full bg-slate-900/60 border border-white/5 rounded-t-3xl p-6 text-center shadow-lg h-30 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-700/5 to-transparent" />
                    <span className="text-amber-750 font-extrabold text-3xl mt-1 block">3</span>
                    <span className="text-xs font-bold text-amber-700 bg-slate-950/40 py-1 rounded-xl block border border-white/5">{topThree[2].points} PTS</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Remaining Rankings Table List */}
          {otherUsers.length > 0 && (
            <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 pl-6 w-20 text-center">Rank</th>
                      <th className="py-4 px-6">User Name</th>
                      <th className="py-4 px-6">Tier Level</th>
                      <th className="py-4 px-6 text-center w-36">Solved Tasks</th>
                      <th className="py-4 pr-6 text-right w-36">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                    {otherUsers.map((u, idx) => {
                      const rank = idx + 4;
                      const tier = getRankLevel(u.points);
                      return (
                        <tr key={u._id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="py-4 pl-6 text-center font-bold text-slate-400">
                            {rank}th
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">
                            {u.username}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block text-xxs font-bold uppercase tracking-wider rounded-md px-2 py-0.5 border ${tier.style}`}>
                              {tier.title}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-semibold text-indigo-400">
                            {u.solvedCount || 0}
                          </td>
                          <td className="py-4 pr-6 text-right font-extrabold text-amber-400">
                            {u.points} PTS
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Leaderboard;
