import { useContext } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import HistplotStone from './StoneCharacterstic/HistplotStone'
import StoneInfo from './StoneCharacterstic/StoneInfo'

const StoneCharacteristics = () => {
  const { data } = useContext(DataContext)

  // ================= THEME COLORS =================
  const THEME = {
    bg: '#0f172a', // Main background
    card: '#020617', // Card background
    grid: '#1e293b', // Chart grid (if used)
    text: '#e5e7eb', // Primary text
    muted: '#94a3b8', // Subtle borders / shadows
    accent1: '#38bdf8', // Blue accent
    accent2: '#22c55e', // Green accent
    accent3: '#f97316', // Orange accent
    accent4: '#a855f7', // Purple accent
  }

  const cardStyle = {
    background: THEME.card,
    borderRadius: 18,
    padding: 22,
    color: THEME.text,
    boxShadow: `0 10px 25px rgba(56,189,248,0.15)`,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  }

  const headingStyle = {
    background: THEME.accent1,
    color: THEME.bg,
    padding: '8px 12px',
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 18,
  }

  return (
    <div
      className="flex flex-col lg:flex-row gap-5"
      style={{
        background: `linear-gradient(to bottom, ${THEME.bg}, ${THEME.card})`,
        minHeight: '100vh',
        padding: 30,
      }}
    >
      {/* Stone Info Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <StoneInfo />
      </div>

      {/* Histogram Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <h2 style={headingStyle}>Gallstone Status Distribution by Age</h2>
        {data && data.length !== 0 ? <HistplotStone data={data} /> : <Loader />}
      </div>
    </div>
  )
}

export default StoneCharacteristics
