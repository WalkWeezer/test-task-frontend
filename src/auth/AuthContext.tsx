import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'test-task-auth'
export const MOCK_EMAIL = 'user@example.com'
export const MOCK_PASSWORD = 'password'

type AuthContextValue = {
  isAuthenticated: boolean
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth)

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
      return { ok: false as const, message: 'Invalid email or password' }
    }
    localStorage.setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
