import React, { useState } from 'react';
import useAdminStore from '../Store/adminStore.js';
import { useAuthStore } from '../Store/authStore.js';
import { 
  Ban, CheckCircle, Search, Filter, HelpCircle, 
  ChevronLeft, ChevronRight, User, Mail, Calendar, Trophy, CheckCircle2 
} from 'lucide-react';

export const UserTable = () => {
  const { users, blockUser, unblockUser } = useAdminStore();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState(null);

  // Filters
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.name ? u.name.toLowerCase().includes(search.toLowerCase()) : false;
    const usernameMatch = u.username ? u.username.toLowerCase().includes(search.toLowerCase()) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(search.toLowerCase()) : false;
    
    const matchesSearch = nameMatch || usernameMatch || emailMatch;
    const matchesStatus = status === 'active' ? u.isActive : status === 'blocked' ? !u.isActive : true;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleBlockToggle = async (u) => {
    const isMe = u._id === currentUser?._id;
    if (isMe) {
      alert('Violation Check: You cannot block your own administrative session!');
      return;
    }

    const actionText = u.isActive ? 'BLOCK & DISABLE' : 'ACTIVATE & UNBLOCK';
    const confirmation = window.confirm(
      `Confirm moderation: Are you sure you want to ${actionText} user account @${u.username}?`
    );

    if (confirmation) {
      if (u.isActive) {
        await blockUser(u._id);
      } else {
        await unblockUser(u._id);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/30 border border-white/5 rounded-3xl p-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-550 self-center pointer-events-none mt-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search full name, username, email address..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input placeholder-slate-550 bg-slate-900/30 font-medium"
          />
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
            <option value="blocked">Blocked Only</option>
          </select>
        </div>

      </div>

      {/* User stand directory grid */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/35 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="py-4.5 pl-6 w-16 text-center">Avatar</th>
                <th className="py-4.5 px-4">Full Coder Name</th>
                <th className="py-4.5 px-4">Username</th>
                <th className="py-4.5 px-4">Email</th>
                <th className="py-4.5 px-4 text-center w-28">Score (PTS)</th>
                <th className="py-4.5 px-4 text-center w-28">Solved Tasks</th>
                <th className="py-4.5 px-4 text-center w-36">Joined Date</th>
                <th className="py-4.5 px-4 text-center w-28">Account Status</th>
                <th className="py-4.5 pr-6 text-center w-32">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-355">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-500 font-medium font-sans">
                    <HelpCircle className="h-10 w-10 mx-auto text-slate-700 mb-2.5" />
                    No programmers match search credentials.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const isBlocked = !u.isActive;
                  const isMe = u._id === currentUser?._id;
                  return (
                    <tr 
                      key={u._id} 
                      className={`hover:bg-slate-900/10 transition-colors ${
                        isBlocked ? 'opacity-55 bg-red-950/5' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <td className="py-4 pl-6 text-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 shadow mx-auto">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.username} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-slate-650" />
                          )}
                        </div>
                      </td>

                      {/* Full Name */}
                      <td 
                        onClick={() => setSelectedUser(u)}
                        className="py-4 px-4 font-bold text-slate-200 hover:text-indigo-400 transition-colors cursor-pointer"
                        title="Click to view details"
                      >
                        {u.name || 'Anonymous Coder'}
                      </td>

                      {/* Username */}
                      <td className="py-4 px-4 font-mono text-xs text-indigo-400">
                        @{u.username}
                      </td>

                      {/* Email */}
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

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold leading-5 ${
                          u.isActive
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse-soft'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {u.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>

                      {/* Moderation actions */}
                      <td className="py-4 pr-6 text-center">
                        {isMe ? (
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Self Account</span>
                        ) : (
                          <button
                            onClick={() => handleBlockToggle(u)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xxs font-extrabold shadow-sm transition-all cursor-pointer mx-auto ${
                              u.isActive
                                ? 'text-red-450 hover:text-red-400 bg-red-500/5 border-red-500/10 hover:bg-red-500/10'
                                : 'text-emerald-450 hover:text-emerald-400 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'
                            }`}
                            title={u.isActive ? 'Disable User' : 'Reactivate User'}
                          >
                            {u.isActive ? <Ban className="h-3 w-3 shrink-0" /> : <CheckCircle className="h-3 w-3 shrink-0" />}
                            {u.isActive ? 'Block' : 'Unblock'}
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4.5 border-t border-white/5 bg-slate-950/20">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Showing page {currentPage} of {totalPages} ({filteredUsers.length} programmers)
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

      {/* User Details Modal Audit Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400 shrink-0" />
                Coder Profile standing
              </span>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-center">
              
              {/* Avatar */}
              <div className="relative inline-block mx-auto">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-slate-900 flex items-center justify-center shadow-lg mx-auto">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} alt={selectedUser.username} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-slate-650" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedUser.name || 'Anonymous Coder'}</h3>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 block w-fit mx-auto mt-2">@{selectedUser.username}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-5 text-left text-xs text-slate-350">
                <div className="space-y-3 pl-2">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="truncate max-w-[120px]" title={selectedUser.email}>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-3 pl-2 border-l border-white/5">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-300">{selectedUser.points || 0} pts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                    <span className="font-bold text-purple-400">{selectedUser.solvedCount || 0} Solved</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-slate-950/20">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-indigo-650 hover:bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserTable;
