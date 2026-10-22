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

type LatestResponse = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

type TimeseriesResponse = {
  amount: number
  base: string
  start_date: string
  end_date: string
  rates: Record<string, Record<string, number>>
}

const BASE = 'https://api.frankfurter.dev/v1'
export const TABLE_CURRENCIES = ['AUD', 'BGN', 'EUR', 'GBP', 'JPY'] as const

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

export async function fetchCurrencyTable(): Promise<CurrencyRow[]> {
  const latest = await fetchJson<LatestResponse>(`${BASE}/latest?base=USD`)
  if (latest.rates.BGN == null && latest.rates.EUR != null) {
    const euro = await fetchJson<LatestResponse>(`${BASE}/latest?base=EUR&symbols=BGN`)
    if (euro.rates.BGN != null) latest.rates.BGN = euro.rates.BGN * latest.rates.EUR
  }
  const available = TABLE_CURRENCIES.filter((code) => latest.rates[code] != null)
  const symbols = available.join(',')
  const history = await fetchJson<TimeseriesResponse>(
    `${BASE}/${isoDate(daysAgo(7))}..${latest.date}?base=USD&symbols=${symbols}`,
  )

  const previousDates = Object.keys(history.rates).sort()
  const previousKey = previousDates.at(-2) ?? previousDates.at(-1)
  const previousRates = previousKey ? history.rates[previousKey] : undefined
  const fetchedAt = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return available.map((code) => {
    const course = latest.rates[code]
    const prev = previousRates?.[code]
    const change = prev === undefined ? 0 : course - prev
    return {
      code,
      ...withSpread(course),
      change,
      time: fetchedAt,
    }
  })
}

export async function fetchUsdHistory(code: string): Promise<HistoryPoint[]> {
  const end = isoDate(new Date())
  const start = isoDate(daysAgo(30))
  const data = await fetchJson<TimeseriesResponse>(
    `${BASE}/${start}..${end}?base=USD&symbols=${code}`,
  )

  return Object.entries(data.rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, rates]) => ({
      date,
      value: rates[code],
    }))
    .filter((point) => Number.isFinite(point.value))
}
