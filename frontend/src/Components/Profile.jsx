import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { useSubmissionStore } from '../Store/submissionStore.js';
import authService from '../Services/authService.js';
import api from '../Services/api.js';
import Editor from '@monaco-editor/react';
import { 
  User, Mail, Key, Shield, Trophy, CheckCircle, Clock, 
  Cpu, FileCode, ChevronRight, X, RefreshCw, AlertCircle, 
  Camera, Check, Edit3, ArrowLeft
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  const { submissions, fetchSubmissions } = useSubmissionStore();

  const [activeSubTab, setActiveSubTab] = useState('details'); // details | submissions
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    profileImage: '',
    password: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Past submission inspector modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchSubmissions();
  }, [isAuthenticated, fetchProfile, fetchSubmissions, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/api/user-api/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        profileImage: formData.profileImage,
        password: formData.password || undefined
      });

      setFormSuccess('Profile details updated successfully');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      // Sync auth state
      await fetchProfile();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const handleViewSubmission = (sub) => {
    setSelectedSubmission(sub);
    setViewModalOpen(true);
  };

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const solvedCount = user?.solvedProblems?.length || 0;
  const rankLevel = Math.floor((user?.points || 0) / 100) + 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back to Dashboard Button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Challenges
      </button>

      {/* Grid: Stats Overview & Sub Menu Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Avatar & Quick stats card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-600 to-indigo-600" />
            
            {/* Avatar container */}
            <div className="relative inline-block mt-4">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-slate-900 mx-auto flex items-center justify-center shadow-lg relative group">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt={user?.username} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-650" />
                )}
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white mt-4">{user?.firstName} {user?.lastName}</h2>
            <p className="text-xs text-slate-450 mt-1">@{user?.username}</p>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-sm bg-slate-950/20 p-2.5 rounded-xl border border-white/5">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Score
                </span>
                <span className="font-extrabold text-amber-300">{user?.points || 0} pts</span>
              </div>
              
              <div className="flex items-center justify-between text-sm bg-slate-950/20 p-2.5 rounded-xl border border-white/5">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Solved
                </span>
                <span className="font-extrabold text-emerald-400">{solvedCount} Problems</span>
              </div>

              <div className="flex items-center justify-between text-sm bg-slate-950/20 p-2.5 rounded-xl border border-white/5">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-purple-400" />
                  Level
                </span>
                <span className="font-extrabold text-purple-400">Rank {rankLevel}</span>
              </div>
            </div>

            {/* Menu options buttons */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setActiveSubTab('details')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'details'
                    ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveSubTab('submissions')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'submissions'
                    ? 'bg-indigo-650/20 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                Submission History ({totalSubmissions})
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Tab View Panels */}
        <div className="lg:col-span-3">
          
          {activeSubTab === 'details' ? (
            <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-xl space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Profile Details</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your personal credentials and secure access options.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {formSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {formError && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 text-rose-455 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Row 1: Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-600 bg-slate-900/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-600 bg-slate-900/30"
                    />
                  </div>
                </div>

                {/* Row 2: Username & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">@</div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-650 bg-slate-900/30 font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-550 self-center pointer-events-none mt-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-650 bg-slate-900/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Profile Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Profile Image Link</label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="Enter absolute image address (e.g. HTTPS URL)..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-600 bg-slate-900/30"
                  />
                </div>

                {/* Row 4: Password Update */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Security Update</h4>
                    <p className="text-xxs text-slate-500 mt-0.5">Leave blank if you do not wish to reset your account password.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-650 bg-slate-900/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Verify your new password..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-650 bg-slate-900/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit action */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving Details...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-xl space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Submission History</h2>
                <p className="text-xs text-slate-400 mt-1">Review all your previous compilation submissions and inspect the code details.</p>
              </div>

              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                  <FileCode className="h-12 w-12 text-slate-700 mb-3" />
                  <span className="font-semibold text-slate-400">No submissions yet</span>
                  <p className="text-xs text-slate-500 mt-1">Launch challenges from the dashboard and submit code to populate standings.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {submissions.map((sub) => (
                    <div 
                      key={sub._id}
                      onClick={() => handleViewSubmission(sub)}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 border border-white/5 rounded-2xl p-4 hover:border-slate-800 hover:bg-slate-900/80 transition-all cursor-pointer group"
                      title="Click to view code submission details"
                    >
                      <div className="flex items-center gap-3">
                        {sub.status === 'Accepted' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <span className="font-extrabold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                            {sub.problem?.title || 'Coding Challenge'}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {new Date(sub.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 self-end md:self-center">
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
                        <span className="font-semibold text-slate-500 uppercase text-xxs border border-white/5 rounded px-1.5 py-0.5 bg-slate-950/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                          {sub.language}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

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
                <h4 className="text-sm font-bold text-white">{selectedSubmission.problem?.title || 'Coding Challenge'}</h4>
                <span className="text-slate-450 font-bold uppercase tracking-wider text-xxs block">Submitted Source Code</span>
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
                  <span className="text-rose-355 font-bold uppercase tracking-wider text-xxs block mb-1">Error Diagnostic / Compiler Stderr</span>
                  <pre className="text-rose-455 overflow-x-auto text-xxs font-mono max-h-24 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-white/5">
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
                Close
              </button>
              <button
                onClick={handleLoadCode}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer animate-pulse-soft"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Load Draft into Monaco Editor</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
