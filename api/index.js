// Vercel serverless entry: runs the Express API. The filesystem is read-only except /tmp,
// so the SQLite database lives there and is re-seeded from the CSV on each cold start.
process.env.DB_PATH = process.env.DB_PATH || '/tmp/gallstone.db'

const app = require('../server/index.js')
const { seed } = require('../server/seed.js')

seed()

module.exports = app
