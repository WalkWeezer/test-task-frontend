import { withSpread } from '../lib/currencyMeta'

export type CurrencyRow = {
  code: string
  surrender: number
  buy: number
  course: number
  change: number
  time: string
}

export type HistoryPoint = {
  date: string
  value: number
}

type OpenErResponse = {
  result: string
  time_last_update_utc: string
  rates: Record<string, number>
}

type FrankfurterSeries = {
  rates: Record<string, Record<string, number>>
}

export const TABLE_CURRENCIES = ['AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY'] as const

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function daysAgo(days: number): Date {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date
}

function formatClock(utcStamp: string): string {
  const parsed = new Date(utcStamp)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
  return parsed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function lastTwo(rates: Record<string, Record<string, number>>, code: string) {
  const dates = Object.keys(rates).sort()
  const prev = dates.at(-2)
  const last = dates.at(-1)
  if (!prev || !last) return 0
  const a = rates[prev]?.[code]
  const b = rates[last]?.[code]
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0
  return b - a
}

export async function fetchCurrencyTable(): Promise<CurrencyRow[]> {
  const latest = await fetchJson<OpenErResponse>('https://open.er-api.com/v6/latest/USD')
  if (latest.result !== 'success') {
    throw new Error('Exchange rate API returned an error')
  }

  let series: FrankfurterSeries['rates'] = {}
  try {
    const start = isoDate(daysAgo(7))
    const end = isoDate(new Date())
    const data = await fetchJson<FrankfurterSeries>(
      `https://api.frankfurter.dev/v1/${start}..${end}?base=USD&symbols=AUD,BRL,CAD,CHF,EUR,GBP,JPY`,
    )
    series = data.rates
  } catch {
    series = {}
  }

  const time = formatClock(latest.time_last_update_utc)
  const eurChange = lastTwo(series, 'EUR')

  return TABLE_CURRENCIES.map((code) => {
    const course = latest.rates[code]
    if (!Number.isFinite(course)) {
      throw new Error(`Missing rate for ${code}`)
    }
    const change =
      code === 'BGN' ? eurChange * (course / (latest.rates.EUR || 1)) : lastTwo(series, code)
    return {
      code,
      ...withSpread(course),
      change,
      time,
    }
  })
}

export async function fetchUsdHistory(code: string): Promise<HistoryPoint[]> {
  const end = isoDate(new Date())
  const start = isoDate(daysAgo(30))
  const seriesCode = code === 'BGN' ? 'EUR' : code
  const data = await fetchJson<FrankfurterSeries>(
    `https://api.frankfurter.dev/v1/${start}..${end}?base=USD&symbols=${seriesCode}`,
  )

  const points = Object.entries(data.rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, rates]) => ({
      date,
      value: rates[seriesCode],
    }))
    .filter((point) => Number.isFinite(point.value))

  if (code !== 'BGN') return points

  const latest = await fetchJson<OpenErResponse>('https://open.er-api.com/v6/latest/USD')
  const peg = latest.rates.EUR ? latest.rates.BGN / latest.rates.EUR : 1.95583
  return points.map((point) => ({ ...point, value: point.value * peg }))
}
