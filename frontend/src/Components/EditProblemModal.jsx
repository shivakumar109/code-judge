import React, { useState, useEffect } from 'react';
import useAdminStore from '../Store/adminStore.js';
import { X, Save, Plus, Trash2, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export const EditProblemModal = ({ problem, onClose }) => {
  const { updateProblem, submitting, error, success, clearState } = useAdminStore();

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
    isProblemActive: true,
  });

  const [hiddenTestCases, setHiddenTestCases] = useState([]);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    clearState();
    if (problem) {
      setFormData({
        title: problem.title || '',
        difficulty: problem.difficulty || 'Easy',
        tags: problem.tags ? problem.tags.join(', ') : '',
        description: problem.description || '',
        constraints: problem.constraints || '',
        inputFormat: problem.inputFormat || '',
        outputFormat: problem.outputFormat || '',
        sampleInput: problem.sampleInput || '',
        sampleOutput: problem.sampleOutput || '',
        explanation: problem.explanation || '',
        isProblemActive: problem.isProblemActive ?? true,
      });
      setHiddenTestCases(problem.hiddenTestCases || []);
    }
  }, [problem, clearState]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...hiddenTestCases];
    updated[index] = { ...updated[index], [field]: value };
    setHiddenTestCases(updated);
  };

  const addTestCaseField = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
  };

  const removeTestCaseField = (index) => {
    if (hiddenTestCases.length <= 3) {
      setValidationError('A minimum of 3 hidden test cases are required for compiling/judging');
      return;
    }
    const updated = hiddenTestCases.filter((_, idx) => idx !== index);
    setValidationError('');
    setHiddenTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const {
      title, difficulty, tags, description, constraints, 
      inputFormat, outputFormat, sampleInput, sampleOutput, explanation, isProblemActive
    } = formData;

    if (!title.trim() || !description.trim() || !constraints.trim() || !inputFormat.trim() || !outputFormat.trim() || !sampleInput.trim() || !sampleOutput.trim()) {
      setValidationError('Please fill in all standard required fields');
      return;
    }

    if (hiddenTestCases.length < 3) {
      setValidationError('A minimum of 3 hidden test cases are required');
      return;
    }

    const invalidTestCase = hiddenTestCases.some(tc => !tc.input.trim() || !tc.output.trim());
    if (invalidTestCase) {
      setValidationError('All hidden test cases must have non-empty Input and Output fields');
      return;
    }

    try {
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
        isProblemActive,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        hiddenTestCases: hiddenTestCases.map(tc => ({
          input: tc.input.trim(),
          output: tc.output.trim()
        }))
      };

      await updateProblem(problem._id, problemData);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      // Handled by store error state
    }
  };

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Modify Coding Challenge</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Error and Success alerts */}
          {(validationError || error) && (
            <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span>{validationError || error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-450" />
              <span>{success}</span>
            </div>
          )}

          {/* Row 1: Title, Difficulty, Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Problem Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-900/30"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Difficulty Level*</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-950 border border-white/5 cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Topics (Comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-900/30"
              />
            </div>
          </div>

          {/* Row 2: Status Checkbox */}
          <div className="flex items-center gap-2.5 bg-slate-950/20 p-4 rounded-xl border border-white/5">
            <input
              type="checkbox"
              id="isProblemActive"
              name="isProblemActive"
              checked={formData.isProblemActive}
              onChange={handleInputChange}
              className="h-4.5 w-4.5 rounded border-white/10 text-indigo-600 focus:ring-indigo-500/20 bg-slate-900 cursor-pointer"
            />
            <label htmlFor="isProblemActive" className="text-xs font-bold text-slate-200 uppercase tracking-wider cursor-pointer">
              Challenge Status Active (Visible on Programmers listing)
            </label>
          </div>

          {/* Row 3: Description */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Description & Specs*</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none font-mono bg-slate-900/30"
            />
          </div>

          {/* Row 4: Specs Specifiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Input Format Spec*</label>
              <textarea
                name="inputFormat"
                rows={3}
                value={formData.inputFormat}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none bg-slate-900/30"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Output Format Spec*</label>
              <textarea
                name="outputFormat"
                rows={3}
                value={formData.outputFormat}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none bg-slate-900/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Constraints*</label>
              <textarea
                name="constraints"
                rows={3}
                value={formData.constraints}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none font-mono bg-slate-900/30"
              />
            </div>
          </div>

          {/* Row 5: Sample Case */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/20 border border-white/5 rounded-2xl p-4.5">
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-indigo-400 uppercase tracking-wider block pl-1">Sample Input*</label>
              <textarea
                name="sampleInput"
                rows={3}
                value={formData.sampleInput}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-emerald-400 uppercase tracking-wider block pl-1">Sample Output*</label>
              <textarea
                name="sampleOutput"
                rows={3}
                value={formData.sampleOutput}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Example Explanation</label>
              <textarea
                name="explanation"
                rows={2}
                value={formData.explanation}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-900/30"
              />
            </div>
          </div>

          {/* Row 6: Hidden Test Cases */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider block">Secure Test cases (Minimum 3 Required)*</h4>
                <p className="text-[10px] text-slate-500 block mt-0.5">Edit secret inputs/outputs used in compile-time evaluations.</p>
              </div>
              <button
                type="button"
                onClick={addTestCaseField}
                className="flex items-center gap-1 bg-slate-900 border border-white/10 hover:border-indigo-500 hover:text-indigo-400 text-slate-350 text-xxs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                + Add Case
              </button>
            </div>

            <div className="space-y-4">
              {hiddenTestCases.map((tc, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 bg-slate-950/30 p-4 rounded-2xl border border-white/5 relative">
                  <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-550 font-extrabold text-[9px] shadow">
                    {idx + 1}
                  </span>
                  
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 pl-1 block">Hidden Input</label>
                    <textarea
                      rows={2}
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                      className="w-full px-3 py-2 text-xxs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 pl-1 block">Expected Output</label>
                    <textarea
                      rows={2}
                      value={tc.output}
                      onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)}
                      className="w-full px-3 py-2 text-xxs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTestCaseField(idx)}
                    className="self-end md:self-center text-rose-550 hover:text-rose-455 bg-rose-500/5 hover:bg-rose-500/10 p-2 rounded-xl border border-rose-500/10 transition-colors mt-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>

        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-slate-950/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProblemModal;
