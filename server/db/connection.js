import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'taskflow.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Check if tables exist
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='team_members'"
    ).get();

    if (!tables) {
      const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
      db.exec(schema);

      const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
      db.exec(seed);

      console.log('Database initialized with schema and seed data');
    }
  }
  return db;
}

export default getDb;
