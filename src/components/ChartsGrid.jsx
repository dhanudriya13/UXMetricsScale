import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';

export default function ChartsGrid({ tasks }) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Success / Partial / Fail Rates */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-text mb-4">Task Completion breakdown</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tasks} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="taskId" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" unit="%" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="TCR" name="Success Rate" stackId="a" fill="#22c55e" />
              <Bar dataKey="partialRate" name="Partial Success" stackId="a" fill="#eab308" />
              <Bar dataKey="failRate" name="Failure Rate" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Avg Time vs Avg Lostness */}
      <div className="bg-surface p-4 rounded-lg border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-text mb-4">Time on Task vs Lostness</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={tasks} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="taskId" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" label={{ value: 'Lostness', angle: 90, position: 'insideRight', fill: '#94a3b8' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="avgSuccessTime" name="Avg Time (Success)" fill="#3b82f6" barSize={30} />
              <Line yAxisId="right" type="monotone" dataKey="avgLostness" name="Avg Lostness" stroke="#eab308" strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
