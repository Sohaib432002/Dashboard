const { db, transaction } = require('./db')
const { TABLES, CHILD_TABLES, ALL_FIELDS } = require('./columns')

const SELECT = `
SELECT p.id, p.created_at, p.updated_at,
  ${ALL_FIELDS.map((f) => `${f.table === 'patients' ? 'p' : f.table}.${f.col} AS ${f.col}`).join(',\n  ')}
FROM patients p
${CHILD_TABLES.map((t) => `JOIN ${t} ON ${t}.patient_id = p.id`).join('\n')}`

// DB row -> object keyed by the display names the frontend uses.
function toApi(row) {
  const out = { id: row.id, createdAt: row.created_at, updatedAt: row.updated_at }
  for (const f of ALL_FIELDS) out[f.key] = row[f.col]
  return out
}

class ValidationError extends Error {}

// Validate a request body against the column map; returns { table: { col: value } }.
function parseBody(body) {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body must be a JSON object')
  const errors = []
  const values = {}
  for (const f of ALL_FIELDS) {
    const raw = body[f.key]
    if (raw === undefined || raw === null || raw === '') {
      errors.push(`${f.key} is required`)
      continue
    }
    const n = Number(raw)
    if (!Number.isFinite(n)) {
      errors.push(`${f.key} must be a number`)
      continue
    }
    if (f.kind === 'binary' && n !== 0 && n !== 1) errors.push(`${f.key} must be 0 or 1`)
    else if (f.kind === 'int' && (!Number.isInteger(n) || n < f.min || n > f.max))
      errors.push(`${f.key} must be an integer between ${f.min} and ${f.max}`)
    else if (f.kind === 'real' && n < 0) errors.push(`${f.key} must not be negative`)
    ;(values[f.table] ||= {})[f.col] = n
  }
  if (errors.length) {
    const err = new ValidationError('Validation failed')
    err.details = errors
    throw err
  }
  return values
}

function insertRow(table, patientId, cols) {
  const names = Object.keys(cols)
  const sql = `INSERT INTO ${table} (patient_id, ${names.join(', ')}) VALUES (?, ${names.map(() => '?').join(', ')})`
  db.prepare(sql).run(patientId, ...names.map((n) => cols[n]))
}

function updateRow(table, patientId, cols) {
  const names = Object.keys(cols)
  const sql = `UPDATE ${table} SET ${names.map((n) => `${n} = ?`).join(', ')} WHERE ${table === 'patients' ? 'id' : 'patient_id'} = ?`
  db.prepare(sql).run(...names.map((n) => cols[n]), patientId)
}

function listPatients() {
  return db.prepare(`${SELECT} ORDER BY p.id`).all().map(toApi)
}

function getPatient(id) {
  const row = db.prepare(`${SELECT} WHERE p.id = ?`).get(id)
  return row ? toApi(row) : null
}

function createPatient(body) {
  return transaction(() => {
    const id = createPatientUnsafe(body)
    logActivity('created', id, `Patient #${id} added`)
    return getPatient(id)
  })
}

function updatePatient(id, body) {
  const values = parseBody(body)
  return transaction(() => {
    if (!db.prepare('SELECT 1 FROM patients WHERE id = ?').get(id)) return null
    updateRow('patients', id, { ...values.patients, updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    for (const t of CHILD_TABLES) updateRow(t, id, values[t])
    logActivity('updated', id, `Patient #${id} updated`)
    return getPatient(id)
  })
}

function deletePatient(id) {
  return transaction(() => {
    const removed = Number(db.prepare('DELETE FROM patients WHERE id = ?').run(id).changes) > 0
    if (removed) logActivity('deleted', id, `Patient #${id} deleted`)
    return removed
  })
}

function logActivity(action, patientId, detail) {
  db.prepare('INSERT INTO activity_log (action, patient_id, detail) VALUES (?, ?, ?)').run(action, patientId, detail)
}

function recentActivity(limit = 6) {
  return db.prepare('SELECT id, action, patient_id AS patientId, detail, created_at AS createdAt FROM activity_log ORDER BY id DESC LIMIT ?').all(limit)
}

function countPatients() {
  return db.prepare('SELECT COUNT(*) AS n FROM patients').get().n
}

// Used by the seed script. Accepts rows keyed by CSV headers (same as API keys).
// All-or-nothing: if any row is invalid nothing is changed. `replace` wipes existing patients first.
function bulkInsert(rows, { replace = false } = {}) {
  return transaction(() => {
    if (replace) db.exec('DELETE FROM patients')
    const problems = []
    rows.forEach((row, i) => {
      try {
        createPatientUnsafe(row)
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err
        problems.push(...(err.details || [err.message]).map((d) => `Row ${i + 1}: ${d}`))
      }
    })
    if (problems.length) {
      const err = new ValidationError('CSV contains invalid rows; nothing was imported')
      err.details = problems.slice(0, 20)
      throw err
    }
    logActivity('created', null, `${replace ? 'Replaced all records with' : 'Imported'} ${rows.length} patients from CSV`)
    return rows.length
  })
}
function createPatientUnsafe(body) {
  const values = parseBody(body)
  const p = values.patients
  const names = Object.keys(p)
  const info = db
    .prepare(`INSERT INTO patients (${names.join(', ')}) VALUES (${names.map(() => '?').join(', ')})`)
    .run(...names.map((n) => p[n]))
  const id = Number(info.lastInsertRowid)
  for (const t of CHILD_TABLES) insertRow(t, id, values[t])
  return id
}

module.exports = {
  ValidationError,
  TABLES,
  listPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  countPatients,
  recentActivity,
  bulkInsert,
}
