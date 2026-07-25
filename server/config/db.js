const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'devtrack.db');
const dbDir = path.dirname(DB_PATH);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    _id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    githubUsername TEXT DEFAULT '',
    leetcodeUsername TEXT DEFAULT '',
    githubData TEXT,
    leetcodeData TEXT,
    hackerRankUsername TEXT DEFAULT '',
    hackerRankData TEXT,
    jobMatchScore INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`);

const migrateColumns = [
  'ALTER TABLE users ADD COLUMN hackerRankUsername TEXT DEFAULT \'\'',
  'ALTER TABLE users ADD COLUMN hackerRankData TEXT',
];
migrateColumns.forEach((sql) => {
  try { db.exec(sql); } catch { /* column already exists */ }
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const getCollection = (name) => {
  if (name === 'users') {
    return {
      findOne(query) {
        const keys = Object.keys(query);
        const values = Object.values(query);
        const conditions = keys.map((k) => {
          if (k === '_id') return `${k} = ?`;
          return `${k} = ?`;
        }).join(' AND ');
        const row = db.prepare(`SELECT * FROM users WHERE ${conditions} LIMIT 1`).get(...values);
        if (!row) return null;
        return parseRow(row);
      },

      findById(id) {
        const row = db.prepare('SELECT * FROM users WHERE _id = ?').get(id);
        if (!row) return null;
        return parseRow(row);
      },

      create({ name, email, password }) {
        const _id = generateId();
        const now = new Date().toISOString();
        db.prepare(
          'INSERT INTO users (_id, name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(_id, name, email, password, now, now);
        return { _id, name, email, password, githubUsername: '', leetcodeUsername: '', hackerRankUsername: '', githubData: null, leetcodeData: null, hackerRankData: null, jobMatchScore: 0, createdAt: now, updatedAt: now };
      },

      findOneAndUpdate(query, update) {
        const existing = this.findOne(query);
        if (!existing) return null;

        const setClauses = [];
        const values = [];
        const { _id, createdAt, ...safeUpdate } = update;

        Object.entries(safeUpdate).forEach(([key, value]) => {
          if (value === undefined) return;
          const dbKey = key;
          const dbValue = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : value;
          setClauses.push(`${dbKey} = ?`);
          values.push(dbValue);
        });

        setClauses.push("updatedAt = ?");
        values.push(new Date().toISOString());

        const whereKeys = Object.keys(query);
        const whereValues = Object.values(query);
        whereValues.forEach((v) => values.push(v));

        db.prepare(
          `UPDATE users SET ${setClauses.join(', ')} WHERE ${whereKeys.map((k) => `${k} = ?`).join(' AND ')}`
        ).run(...values);

        return this.findOne(query);
      },
    };
  }
  throw new Error(`Collection "${name}" not found`);
};

function parseRow(row) {
  const parsed = { ...row };
  ['githubData', 'leetcodeData', 'hackerRankData'].forEach((field) => {
    if (typeof parsed[field] === 'string') {
      try { parsed[field] = JSON.parse(parsed[field]); } catch { parsed[field] = null; }
    }
  });
  return parsed;
}

const connectDB = async () => {
  console.log(`SQLite database ready at ${DB_PATH}`);
  return true;
};

module.exports = { connectDB, getCollection };
