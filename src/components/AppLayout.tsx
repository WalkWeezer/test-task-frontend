import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import styles from './AppLayout.module.css'

function RatesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 15l3.5-4 3 2.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CardsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.shell}>
      <button className={styles.menuToggle} type="button" onClick={() => setOpen(true)} aria-label="Open menu">
        ☰
      </button>
      {open ? <button className={styles.backdrop} type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden>
            💰
          </span>
          Dashboard
        </div>
        <p className={styles.menuLabel}>MENU</p>
        <nav className={styles.nav} onClick={() => setOpen(false)}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <RatesIcon />
            Exchange Rates
          </NavLink>
          <NavLink to="/cards" className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <CardsIcon />
            Kanban Cards
          </NavLink>
        </nav>
        <button
          className={styles.logout}
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          <span aria-hidden>◼</span>
          Logout
        </button>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
