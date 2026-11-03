import { useEffect, useState } from 'react'
import { LuMaximize, LuMenu, LuMinimize, LuX } from 'react-icons/lu'
import { getHealth } from '../api'

const HEALTH_POLL_MS = 30000

const DashboardNavbar = ({ title, sidebarOpen, toggleSidebar }) => {
  const [online, setOnline] = useState(null)
  const [now, setNow] = useState(() => new Date())
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = () =>
      getHealth()
        .then(() => !cancelled && setOnline(true))
        .catch(() => !cancelled && setOnline(false))
    check()
    const id = setInterval(check, HEALTH_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen?.()
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn menu-btn"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <LuX size={20} /> : <LuMenu size={20} />}
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate">Gallstone Risk Dashboard</h1>
        <p className="truncate">{title} · Clinical analytics for high-risk patient detection</p>
      </div>

      <div className="topbar-stat hide-sm">
        <small>
          <span className={`dot ${online === false ? 'is-bad' : ''}`} />
          Database
        </small>
        <strong className={online === false ? 'text-red-400' : 'text-emerald-400'}>
          {online === null ? 'CHECKING' : online ? 'CONNECTED' : 'OFFLINE'}
        </strong>
      </div>

      <div className="topbar-stat hide-sm">
        <small>Data Mode</small>
        <strong className="text-sky-400">LIVE</strong>
      </div>

      <time className="hide-sm text-sm font-medium tabular-nums text-slate-200" dateTime={now.toISOString()}>
        {now.toLocaleTimeString([], { hour12: false })}
      </time>

      <button
        type="button"
        className="icon-btn"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}
      >
        {fullscreen ? <LuMinimize size={18} /> : <LuMaximize size={18} />}
      </button>
    </header>
  )
}

export default DashboardNavbar
