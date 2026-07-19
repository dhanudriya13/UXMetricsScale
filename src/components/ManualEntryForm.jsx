import { useState } from 'react';
import { Plus, Play, Trash2 } from 'lucide-react';

export default function ManualEntryForm({ onProcessData, onCancel }) {
  const [records, setRecords] = useState([]);
  
  const [formData, setFormData] = useState({
    user_id: '',
    task_id: '',
    success_state: '1',
    error_count: '0',
    time_on_task_seconds: '',
    pages_visited_total: '',
    pages_visited_unique: '',
    optimal_path_length: '',
    seq_score: '5',
    sus_scores: '3|3|3|3|3|3|3|3|3|3'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    setRecords([...records, { ...formData }]);
    // Reset specific fields for faster entry of next row
    setFormData({
      ...formData,
      user_id: '', // keep task_id same to save time
      time_on_task_seconds: '',
      error_count: '0',
      pages_visited_total: '',
      pages_visited_unique: ''
    });
  };

  const handleRemoveRecord = (index) => {
    const newRecords = [...records];
    newRecords.splice(index, 1);
    setRecords(newRecords);
  };

  const handleProcess = () => {
    if (records.length === 0) return;
    onProcessData(records);
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm p-6 mb-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text">Manual Data Entry</h2>
        <button onClick={onCancel} className="text-textMuted hover:text-text transition-colors">
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">User ID</label>
              <input required type="text" name="user_id" value={formData.user_id} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" placeholder="user_001" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Task ID</label>
              <input required type="text" name="task_id" value={formData.task_id} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" placeholder="Task_A" />
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Success State</label>
              <select name="success_state" value={formData.success_state} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary">
                <option value="1">Full Success (1)</option>
                <option value="0.5">Partial Success (0.5)</option>
                <option value="0">Fail (0)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Errors</label>
                <input required type="number" min="0" name="error_count" value={formData.error_count} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Time (s)</label>
                <input required type="number" step="0.1" min="0" name="time_on_task_seconds" value={formData.time_on_task_seconds} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-textMuted mb-1">Path Length (L)</label>
                <input required type="number" min="1" name="optimal_path_length" value={formData.optimal_path_length} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textMuted mb-1">Unique Pgs (N)</label>
                <input required type="number" min="1" name="pages_visited_unique" value={formData.pages_visited_unique} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textMuted mb-1">Total Pgs (R)</label>
                <input required type="number" min="1" name="pages_visited_total" value={formData.pages_visited_total} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">SEQ Score (1-7)</label>
              <input required type="number" min="1" max="7" name="seq_score" value={formData.seq_score} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">SUS Scores (10 items, 1-5)</label>
              <input required type="text" name="sus_scores" value={formData.sus_scores} onChange={handleChange} className="w-full bg-white border border-border rounded p-2 text-text font-mono text-sm focus:outline-none focus:border-primary" placeholder="4|5|3|4|5|2|4|3|5|4" />
              <p className="text-xs text-textMuted mt-1">Format: number|number|... (e.g. 4|5|3|4|5|2|4|3|5|4)</p>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-surface border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-text">Staged Records ({records.length})</h3>
            <button 
              onClick={handleProcess}
              disabled={records.length === 0}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" /> Process Data
            </button>
          </div>
          
          <div className="bg-slate-50 border border-border rounded flex-grow overflow-auto max-h-[500px]">
            {records.length === 0 ? (
              <div className="h-full flex items-center justify-center text-textMuted text-sm p-8">
                No records added yet. Fill out the form to stage data.
              </div>
            ) : (
              <table className="w-full text-xs text-left text-textMuted">
                <thead className="text-xs uppercase bg-slate-100 text-textMuted border-b border-border sticky top-0">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Task</th>
                    <th className="px-3 py-2">Success</th>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-slate-100/50">
                      <td className="px-3 py-2 font-medium text-text">{rec.user_id}</td>
                      <td className="px-3 py-2">{rec.task_id}</td>
                      <td className="px-3 py-2">
                        {rec.success_state === '1' ? <span className="text-success">Success</span> : rec.success_state === '0.5' ? <span className="text-warning">Partial</span> : <span className="text-danger">Fail</span>}
                      </td>
                      <td className="px-3 py-2">{rec.time_on_task_seconds}s</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => handleRemoveRecord(i)} className="text-danger hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
