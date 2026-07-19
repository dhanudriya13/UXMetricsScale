import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually to avoid installing dotenv just for this script
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    // Remove quotes
    value = value.replace(/^['"](.*)['"]$/, '$1');
    envVars[key] = value;
  }
});

const url = envVars.NEXT_PUBLIC_TURSO_URL;
const authToken = envVars.NEXT_PUBLIC_TURSO_TOKEN;

if (!url || !authToken) {
  console.error("Missing NEXT_PUBLIC_TURSO_URL or NEXT_PUBLIC_TURSO_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function pushSchema() {
  console.log("Connecting to Turso at", url);
  try {
    console.log("Creating table ux_metrics if not exists...");
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
    console.log("Schema pushed successfully!");
  } catch (error) {
    console.error("Error pushing schema:", error);
  }
}

pushSchema();
