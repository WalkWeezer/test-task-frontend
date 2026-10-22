import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchCurrencyTable, fetchUsdHistory, type CurrencyRow, type HistoryPoint } from '../api/currencies'
import { FLAG_EMOJI, formatRate } from '../lib/currencyMeta'
import styles from './CurrenciesPage.module.css'

const RANGES = [
  { id: '1W', days: 7 },
  { id: '1M', days: 30 },
  { id: '3M', days: 90 },
  { id: '6M', days: 180 },
  { id: '1Y', days: 365 },
] as const

export function CurrenciesPage() {
  const [rows, setRows] = useState<CurrencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [range, setRange] = useState<(typeof RANGES)[number]['id']>('1M')
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [chartLoading, setChartLoading] = useState(false)

  const loadTable = () => {
    setLoading(true)
    setError(null)
    fetchCurrencyTable()
      .then(setRows)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load rates'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTable()
  }, [])

  const days = RANGES.find((item) => item.id === range)?.days ?? 30

  useEffect(() => {
    if (!selected) return
    setChartLoading(true)
    fetchUsdHistory(selected, days)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setChartLoading(false))
  }, [selected, days])

  const selectedRow = rows.find((row) => row.code === selected)
  const first = history[0]?.value
  const last = history.at(-1)?.value
  const deltaPct = first && last ? ((last - first) / first) * 100 : 0
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  )
  const compact = Boolean(selected)

  return (
    <section className={compact ? styles.split : undefined}>
      <div className={styles.mainCol}>
        <header className={styles.header}>
          <h1 className={styles.title}>Exchange rates</h1>
          <span className={styles.dateChip}>{today}</span>
        </header>

        <div className={styles.card}>
          {loading ? <p className={styles.status}>Loading exchange rates…</p> : null}
          {error ? (
            <div className={styles.status}>
              <p>{error}</p>
              <button className={styles.retry} type="button" onClick={loadTable}>
                Try again
              </button>
            </div>
          ) : null}
          {!loading && !error ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Surrender</th>
                  <th>Buy</th>
                  <th>Course</th>
                  {compact ? null : <th>Change</th>}
                  {compact ? null : <th>Time</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.code}
                    className={row.code === selected ? styles.rowActive : styles.row}
                    onClick={() => setSelected(row.code === selected ? null : row.code)}
                  >
                    <td>
                      {FLAG_EMOJI[row.code] ?? ''} {row.code}
                    </td>
                    <td>{formatRate(row.surrender)}</td>
                    <td>{formatRate(row.buy)}</td>
                    <td>{formatRate(row.course)}</td>
                    {compact ? null : <td>{formatRate(Math.abs(row.change))}</td>}
                    {compact ? null : <td>{row.time}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>

      {selected && selectedRow ? (
        <aside className={styles.chartPanel}>
          <div>
            <p className={styles.pair}>
              {FLAG_EMOJI[selected]} {selected} / USD
            </p>
            <p className={styles.pairSub}>Monthly dynamics</p>
          </div>
          <div className={styles.rateRow}>
            <p className={styles.rate}>{formatRate(selectedRow.course)}</p>
            <span className={deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}>
              {deltaPct >= 0 ? '▲' : '▼'} {deltaPct >= 0 ? '+' : ''}
              {deltaPct.toFixed(2)}%
            </span>
          </div>
          <div className={styles.chartBox}>
            {chartLoading ? <p className={styles.status}>Loading chart…</p> : null}
            {!chartLoading && history.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7bd39a" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#7bd39a" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip formatter={(value) => [typeof value === 'number' ? formatRate(value) : String(value), selected]} />
                  <Area type="monotone" dataKey="value" stroke="#3cc56a" strokeWidth={2} fill="url(#rateFill)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className={styles.ranges}>
            {RANGES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={range === item.id ? styles.rangeActive : styles.range}
                onClick={() => setRange(item.id)}
              >
                {item.id}
              </button>
            ))}
          </div>
        </aside>
      ) : null}
    </section>
  )
}
