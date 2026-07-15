import { useState, useRef } from 'react';
import { Database, UploadCloud, PenLine } from 'lucide-react';
import Papa from 'papaparse';
import { generateSampleCSV, processUXData } from './utils/metricsEngine';
import KPICards from './components/KPICards';
import ChartsGrid from './components/ChartsGrid';
import MetricsTable from './components/MetricsTable';
import ManualEntryForm from './components/ManualEntryForm';
import AuthorSection from './components/AuthorSection';
import HowToUseSection from './components/HowToUseSection';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvPreview, setCsvPreview] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const result = processUXData(csv);
      
      setCsvPreview(csv.split('\n').slice(0, 5).join('\n') + '\n...');
      setMetrics(result);
      setIsProcessing(false);
    };
    reader.onerror = () => setIsProcessing(false);
    reader.readAsText(file);
  };

  const handleLoadSampleData = () => {
    setIsProcessing(true);
    setShowManualEntry(false);
    
    // Simulate network delay for effect
    setTimeout(() => {
      const csv = generateSampleCSV(100);
      const result = processUXData(csv);
      
      setCsvPreview(csv.split('\n').slice(0, 5).join('\n') + '\n...');
      setMetrics(result);
      setIsProcessing(false);
    }, 600);
  };

  const handleProcessManualData = (records) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Convert array of objects to CSV string so it flows through the same pipeline
      const csv = Papa.unparse(records);
      const result = processUXData(csv);
      
      setCsvPreview(csv.split('\n').slice(0, 5).join('\n') + '\n...');
      setMetrics(result);
      setIsProcessing(false);
      setShowManualEntry(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text flex items-center gap-2">
            <ActivityIcon className="text-primary" />
            Quantitative UX Metrics Platform
          </h1>
          <p className="text-textMuted mt-1">ISO 9241-11 Usability Analytics & Reporting (Simulated ETL Pipeline)</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${showManualEntry ? 'bg-primary text-white' : 'bg-surface hover:bg-slate-700 text-text border border-border'}`}
          >
            <PenLine className="w-5 h-5" />
            Manual Entry
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-surface hover:bg-slate-700 text-text border border-border px-5 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadCloud className="w-5 h-5" />
            Upload CSV
          </button>
          <button
            onClick={handleLoadSampleData}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
          >
            {isProcessing ? (
              <Database className="w-5 h-5 animate-pulse" />
            ) : (
              <Database className="w-5 h-5" />
            )}
            {isProcessing ? 'Processing Data...' : 'Load Sample Data'}
          </button>
        </div>
      </header>

      {showManualEntry && (
        <ManualEntryForm 
          onProcessData={handleProcessManualData} 
          onCancel={() => setShowManualEntry(false)} 
        />
      )}

      {!showManualEntry && metrics ? (
        <main className="animate-in fade-in duration-500">
          <KPICards kpis={metrics.globalKPIs} />
          <ChartsGrid tasks={metrics.tasks} />
          <MetricsTable tasks={metrics.tasks} />
        </main>
      ) : !showManualEntry ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-surface/50 text-textMuted">
          <Database className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg">No data loaded.</p>
          <p className="text-sm mt-1">Click "Load Sample Data" to simulate the ETL pipeline and process UX metrics.</p>
        </div>
      ) : null}
      
      {metrics && (
        <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-textMuted mb-2">Simulated Raw CSV Data Preview</h4>
          <pre className="text-xs text-textMuted overflow-x-auto p-2 bg-black/30 rounded">
            {csvPreview}
          </pre>
        </div>
      )}
      
      <HowToUseSection />
      <AuthorSection />
    </div>
  );
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default App;
