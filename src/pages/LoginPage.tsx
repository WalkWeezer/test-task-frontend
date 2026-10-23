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
            setError('email', { message: 'Please enter a valid email address' })
            setError('password', { message: 'Password must be at least 6 characters' })
            return
          }
          navigate('/', { replace: true })
        })}
        noValidate
      >
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Log in</h1>
          <p className={styles.subtitle}>Welcome Back</p>
        </div>
        <label className={styles.field}>
          <span className={styles.inputWrap}>
            <span className={errors.email ? styles.iconError : styles.icon}>✉</span>
            <input
              className={errors.email ? styles.inputError : styles.input}
              type="text"
              placeholder="Email Address"
              autoComplete="username"
              {...register('email', {
                required: 'Please enter a valid email address',
              })}
            />
          </span>
          {errors.email ? <p className={styles.error}>{errors.email.message}</p> : null}
        </label>
        <label className={styles.field}>
          <span className={styles.inputWrap}>
            <span className={errors.password ? styles.iconError : styles.icon}>🔒</span>
            <input
              className={errors.password ? styles.inputError : styles.input}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password must be at least 6 characters',
              })}
            />
          </span>
          {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
        </label>
        <button className={styles.submit} type="submit">
          Login
        </button>
        <p className={styles.hint}>
          {MOCK_EMAIL} / {MOCK_PASSWORD}
        </p>
      </form>
    </div>
  )
}
