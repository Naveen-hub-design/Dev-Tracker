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

// Initialize database tables
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
  );

  CREATE TABLE IF NOT EXISTS projects (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    image TEXT,
    status TEXT DEFAULT 'in_progress',
    techStack TEXT DEFAULT '[]',
    startDate TEXT DEFAULT '',
    updatedAt TEXT DEFAULT (datetime('now')),
    completion INTEGER DEFAULT 0,
    githubUrl TEXT DEFAULT '',
    liveUrl TEXT DEFAULT '',
    features TEXT DEFAULT '[]',
    challenges TEXT DEFAULT '[]',
    futureImprovements TEXT DEFAULT '[]',
    contributors TEXT DEFAULT '[]',
    milestones TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS certificates (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    organization TEXT DEFAULT '',
    category TEXT DEFAULT 'Other',
    issueDate TEXT DEFAULT '',
    expiryDate TEXT DEFAULT '',
    credentialId TEXT DEFAULT '',
    verifyUrl TEXT DEFAULT '',
    image TEXT,
    notes TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS goals (
    _id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    dailyCommits INTEGER DEFAULT 3,
    dailyProblems INTEGER DEFAULT 2,
    dailyHours REAL DEFAULT 2,
    weeklyCommits INTEGER DEFAULT 15,
    weeklyProblems INTEGER DEFAULT 10,
    weeklyHours REAL DEFAULT 14,
    monthlyCommits INTEGER DEFAULT 60,
    monthlyProblems INTEGER DEFAULT 40,
    monthlyHours REAL DEFAULT 60,
    history TEXT DEFAULT '{}',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resumes (
    _id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    activeTemplate TEXT DEFAULT 'modern',
    personal TEXT DEFAULT '{}',
    education TEXT DEFAULT '[]',
    skills TEXT DEFAULT '{}',
    experience TEXT DEFAULT '[]',
    projects TEXT DEFAULT '[]',
    achievements TEXT DEFAULT '[]',
    codingProfiles TEXT DEFAULT '{}',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS daily_streaks (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    problemId TEXT NOT NULL,
    problemTitle TEXT DEFAULT '',
    problemDifficulty TEXT DEFAULT '',
    problemUrl TEXT DEFAULT '',
    solved INTEGER DEFAULT 1,
    notes TEXT DEFAULT '',
    solvedAt TEXT DEFAULT (datetime('now')),
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    UNIQUE(userId, date),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
  );
`);

const migrateColumns = [
  'ALTER TABLE users ADD COLUMN hackerRankUsername TEXT DEFAULT \'\'',
  'ALTER TABLE users ADD COLUMN hackerRankData TEXT',
  'ALTER TABLE users ADD COLUMN codeforcesUsername TEXT DEFAULT \'\'',
  'ALTER TABLE users ADD COLUMN codeforcesData TEXT',
];
migrateColumns.forEach((sql) => {
  try { db.exec(sql); } catch { /* column already exists */ }
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const JSON_FIELDS = {
  users: ['githubData', 'leetcodeData', 'hackerRankData', 'codeforcesData'],
  projects: ['techStack', 'features', 'challenges', 'futureImprovements', 'contributors', 'milestones'],
  certificates: [],
  goals: ['history'],
  resumes: ['personal', 'education', 'skills', 'experience', 'projects', 'achievements', 'codingProfiles'],
};

function parseRow(row, tableName) {
  if (!row) return null;
  const parsed = { ...row };
  const jsonCols = JSON_FIELDS[tableName] || [];
  
  jsonCols.forEach((field) => {
    if (typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch {
        parsed[field] = null;
      }
    }
  });

  return parsed;
}

const VALID_TABLES = ['users', 'projects', 'certificates', 'goals', 'resumes', 'daily_streaks'];

const getCollection = (name) => {
  if (!VALID_TABLES.includes(name)) {
    throw new Error(`Collection "${name}" not found`);
  }

  const tableName = name;

  return {
    find(query = {}, options = {}) {
      const keys = Object.keys(query);
      const values = Object.values(query);
      let sql = `SELECT * FROM ${tableName}`;
      if (keys.length > 0) {
        const conditions = keys.map((k) => `${k} = ?`).join(' AND ');
        sql += ` WHERE ${conditions}`;
      }
      if (options.sort) {
        sql += ` ORDER BY ${options.sort}`;
      }
      const rows = db.prepare(sql).all(...values);
      return rows.map((r) => parseRow(r, tableName));
    },

    findOne(query) {
      const keys = Object.keys(query);
      const values = Object.values(query);
      if (keys.length === 0) return null;
      const conditions = keys.map((k) => `${k} = ?`).join(' AND ');
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${conditions} LIMIT 1`).get(...values);
      if (!row) return null;
      return parseRow(row, tableName);
    },

    findById(id) {
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE _id = ?`).get(id);
      if (!row) return null;
      return parseRow(row, tableName);
    },

    create(doc) {
      const _id = doc._id || generateId();
      const now = new Date().toISOString();
      const payload = {
        ...doc,
        _id,
        createdAt: doc.createdAt || now,
        updatedAt: doc.updatedAt || now,
      };

      const keys = Object.keys(payload);
      const values = [];

      keys.forEach((key) => {
        let val = payload[key];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        values.push(val);
      });

      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      db.prepare(sql).run(...values);

      return this.findById(_id);
    },

    findOneAndUpdate(query, update, options = {}) {
      const existing = this.findOne(query);
      if (!existing) {
        if (options.upsert) {
          return this.create({ ...query, ...update });
        }
        return null;
      }

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
        `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${whereKeys.map((k) => `${k} = ?`).join(' AND ')}`
      ).run(...values);

      return this.findOne(query);
    },

    deleteOne(query) {
      const keys = Object.keys(query);
      const values = Object.values(query);
      if (keys.length === 0) return { changes: 0 };
      const conditions = keys.map((k) => `${k} = ?`).join(' AND ');
      const info = db.prepare(`DELETE FROM ${tableName} WHERE ${conditions}`).run(...values);
      return { changes: info.changes };
    },

    deleteById(id) {
      const info = db.prepare(`DELETE FROM ${tableName} WHERE _id = ?`).run(id);
      return { changes: info.changes };
    },
  };
};

const connectDB = async () => {
  console.log(`SQLite database ready at ${DB_PATH}`);
  return true;
};

module.exports = { connectDB, getCollection, db };
