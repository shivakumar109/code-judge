import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { useProblemStore } from '../Store/problemStore.js';
import submissionService from '../Services/submissionService.js';
import { 
  Plus, Trash2, ShieldAlert, BarChart, Settings, FilePlus2, 
  HelpCircle, CheckCircle2, ChevronDown, ListPlus, Loader2, Users, Ban, CheckCircle
} from 'lucide-react';

export const AdminPanel = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { problems, fetchProblems, createProblem, deleteProblem } = useProblemStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('create'); // create | manage | users
  
  // User Directory State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  // Form states for creating problem
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    tags: '',
    description: '',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: '',
  });

  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', output: '' },
    { input: '', output: '' },
    { input: '', output: '' }, // Minimum 3 hidden test cases
  ]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProblems();
    fetchUsersDirectory();
  }, [isAuthenticated, user, navigate, fetchProblems]);

  const fetchUsersDirectory = async () => {
    try {
      setUsersLoading(true);
      setUsersError('');
      const data = await submissionService.getAdminLeaderboard();
      setUsers(data.leaderboard || []);
      setUsersLoading(false);
    } catch (err) {
      setUsersError('Failed to fetch user standings directory');
      setUsersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hidden testcase operations
  const handleTestCaseChange = (index, field, value) => {
    const updated = [...hiddenTestCases];
    updated[index][field] = value;
    setHiddenTestCases(updated);
  };

  const addTestCaseField = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
  };

  const removeTestCaseField = (index) => {
    if (hiddenTestCases.length <= 3) {
      setFormError('A minimum of 3 hidden test cases are required for judging');
      return;
    }
    const updated = hiddenTestCases.filter((_, idx) => idx !== index);
    setFormError('');
    setHiddenTestCases(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const {
      title, difficulty, tags, description, constraints, 
      inputFormat, outputFormat, sampleInput, sampleOutput, explanation
    } = formData;

    // Validation
    if (!title.trim() || !description.trim() || !constraints.trim() || !inputFormat.trim() || !outputFormat.trim() || !sampleInput.trim() || !sampleOutput.trim()) {
      setFormError('Please fill in all standard required fields');
      return;
    }

    // Check hidden test cases
    const invalidTestcase = hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim());
    if (invalidTestcase) {
      setFormError('All hidden test cases must have non-empty Input and Output fields');
      return;
    }

    try {
      setFormLoading(true);
      const problemData = {
        title: title.trim(),
        difficulty,
        description: description.trim(),
        constraints: constraints.trim(),
        inputFormat: inputFormat.trim(),
        outputFormat: outputFormat.trim(),
        sampleInput: sampleInput.trim(),
        sampleOutput: sampleOutput.trim(),
        explanation: explanation.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        hiddenTestCases: hiddenTestCases.map(tc => ({
          input: tc.input.trim(),
          output: tc.output.trim()
        }))
      };

      await createProblem(problemData);
      
      setFormSuccess('Coding problem was successfully created and injected into the database!');
      setFormData({
        title: '',
        difficulty: 'Easy',
        tags: '',
        description: '',
        constraints: '',
        inputFormat: '',
        outputFormat: '',
        sampleInput: '',
        sampleOutput: '',
        explanation: '',
      });
      setHiddenTestCases([
        { input: '', output: '' },
        { input: '', output: '' },
        { input: '', output: '' },
      ]);
      fetchProblems();
      fetchUsersDirectory();
      setFormLoading(false);
    } catch (err) {
      setFormError(err.message || 'Failed to submit problem');
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this challenge? This will soft-delete the problem from active listings.')) {
      try {
        await deleteProblem(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Are you sure you want to block this user account? The user will be disabled instantly.')) {
      try {
        await submissionService.blockUser(userId);
        fetchUsersDirectory();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to block user');
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm('Are you sure you want to unblock this user account? The user will be re-enabled.')) {
      try {
        await submissionService.unblockUser(userId);
        fetchUsersDirectory();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unblock user');
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-[#0b0f19]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-8 w-8 text-violet-400" />
            Administrative Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage coding challenges, audit standings, and moderate client accounts in real-time.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-white/5 self-start">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FilePlus2 className="h-4 w-4" />
            Add Problem
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'manage' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Manage Problems
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            User Moderation
          </button>
        </div>
      </div>

      {/* Tab Panels */}

      {/* Tab: Create Problem */}
      {activeTab === 'create' && (
        <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FilePlus2 className="h-5.5 w-5.5 text-indigo-400" />
            Seed a New Coding Problem
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Feedback Alerts */}
            {formError && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300 animate-pulse">
                <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Title, Difficulty, Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input bg-slate-900/30"
                  placeholder="e.g. Palindrome Check"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty Level*</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input bg-slate-950 border border-white/5 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topics (Comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input bg-slate-900/30"
                  placeholder="e.g. Arrays, Sorting, Math"
                />
              </div>

            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement & Description*</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input resize-none font-mono text-xs bg-slate-900/30"
                placeholder="Describe the problem statement here..."
              />
            </div>

            {/* Formats and Constraints Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Format Specification*</label>
                <textarea
                  name="inputFormat"
                  rows={3}
                  value={formData.inputFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input resize-none text-xs bg-slate-900/30"
                  placeholder="e.g. First line contains N..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Output Format Specification*</label>
                <textarea
                  name="outputFormat"
                  rows={3}
                  value={formData.outputFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input resize-none text-xs bg-slate-900/30"
                  placeholder="e.g. Print the index value..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithmic Constraints*</label>
                <textarea
                  name="constraints"
                  rows={3}
                  value={formData.constraints}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input resize-none font-mono text-xs bg-slate-900/30"
                  placeholder="e.g. 1 <= N <= 10^5"
                />
              </div>

            </div>

            {/* Sample Inputs / Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/20 border border-white/5 rounded-2xl p-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Sample Stdin (Input)*</label>
                <textarea
                  name="sampleInput"
                  rows={3}
                  value={formData.sampleInput}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input font-mono text-xs bg-slate-900/30"
                  placeholder="Sample stdin inputs..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sample Stdout (Expected Output)*</label>
                <textarea
                  name="sampleOutput"
                  rows={3}
                  value={formData.sampleOutput}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input font-mono text-xs bg-slate-900/30"
                  placeholder="Sample expected output..."
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Explanation (Optional)</label>
                <textarea
                  name="explanation"
                  rows={2}
                  value={formData.explanation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-200 glass-input text-xs bg-slate-900/30"
                  placeholder="Explain why the input maps to the output..."
                />
              </div>

            </div>

            {/* Secure Hidden Test Cases Section */}
            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-md font-bold text-white flex items-center gap-1.5">
                    <ListPlus className="h-5 w-5 text-indigo-400" />
                    Secure Hidden Test Cases (Minimum 3 Required)*
                  </h3>
                  <p className="text-xxs text-slate-500">These will only run in the backend judge during submissions and remain hidden from client profiles.</p>
                </div>
                <button
                  type="button"
                  onClick={addTestCaseField}
                  className="flex items-center gap-1 bg-slate-900 border border-white/10 hover:border-indigo-500 hover:text-indigo-400 text-slate-350 text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Case
                </button>
              </div>

              {/* Testcase rows */}
              <div className="space-y-4">
                {hiddenTestCases.map((tc, index) => (
                  <div 
                    key={index}
                    className="flex flex-col md:flex-row items-start gap-4 bg-slate-955/40 p-4 rounded-2xl border border-white/5 relative"
                  >
                    <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-400 font-bold text-xxs shadow">
                      {index + 1}
                    </span>

                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-xxs font-semibold uppercase tracking-wider text-slate-500 pl-1">Hidden Input</label>
                      <textarea
                        rows={2}
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                        placeholder="Stdin inputs..."
                      />
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-xxs font-semibold uppercase tracking-wider text-slate-500 pl-1">Expected Output</label>
                      <textarea
                        rows={2}
                        value={tc.output}
                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                        placeholder="Expected stdout..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTestCaseField(index)}
                      className="self-end md:self-center text-rose-550 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 p-2 rounded-xl border border-rose-500/10 transition-colors mt-2 md:mt-4 cursor-pointer"
                      title="Remove testcase"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Form Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="flex w-full justify-center items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-xl hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {formLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Create Coding Challenge</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

      {/* Tab: Manage Problems */}
      {activeTab === 'manage' && (
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trash2 className="h-5.5 w-5.5 text-indigo-400" />
            Manage Seeded Problems
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 pl-6">Challenge Title</th>
                  <th className="py-4 px-4 w-36">Difficulty</th>
                  <th className="py-4 px-4">Topics</th>
                  <th className="py-4 pr-6 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-350">
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500 font-medium">
                      No active problems found. Create one in the first tab!
                    </td>
                  </tr>
                ) : (
                  problems.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 pl-6 font-semibold text-white">
                        {p.title}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xxs font-bold leading-5 border ${
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
                        <div className="flex flex-wrap gap-1">
                          {p.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="bg-slate-800/40 border border-white/5 rounded px-1.5 py-0.5 text-xxs text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-center">
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 p-2 rounded-xl border border-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Challenge"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: User Moderation Directory */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-2xl animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-indigo-400" />
            User Moderation Directory
          </h2>

          {usersLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <span className="text-sm text-slate-400 font-medium">Processing developer standing directory...</span>
            </div>
          ) : usersError ? (
            <div className="text-center py-20 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
              <ShieldAlert className="h-12 w-12 mx-auto mb-3" />
              <p className="font-semibold">{usersError}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-700" />
              <p className="font-semibold text-slate-400">No active programmers</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 pl-6">Full Name</th>
                    <th className="py-4 px-4">Username</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4 text-center">Score (PTS)</th>
                    <th className="py-4 px-4 text-center">Solved Tasks</th>
                    <th className="py-4 px-4 text-center">Joined Date</th>
                    <th className="py-4 px-4 text-center">Account Status</th>
                    <th className="py-4 pr-6 text-center w-28">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-slate-350">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 pl-6 font-semibold text-white">
                        {u.name || 'Anonymous User'}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-indigo-400">
                        {u.username}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-455">
                        {u.email}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-400">
                        {u.points || 0}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-purple-400">
                        {u.solvedCount || 0}
                      </td>
                      <td className="py-4 px-4 text-center text-xxs font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xxs font-bold ${
                          u.isActive
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                          {u.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-center">
                        {u.isActive ? (
                          <button
                            onClick={() => handleBlockUser(u._id)}
                            className="flex items-center gap-1 text-red-450 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-2.5 py-1 rounded-xl transition-all text-xxs font-bold mx-auto cursor-pointer"
                            title="Block User"
                          >
                            <Ban className="h-3 w-3" />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(u._id)}
                            className="flex items-center gap-1 text-emerald-450 hover:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1 rounded-xl transition-all text-xxs font-bold mx-auto cursor-pointer"
                            title="Activate User"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
