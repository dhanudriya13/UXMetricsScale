import { useState, useRef, useEffect } from 'react';
import { Database, UploadCloud, PenLine } from 'lucide-react';
import Papa from 'papaparse';
import { generateSampleCSV, processUXRecords } from './utils/metricsEngine';
import { initDb, fetchUXData, insertUXDataBatch } from './utils/db';
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

  // Initialize DB on component mount
  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target.result;
      
      try {
        const parsed = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
        if (parsed.data.length > 0) {
          await insertUXDataBatch(parsed.data);
          
          // Refresh data from DB
          const records = await fetchUXData();
          const result = processUXRecords(records);
          setCsvPreview('Data successfully imported to Turso database.\nTotal records: ' + records.length);
          setMetrics(result);
        }
      } catch (err) {
        console.error('Failed to import CSV:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => setIsProcessing(false);
    reader.readAsText(file);
  };

  const handleLoadSampleData = async () => {
    setIsProcessing(true);
    setShowManualEntry(false);
    
    try {
      const records = await fetchUXData();
      if (records.length === 0) {
        // No data, optionally we could insert some sample data here, 
        // but for now we just show empty or insert dummy data
        const dummyCSV = generateSampleCSV(50);
        const parsed = Papa.parse(dummyCSV, { header: true, dynamicTyping: true, skipEmptyLines: true });
        await insertUXDataBatch(parsed.data);
        const newRecords = await fetchUXData();
        const result = processUXRecords(newRecords);
        setCsvPreview('Initialized Turso DB with sample data.\nTotal records: ' + newRecords.length);
        setMetrics(result);
      } else {
        const result = processUXRecords(records);
        setCsvPreview('Fetched from Turso Database.\nTotal records: ' + records.length);
        setMetrics(result);
      }
    } catch (err) {
      console.error('Failed to fetch from DB:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessManualData = async (records) => {
    setIsProcessing(true);
    try {
      await insertUXDataBatch(records);
      const allRecords = await fetchUXData();
      const result = processUXRecords(allRecords);
      setCsvPreview('Added manual entry to Turso Database.\nTotal records: ' + allRecords.length);
      setMetrics(result);
      setShowManualEntry(false);
    } catch (err) {
      console.error('Failed to insert manual data:', err);
    } finally {
      setIsProcessing(false);
    }
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${showManualEntry ? 'bg-primary text-white' : 'bg-surface hover:bg-slate-200 text-text border border-border'}`}
          >
            <PenLine className="w-5 h-5" />
            Manual Entry
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-surface hover:bg-slate-200 text-text border border-border px-5 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-textMuted mb-2">Database Status</h4>
          <pre className="text-xs text-textMuted overflow-x-auto p-2 bg-slate-100 rounded whitespace-pre-wrap">
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
