import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useProblemStore } from '../Store/problemStore.js';
import { useSubmissionStore } from '../Store/submissionStore.js';
import { useAuthStore } from '../Store/authStore.js';
import { 
  Send, Code, BookOpen, Clock, Cpu, HelpCircle, 
  Terminal, CheckCircle, XCircle, AlertCircle, RefreshCw, ChevronRight, FileCode,
  Play, AlertTriangle, X
} from 'lucide-react';

export const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedProblem, fetchProblemById } = useProblemStore();
  const { 
    submitSolution, 
    submissions,
    submitting, 
    verdict,
    runtime,
    memory,
    error,
    fetchSubmissions,
    clearResults,
    executeCodeDraft,
    running,
    runResult,
    runError
  } = useSubmissionStore();

  const { isAuthenticated, user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('description'); // description | submissions
  const [consoleTab, setConsoleTab] = useState('output'); // Console display: output | testcases
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Custom dry-run test case state
  const [customInput, setCustomInput] = useState('');
  // Past submission inspector modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Language templates/boilerplate code
  const templates = {
    python: `import sys\n\ndef main():\n    # Read from standard input (stdin)\n    # input_data = sys.stdin.read().split()\n    # print("Hello World")\n    pass\n\nif __name__ == '__main__':\n    main()\n`,
    cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Read from standard input (cin), write to standard output (cout)\n    // cout << "Hello World" << endl;\n    return 0;\n}\n`,
    javascript: `const readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nrl.on('line', (line) => {\n    // Process each line here\n    // console.log(line);\n});\n`,
    java: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line;\n        while ((line = br.readLine()) != null) {\n            // Process input\n        }\n    }\n}\n`
  };

  // Reset results and fetch problem details on load
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    clearResults();
    setEvaluationResult(null);
    fetchProblemById(id);
    fetchSubmissions();
  }, [id, fetchProblemById, fetchSubmissions, isAuthenticated, navigate, clearResults]);

  // Load draft from localStorage or state when problem ID or language changes
  useEffect(() => {
    if (location.state?.draftCode) {
      setCode(location.state.draftCode);
      const passedLang = location.state.draftLanguage || language;
      if (location.state?.draftLanguage) {
        setLanguage(location.state.draftLanguage);
      }
      const draftKey = `draft-${user?._id || 'guest'}-${id}-${passedLang}`;
      localStorage.setItem(draftKey, location.state.draftCode);
      window.history.replaceState({}, document.title);
      return;
    }

    const draftKey = `draft-${user?._id || 'guest'}-${id}-${language}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft !== null) {
      setCode(savedDraft);
    } else {
      setCode(templates[language]);
    }
  }, [id, language, user?._id]);

  // Automatically save code to localStorage whenever it changes
  useEffect(() => {
    if (code && code.trim() !== '') {
      const draftKey = `draft-${user?._id || 'guest'}-${id}-${language}`;
      localStorage.setItem(draftKey, code);
    }
  }, [code, id, language, user?._id]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(templates[newLang]);
  };

  const handleSubmit = async () => {
    setConsoleTab('output');
    setEvaluationResult(null);
    try {
      const res = await submitSolution(id, code, language);
      setEvaluationResult(res);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleRun = async () => {
    setConsoleTab('output');
    setEvaluationResult(null);
    try {
      await executeCodeDraft(id, code, language, customInput);
    } catch (err) {
      console.error('Dry run failed:', err);
    }
  };

  const handleViewSubmission = (sub) => {
    setSelectedSubmission(sub);
    setViewModalOpen(true);
  };

  const handleLoadCode = () => {
    if (selectedSubmission?.code) {
      setCode(selectedSubmission.code);
      setLanguage(selectedSubmission.language);
      setViewModalOpen(false);
    }
  };

  // Filter submissions locally for this specific problem
  const problemSubmissions = submissions.filter(
    (sub) => (sub.problem?._id || sub.problem) === id
  );

  return (
    <div className="flex flex-col xl:flex-row h-auto xl:h-[calc(100vh-80px)] overflow-y-auto xl:overflow-hidden w-full px-4 py-4 gap-4 bg-[#080b11]">
      
      {/* Left Column: Problem description & Submissions Log */}
      <div className="flex-1 flex flex-col h-full bg-slate-900/35 border border-white/5 rounded-3xl overflow-hidden glass-card">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-white/5 bg-slate-950/40 p-2">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'description'
                ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Description
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ml-2 cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Submissions ({problemSubmissions.length})
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === 'description' && selectedProblem ? (
            <div className="space-y-6">
              
              {/* Problem Title & Stats */}
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 shadow-sm border ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                        : selectedProblem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedProblem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-md bg-slate-800/60 border border-white/5 px-2 py-0.5 text-xxs font-medium text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold text-white mt-3">{selectedProblem.title}</h1>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-300 leading-relaxed space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-1">Problem Description</h3>
                <p className="whitespace-pre-line text-slate-350">{selectedProblem.description}</p>
              </div>

              {/* Input Format */}
              <div className="text-sm text-slate-300 bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ChevronRight className="h-4 w-4 text-indigo-400" />
                  Input Format
                </h4>
                <p className="whitespace-pre-line pl-5 text-xs text-slate-400 leading-relaxed">{selectedProblem.inputFormat}</p>
              </div>

              {/* Output Format */}
              <div className="text-sm text-slate-300 bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ChevronRight className="h-4 w-4 text-indigo-400" />
                  Output Format
                </h4>
                <p className="whitespace-pre-line pl-5 text-xs text-slate-400 leading-relaxed">{selectedProblem.outputFormat}</p>
              </div>

              {/* Constraints */}
              <div className="text-sm text-slate-300 bg-slate-950/20 border border-white/5 rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ChevronRight className="h-4 w-4 text-indigo-400" />
                  Constraints
                </h4>
                <pre className="pl-5 text-xs font-mono text-slate-450">{selectedProblem.constraints}</pre>
              </div>

              {/* Sample Cases */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-white border-b border-white/5 pb-1">Examples</h3>
                
                <div className="space-y-3">
                  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-xxs">Sample Input:</span>
                      <pre className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-indigo-300 whitespace-pre-wrap">{selectedProblem.sampleInput}</pre>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-semibold mb-1 uppercase tracking-wider text-xxs">Sample Output:</span>
                      <pre className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-emerald-400 whitespace-pre-wrap">{selectedProblem.sampleOutput}</pre>
                    </div>
                    {selectedProblem.explanation && (
                      <div className="pt-2 text-xs font-sans text-slate-400 border-t border-white/5 leading-relaxed">
                        <span className="font-bold text-slate-300">Explanation:</span> {selectedProblem.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : activeTab === 'submissions' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Submissions Archive</h3>

              {problemSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 animate-in fade-in">
                  <FileCode className="h-12 w-12 text-slate-700 mb-3" />
                  <span className="font-semibold text-slate-400">No submissions yet</span>
                  <p className="text-xs text-slate-500 mt-1">Submit your code draft in the IDE to log execution benchmarks.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {problemSubmissions.map((sub) => (
                    <div 
                      key={sub._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 border border-white/5 rounded-2xl p-4 hover:border-slate-800 hover:bg-slate-900/80 transition-all cursor-pointer group/sub"
                      onClick={() => handleViewSubmission(sub)}
                      title="Click to view code submission details"
                    >
                      <div className="flex items-center gap-3">
                        {sub.status === 'Accepted' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <span className={`font-bold text-sm ${sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {sub.status}
                          </span>
                          <span className="text-xxs text-slate-500 block mt-0.5">
                            {new Date(sub.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center self-end sm:self-center text-xs text-slate-400 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" />
                          <span>{sub.runtime} ms</span>
                        </div>
                        <div className="w-px h-3 bg-white/5" />
                        <div className="flex items-center gap-1">
                          <Cpu className="h-3.5 w-3.5 text-purple-400" />
                          <span>{sub.memory} KB</span>
                        </div>
                        <div className="w-px h-3 bg-white/5" />
                        <span className="font-semibold text-slate-500 uppercase text-xxs border border-white/5 rounded px-1.5 py-0.5 bg-slate-950/20 group-hover/sub:text-indigo-400 group-hover/sub:border-indigo-500/30 transition-colors">
                          {sub.language}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover/sub:text-indigo-400 transition-colors transform group-hover/sub:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="animate-pulse">Loading problem statements...</div>
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Code Editor & Compiler Output panels */}
      <div className="flex-1 flex flex-col h-full bg-slate-900/35 border border-white/5 rounded-3xl overflow-hidden glass-card">
        
        {/* Editor Controls Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-950/40 p-3 flex-wrap gap-3">
          
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider pl-1">Monaco Workspace</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Dropdown Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-indigo-400 glass-input bg-slate-950 border border-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="python">Python 3</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="javascript">Node.js (JS)</option>
              <option value="java">Java (JDK)</option>
            </select>

            <button
              onClick={() => setCode(templates[language])}
              className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Code Template"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[300px] border-b border-white/5">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : 'python'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 14,
              fontFamily: 'Fira Code, monospace',
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              lineHeight: 20,
              padding: { top: 8, bottom: 8 }
            }}
          />
        </div>

        {/* Bottom Console Section (Submit & Compiler Output) */}
        <div className="h-72 bg-slate-950/40 flex flex-col border-t border-white/5">
          
          {/* Console Header Tabs */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 bg-slate-950/60 p-2 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setConsoleTab('output')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  consoleTab === 'output'
                    ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                Result / Output
              </button>
              <button
                onClick={() => setConsoleTab('testcases')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  consoleTab === 'testcases'
                    ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                Test Cases
              </button>
            </div>

            {/* Run / Submit Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={submitting || running}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 hover:border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 shadow-md hover:text-white transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {running ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Running Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitting || running}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Console Tab Panels */}
          <div className="flex-1 overflow-y-auto p-4 text-xs scrollbar-thin">
            {consoleTab === 'testcases' && selectedProblem ? (
              <div className="space-y-4 font-sans text-slate-350">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-xxs block mb-1">Base Sample Input</span>
                    <pre className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 font-mono text-xs text-indigo-300 overflow-x-auto max-h-24 whitespace-pre-wrap">{selectedProblem.sampleInput}</pre>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-xxs block mb-1">Base Sample Output</span>
                    <pre className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto max-h-24 whitespace-pre-wrap">{selectedProblem.sampleOutput}</pre>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-xxs block mb-1">Custom Input (Optional)</span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Provide custom standard input (stdin) for dry-run execution..."
                    className="w-full h-20 p-2.5 text-xs rounded-xl glass-input placeholder-slate-600 bg-slate-900/30 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full font-mono text-slate-350">
                {submitting || running ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 animate-pulse text-indigo-400 py-4">
                    <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                    <span className="font-semibold text-slate-400">
                      {running ? 'Executing dry run in secure sandboxed runtime...' : 'Evaluating solution across hidden test suites...'}
                    </span>
                    <span className="text-xxs text-slate-500">Communicating with compiler environment...</span>
                  </div>
                ) : runResult ? (
                  // Run Output Report
                  <div className="space-y-4">
                    {/* Sample Test Case Report */}
                    <div className="border border-white/5 bg-slate-900/40 rounded-2xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          {runResult.sampleResult?.status === 'Accepted' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                          <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Base Sample Test Case</span>
                        </div>
                        <span className={`text-xs font-bold uppercase ${runResult.sampleResult?.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {runResult.sampleResult?.status}
                        </span>
                      </div>

                      {runResult.sampleResult?.compileOutput && (
                        <div className="space-y-1">
                          <span className="text-slate-500 font-bold uppercase text-xxs block">Compilation Error:</span>
                          <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2 rounded-lg border border-white/5">{runResult.sampleResult.compileOutput}</pre>
                        </div>
                      )}

                      {runResult.sampleResult?.stderr && (
                        <div className="space-y-1">
                          <span className="text-slate-500 font-bold uppercase text-xxs block">Standard Error:</span>
                          <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2 rounded-lg border border-white/5">{runResult.sampleResult.stderr}</pre>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold block text-xxs uppercase">Input</span>
                          <pre className="bg-slate-955/60 p-2 rounded-lg border border-white/5 text-indigo-300 max-h-20 overflow-y-auto whitespace-pre-wrap">{runResult.sampleResult?.input}</pre>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block text-xxs uppercase">Expected Output</span>
                          <pre className="bg-slate-955/60 p-2 rounded-lg border border-white/5 text-emerald-400 max-h-20 overflow-y-auto whitespace-pre-wrap">{runResult.sampleResult?.expected}</pre>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block text-xxs uppercase">Actual Output</span>
                          <pre className="bg-slate-955/60 p-2 rounded-lg border border-white/5 text-slate-350 max-h-20 overflow-y-auto whitespace-pre-wrap">{runResult.sampleResult?.actual || '(No Output)'}</pre>
                        </div>
                      </div>

                      {runResult.sampleResult?.status === 'Accepted' && (
                        <div className="flex gap-4 pt-1 font-sans text-slate-400 text-[10px]">
                          <span>Runtime: <strong className="text-indigo-400 font-semibold">{runResult.sampleResult.runtime} ms</strong></span>
                          <span>Memory: <strong className="text-purple-400 font-semibold">{runResult.sampleResult.memory} KB</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Custom Input Case Report */}
                    {runResult.customResult && (
                      <div className="border border-white/5 bg-slate-900/40 rounded-2xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-1.5">
                            {runResult.customResult.status === 'Accepted' || runResult.customResult.status === 'Completed' || runResult.customResult.statusId === 3 ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-500" />
                            )}
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">Custom Test Case Run</span>
                          </div>
                          <span className={`text-xs font-bold uppercase ${runResult.customResult.status === 'Accepted' || runResult.customResult.status === 'Completed' || runResult.customResult.statusId === 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {runResult.customResult.status === 'Accepted' || runResult.customResult.statusId === 3 ? 'Success' : runResult.customResult.status}
                          </span>
                        </div>

                        {runResult.customResult.compileOutput && (
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase text-xxs block">Compilation Error:</span>
                            <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2 rounded-lg border border-white/5">{runResult.customResult.compileOutput}</pre>
                          </div>
                        )}

                        {runResult.customResult.stderr && (
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold uppercase text-xxs block">Standard Error:</span>
                            <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2 rounded-lg border border-white/5">{runResult.customResult.stderr}</pre>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                          <div>
                            <span className="text-slate-500 font-semibold block text-xxs uppercase">Custom Input Stdin</span>
                            <pre className="bg-slate-955/60 p-2 rounded-lg border border-white/5 text-indigo-300 max-h-20 overflow-y-auto whitespace-pre-wrap">{runResult.customResult.input}</pre>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold block text-xxs uppercase">Actual Output stdout</span>
                            <pre className="bg-slate-955/60 p-2 rounded-lg border border-white/5 text-slate-350 max-h-20 overflow-y-auto whitespace-pre-wrap">{runResult.customResult.actual || '(No Output)'}</pre>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-1 font-sans text-slate-400 text-[10px]">
                          <span>Runtime: <strong className="text-indigo-400 font-semibold">{runResult.customResult.runtime} ms</strong></span>
                          <span>Memory: <strong className="text-purple-400 font-semibold">{runResult.customResult.memory} KB</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : evaluationResult ? (
                  // Submit Output Report
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        {evaluationResult.evaluation?.success ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500" />
                        )}
                        <span className={`text-sm font-bold uppercase tracking-wider ${evaluationResult.evaluation?.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {verdict}
                        </span>
                      </div>
                      
                      {evaluationResult.evaluation?.success && (
                        <div className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          All {evaluationResult.evaluation?.totalCases} Test Cases Passed!
                        </div>
                      )}
                    </div>

                    {/* Execution Message */}
                    {evaluationResult.message && (
                      <div className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/5 leading-relaxed text-xs">
                        {evaluationResult.message}
                      </div>
                    )}

                    {!evaluationResult.evaluation?.success ? (
                      <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3.5 space-y-2">
                        <p className="text-rose-300 font-bold text-xxs uppercase tracking-wider">
                          Failed on test case {evaluationResult.evaluation?.failedAtCase || 1} of {evaluationResult.evaluation?.totalCases || 3}
                        </p>
                        
                        {/* Diagnostic Outputs */}
                        {evaluationResult.submission?.errorMessage && (
                          <div className="space-y-1">
                            <span className="text-slate-500 font-semibold uppercase text-xxs block">Compiler Feedback / Stderr:</span>
                            <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-28 leading-relaxed whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-white/5">
                              {evaluationResult.submission.errorMessage}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-4 p-1 text-slate-300">
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-3 flex-1 flex flex-col justify-center items-center gap-1 shadow-sm font-sans">
                          <span className="text-slate-500 uppercase text-xxs font-bold tracking-wider">Execution Runtime</span>
                          <span className="text-lg font-extrabold text-indigo-400">{runtime} ms</span>
                        </div>
                        <div className="bg-slate-900 border border-white/5 rounded-2xl p-3 flex-1 flex flex-col justify-center items-center gap-1 shadow-sm font-sans">
                          <span className="text-slate-500 uppercase text-xxs font-bold tracking-wider">Memory Allocation</span>
                          <span className="text-lg font-extrabold text-purple-400">{memory} KB</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : runError || error ? (
                  <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                    <span>{runError || error}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 py-6">
                    <HelpCircle className="h-8 w-8 mb-2 text-slate-750" />
                    <span>No execution outputs. Write code and hit Run Code or Submit Solution!</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* PAST SUBMISSION DETAILS MODAL */}
      {viewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 shadow-sm ${
                  selectedSubmission.status === 'Accepted'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {selectedSubmission.status}
                </span>
                <span className="font-semibold text-slate-200 uppercase text-xxs border border-white/5 rounded px-1.5 py-0.5 bg-slate-900 font-mono">
                  {selectedSubmission.language}
                </span>
                <span className="text-xxs text-slate-500 font-sans">
                  Submitted {new Date(selectedSubmission.createdAt).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setViewModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body (Code View) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xxs block">Submitted Source Code</span>
                <div className="h-[45vh] rounded-2xl overflow-hidden border border-white/5">
                  <Editor
                    height="100%"
                    language={selectedSubmission.language === 'cpp' ? 'cpp' : selectedSubmission.language === 'javascript' ? 'javascript' : selectedSubmission.language === 'java' ? 'java' : 'python'}
                    theme="vs-dark"
                    value={selectedSubmission.code}
                    options={{
                      readOnly: true,
                      fontSize: 13,
                      fontFamily: 'Fira Code, monospace',
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      lineHeight: 18,
                      padding: { top: 12, bottom: 12 }
                    }}
                  />
                </div>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="space-y-1 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4">
                  <span className="text-rose-300 font-bold uppercase tracking-wider text-xxs block mb-1">Error Diagnostic / Compiler Stderr</span>
                  <pre className="text-rose-450 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-white/5">
                    {selectedSubmission.errorMessage}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-slate-950/20">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadCode}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer animate-pulse-soft"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Load Draft Into Editor</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
