import { Info, UploadCloud, Database, PenLine } from 'lucide-react';

const HowToUseSection = () => {
  return (
    <div className="mt-8 mb-8 bg-surface border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <Info className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-text">How to Use This System</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background border border-border rounded-lg p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-text">1. Load Sample Data</h3>
          </div>
          <p className="text-sm text-textMuted leading-relaxed">
            Quickly test the platform by clicking <strong>Load Sample Data</strong>. This simulates a dataset with 100 entries, allowing you to instantly preview the dashboards, KPIs, and computed metrics.
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <UploadCloud className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-text">2. Upload CSV</h3>
          </div>
          <p className="text-sm text-textMuted leading-relaxed">
            Upload your own raw UX data in CSV format. The system acts as a simulated ETL pipeline, parsing your CSV to calculate effectiveness, efficiency, and satisfaction metrics automatically.
          </p>
        </div>

        <div className="bg-background border border-border rounded-lg p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-text">3. Manual Entry</h3>
          </div>
          <p className="text-sm text-textMuted leading-relaxed">
            Use the <strong>Manual Entry</strong> feature to input UX task results directly into the system. Useful for quickly testing specific scenarios or entering data from small qualitative sessions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToUseSection;
