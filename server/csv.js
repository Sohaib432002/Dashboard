const Papa = require('papaparse')
const { ALL_FIELDS } = require('./columns')
const { ValidationError, bulkInsert, listPatients } = require('./patients')

const HEADERS = ALL_FIELDS.map((f) => f.key)

function importCsv(text, { replace = false } = {}) {
  const parsed = Papa.parse(String(text).replace(/^﻿/, ''), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })
  const fail = (details) => {
    const err = new ValidationError('Invalid CSV file')
    err.details = details
    throw err
  }
  if (parsed.errors.length) fail(parsed.errors.slice(0, 10).map((e) => `Row ${e.row + 1}: ${e.message}`))
  const found = new Set(parsed.meta.fields || [])
  const missing = HEADERS.filter((h) => !found.has(h))
  if (missing.length) fail([`Missing columns: ${missing.join(', ')}`])
  if (parsed.data.length === 0) fail(['The file has no data rows'])
  return bulkInsert(parsed.data, { replace })
}

function exportCsv() {
  const rows = listPatients().map((p) => HEADERS.map((h) => p[h]))
  return Papa.unparse({ fields: HEADERS, data: rows })
}

module.exports = { importCsv, exportCsv }
