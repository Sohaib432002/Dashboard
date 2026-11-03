import { useContext, useEffect, useMemo, useState } from 'react'
import { LuChevronLeft, LuChevronRight, LuDownload, LuPencil, LuPlus, LuRefreshCw, LuSearch, LuTrash2, LuUpload, LuX } from 'react-icons/lu'
import { createPatient, deletePatient, errorMessage, exportUrl, importCsv, updatePatient } from '../api'
import { ALL_FIELDS, FIELD_GROUPS } from '../patientFields'
import { DataContext } from './useContext'

const PAGE_SIZE = 15

const emptyForm = () => Object.fromEntries(ALL_FIELDS.map((f) => [f.key, '']))

const PatientForm = ({ patient, onClose, onSaved }) => {
  const [form, setForm] = useState(() =>
    patient ? Object.fromEntries(ALL_FIELDS.map((f) => [f.key, patient[f.key]])) : emptyForm()
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const body = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, Number(form[f.key])]))
      if (patient) await updatePatient(patient.id, body)
      else await createPatient(body)
      await onSaved()
      onClose()
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={patient ? 'Edit patient' : 'Add patient'}>
      <form className="modal" onSubmit={submit}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {patient ? `Edit patient #${patient.id}` : 'Add patient'}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <LuX size={18} />
          </button>
        </div>

        {FIELD_GROUPS.map((group) => (
          <fieldset key={group.title} className="mb-5 min-w-0 border-0 p-0">
            <legend className="panel-title">{group.title}</legend>
            <div className="form-grid">
              {group.fields.map((f) => {
                const id = `pf-${f.key}`
                return (
                  <div key={f.key} className="field">
                    <label htmlFor={id}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select
                        id={id}
                        required
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        {f.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        type="number"
                        required
                        min={f.min ?? 0}
                        max={f.max}
                        step={f.type === 'int' ? 1 : 'any'}
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}

        {error && (
          <p role="alert" className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : patient ? 'Save changes' : 'Add patient'}
          </button>
        </div>
      </form>
    </div>
  )
}

const ImportPanel = ({ onImported }) => {
  const [mode, setMode] = useState('replace')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null) // { ok, text }

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    if (mode === 'replace' && !window.confirm('This replaces ALL existing patient records with the file contents. Continue?')) return
    setBusy(true)
    setResult(null)
    try {
      const out = await importCsv(await file.text(), mode)
      await onImported()
      setResult({ ok: true, text: `Imported ${out.imported} patients. The database now holds ${out.total}.` })
      setFile(null)
      e.target.reset()
    } catch (err) {
      setResult({ ok: false, text: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card mb-4" onSubmit={submit}>
      <h2 className="panel-title">Update data from a dataset file</h2>
      <p className="mb-3 text-sm text-slate-300">
        Upload a CSV with the same columns as the original dataset. Every chart, metric and page updates from the database.
      </p>
      <div className="filter-row">
        <div className="filter-item">
          <label htmlFor="imp-file">CSV file</label>
          <input
            id="imp-file"
            type="file"
            accept=".csv,text/csv"
            className="filter-control"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="imp-mode">Mode</label>
          <select id="imp-mode" className="filter-control" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="replace">Replace all records</option>
            <option value="append">Add to existing records</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!file || busy}>
          <LuUpload size={15} /> {busy ? 'Importing…' : 'Import'}
        </button>
      </div>
      {result && (
        <p
          role={result.ok ? 'status' : 'alert'}
          className={`mt-3 rounded-lg border p-3 text-sm ${
            result.ok
              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
              : 'border-red-400/40 bg-red-500/10 text-red-300'
          }`}
        >
          {result.text}
        </p>
      )}
    </form>
  )
}

const Patients = () => {
  const { data, refresh } = useContext(DataContext)
  const [search, setSearch] = useState('')
  const [gallstone, setGallstone] = useState('all')
  const [gender, setGender] = useState('all')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null) // null | 'new' | patient
  const [actionError, setActionError] = useState(null)

  const rows = useMemo(
    () =>
      data.filter((p) => {
        if (search.trim() && !String(p.id).includes(search.trim())) return false
        if (gallstone !== 'all' && p['Gallstone Status'] !== Number(gallstone)) return false
        if (gender !== 'all' && p.Gender !== Number(gender)) return false
        return true
      }),
    [data, search, gallstone, gender]
  )

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const remove = async (p) => {
    if (!window.confirm(`Delete patient #${p.id}? This cannot be undone.`)) return
    try {
      await deletePatient(p.id)
      setActionError(null)
      await refresh()
    } catch (err) {
      setActionError(errorMessage(err))
    }
  }

  const resetPage = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <div className="page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title mb-0">Patient Records</h1>
          <p className="page-subtitle">
            {rows.length} of {data.length} records stored in the database
          </p>
        </div>
        <div className="flex gap-2">
          <a className="btn" href={exportUrl} download>
            <LuDownload size={15} /> Export CSV
          </a>
          <button type="button" className="btn" onClick={refresh}>
            <LuRefreshCw size={15} /> Refresh
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <LuPlus size={16} /> Add patient
          </button>
        </div>
      </div>

      <ImportPanel onImported={refresh} />

      <div className="card mb-4">
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="pt-search">Patient ID</label>
            <div className="relative">
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                id="pt-search"
                className="filter-control !pl-9"
                inputMode="numeric"
                placeholder="Search by ID"
                value={search}
                onChange={resetPage(setSearch)}
              />
            </div>
          </div>
          <div className="filter-item">
            <label htmlFor="pt-gall">Gallstones</label>
            <select id="pt-gall" className="filter-control" value={gallstone} onChange={resetPage(setGallstone)}>
              <option value="all">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="pt-gender">Gender</label>
            <select id="pt-gender" className="filter-control" value={gender} onChange={resetPage(setGender)}>
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
          {actionError}
        </p>
      )}

      <div className="card !p-0">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Gallstones</th>
                <th>BMI</th>
                <th>Glucose</th>
                <th>Cholesterol</th>
                <th>Vitamin D</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-white">#{p.id}</td>
                  <td>{p.Age}</td>
                  <td>{p.Gender === 0 ? 'Male' : 'Female'}</td>
                  <td>
                    <span className={`badge ${p['Gallstone Status'] === 1 ? 'badge-yes' : 'badge-no'}`}>
                      {p['Gallstone Status'] === 1 ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{p['Body Mass Index (BMI)']}</td>
                  <td>{p.Glucose}</td>
                  <td>{p['Total Cholesterol (TC)']}</td>
                  <td>{p['Vitamin D']}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button type="button" className="icon-btn" aria-label={`Edit patient ${p.id}`} onClick={() => setEditing(p)}>
                        <LuPencil size={15} />
                      </button>
                      <button type="button" className="icon-btn !text-red-400" aria-label={`Delete patient ${p.id}`} onClick={() => remove(p)}>
                        <LuTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No patients match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-sky-500/20 px-4 py-3 text-sm">
          <span className="text-slate-400">
            Page {current} of {pages}
          </span>
          <div className="flex gap-2">
            <button type="button" className="icon-btn" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
              <LuChevronLeft size={16} />
            </button>
            <button type="button" className="icon-btn" aria-label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)}>
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <PatientForm
          patient={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}

export default Patients
