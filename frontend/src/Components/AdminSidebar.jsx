import React from 'react';
import { useAuthStore } from '../Store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ListTodo, FilePlus, Users, Trophy, LogOut, Terminal, ShieldAlert 
} from 'lucide-react';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Confirm exit from administrative session?')) {
      await logout();
      navigate('/login');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: ListTodo },
    { id: 'add-problem', label: 'Add Problem', icon: FilePlus },
    { id: 'users', label: 'Users Directory', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard Audit', icon: Trophy },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950/70 border-r border-white/5 flex flex-col h-auto lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 shrink-0">
      
      {/* Admin Title Banner */}
      <div className="p-6 border-b border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-md shadow-violet-500/5">
            <ShieldAlert className="h-5.5 w-5.5 animate-pulse-soft" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">Admin Control</h2>
            <span className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">System Audit</span>
          </div>
        </div>
        
        {/* User Card */}
        {user && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 shadow">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                <span className="text-slate-350 font-bold text-xxs">{user.username?.substring(0,2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xxs font-bold text-slate-200 truncate">@{user.username}</p>
              <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">System Admin</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-450 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-450'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Action Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-350 transition-colors border border-transparent cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          Logout Session
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
