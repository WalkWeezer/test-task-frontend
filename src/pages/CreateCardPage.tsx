import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CreateCardPage.module.css'

const TAG_COLORS = ['#c4b5fd', '#f9a8d4', '#86efac', '#a5b4fc'] as const

const STATUSES = ['To do', 'In progress', 'Done'] as const

type CardForm = {
  title: string
  description: string
  status: (typeof STATUSES)[number]
  dueDate: string
  tagColor: string
}

export function CreateCardPage() {
  const [mode, setMode] = useState<'form' | 'preview'>('form')
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardForm>({
    defaultValues: {
      title: '',
      description: '',
      status: 'To do',
      dueDate: '',
      tagColor: TAG_COLORS[0],
    },
  })

  const values = watch()

  if (mode === 'preview') {
    return (
      <section>
        <header className={styles.header}>
          <h1 className={styles.title}>Card Preview</h1>
        </header>
        <article className={styles.previewCard}>
          <h2 className={styles.cardTitle}>{values.title}</h2>
          <p className={styles.body}>{values.description}</p>
          <div className={styles.tags}>
            {TAG_COLORS.map((color) => (
              <span
                key={color}
                className={styles.tag}
                style={{
                  background: color,
                  outline: color === values.tagColor ? '2px solid #1d1b4d' : undefined,
                }}
              />
            ))}
          </div>
          <div className={styles.meta}>
            <span>{values.status}</span>
            <span>{values.dueDate}</span>
          </div>
          <div className={styles.previewActions}>
            <button className={styles.ghost} type="button" onClick={() => setMode('form')}>
              Edit
            </button>
            <button
              className={styles.submit}
              type="button"
              onClick={() => window.alert(JSON.stringify(values, null, 2))}
            >
              Preview
            </button>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Create New Card</h1>
      </header>
      <form
        className={styles.form}
        onSubmit={handleSubmit(() => setMode('preview'))}
        noValidate
      >
        <div className={styles.columns}>
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={styles.label}>Title</span>
              <input
                className={`${styles.input} ${errors.title ? styles.invalid : ''}`}
                placeholder="Enter title"
                {...register('title', {
                  required: 'This field is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                })}
              />
              <p className={styles.error}>{errors.title?.message ?? ''}</p>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Description</span>
              <textarea
                className={`${styles.textarea} ${errors.description ? styles.invalid : ''}`}
                placeholder="Enter a description"
                {...register('description', {
                  required: 'This field is required',
                  minLength: { value: 10, message: 'Minimum 10 characters' },
                })}
              />
              <p className={styles.error}>{errors.description?.message ?? ''}</p>
            </label>
          </div>
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select
                className={`${styles.select} ${errors.status ? styles.invalid : ''}`}
                {...register('status', { required: 'This field is required' })}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Date</span>
              <input
                className={`${styles.input} ${errors.dueDate ? styles.invalid : ''}`}
                type="date"
                {...register('dueDate', { required: 'This field is required' })}
              />
              <p className={styles.error}>{errors.dueDate?.message ?? ''}</p>
            </label>
            <div className={styles.field}>
              <span className={styles.label}>Color</span>
              <div className={styles.colors}>
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={values.tagColor === color ? styles.colorActive : styles.color}
                    style={{ background: color }}
                    aria-label={color}
                    onClick={() => setValue('tagColor', color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.submit} type="submit">
            Preview
          </button>
        </div>
      </form>
    </section>
  )
}
