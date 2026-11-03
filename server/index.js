const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { DB_PATH } = require('./db')
const patients = require('./patients')
const { summary } = require('./stats')
const { seed } = require('./seed')
const { importCsv, exportCsv } = require('./csv')

const PORT = Number(process.env.PORT) || 5000
const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json({ limit: '100kb' }))

const parseId = (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'Invalid patient id' })
    return null
  }
  return id
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected', patients: patients.countPatients() })
})

app.get('/api/patients', (req, res) => res.json(patients.listPatients()))

app.get('/api/patients/:id', (req, res) => {
  const id = parseId(req, res)
  if (id === null) return
  const row = patients.getPatient(id)
  return row ? res.json(row) : res.status(404).json({ error: 'Patient not found' })
})

app.post('/api/patients', (req, res) => res.status(201).json(patients.createPatient(req.body)))

app.put('/api/patients/:id', (req, res) => {
  const id = parseId(req, res)
  if (id === null) return
  const row = patients.updatePatient(id, req.body)
  return row ? res.json(row) : res.status(404).json({ error: 'Patient not found' })
})

app.delete('/api/patients/:id', (req, res) => {
  const id = parseId(req, res)
  if (id === null) return
  return patients.deletePatient(id)
    ? res.status(204).end()
    : res.status(404).json({ error: 'Patient not found' })
})

// CSV import: send the raw file as the body. ?mode=replace (default) or ?mode=append
app.post('/api/import', express.text({ type: '*/*', limit: '10mb' }), (req, res) => {
  const replace = req.query.mode !== 'append'
  const imported = importCsv(req.body || '', { replace })
  res.json({ imported, mode: replace ? 'replace' : 'append', total: patients.countPatients() })
})

app.get('/api/export.csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="GallStone.csv"')
  res.send(exportCsv())
})

app.get('/api/stats/summary', (req, res) => res.json(summary()))

// Serve the production React build when present (npm run build).
const buildDir = path.join(__dirname, '..', 'build')
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir))
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(buildDir, 'index.html')))
}

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof patients.ValidationError) {
    return res.status(400).json({ error: err.message, details: err.details || [] })
  }
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ error: 'Malformed JSON body' })
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

if (require.main === module) {
  const { seeded, count } = seed()
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`Database: ${DB_PATH} (${count} patients${seeded ? ', freshly seeded' : ''})`)
  })
}

module.exports = app
