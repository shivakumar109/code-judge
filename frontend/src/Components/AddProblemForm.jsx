import React, { useState } from 'react';
import useAdminStore from '../Store/adminStore.js';
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle2, ListPlus } from 'lucide-react';

export const AddProblemForm = () => {
  const { createProblem, submitting, error, success, clearState } = useAdminStore();

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

  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      setValidationError('A minimum of 3 hidden test cases are required for judging');
      return;
    }
    const updated = hiddenTestCases.filter((_, idx) => idx !== index);
    setValidationError('');
    setHiddenTestCases(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearState();

    const {
      title, difficulty, tags, description, constraints, 
      inputFormat, outputFormat, sampleInput, sampleOutput, explanation
    } = formData;

    // Validation
    if (!title.trim() || !description.trim() || !constraints.trim() || !inputFormat.trim() || !outputFormat.trim() || !sampleInput.trim() || !sampleOutput.trim()) {
      setValidationError('Please fill in all standard required fields');
      return;
    }

    // Check hidden test cases
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
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        hiddenTestCases: hiddenTestCases.map(tc => ({
          input: tc.input.trim(),
          output: tc.output.trim()
        }))
      };

      await createProblem(problemData);
      
      // Reset form on success
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
    } catch (err) {
      // Handled by store error state
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl animate-in fade-in duration-300">
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        
        {/* Feedback Alerts */}
        {(validationError || error) && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{validationError || error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Title, Difficulty, Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Problem Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-900/30"
              placeholder="e.g. Two Sum Problem"
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
              placeholder="e.g. Arrays, Hash Table, Math"
            />
          </div>

        </div>

        {/* Description Textarea */}
        <div className="space-y-1.5">
          <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Description & Statement specs*</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none font-mono bg-slate-900/30"
            placeholder="Provide complete algorithmic problem challenge description..."
          />
        </div>

        {/* Formats and Constraints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Input Format Specification*</label>
            <textarea
              name="inputFormat"
              rows={3}
              value={formData.inputFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none bg-slate-900/30"
              placeholder="e.g. First line contains N elements..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Output Format Specification*</label>
            <textarea
              name="outputFormat"
              rows={3}
              value={formData.outputFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none bg-slate-900/30"
              placeholder="e.g. Print single integer..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Algorithmic Constraints*</label>
            <textarea
              name="constraints"
              rows={3}
              value={formData.constraints}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input resize-none font-mono bg-slate-900/30"
              placeholder="e.g. 1 <= N <= 10^5"
            />
          </div>

        </div>

        {/* Sample Inputs / Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/20 border border-white/5 rounded-2xl p-4.5">
          
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-indigo-400 uppercase tracking-wider block pl-1">Sample Input*</label>
            <textarea
              name="sampleInput"
              rows={3}
              value={formData.sampleInput}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
              placeholder="Sample stdin inputs..."
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
              placeholder="Sample expected output..."
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block pl-1">Example Explanation (Optional)</label>
            <textarea
              name="explanation"
              rows={2}
              value={formData.explanation}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs rounded-xl text-slate-200 glass-input bg-slate-900/30"
              placeholder="Explain why the input maps to the output..."
            />
          </div>

        </div>

        {/* Secure Hidden Test Cases Section */}
        <div className="space-y-4 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pl-1">
                <ListPlus className="h-4 w-4 text-indigo-400" />
                Secure Hidden Test Cases (Minimum 3 Required)*
              </h3>
              <p className="text-[10px] text-slate-500 pl-1">These will only run in the backend judge during submissions.</p>
            </div>
            <button
              type="button"
              onClick={addTestCaseField}
              className="flex items-center gap-1 bg-slate-900 border border-white/10 hover:border-indigo-500 hover:text-indigo-400 text-slate-350 text-xxs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              + Add Case
            </button>
          </div>

          {/* Testcase rows */}
          <div className="space-y-4">
            {hiddenTestCases.map((tc, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row items-start gap-4 bg-slate-950/30 p-4 rounded-2xl border border-white/5 relative"
              >
                <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-550 font-extrabold text-[9px] shadow">
                  {index + 1}
                </span>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 pl-1 block">Hidden Input</label>
                  <textarea
                    rows={2}
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    className="w-full px-3 py-2 text-xxs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                    placeholder="Stdin inputs..."
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 pl-1 block">Expected Output</label>
                  <textarea
                    rows={2}
                    value={tc.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    className="w-full px-3 py-2 text-xxs rounded-xl text-slate-200 glass-input font-mono bg-slate-900/30"
                    placeholder="Expected stdout..."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeTestCaseField(index)}
                  className="self-end md:self-center text-rose-550 hover:text-rose-455 bg-rose-500/5 hover:bg-rose-500/10 p-2 rounded-xl border border-rose-500/10 transition-colors mt-2 cursor-pointer"
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
          disabled={submitting}
          className="flex w-full justify-center items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 py-3 text-xs font-bold text-white shadow-xl hover:from-indigo-600 hover:to-violet-600 transition-all disabled:opacity-50 mt-4 cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <>
              <Plus className="h-4.5 w-4.5 animate-pulse-soft" />
              <span>Create Coding Challenge</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default AddProblemForm;
