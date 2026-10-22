import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`${styles.shell} ${expanded ? styles.shellExpanded : ''}`}>
      <aside className={`${styles.sidebar} ${expanded ? styles.sidebarExpanded : ''}`}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        >
          <span className={styles.brandEmoji} aria-hidden>
            💰
          </span>
          <span className={styles.brandTitle}>Dashboard</span>
        </button>
        <div className={styles.divider} />
        <p className={styles.menuLabel}>MENU</p>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <span className={styles.emoji} aria-hidden>
              💱
            </span>
            <span className={styles.shortLabel}>Rates</span>
            <span className={styles.fullLabel}>Exchange Rates</span>
          </NavLink>
          <NavLink to="/cards" className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <span className={styles.emoji} aria-hidden>
              📋
            </span>
            <span className={styles.shortLabel}>Cards</span>
            <span className={styles.fullLabel}>Kanban Cards</span>
          </NavLink>
        </nav>
        <div className={styles.divider} />
        <button
          className={styles.logout}
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <span className={styles.emojiSmall} aria-hidden>
            🚪
          </span>
          <span>Logout</span>
        </button>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
