import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import {
  clearCardDraft,
  EMPTY_CARD_FORM,
  loadCardDraft,
  saveCardDraft,
  type CardForm,
} from './cardDraft'
import styles from './CreateCardPage.module.css'

const PRIORITIES = ['High', 'Medium', 'Low'] as const
const STATUSES = ['To do', 'In Progress', 'Done'] as const
const ASSIGNEES = ['Alex Johnson', 'Maria Chen', 'Sam Lee'] as const

const TAG_STYLES = [
  { bg: '#eee4ff', color: '#814ee0' },
  { bg: '#e7eeff', color: '#2563eb' },
  { bg: '#ffe7e7', color: '#ea3a3a' },
]

function formatDeadline(value: string) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function CreateCardPage() {
  const draft = loadCardDraft()
  const [mode, setMode] = useState<'form' | 'preview'>(draft.mode)
  const [files, setFiles] = useState<File[]>(draft.files)
  const [tagDraft, setTagDraft] = useState(draft.tagDraft)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardForm>({
    defaultValues: draft.values,
  })

  const values = watch()
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  useEffect(() => {
    saveCardDraft({ values, mode, tagDraft, files })
  }, [values, mode, tagDraft, files])

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((current) => [...current, ...Array.from(list)].slice(0, 6))
  }

  const addTag = (raw: string) => {
    const parts = raw
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)
    if (!parts.length) return
    const next = [...values.tags]
    for (const tag of parts) {
      if (!next.some((item) => item.toLowerCase() === tag.toLowerCase())) next.push(tag)
    }
    setValue('tags', next)
    setTagDraft('')
  }

  const onTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(tagDraft)
    }
    if (event.key === 'Backspace' && !tagDraft && values.tags.length) {
      setValue('tags', values.tags.slice(0, -1))
    }
  }

  if (mode === 'preview') {
    const tags = values.tags
    return (
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Card Preview</h1>
        </header>
        <article className={styles.previewCard}>
          <div className={styles.badges}>
            {values.status ? <span className={styles.badgeBlue}>{values.status}</span> : null}
            {values.priority ? (
              <span className={styles.badgeWarn}>{values.priority === 'High' ? '🔥 High' : values.priority}</span>
            ) : null}
          </div>
          <h2 className={styles.previewTitle}>{values.title}</h2>
          <p className={styles.previewBody}>{values.description}</p>
          <div className={styles.divider} />
          <div className={styles.metaRow}>
            <div>
              <p className={styles.metaLabel}>ASSIGNEE</p>
              <p className={styles.metaValue}>{values.assignee || '—'}</p>
            </div>
            <div>
              <p className={styles.metaLabel}>DEADLINE</p>
              <p className={styles.metaValue}>{formatDeadline(values.deadline)}</p>
            </div>
          </div>
          {tags.length ? (
            <div className={styles.tagRow}>
              {tags.map((tag, index) => {
                const style = TAG_STYLES[index % TAG_STYLES.length]
                return (
                  <span key={tag} className={styles.tag} style={{ background: style.bg, color: style.color }}>
                    {tag}
                  </span>
                )
              })}
            </div>
          ) : null}
          {previews.length ? (
            <div className={styles.thumbs}>
              {previews.map((src) => (
                <img key={src} className={styles.thumb} src={src} alt="" />
              ))}
            </div>
          ) : null}
        </article>
        <div className={styles.actionsStart}>
          <button className={styles.ghost} type="button" onClick={() => setMode('form')}>
            ← Back to Form
          </button>
          <button className={styles.primary} type="button" onClick={() => setMode('form')}>
            Edit Card
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Create New Card</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => {
          window.alert(
            JSON.stringify(
              {
                ...data,
                images: files.map((file) => file.name),
              },
              null,
              2,
            ),
          )
          setMode('preview')
        })}
        noValidate
      >
        <div className={styles.formCard}>
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={errors.title ? styles.labelError : styles.label}>Title *</span>
              <input
                className={errors.title ? styles.controlError : styles.control}
                placeholder="Enter card title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title ? <p className={styles.error}>{errors.title.message}</p> : null}
            </label>
            <label className={styles.field}>
              <span className={errors.description ? styles.labelError : styles.label}>Description *</span>
              <textarea
                className={`${errors.description ? styles.controlError : styles.control} ${styles.textarea}`}
                placeholder="Enter detailed description..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description ? <p className={styles.error}>{errors.description.message}</p> : null}
            </label>
            <label className={styles.field}>
              <span className={errors.priority ? styles.labelError : styles.label}>Priority *</span>
              <select
                className={errors.priority ? styles.controlError : styles.control}
                {...register('priority', { required: 'Please select a priority' })}
              >
                <option value="">Select priority</option>
                {PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.priority ? <p className={styles.error}>{errors.priority.message}</p> : null}
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Status</span>
              <select className={styles.control} {...register('status')}>
                <option value="">Select status</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={styles.label}>Assignee</span>
              <select className={styles.control} {...register('assignee')}>
                <option value="">Select assignee</option>
                {ASSIGNEES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Deadline</span>
              <input className={styles.control} type="date" {...register('deadline')} />
            </label>
            <div className={styles.field}>
              <span className={styles.label}>Tags</span>
              <div className={styles.tagInput}>
                {values.tags.map((tag, index) => {
                  const style = TAG_STYLES[index % TAG_STYLES.length]
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={styles.tagChip}
                      style={{ background: style.bg, color: style.color }}
                      onClick={() => setValue('tags', values.tags.filter((item) => item !== tag))}
                    >
                      {tag}
                    </button>
                  )
                })}
                <input
                  className={styles.tagField}
                  placeholder={values.tags.length ? '' : 'Add tags...'}
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={onTagKeyDown}
                  onBlur={() => addTag(tagDraft)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Images</span>
              <label className={styles.drop}>
                <input
                  className={styles.file}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => addFiles(event.target.files)}
                />
                <span className={styles.cloud}>☁️</span>
                <span className={styles.dropText}>Drag & drop images here</span>
                <span className={styles.dropLink}>or click to browse</span>
              </label>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.ghost}
            type="button"
            onClick={() => {
              clearCardDraft()
              reset(EMPTY_CARD_FORM)
              setFiles([])
              setTagDraft('')
              setMode('form')
            }}
          >
            Cancel
          </button>
          <button className={styles.primary} type="submit">
            Create Card
          </button>
        </div>
      </form>
    </section>
  )
}
