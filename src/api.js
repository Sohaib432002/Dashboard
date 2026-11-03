import axios from 'axios'

export const API_BASE = process.env.REACT_APP_API_URL || '/api'
const client = axios.create({ baseURL: API_BASE, timeout: 15000 })

export const exportUrl = `${API_BASE}/export.csv`
export const importCsv = (csvText, mode) =>
  client
    .post(`/import?mode=${mode}`, csvText, { headers: { 'Content-Type': 'text/csv' }, timeout: 60000 })
    .then((r) => r.data)

// Pull the most useful message out of an axios error.
export function errorMessage(err) {
  const body = err?.response?.data
  if (body?.details?.length) return `${body.error}: ${body.details.join('; ')}`
  if (body?.error) return body.error
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED')
    return 'Cannot reach the API server. Start it with "npm run server".'
  return err?.message || 'Something went wrong'
}

export const getPatients = () => client.get('/patients').then((r) => r.data)
export const createPatient = (p) => client.post('/patients', p).then((r) => r.data)
export const updatePatient = (id, p) => client.put(`/patients/${id}`, p).then((r) => r.data)
export const deletePatient = (id) => client.delete(`/patients/${id}`)
export const getSummary = () => client.get('/stats/summary').then((r) => r.data)
export const getHealth = () => client.get('/health').then((r) => r.data)
