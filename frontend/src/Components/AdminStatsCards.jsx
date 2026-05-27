import React from 'react';
import { 
  FileCode, CheckCircle, XCircle, Users, UserCheck, UserX 
} from 'lucide-react';

export const AdminStatsCards = ({ stats }) => {
  const cards = [
    {
      label: 'Total Problems',
      value: stats.totalProblems || 0,
      icon: FileCode,
      color: 'from-blue-600/10 to-indigo-600/5',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400 bg-blue-500/15',
    },
    {
      label: 'Active Problems',
      value: stats.activeProblems || 0,
      icon: CheckCircle,
      color: 'from-emerald-600/10 to-teal-600/5',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400 bg-emerald-500/15',
    },
    {
      label: 'Inactive Problems',
      value: stats.inactiveProblems || 0,
      icon: XCircle,
      color: 'from-amber-600/10 to-orange-600/5',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400 bg-amber-500/15',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'from-purple-600/10 to-pink-600/5',
      borderColor: 'border-purple-500/20',
      iconColor: 'text-purple-400 bg-purple-500/15',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers || 0,
      icon: UserCheck,
      color: 'from-teal-600/10 to-emerald-600/5',
      borderColor: 'border-teal-500/20',
      iconColor: 'text-teal-400 bg-teal-500/15',
    },
    {
      label: 'Blocked Users',
      value: stats.blockedUsers || 0,
      icon: UserX,
      color: 'from-rose-600/10 to-red-600/5',
      borderColor: 'border-rose-500/20',
      iconColor: 'text-rose-400 bg-rose-500/15',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`glass-card rounded-3xl p-6 border ${card.borderColor} bg-gradient-to-br ${card.color} shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-450 text-[10px] font-bold uppercase tracking-widest block">{card.label}</span>
                <span className="text-3xl font-extrabold text-white tracking-tight mt-1.5 block group-hover:scale-105 transition-transform duration-300">{card.value}</span>
              </div>
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${card.iconColor} shadow-md`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
            </div>
            
            {/* Subtle glow border at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
