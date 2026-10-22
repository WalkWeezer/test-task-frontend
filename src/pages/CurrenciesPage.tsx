import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchCurrencyTable, fetchUsdHistory, type CurrencyRow, type HistoryPoint } from '../api/currencies'
import { flagUrl, formatChange, formatRate } from '../lib/currencyMeta'
import styles from './CurrenciesPage.module.css'

function changeClass(value: number) {
  if (value > 0) return styles.changeUp
  if (value < 0) return styles.changeDown
  return undefined
}

export function CurrenciesPage() {
  const [rows, setRows] = useState<CurrencyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)

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

  useEffect(() => {
    if (!selected) return
    setChartLoading(true)
    setChartError(null)
    fetchUsdHistory(selected)
      .then(setHistory)
      .catch((err: unknown) => setChartError(err instanceof Error ? err.message : 'Failed to load chart'))
      .finally(() => setChartLoading(false))
  }, [selected])

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

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Exchange rates</h1>
        <span className={styles.dateChip}>{today}</span>
      </header>

      <div className={selected ? styles.layoutSplit : styles.layout}>
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
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Currency</th>
                    <th>Surrender</th>
                    <th>Buy</th>
                    <th>Course</th>
                    <th>Change</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.code}
                      className={row.code === selected ? styles.rowActive : styles.row}
                      onClick={() => setSelected(row.code)}
                    >
                      <td>
                        <span className={styles.currency}>
                          <img className={styles.flag} src={flagUrl(row.code)} alt="" referrerPolicy="no-referrer" />
                          {row.code}
                        </span>
                      </td>
                      <td>{formatRate(row.surrender)}</td>
                      <td>{formatRate(row.buy)}</td>
                      <td>{formatRate(row.course)}</td>
                      <td className={changeClass(row.change)}>{formatChange(row.change)}</td>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {selected ? (
          <aside className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div>
                <p className={styles.pair}>{selected} / USD, 30d</p>
                <p className={styles.rate}>{selectedRow ? formatRate(selectedRow.course) : '—'}</p>
              </div>
              <span className={deltaPct >= 0 ? styles.deltaUp : styles.deltaDown}>
                {deltaPct >= 0 ? '+' : ''}
                {deltaPct.toFixed(2)}%
              </span>
            </div>
            {chartLoading ? <p className={styles.hint}>Loading chart…</p> : null}
            {chartError ? <p className={styles.hint}>{chartError}</p> : null}
            {!chartLoading && !chartError && history.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={history} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#eef1f8" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip
                    formatter={(value) => [typeof value === 'number' ? formatRate(value) : String(value), selected]}
                  />
                  <Line type="monotone" dataKey="value" stroke="#7bd39a" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </aside>
        ) : null}
      </div>
    </section>
  )
}
