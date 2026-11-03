import { useContext, useEffect, useState } from 'react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, YAxis } from 'recharts'
import { LuDatabase, LuFlaskConical, LuScale, LuShieldAlert, LuStethoscope, LuUsers } from 'react-icons/lu'
import { errorMessage, getSummary } from '../api'
import Loader from './LoadingSpinner'
import { DataContext } from './useContext'

const COLORS = { cyan: '#22b8ff', blue: '#2f7bff', orange: '#ff9f1c', green: '#22e08a', muted: '#8da2c8' }

const fmtTime = (iso) =>
  new Date(`${iso.replace(' ', 'T')}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const Sparkline = ({ series, dataKey, color = COLORS.cyan }) => (
  <div className="h-9 w-28" aria-hidden="true">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={series} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

const Panel = ({ title, children, className = '' }) => (
  <section className={`panel ${className}`}>
    <h2 className="panel-title">{title}</h2>
    {children}
  </section>
)

const ProfilePanel = ({ t }) => {
  const rows = [
    ['Records', t.patients],
    ['Age range', `${t.minAge}–${t.maxAge} yrs`],
    ['Average age', `${t.avgAge} yrs`],
    ['Male / Female', `${t.male} / ${t.female}`],
    ['Data points', `${t.patients * 39}`],
    ['Storage', 'SQLite'],
  ]
  return (
    <Panel title="Cohort Profile">
      <div className="mx-auto mb-5 grid h-36 w-36 place-items-center rounded-full border border-sky-400/60 shadow-[0_0_30px_rgba(34,184,255,0.25),inset_0_0_30px_rgba(34,184,255,0.15)]">
        <div className="text-center">
          <LuUsers className="mx-auto mb-1 text-sky-400" size={26} />
          <div className="text-3xl font-semibold text-white">{t.patients}</div>
          <div className="text-[0.65rem] uppercase tracking-widest text-slate-400">Patients</div>
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-slate-400">{k}</dt>
            <dd className="font-medium text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Clinical', 'Metabolic', 'Body composition'].map((tag) => (
          <span key={tag} className="rounded-md border border-sky-400/30 px-2 py-1 text-xs text-sky-100">
            {tag}
          </span>
        ))}
      </div>
    </Panel>
  )
}

// Risk-factor "map": a glowing core (prevalence) with the factor cut-offs orbiting it.
const RiskMap = ({ t, factors }) => {
  const left = factors.slice(0, 3)
  const right = factors.slice(3, 6)
  const Node = ({ f, x, y, align }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="150" height="62" rx="8" fill="rgba(8,22,52,0.85)" stroke={COLORS.blue} strokeOpacity="0.5" />
      <text x="12" y="24" fill="#fff" fontSize="13" fontWeight="600">
        {f.label}
      </text>
      <text x="12" y="43" fill={COLORS.muted} fontSize="11">
        {f.sharePct}% of patients
      </text>
      <circle cx={align === 'left' ? 150 : 0} cy="31" r="3" fill={COLORS.orange} />
    </g>
  )
  const ys = [30, 150, 270]
  return (
    <Panel title="Risk Factor Map · Live Feed" className="hero-stage !p-2 sm:!p-4">
      <svg viewBox="0 0 760 400" className="h-auto w-full" role="img" aria-label="Risk factor map">
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7fdcff" stopOpacity="0.95" />
            <stop offset="55%" stopColor={COLORS.blue} stopOpacity="0.45" />
            <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...left, ...right].map((_, i) => {
          const isLeft = i < 3
          const y = ys[i % 3] + 31
          return (
            <path
              key={i}
              d={`M ${isLeft ? 160 : 600} ${y} C ${isLeft ? 260 : 500} ${y}, ${isLeft ? 280 : 480} 200, ${isLeft ? 320 : 440} 200`}
              fill="none"
              stroke={COLORS.orange}
              strokeOpacity="0.55"
              strokeDasharray="4 4"
            />
          )
        })}
        <circle cx="380" cy="200" r="150" fill="url(#core)" className="pulse" />
        <g className="orbit-spin">
          <circle className="orbit-ring" cx="380" cy="200" r="130" strokeDasharray="2 10" />
          <circle cx="510" cy="200" r="5" fill={COLORS.cyan} />
        </g>
        <g className="orbit-spin rev">
          <circle className="orbit-ring" cx="380" cy="200" r="100" strokeDasharray="30 8" />
          <circle cx="280" cy="200" r="4" fill={COLORS.orange} />
        </g>
        <circle cx="380" cy="200" r="72" fill="rgba(2,8,23,0.85)" stroke={COLORS.cyan} strokeWidth="2" />
        <text x="380" y="198" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="700">
          {t.prevalencePct}%
        </text>
        <text x="380" y="222" textAnchor="middle" fill={COLORS.muted} fontSize="11" letterSpacing="1.5">
          GALLSTONE PREVALENCE
        </text>
        {left.map((f, i) => (
          <Node key={f.label} f={f} x={10} y={ys[i]} align="left" />
        ))}
        {right.map((f, i) => (
          <Node key={f.label} f={f} x={600} y={ys[i]} align="right" />
        ))}
      </svg>
    </Panel>
  )
}

const KeyMetrics = ({ t, groups }) => {
  const rows = [
    { label: 'Patients', value: t.patients, key: 'count', sub: `${t.withGallstone} with gallstones` },
    { label: 'Gallstone Prevalence', value: `${t.prevalencePct}%`, key: 'prevalence', sub: 'by age group' },
    { label: 'Average BMI', value: t.avgBmi, key: 'avgBmi', sub: 'by age group' },
    { label: 'Average Glucose', value: t.avgGlucose, key: 'avgGlucose', sub: 'mg/dL by age group' },
    { label: 'Average Cholesterol', value: t.avgCholesterol, key: 'avgCholesterol', sub: 'mg/dL by age group' },
  ]
  return (
    <Panel title="Key Metrics">
      {rows.map((r) => (
        <div key={r.label} className="kpi-row">
          <div>
            <div className="kpi-label">{r.label}</div>
            <div className="kpi-value">{r.value}</div>
          </div>
          <div className="text-right">
            <Sparkline series={groups} dataKey={r.key} />
            <div className="kpi-sub text-slate-400">{r.sub}</div>
          </div>
        </div>
      ))}
    </Panel>
  )
}

const Pipeline = ({ t }) => {
  const steps = [
    { icon: LuDatabase, title: 'Records', sub: `${t.patients} patients` },
    { icon: LuUsers, title: 'Demographics', sub: `Avg age ${t.avgAge}` },
    { icon: LuScale, title: 'Body Composition', sub: `Avg BMI ${t.avgBmi}` },
    { icon: LuFlaskConical, title: 'Lab Panel', sub: `Glucose ${t.avgGlucose}` },
    { icon: LuShieldAlert, title: 'Risk Screening', sub: `${t.highRisk} high-risk`, hot: true },
    { icon: LuStethoscope, title: 'Outcome', sub: `${t.withGallstone} gallstone cases` },
  ]
  return (
    <Panel title="Risk Screening Pipeline">
      <div className="pipeline">
        {steps.map(({ icon: Icon, title, sub, hot }) => (
          <div key={title} className={`pipe-node ${hot ? 'is-hot' : ''}`}>
            <div className="hex">
              <Icon size={24} />
            </div>
            <strong>{title}</strong>
            <span>{sub}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        High-risk = BMI above 30, glucose above 125 mg/dL, or total cholesterol above 200 mg/dL.
      </p>
    </Panel>
  )
}

const StrongestSignal = ({ signals }) => {
  const top = signals[0]
  if (!top) return null
  const strength = Math.min(100, Math.abs(top.effectSize) * 100)
  return (
    <Panel title="Strongest Signal">
      <div className="text-xs text-slate-400">Biggest difference between groups</div>
      <div className="mb-3 text-3xl font-semibold text-orange-400">{top.key}</div>
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>Effect size (Cohen&apos;s d)</span>
        <span className="font-semibold text-white">{top.effectSize}</span>
      </div>
      <div className="bar-track mb-4">
        <div className="bar-fill" style={{ width: `${strength}%` }} />
      </div>
      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">With gallstones</dt>
          <dd className="font-medium text-white">{top.withGallstone}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Without gallstones</dt>
          <dd className="font-medium text-white">{top.withoutGallstone}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-300">
        Patients with gallstones tend to have {top.direction} values of this measure.
      </p>
    </Panel>
  )
}

const ComorbidityGraph = ({ graph }) => {
  const { nodes, links } = graph
  const pos = [
    [70, 40],
    [250, 40],
    [70, 140],
    [250, 140],
  ]
  const byName = Object.fromEntries(nodes.map((n, i) => [n.name, pos[i]]))
  return (
    <Panel title="Comorbidity Graph">
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Comorbidity co-occurrence graph">
        {links.map((l) => (
          <g key={`${l.source}-${l.target}`}>
            <line
              x1={byName[l.source][0]}
              y1={byName[l.source][1]}
              x2={byName[l.target][0]}
              y2={byName[l.target][1]}
              stroke={COLORS.cyan}
              strokeOpacity="0.5"
              strokeWidth={1 + Math.min(4, l.count / 3)}
            />
            <text
              x={(byName[l.source][0] + byName[l.target][0]) / 2}
              y={(byName[l.source][1] + byName[l.target][1]) / 2 - 4}
              fill={COLORS.muted}
              fontSize="10"
              textAnchor="middle"
            >
              {l.count}
            </text>
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={n.name} transform={`translate(${pos[i][0]} ${pos[i][1]})`}>
            <rect x="-52" y="-16" width="104" height="32" rx="16" fill="#08163a" stroke={COLORS.blue} />
            <text textAnchor="middle" y="-1" fill="#fff" fontSize="11" fontWeight="600">
              {n.name}
            </text>
            <text textAnchor="middle" y="11" fill={COLORS.muted} fontSize="9">
              {n.count} patients
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-400">Line labels show patients having both conditions.</p>
    </Panel>
  )
}

const StatusDonut = ({ t }) => {
  const parts = [
    { name: 'Gallstones', value: t.withGallstone, color: COLORS.cyan },
    { name: 'No gallstones', value: t.withoutGallstone, color: '#1b3a7a' },
  ]
  return (
    <Panel title="Gallstone Status">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="relative h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={parts} dataKey="value" innerRadius={46} outerRadius={64} stroke="none" startAngle={90} endAngle={-270}>
                {parts.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-xl font-semibold text-white">{t.prevalencePct}%</div>
              <div className="text-[0.65rem] text-slate-400">Positive</div>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {parts.map((p) => (
            <li key={p.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              <span className="text-slate-300">{p.name}</span>
              <span className="ml-auto pl-3 font-medium text-white">{p.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

const Insights = ({ summary }) => {
  const { totals: t, ageGroups, signals, factors } = summary
  const peak = [...ageGroups].filter((g) => g.count >= 10).sort((a, b) => b.prevalence - a.prevalence)[0]
  const vitD = factors.find((f) => f.label.startsWith('Vitamin D'))
  const items = [
    `${t.highRiskPct}% of patients (${t.highRisk}) exceed at least one high-risk threshold.`,
    peak && `Highest gallstone prevalence is in the ${peak.label} age group (${peak.prevalence}%).`,
    signals[0] && `${signals[0].key} shows the largest gap between patients with and without gallstones.`,
    vitD && `${vitD.gallstonePct}% of patients with low vitamin D have gallstones.`,
  ].filter(Boolean)
  return (
    <Panel title="Data Insights">
      <ul className="space-y-3 text-sm">
        {items.map((text) => (
          <li key={text} className="flex gap-2 text-slate-200">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_8px_#22b8ff]" />
            {text}
          </li>
        ))}
      </ul>
    </Panel>
  )
}

const ActivityStream = ({ activity }) => (
  <Panel title="Activity Stream">
    {activity.length === 0 ? (
      <p className="text-sm text-slate-400">
        No changes yet. Adding, editing, or deleting a patient record is logged here.
      </p>
    ) : (
      <ul className="space-y-2 text-sm">
        {activity.map((a) => (
          <li key={a.id} className="flex gap-3">
            <span className="w-12 shrink-0 text-slate-500 tabular-nums">{fmtTime(a.createdAt)}</span>
            <span className="text-slate-200">{a.detail}</span>
          </li>
        ))}
      </ul>
    )}
  </Panel>
)

const Overview = () => {
  const { data } = useContext(DataContext)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  // Re-fetch when the patient list changes (records added/edited/deleted).
  useEffect(() => {
    let cancelled = false
    getSummary()
      .then((s) => !cancelled && (setSummary(s), setError(null)))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [data])

  if (error) return <div className="error-box text-sm text-slate-200">{error}</div>
  if (!summary) return <Loader />

  const { totals: t } = summary
  if (t.patients === 0) {
    return (
      <div className="page">
        <div className="panel text-center text-slate-300">
          No patient records yet. Add the first one from the Patients page.
        </div>
      </div>
    )
  }

  return (
    <div className="page space-y-4">
      <div className="overview-grid top">
        <ProfilePanel t={t} />
        <RiskMap t={t} factors={summary.factors} />
        <KeyMetrics t={t} groups={summary.ageGroups} />
      </div>
      <div className="overview-grid middle">
        <Pipeline t={t} />
        <StrongestSignal signals={summary.signals} />
      </div>
      <div className="overview-grid bottom">
        <ComorbidityGraph graph={summary.comorbidityGraph} />
        <StatusDonut t={t} />
        <Insights summary={summary} />
        <ActivityStream activity={summary.activity} />
      </div>
    </div>
  )
}

export default Overview
