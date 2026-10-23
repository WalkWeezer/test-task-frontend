export type CardForm = {
  title: string
  description: string
  priority: string
  status: string
  assignee: string
  deadline: string
  tags: string[]
}

export type CardImage = {
  name: string
  preview: string
  file: File
}

export type CardDraft = {
  values: CardForm
  mode: 'form' | 'preview'
  tagDraft: string
  images: CardImage[]
}

const STORAGE_KEY = 'test-task-card-draft'

export const EMPTY_CARD_FORM: CardForm = {
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
  tags: [],
}

let draft: CardDraft = {
  values: { ...EMPTY_CARD_FORM, tags: [] },
  mode: 'form',
  tagDraft: '',
  images: [],
}

let hydrated = false

function readStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CardDraft>
    return parsed
  } catch {
    return null
  }
}

function persist() {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        values: draft.values,
        mode: draft.mode,
        tagDraft: draft.tagDraft,
      }),
    )
  } catch {
    // private mode / quota
  }
}

function hydrate() {
  if (hydrated) return
  hydrated = true
  const stored = readStored()
  if (!stored) return
  draft = {
    ...draft,
    values: {
      ...EMPTY_CARD_FORM,
      ...stored.values,
      tags: Array.isArray(stored.values?.tags) ? stored.values.tags : [],
    },
    mode: stored.mode === 'preview' ? 'preview' : 'form',
    tagDraft: stored.tagDraft ?? '',
  }
}

export function loadCardDraft(): CardDraft {
  hydrate()
  return {
    ...draft,
    values: { ...draft.values, tags: [...draft.values.tags] },
    images: draft.images,
  }
}

export function saveCardDraft(patch: Partial<CardDraft>) {
  hydrate()
  draft = {
    values: patch.values ? { ...patch.values, tags: [...patch.values.tags] } : draft.values,
    mode: patch.mode ?? draft.mode,
    tagDraft: patch.tagDraft ?? draft.tagDraft,
    images: patch.images ?? draft.images,
  }
  persist()
}

export function clearCardDraft() {
  draft = {
    values: { ...EMPTY_CARD_FORM, tags: [] },
    mode: 'form',
    tagDraft: '',
    images: [],
  }
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
