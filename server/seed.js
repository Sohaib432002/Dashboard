// Imports server/data/GallStone.csv into the database. Safe to run repeatedly:
// it does nothing when patients already exist unless --reset is passed.
const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')
const { db, DB_PATH } = require('./db')
const { bulkInsert, countPatients } = require('./patients')

const DEFAULT_CSV = path.join(__dirname, 'data', 'GallStone.csv')

function seed({ reset = false, file = DEFAULT_CSV } = {}) {
  if (reset) {
    db.exec('DELETE FROM patients; DELETE FROM activity_log; DELETE FROM sqlite_sequence;')
  } else if (countPatients() > 0) {
    return { seeded: false, count: countPatients() }
  }
  const parsed = Papa.parse(fs.readFileSync(file, 'utf8'), { header: true, skipEmptyLines: true })
  if (parsed.errors.length) throw new Error(`CSV parse error: ${parsed.errors[0].message}`)
  bulkInsert(parsed.data)
  return { seeded: true, count: countPatients() }
}

if (require.main === module) {
  // usage: node server/seed.js [--reset] [path/to/file.csv]
  const file = process.argv.slice(2).find((a) => !a.startsWith('--'))
  const result = seed({ reset: process.argv.includes('--reset'), file: file ? path.resolve(file) : DEFAULT_CSV })
  console.log(
    result.seeded
      ? `Seeded ${result.count} patients into ${DB_PATH}`
      : `Database already contains ${result.count} patients (use --reset to re-import)`
  )
}

module.exports = { seed }
