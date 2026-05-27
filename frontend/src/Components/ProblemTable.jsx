import React, { useState } from 'react';
import useAdminStore from '../Store/adminStore.js';
import ProblemDetailsModal from './ProblemDetailsModal.jsx';
import EditProblemModal from './EditProblemModal.jsx';
import { 
  Eye, Edit3, Trash2, CheckCircle, Search, Filter, HelpCircle, 
  ChevronLeft, ChevronRight, Ban, EyeOff 
} from 'lucide-react';

export const ProblemTable = () => {
  const { problems, deleteProblem, updateProblem } = useAdminStore();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal control states
  const [selectedDetailsProblem, setSelectedDetailsProblem] = useState(null);
  const [selectedEditProblem, setSelectedEditProblem] = useState(null);

  // Filters
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficulty ? p.difficulty === difficulty : true;
    const matchesStatus = status === 'active' ? p.isProblemActive : status === 'inactive' ? !p.isProblemActive : true;
    return matchesSearch && matchesDiff && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleStatus = async (p) => {
    const confirmation = window.confirm(
      `Are you sure you want to ${p.isProblemActive ? 'DEACTIVATE' : 'ACTIVATE'} this problem?`
    );
    if (confirmation) {
      try {
        await updateProblem(p._id, { isProblemActive: !p.isProblemActive });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm('Soft delete this challenge? This sets isProblemActive = false and deactivates it instantly.')) {
      await deleteProblem(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Filtering Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/30 border border-white/5 rounded-3xl p-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-500 self-center pointer-events-none mt-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search title, statement specs..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input placeholder-slate-550 bg-slate-900/30 font-medium"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="relative min-w-[150px]">
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-950 border border-white/5 cursor-pointer font-bold"
          >
            <option value="">Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[150px]">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-950 border border-white/5 cursor-pointer font-bold"
          >
            <option value="">Status Code</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

      </div>

      {/* Problems Audit Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/35 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="py-4.5 pl-6">Challenge Title</th>
                <th className="py-4.5 px-4 w-32">Difficulty</th>
                <th className="py-4.5 px-4">Topics</th>
                <th className="py-4.5 px-4 text-center w-28">Test Cases</th>
                <th className="py-4.5 px-4 text-center w-28">Status</th>
                <th className="py-4.5 px-4 text-center w-36">Seeded Date</th>
                <th className="py-4.5 pr-6 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-350">
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 font-medium">
                    <HelpCircle className="h-10 w-10 mx-auto text-slate-700 mb-2.5" />
                    No problems match search audits.
                  </td>
                </tr>
              ) : (
                paginatedProblems.map((p) => (
                  <tr key={p._id} className={`hover:bg-slate-900/10 transition-colors ${!p.isProblemActive ? 'opacity-60 bg-slate-950/10' : ''}`}>
                    <td className="py-4 pl-6 font-bold text-slate-200">
                      {p.title}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-5 border ${
                          p.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                            : p.difficulty === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {p.tags?.slice(0,3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-800/40 border border-white/5 rounded px-1.5 py-0.5 text-[9px] text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {p.tags?.length > 3 && (
                          <span className="text-[9px] text-slate-500 font-semibold self-center">+{p.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                      {p.hiddenTestCases?.length || 0} cases
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isProblemActive
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                        {p.isProblemActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-[10px] text-slate-455">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View Modal Trigger */}
                        <button
                          onClick={() => setSelectedDetailsProblem(p)}
                          className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/10 transition-colors cursor-pointer"
                          title="View Specs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Modal Trigger */}
                        <button
                          onClick={() => setSelectedEditProblem(p)}
                          className="text-violet-400 hover:text-violet-300 bg-violet-500/5 hover:bg-violet-500/10 p-2 rounded-xl border border-violet-500/10 transition-colors cursor-pointer"
                          title="Edit Specs"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Toggle Active status */}
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            p.isProblemActive
                              ? 'text-amber-450 hover:text-amber-400 bg-amber-500/5 border-amber-500/10'
                              : 'text-emerald-450 hover:text-emerald-400 bg-emerald-500/5 border-emerald-500/10'
                          }`}
                          title={p.isProblemActive ? 'Deactivate' : 'Reactivate'}
                        >
                          {p.isProblemActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        </button>

                        {/* Soft Delete */}
                        <button
                          onClick={() => handleSoftDelete(p._id)}
                          className="text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 p-2 rounded-xl border border-rose-500/10 transition-colors cursor-pointer"
                          title="Soft Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4.5 border-t border-white/5 bg-slate-950/20">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Showing page {currentPage} of {totalPages} ({filteredProblems.length} challenges)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Problem Details Audit Modal Overlay */}
      {selectedDetailsProblem && (
        <ProblemDetailsModal 
          problem={selectedDetailsProblem} 
          onClose={() => setSelectedDetailsProblem(null)} 
        />
      )}

      {/* Problem Inplace Edit Modal Overlay */}
      {selectedEditProblem && (
        <EditProblemModal 
          problem={selectedEditProblem} 
          onClose={() => setSelectedEditProblem(null)} 
        />
      )}

    </div>
  );
};

export default ProblemTable;
