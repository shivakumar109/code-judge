import React from 'react';
import { X, BookOpen, ChevronRight, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProblemDetailsModal = ({ problem, onClose }) => {
  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 shadow-sm border ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
            }`}>
              {problem.difficulty}
            </span>
            <span className="font-semibold text-slate-200 text-sm font-sans tracking-wide truncate max-w-md">
              {problem.title}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold ${
              problem.isProblemActive
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {problem.isProblemActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {problem.tags?.map((tag) => (
              <span 
                key={tag}
                className="inline-block rounded bg-slate-900 border border-white/5 px-2 py-0.5 text-xxs font-medium text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/5 pb-1 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
              Problem Description
            </h4>
            <p className="whitespace-pre-line text-slate-350">{problem.description}</p>
          </div>

          {/* Formats and Constraints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="text-xs bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0" />
                Input Format
              </h5>
              <p className="whitespace-pre-line text-[11px] text-slate-400 leading-relaxed">{problem.inputFormat}</p>
            </div>

            <div className="text-xs bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0" />
                Output Format
              </h5>
              <p className="whitespace-pre-line text-[11px] text-slate-400 leading-relaxed">{problem.outputFormat}</p>
            </div>

            <div className="text-xs bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0" />
                Algorithmic Constraints
              </h5>
              <pre className="font-mono text-[10px] text-slate-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">{problem.constraints}</pre>
            </div>

          </div>

          {/* Sample Input & Output */}
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider pl-1 font-sans">Sample Case</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-xxs">Sample Input:</span>
                <pre className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-indigo-300 whitespace-pre-wrap">{problem.sampleInput}</pre>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-xxs">Sample Output:</span>
                <pre className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-emerald-400 whitespace-pre-wrap">{problem.sampleOutput}</pre>
              </div>
            </div>
            {problem.explanation && (
              <div className="pt-2 text-xs font-sans text-slate-400 border-t border-white/5 leading-relaxed">
                <span className="font-bold text-slate-300">Explanation:</span> {problem.explanation}
              </div>
            )}
          </div>

          {/* Hidden Test cases List (Visible ONLY to Admin) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/5 pb-1 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-violet-450 shrink-0" />
              Secure Hidden Test Cases ({problem.hiddenTestCases?.length || 0} cases)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problem.hiddenTestCases?.map((tc, idx) => (
                <div key={idx} className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-2.5 font-mono text-xxs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Test Case {idx + 1}</span>
                    <span className="text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded border border-white/5">Backend Secure</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block font-semibold mb-1 uppercase tracking-wider">Input:</span>
                    <pre className="bg-slate-900/60 p-2 rounded-lg border border-white/5 text-indigo-300 overflow-x-auto">{tc.input}</pre>
                  </div>
                  <div>
                    <span className="text-slate-455 block font-semibold mb-1 uppercase tracking-wider">Expected Output:</span>
                    <pre className="bg-slate-900/60 p-2 rounded-lg border border-white/5 text-emerald-400 overflow-x-auto">{tc.output}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-slate-950/20">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-650 hover:bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProblemDetailsModal;
