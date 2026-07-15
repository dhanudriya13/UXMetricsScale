import { Activity, Clock, Crosshair, ThumbsUp, AlertCircle } from 'lucide-react';

export default function KPICards({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-textMuted uppercase tracking-wider">Avg TCR</span>
          <Crosshair className="text-primary w-5 h-5" />
        </div>
        <div className="text-3xl font-bold text-text">
          {kpis.avgTCR.toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-textMuted uppercase tracking-wider">Overall Efficiency</span>
          <Activity className="text-success w-5 h-5" />
        </div>
        <div className="text-3xl font-bold text-text">
          {kpis.overallEfficiency.toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-textMuted uppercase tracking-wider">Avg Lostness</span>
          <AlertCircle className="text-warning w-5 h-5" />
        </div>
        <div className="text-3xl font-bold text-text">
          {kpis.avgLostness.toFixed(3)}
        </div>
      </div>
      
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-textMuted uppercase tracking-wider">Avg SEQ</span>
          <ThumbsUp className="text-primary w-5 h-5" />
        </div>
        <div className="text-3xl font-bold text-text">
          {kpis.avgSeq.toFixed(1)} <span className="text-base text-textMuted font-normal">/ 7</span>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-textMuted uppercase tracking-wider">Global SUS</span>
          <Clock className="text-primary w-5 h-5" />
        </div>
        <div className="text-3xl font-bold text-text">
          {kpis.avgSUS !== null ? kpis.avgSUS.toFixed(1) : '-'} <span className="text-base text-textMuted font-normal">/ 100</span>
        </div>
      </div>
    </div>
  );
}
