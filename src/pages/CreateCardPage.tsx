import { useForm } from 'react-hook-form'
import styles from './CreateCardPage.module.css'

const TAG_COLORS = ['#8b7cf6', '#f0a6c8', '#9fe1c3'] as const

const STATUSES = ['To do', 'In progress', 'Done'] as const

type CardForm = {
  title: string
  description: string
  assignee: string
  status: (typeof STATUSES)[number]
  dueDate: string
  tagColor: string
}

const emptyPreview = {
  title: 'Card title',
  description: 'The description will appear here as you type.',
  assignee: 'Unassigned',
  status: 'To do',
  dueDate: 'No due date',
}

export function CreateCardPage() {
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
      assignee: '',
      status: 'To do',
      dueDate: '',
      tagColor: TAG_COLORS[0],
    },
  })

  const values = watch()

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Create New Card</h1>
      </header>
      <div className={styles.grid}>
        <form
          className={styles.form}
          onSubmit={handleSubmit((data) => {
            window.alert(JSON.stringify(data, null, 2))
          })}
          noValidate
        >
          <div className={styles.fields}>
            <label className={`${styles.field} ${styles.wide}`}>
              <span className={styles.label}>Title</span>
              <input
                className={`${styles.input} ${errors.title ? styles.invalid : ''}`}
                placeholder="Enter card title"
                {...register('title', {
                  required: 'This field is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                })}
              />
              <p className={styles.error}>{errors.title?.message ?? ''}</p>
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span className={styles.label}>Description</span>
              <textarea
                className={`${styles.textarea} ${errors.description ? styles.invalid : ''}`}
                placeholder="Describe the task"
                {...register('description', {
                  required: 'This field is required',
                  minLength: { value: 10, message: 'Minimum 10 characters' },
                })}
              />
              <p className={styles.error}>{errors.description?.message ?? ''}</p>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Assignee</span>
              <input
                className={`${styles.input} ${errors.assignee ? styles.invalid : ''}`}
                placeholder="Name"
                {...register('assignee', { required: 'This field is required' })}
              />
              <p className={styles.error}>{errors.assignee?.message ?? ''}</p>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select className={styles.select} {...register('status', { required: true })}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Due date</span>
              <input
                className={`${styles.input} ${errors.dueDate ? styles.invalid : ''}`}
                type="date"
                {...register('dueDate', { required: 'This field is required' })}
              />
              <p className={styles.error}>{errors.dueDate?.message ?? ''}</p>
            </label>
            <div className={styles.field}>
              <span className={styles.label}>Tag color</span>
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
          <div className={styles.actions}>
            <button className={styles.submit} type="submit">
              Preview
            </button>
          </div>
        </form>

        <aside className={styles.preview}>
          <h2 className={styles.previewTitle}>Card Preview</h2>
          {values.title || values.description ? (
            <article className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{values.title || emptyPreview.title}</h3>
                <span className={styles.badge} style={{ background: values.tagColor }}>
                  {values.status}
                </span>
              </div>
              <p className={styles.body}>{values.description || emptyPreview.description}</p>
              <div className={styles.meta}>
                <span>{values.assignee || emptyPreview.assignee}</span>
                <span>{values.dueDate || emptyPreview.dueDate}</span>
              </div>
            </article>
          ) : (
            <p className={styles.empty}>Fill in the form to see a live preview.</p>
          )}
        </aside>
      </div>
    </section>
  )
}
