export default function MetricsTable({ tasks }) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-slate-100/50">
        <h3 className="text-lg font-semibold text-text">Raw Computed Metrics per Task</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-textMuted">
          <thead className="text-xs uppercase bg-slate-100 text-textMuted border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3">Task ID</th>
              <th scope="col" className="px-6 py-3">TCR (%)</th>
              <th scope="col" className="px-6 py-3">Partial (%)</th>
              <th scope="col" className="px-6 py-3">Avg Errors</th>
              <th scope="col" className="px-6 py-3">Avg Time (s)</th>
              <th scope="col" className="px-6 py-3">Rel. Efficiency (%)</th>
              <th scope="col" className="px-6 py-3">Avg Lostness</th>
              <th scope="col" className="px-6 py-3">Avg SEQ</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task.taskId} className={`border-b border-border hover:bg-slate-200/50 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50'}`}>
                <td className="px-6 py-4 font-medium text-text whitespace-nowrap">
                  {task.taskId}
                </td>
                <td className="px-6 py-4 text-success">{task.TCR.toFixed(1)}</td>
                <td className="px-6 py-4 text-warning">{task.partialRate.toFixed(1)}</td>
                <td className="px-6 py-4">{task.avgErrors.toFixed(2)}</td>
                <td className="px-6 py-4">{task.avgSuccessTime.toFixed(1)}</td>
                <td className="px-6 py-4 text-primary">{task.relativeEfficiency.toFixed(1)}</td>
                <td className="px-6 py-4">{task.avgLostness.toFixed(3)}</td>
                <td className="px-6 py-4">{task.avgSeq.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
