import { createClient } from '@libsql/client/web';

const client = createClient({
  url: import.meta.env.NEXT_PUBLIC_TURSO_URL,
  authToken: import.meta.env.NEXT_PUBLIC_TURSO_TOKEN,
});

export const initDb = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS ux_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      task_id TEXT,
      success_state REAL,
      error_count INTEGER,
      time_on_task_seconds REAL,
      pages_visited_total INTEGER,
      pages_visited_unique INTEGER,
      optimal_path_length INTEGER,
      seq_score INTEGER,
      sus_scores TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const fetchUXData = async () => {
  const result = await client.execute('SELECT * FROM ux_metrics ORDER BY created_at DESC');
  return result.rows;
};

export const insertUXDataBatch = async (records) => {
  const statements = records.map(record => ({
    sql: `INSERT INTO ux_metrics (
      user_id, task_id, success_state, error_count, time_on_task_seconds, 
      pages_visited_total, pages_visited_unique, optimal_path_length, 
      seq_score, sus_scores
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      record.user_id,
      record.task_id,
      Number(record.success_state),
      Number(record.error_count),
      Number(record.time_on_task_seconds),
      Number(record.pages_visited_total),
      Number(record.pages_visited_unique),
      Number(record.optimal_path_length),
      Number(record.seq_score),
      record.sus_scores ? String(record.sus_scores) : null
    ]
  }));
  
  if (statements.length > 0) {
    await client.batch(statements, 'write');
  }
};
