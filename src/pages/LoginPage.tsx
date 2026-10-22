import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { MOCK_EMAIL, MOCK_PASSWORD, useAuth } from '../auth/AuthContext'
import styles from './LoginPage.module.css'

type LoginValues = {
  email: string
  password: string
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className={styles.page}>
      <form
        className={styles.card}
        onSubmit={handleSubmit((values) => {
          const result = login(values.email, values.password)
          if (!result.ok) {
            setError('email', { message: result.message })
            setError('password', { message: result.message })
            return
          }
          navigate('/', { replace: true })
        })}
        noValidate
      >
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.subtitle}>Welcome Back</p>
        <label className={styles.field}>
          <span className={styles.srOnly}>Email Address</span>
          <span className={styles.inputWrap}>
            <span className={styles.icon} aria-hidden>
              ✉
            </span>
            <input
            className={errors.email ? styles.inputError : styles.input}
            type="email"
            placeholder="Email Address"
            autoComplete="username"
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid e-mail',
              },
            })}
          />
          </span>
          <p className={styles.error}>{errors.email?.message ?? ''}</p>
        </label>
        <label className={styles.field}>
          <span className={styles.srOnly}>Password</span>
          <span className={styles.inputWrap}>
            <span className={styles.icon} aria-hidden>
              🔒
            </span>
            <input
            className={errors.password ? styles.inputError : styles.input}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register('password', {
              required: 'This field is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />
          </span>
          <p className={styles.error}>{errors.password?.message ?? ''}</p>
        </label>
        <button className={styles.submit} type="submit">
          Login
        </button>
        <p className={styles.hint}>
          Mock login: <code>{MOCK_EMAIL}</code> / <code>{MOCK_PASSWORD}</code>
        </p>
      </form>
    </div>
  )
}
