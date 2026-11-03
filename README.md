# Gallstone Risk Dashboard

Interactive dashboard for analysing gallstone risk and metabolic markers in a clinical cohort
(319 patients, 39 measurements each). React frontend + Node/Express API + SQLite database.

## Stack

| Layer    | Technology                                                    |
| -------- | ------------------------------------------------------------- |
| Frontend | React 19, React Router (hash routes), Recharts, Tailwind CSS  |
| Backend  | Node.js, Express 4                                            |
| Database | SQLite via Node's built-in `node:sqlite` (free, no server)    |

Requires **Node.js 22.13 or newer**.

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the API on <http://localhost:5000> and the React app on <http://localhost:3000>
(the dev server proxies `/api` to the API). On first start the API creates the database at
`server/data/gallstone.db` and imports `server/data/GallStone.csv` automatically.

### Production

```bash
npm run build
npm run server      # serves the API and the built app on http://localhost:5000
```

### Scripts

| Script               | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | API + React dev server together                              |
| `npm run server`     | API only (also serves `build/` when it exists)               |
| `npm run seed`       | Import the CSV if the database is empty                      |
| `npm run seed:reset` | Wipe the database and re-import the CSV                      |
| `npm run build`      | Production build of the frontend                             |

### Configuration (environment variables)

| Variable            | Default                      | Meaning                           |
| ------------------- | ---------------------------- | --------------------------------- |
| `PORT`              | `5000`                       | API port                          |
| `DB_PATH`           | `server/data/gallstone.db`   | SQLite file location              |
| `CORS_ORIGIN`       | any origin                   | Restrict allowed browser origin   |
| `REACT_APP_API_URL` | `/api`                       | API base URL used by the frontend |

## Where is the database, and how do I update the data?

The database is a single file: **`server/data/gallstone.db`** (created on first run). The website
reads everything from it through the API, so changing the data changes every page.

Ways to update the data:

1. **Upload a dataset file (easiest).** Open **Patients → Update data from a dataset file**, choose a
   CSV with the same columns as `server/data/GallStone.csv`, then pick *Replace all records* or
   *Add to existing records*. The file is validated first; if any row is invalid nothing changes and
   the error lists the problem rows. **Export CSV** downloads the current database in the same format.
2. **Edit single records** with the Add / Edit / Delete buttons on the Patients page.
3. **From the command line**, re-import a file (the website must be restarted or refreshed afterwards):
   ```bash
   npm run seed:reset                       # wipe and re-import server/data/GallStone.csv
   node server/seed.js --reset my-data.csv  # wipe and import your own file
   ```
4. **Directly in the database** with any SQLite tool, e.g. [DB Browser for SQLite](https://sqlitebrowser.org/)
   (free) or the VS Code "SQLite Viewer" extension: open `server/data/gallstone.db`. Close the tool (or
   stop writing) before using the website's import. Refresh the page to see changes.

## Database schema

One patient has one row in each table (`ON DELETE CASCADE` from `patients`):

- `patients` – id, gallstone_status, age, gender, created_at, updated_at
- `comorbidities` – comorbidity count, CAD, hypothyroidism, hyperlipidemia, diabetes
- `body_composition` – height, weight, BMI, body water, fat/lean/muscle/bone measures, visceral fat, hepatic fat
- `lab_results` – glucose, cholesterol (total/LDL/HDL), triglyceride, AST, ALT, ALP, creatinine, GFR, CRP, hemoglobin, vitamin D
- `activity_log` – created/updated/deleted events shown on the Overview page

Column definitions, constraints and the mapping to the field names used by the frontend live in
[`server/columns.js`](server/columns.js).

## API

| Method & path             | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `GET /api/health`         | Service and database status                         |
| `GET /api/patients`       | All patients (joined across the four tables)        |
| `GET /api/patients/:id`   | One patient                                         |
| `POST /api/patients`      | Create (all 39 fields required, validated)          |
| `PUT /api/patients/:id`   | Replace a patient's data                            |
| `DELETE /api/patients/:id`| Delete a patient                                    |
| `GET /api/stats/summary`  | Aggregates used by the Overview page                |
| `POST /api/import?mode=replace\|append` | Import a CSV (raw file as request body, `Content-Type: text/csv`) |
| `GET /api/export.csv`     | Download all patients as CSV                        |

Validation errors return `400` with `{ error, details: [...] }`; unknown ids return `404`.

## Pages

Overview · Patient Records (add / edit / delete) · Demographics · Stone Characteristics ·
Incidence & Prevalence · Symptoms & Clinical Data · Treatment Data · Laboratory Results ·
Risk Factors · Visualizations · Summary Metrics

## Notes

- "High-risk" means BMI above 30, glucose above 125 mg/dL, or total cholesterol above 200 mg/dL.
- The Overview "strongest signal" is the measure with the largest standardised difference
  (Cohen's d) between patients with and without gallstones.
- The previous GitHub Pages deployment was removed: the app now needs the API and database.
