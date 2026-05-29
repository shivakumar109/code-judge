import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/authStore.js';
import { useSubmissionStore } from '../Store/submissionStore.js';
import authService from '../Services/authService.js';
import api from '../Services/api.js';
import Editor from '@monaco-editor/react';
import { 
  User, Mail, Key, Shield, Trophy, CheckCircle, Clock, 
  Cpu, FileCode, ChevronRight, X, RefreshCw, AlertCircle, 
  Camera, Check, Edit3, ArrowLeft, XCircle, Settings, Award, 
  Zap, Activity, Info, Calendar, Sparkles, UploadCloud, Loader2
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchProfile, isAuthenticated } = useAuthStore();
  const { submissions, fetchSubmissions } = useSubmissionStore();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | submissions | solved | settings
  const [isEditing, setIsEditing] = useState(false); // Controls whether the details are editable
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation for PNG/JPG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PNG, JPG, and JPEG files are allowed');
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');
    
    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      const response = await api.post('/api/user-api/upload-avatar', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          profileImage: response.data.secure_url,
        }));
      }
    } catch (err) {
      console.error('File upload error:', err);
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
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
      const response = await api.put('/api/user-api/edit-profile', {
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
      setIsEditing(false); // Lock editing back to view mode on success
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to update profile details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
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
    setIsEditing(false);
    setFormError('');
    setFormSuccess('');
    setUploadError('');
    setUploading(false);
  };

  const handleLoadCode = () => {
    if (selectedSubmission) {
      const problemId = selectedSubmission.problem?._id || selectedSubmission.problem;
      navigate(`/problem/${problemId}`, { 
        state: { 
          draftCode: selectedSubmission.code, 
          draftLanguage: selectedSubmission.language 
        } 
      });
    }
  };

  const handleViewSubmission = (sub) => {
    setSelectedSubmission(sub);
    setViewModalOpen(true);
  };

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const solvedCount = user?.solvedProblems?.length || 0;

  const points = user?.points || 0;
  const rankLevel = Math.floor(points / 100) + 1;
  const pointsInCurrentLevel = points % 100;
  const progressPercent = pointsInCurrentLevel; // pointsInCurrentLevel / 100 * 100 = pointsInCurrentLevel
  const pointsNeeded = 100 - pointsInCurrentLevel;

  const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
  const acceptedCount = acceptedSubmissions.length;
  const accuracy = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

  // Solved breakdown
  const solvedEasy = user?.solvedProblems?.filter(p => p.difficulty === 'Easy').length || 0;
  const solvedMedium = user?.solvedProblems?.filter(p => p.difficulty === 'Medium').length || 0;
  const solvedHard = user?.solvedProblems?.filter(p => p.difficulty === 'Hard').length || 0;

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
                  <img 
                    src={formData.profileImage} 
                    alt={user?.username} 
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                    }}
                  />
                ) : (
                  <User className="h-12 w-12 text-slate-650" />
                )}
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white mt-4">{user?.firstName} {user?.lastName}</h2>
            <p className="text-xs text-slate-450 mt-1">@{user?.username}</p>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div 
                onClick={() => setActiveSubTab('solved')}
                className="flex items-center justify-between text-sm bg-slate-950/20 p-2.5 rounded-xl border border-white/5 hover:border-slate-800/40 transition-all cursor-pointer group/stat"
                title="Click to view solved problems details"
              >
                <span className="text-slate-400 font-semibold flex items-center gap-1.5 group-hover/stat:text-amber-400 transition-colors">
                  <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                  Score
                </span>
                <span className="font-extrabold text-amber-300 group-hover/stat:scale-105 transition-transform">{user?.points || 0} pts</span>
              </div>
              
              <div 
                onClick={() => setActiveSubTab('solved')}
                className={`flex items-center justify-between text-sm p-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeSubTab === 'solved'
                    ? 'bg-indigo-650/20 text-indigo-400 border-indigo-500/20 shadow-md font-bold'
                    : 'bg-slate-950/20 text-slate-400 border-white/5 hover:bg-slate-800/20 hover:text-slate-200'
                }`}
                title="Click to view all solved problems"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  Solved
                </span>
                <span className="font-extrabold text-emerald-400">{solvedCount} Problems</span>
              </div>

              <div 
                onClick={() => setActiveSubTab('overview')}
                className={`flex items-center justify-between text-sm p-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeSubTab === 'overview'
                    ? 'bg-indigo-650/20 text-indigo-400 border-indigo-500/20 shadow-md font-bold'
                    : 'bg-slate-950/20 text-slate-400 border-white/5 hover:bg-slate-800/20 hover:text-slate-200'
                }`}
                title="Click to view Rank level overview"
              >
                <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-purple-400 shrink-0" />
                  Level
                </span>
                <span className="font-extrabold text-purple-450">Rank {rankLevel}</span>
              </div>

            {user?.role !== 'admin' && (
              <>
                <div className="mt-4 flex gap-4">
                  <div className="flex-1 rounded-2xl bg-slate-900/40 border border-white/5 p-3 text-center">
                    <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Score</span>
                    <span className="block text-amber-400 font-extrabold text-sm mt-1">{points} pts</span>
                  </div>
                  <div className="flex-1 rounded-2xl bg-slate-900/40 border border-white/5 p-3 text-center">
                    <span className="block text-slate-400 text-xxs font-bold uppercase tracking-wider">Solved</span>
                    <span className="block text-emerald-400 font-extrabold text-sm mt-1">{solvedCount} Problems</span>
                  </div>
                </div>

                {/* Level badge */}
                <div className="mt-4 rounded-2xl bg-slate-950/60 border border-white/5 p-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span className="text-slate-300 text-xs font-semibold">Level</span>
                  </div>
                  <span className="text-purple-400 font-extrabold text-sm">Rank {rankLevel}</span>
                </div>
              </>
            )}
            </div>

            {/* Menu options buttons */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  activeSubTab === 'overview'
                    ? 'bg-indigo-650/25 text-indigo-400 border-indigo-500/20 shadow-lg'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <User className="h-4 w-4 shrink-0" />
                Profile Overview
              </button>
              
              <button
                onClick={() => setActiveSubTab('solved')}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  activeSubTab === 'solved'
                    ? 'bg-indigo-650/25 text-indigo-400 border-indigo-500/20 shadow-lg'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Trophy className="h-4 w-4 shrink-0" />
                Solved Problems
              </button>

              <button
                onClick={() => setActiveSubTab('submissions')}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  activeSubTab === 'submissions'
                    ? 'bg-indigo-650/25 text-indigo-400 border-indigo-500/20 shadow-lg'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Activity className="h-4 w-4 shrink-0" />
                Submissions ({totalSubmissions})
              </button>

              <button
                onClick={() => setActiveSubTab('settings')}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  activeSubTab === 'settings'
                    ? 'bg-indigo-650/25 text-indigo-400 border-indigo-500/20 shadow-lg'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                Account Settings
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Tab View Panels */}
        <div className="lg:col-span-3">
          
          {activeSubTab === 'overview' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Banner */}
              <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/30 via-indigo-900/30 to-slate-900/30 border border-white/5 p-6 overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-650/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                    <Sparkles className="h-8 w-8 animate-pulse-soft" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Profile Overview</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Welcome back, developer. Monitor your performance, stats, and milestones.</p>
                  </div>
                </div>
              </div>

              {/* Grid: User Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Details card 1: Personal Info */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl space-y-4 relative overflow-hidden bg-slate-900/20">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Identity Details</span>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-350">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">First Name</span>
                      <span className="font-semibold text-slate-200">{user?.firstName || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">Last Name</span>
                      <span className="font-semibold text-slate-200">{user?.lastName || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">Username</span>
                      <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">@{user?.username}</span>
                    </div>
                  </div>
                </div>

                {/* Details card 2: Account Info */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl space-y-4 relative overflow-hidden bg-slate-900/20">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Contact & Status</span>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-355">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">Email Address</span>
                      <span className="font-semibold text-slate-200">{user?.email || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">Role Privilege</span>
                      <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] bg-slate-950/40 border border-white/5 rounded px-2 py-0.5">Participant</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-455 font-medium">Status</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Gamified Level & Progression Card */}
              {user?.role !== 'admin' && (
                <div className="glass-card rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden bg-gradient-to-br from-indigo-950/15 to-purple-950/15">
                  <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400 animate-pulse-soft" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Rank Progression</span>
                    </div>
                    <span className="font-semibold text-purple-400 text-xs">Level {rankLevel}</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex justify-between text-xs font-medium text-slate-350">
                      <span>Rank Progression Milestone</span>
                      <span className="font-extrabold text-indigo-400">{progressPercent} / 100 XP</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                        style={{ width: `${progressPercent}%` }} 
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xxs text-slate-450 mt-1 pl-1">
                      <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>You need <strong className="text-slate-300 font-semibold">{pointsNeeded} points</strong> to level up to <strong className="text-purple-400 font-semibold">Rank {rankLevel + 1}</strong>. Keep solving challenges!</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid: Advanced Statistics Grid */}
              {user?.role !== 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Accuracy gauge card */}
                  <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20 shadow-xl flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <Activity className="h-4 w-4 text-violet-450 shrink-0" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Accuracy Rating</span>
                    </div>
                    <div className="text-center py-2">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{accuracy}%</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Solution Accuracy</p>
                    </div>
                    <div className="text-xxs text-slate-450 text-center border-t border-white/5 pt-2.5 leading-relaxed">
                      Accepted: <strong className="text-emerald-400 font-semibold">{acceptedCount}</strong> of <strong className="text-slate-300 font-semibold">{totalSubmissions}</strong> total runs.
                    </div>
                  </div>

                  {/* Submissions breakdown */}
                  <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20 shadow-xl flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <FileCode className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Total Submissions</span>
                    </div>
                    <div className="text-center py-2">
                      <span className="text-4xl font-extrabold text-white tracking-tight">{solvedCount}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Solved Tasks</p>
                    </div>
                    <div className="text-xxs text-slate-450 text-center border-t border-white/5 pt-2.5 leading-relaxed">
                      Overall performance ranking details across platform solvers.
                    </div>
                  </div>

                  {/* Task Difficulty Breakdown Bar */}
                  <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-900/20 shadow-xl flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <Award className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Task Breakdown</span>
                    </div>
                    
                    <div className="space-y-2 text-xxs font-mono">
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Easy Solved</span>
                        <span className="font-bold">{solvedEasy}</span>
                      </div>
                      <div className="flex justify-between items-center text-amber-400">
                        <span>Medium Solved</span>
                        <span className="font-bold">{solvedMedium}</span>
                      </div>
                      <div className="flex justify-between items-center text-rose-400">
                        <span>Hard Solved</span>
                        <span className="font-bold">{solvedHard}</span>
                      </div>
                    </div>

                    <div className="text-xxs text-slate-450 text-center border-t border-white/5 pt-2.5 leading-relaxed">
                      Difficulty statistics from solved code exercises.
                    </div>
                  </div>

                </div>
              )}

              {/* Action Button: Edit profile toggle */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveSubTab('settings')}
                  className="flex items-center gap-2 rounded-xl border border-indigo-500/20 hover:bg-indigo-550/10 hover:border-indigo-500/40 text-indigo-400 px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/5 hover:-translate-y-0.5"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile Settings
                </button>
              </div>

            </div>
          ) : activeSubTab === 'settings' ? (
            <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-xl space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Update Profile</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your personal profile details and account credentials.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {formSuccess && (
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{formSuccess}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormSuccess('');
                        setActiveSubTab('overview');
                      }}
                      className="text-emerald-450 font-bold hover:underline hover:text-emerald-300 cursor-pointer ml-4"
                    >
                      Go to Overview &rarr;
                    </button>
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
                      className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
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
                      className="w-full px-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
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
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30 font-semibold"
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
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Profile Image URL & File Upload with Real-time Circular Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/20 p-5 rounded-2xl border border-white/5">
                  <div className="md:col-span-9 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 pl-1">Profile Image</label>
                      <span className="text-[10px] text-slate-500">Only PNG, JPG, or JPEG allowed (Max 5MB)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Left: Standard URL Input */}
                      <div className="relative flex-grow">
                        <Camera className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-550 self-center pointer-events-none mt-3" />
                        <input
                          type="url"
                          name="profileImage"
                          value={formData.profileImage}
                          onChange={handleChange}
                          placeholder="Paste public image link (e.g. Imgur, Unsplash)..."
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
                        />
                      </div>

                      {/* Right: Upload File Trigger */}
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          accept="image/png, image/jpeg, image/jpg" 
                          className="hidden" 
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full sm:w-auto h-full flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-550/25 hover:border-indigo-500/40 text-indigo-400 text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-3.5 w-3.5" />
                              <span>Upload Photo</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {uploadError && (
                      <p className="text-xxs text-rose-400 font-semibold pl-1 flex items-center gap-1 animate-in fade-in duration-200">
                        <AlertCircle className="h-3 w-3 text-rose-500" />
                        {uploadError}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-550 pl-1 block">
                      Either provide a public image web address or upload a local image file directly to Cloudinary.
                    </span>
                  </div>
                  
                  {/* Real-time Preview */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center pt-2 md:pt-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Preview</span>
                    <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-indigo-500/20 bg-slate-900 flex items-center justify-center shadow-lg relative group">
                      {formData.profileImage ? (
                        <img 
                          src={formData.profileImage} 
                          alt="Avatar preview" 
                          className="h-full w-full object-cover animate-in fade-in" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                          }}
                        />
                      ) : (
                        <User className="h-8 w-8 text-slate-650 animate-in fade-in" />
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xxs flex flex-col items-center justify-center text-indigo-400">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 4: Password Updates (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/20 p-4.5 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">New Password (Optional)</label>
                    <div className="relative">
                      <Key className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-550 self-center pointer-events-none mt-3" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block pl-1">Confirm New Password</label>
                    <div className="relative">
                      <Key className="absolute inset-y-0 left-0 pl-3.5 h-4 w-4 text-slate-550 self-center pointer-events-none mt-3" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input placeholder-slate-655 bg-slate-900/30"
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
          ) : activeSubTab === 'submissions' ? (
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
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-xl space-y-6 animate-in fade-in duration-300">
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Solved Challenges</h2>
                <p className="text-xs text-slate-400 mt-1">Review all the coding challenges you have successfully solved.</p>
              </div>

              {(!user?.solvedProblems || user.solvedProblems.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                  <Trophy className="h-12 w-12 text-slate-700 mb-3" />
                  <span className="font-semibold text-slate-400">No problems solved yet</span>
                  <p className="text-xs text-slate-500 mt-1">Launch challenges from the dashboard and submit successful solutions to stand out!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {user.solvedProblems.map((prob) => (
                    <div
                      key={prob._id}
                      onClick={() => navigate(`/problem/${prob._id}`)}
                      className="flex items-center justify-between bg-slate-900/40 border border-white/5 rounded-2xl p-4.5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group"
                      title="Click to view challenge statements and resolve"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <span className="font-extrabold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                            {prob.title}
                          </span>
                          <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {prob.tags?.map((tag) => (
                              <span key={tag} className="inline-block rounded bg-slate-850 border border-white/5 px-2 py-0.5 text-[9px] font-medium text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-5 ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {prob.difficulty}
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
