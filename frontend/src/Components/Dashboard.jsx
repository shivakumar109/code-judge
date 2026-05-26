import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProblemStore } from '../Store/problemStore.js';
import { useAuthStore } from '../Store/authStore.js';
import { Search, Filter, CheckCircle, HelpCircle, Trophy, BarChart } from 'lucide-react';

export const Dashboard = () => {
  const { 
    problems, 
    loading, 
    fetchProblems, 
    searchQuery, 
    difficultyFilter, 
    tagFilter, 
    setFilters,
    clearFilters
  } = useProblemStore();

  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProblems();
    fetchProfile();
  }, [fetchProblems, fetchProfile]);

  const handleSearchChange = (e) => {
    setFilters({ searchQuery: e.target.value });
  };

  const handleDifficultyChange = (e) => {
    setFilters({ difficultyFilter: e.target.value });
  };

  const handleTagClick = (tag) => {
    if (tagFilter.toLowerCase() === tag.toLowerCase()) {
      setFilters({ tagFilter: '' }); // Toggle off
    } else {
      setFilters({ tagFilter: tag });
    }
  };

  // Perform client-side filtering on problems list
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = searchQuery
      ? problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesDifficulty = difficultyFilter
      ? problem.difficulty === difficultyFilter
      : true;
    const matchesTag = tagFilter
      ? problem.tags?.some(t => t.toLowerCase() === tagFilter.toLowerCase())
      : true;
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const tags = [
    "Arrays", "Strings", "Math", "Sorting", "Searching", "Recursion",
    "Stack", "Queue", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Greedy"
  ];

  // Calculate statistics based on fetched active problems
  const totalCount = problems.length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
  const solvedCount = user?.solvedProblems?.length || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Welcome Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/40 to-slate-900/40 border border-white/5 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent blur-2xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hello, <span className="text-indigo-400">{user?.username || 'Guest Coder'}</span>!
            </h1>
            <p className="mt-2 text-slate-350 max-w-xl text-sm leading-relaxed">
              Challenge yourself, master algorithms, and scale the ranks. Solve hard problems to earn top points!
            </p>
          </div>
          {user && (
            <div className="flex gap-4 sm:gap-6 bg-slate-950/40 border border-white/5 rounded-2xl p-4 shrink-0 shadow-lg">
              <div className="text-center">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Solved</span>
                <span className="text-2xl font-bold text-indigo-400 mt-1 block">{solvedCount}</span>
              </div>
              <div className="w-px bg-white/5" />
              <div className="text-center">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Score</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">{user.points || 0}</span>
              </div>
              <div className="w-px bg-white/5" />
              <div className="text-center">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Rank</span>
                <span className="text-2xl font-bold text-purple-400 mt-1 block">Level {Math.floor((user.points || 0) / 100) + 1}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout: Main Problem List and Sidebar Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Problems Table Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/30 border border-white/5 rounded-2xl p-4">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search problem title or description..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input placeholder-slate-500 bg-slate-900/30"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="relative min-w-[170px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Filter className="h-4 w-4 text-slate-500" />
              </div>
              <select
                value={difficultyFilter}
                onChange={handleDifficultyChange}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input appearance-none bg-slate-950 border border-white/5 cursor-pointer"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || difficultyFilter || tagFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-bold text-indigo-400 hover:text-white hover:bg-white/5 rounded-xl border border-indigo-500/20 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Tags Quick List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 block">Filter by Topics</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    tagFilter.toLowerCase() === tag.toLowerCase()
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/25 scale-105'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-slate-700 hover:text-slate-200 cursor-pointer'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Problems Listing */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <span className="text-sm text-slate-400 font-medium animate-pulse">Retrieving coding challenges...</span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <HelpCircle className="h-12 w-12 text-slate-600 mb-4" />
                <span className="text-lg font-bold text-slate-350">No problems found</span>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  We couldn't find any challenges matching your filters. Try adjusting your queries!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 pl-6 w-16 text-center">Status</th>
                      <th className="py-4 px-4">Title</th>
                      <th className="py-4 px-4 w-32">Difficulty</th>
                      <th className="py-4 pr-6">Topics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredProblems.map((problem) => {
                      // solvedProblems is populated as objects on the profile, check matching IDs
                      const isSolved = user?.solvedProblems?.some(
                        (sp) => (sp._id || sp) === problem._id
                      );
                      return (
                        <tr
                          key={problem._id}
                          className="hover:bg-slate-900/20 transition-colors group"
                        >
                          <td className="py-4 pl-6 text-center">
                            {isSolved ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)] inline-block" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-slate-700/60 inline-block" />
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              to={`/problem/${problem._id}`}
                              className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors duration-200"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 shadow-sm border ${
                                problem.difficulty === 'Easy'
                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                                  : problem.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                  : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="py-4 pr-6">
                            <div className="flex flex-wrap gap-1.5 max-w-xs sm:max-w-sm">
                              {problem.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block rounded-md bg-slate-800/40 border border-white/5 px-2 py-0.5 text-xxs font-medium text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                              {problem.tags?.length > 3 && (
                                <span className="text-xxs text-slate-500 font-semibold self-center">
                                  +{problem.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Statistics Column */}
        <div className="space-y-6">
          
          {/* Difficulty Statistics Panel */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart className="h-5 w-5 text-indigo-400" />
              Target Statistics
            </h3>
            
            <div className="space-y-3.5">
              {/* Easy Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Easy Tasks</span>
                  <span className="text-emerald-400 font-bold">{easyCount} available</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                    style={{ width: `${totalCount ? (easyCount / totalCount) * 100 : 0}%` }} 
                  />
                </div>
              </div>

              {/* Medium Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Medium Tasks</span>
                  <span className="text-amber-400 font-bold">{mediumCount} available</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500" 
                    style={{ width: `${totalCount ? (mediumCount / totalCount) * 100 : 0}%` }} 
                  />
                </div>
              </div>

              {/* Hard Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Hard Tasks</span>
                  <span className="text-rose-400 font-bold">{hardCount} available</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-500" 
                    style={{ width: `${totalCount ? (hardCount / totalCount) * 100 : 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reward Points Help Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden bg-gradient-to-tr from-indigo-950/20 to-purple-950/20">
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-amber-500/5 rounded-full blur-xl" />
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-amber-400" />
              Scoring System
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Submit fully passing code against our secure test cases to earn points and scale the ranks.
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-bold">Easy Difficulty</span>
                <span className="font-semibold text-slate-350">+10 Points</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-amber-400 font-bold">Medium Difficulty</span>
                <span className="font-semibold text-slate-350">+20 Points</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                <span className="text-rose-400 font-bold">Hard Difficulty</span>
                <span className="font-semibold text-slate-350">+30 Points</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
