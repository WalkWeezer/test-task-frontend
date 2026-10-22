import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand} aria-hidden>
          💰
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <span className={styles.emoji}>💱</span>
            <span>Rates</span>
          </NavLink>
          <NavLink to="/cards" className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}>
            <span className={styles.emoji}>📋</span>
            <span>Cards</span>
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
          <span className={styles.emojiSmall}>🚪</span>
          <span>Logout</span>
        </button>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
