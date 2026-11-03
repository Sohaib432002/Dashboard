const fs = require('fs')
const path = require('path')
const { DatabaseSync } = require('node:sqlite')
const { buildSchema } = require('./columns')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'gallstone.db')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')
db.exec(buildSchema())
db.exec(`CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
  patient_id INTEGER,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`)

// Run fn inside a transaction; roll back if it throws.
function transaction(fn) {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

module.exports = { db, transaction, DB_PATH }
