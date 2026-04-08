import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

const sqlite = new Database("./data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Auto-create tables on startup
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS training_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS staff_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    community TEXT NOT NULL DEFAULT '',
    added_at TEXT NOT NULL
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS assessment_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    staff_name TEXT NOT NULL,
    staff_title TEXT NOT NULL DEFAULT '',
    community TEXT NOT NULL DEFAULT '',
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    score_percent INTEGER NOT NULL,
    passed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL,
    certificate_id TEXT
  )
`);

// Add columns if they don't exist (for existing databases)
try { sqlite.exec(`ALTER TABLE assessment_results ADD COLUMN staff_title TEXT NOT NULL DEFAULT ''`); } catch {}
try { sqlite.exec(`ALTER TABLE assessment_results ADD COLUMN community TEXT NOT NULL DEFAULT ''`); } catch {}
try { sqlite.exec(`ALTER TABLE assessment_results ADD COLUMN section_breakdown TEXT`); } catch {}
