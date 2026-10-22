const FLAG_BY_CURRENCY: Record<string, string> = {
  AUD: 'au',
  BGN: 'bg',
  BRL: 'br',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  CZK: 'cz',
  DKK: 'dk',
  EUR: 'eu',
  GBP: 'gb',
  HKD: 'hk',
  HUF: 'hu',
  IDR: 'id',
  ILS: 'il',
  INR: 'in',
  ISK: 'is',
  JPY: 'jp',
  KRW: 'kr',
  MXN: 'mx',
  MYR: 'my',
  NOK: 'no',
  NZD: 'nz',
  PHP: 'ph',
  PLN: 'pl',
  RON: 'ro',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TRY: 'tr',
  USD: 'us',
  ZAR: 'za',
}

export function flagUrl(code: string): string {
  const country = FLAG_BY_CURRENCY[code] ?? code.slice(0, 2).toLowerCase()
  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/${country}.svg`
}

export function formatRate(value: number): string {
  if (value >= 100) return value.toFixed(3)
  if (value >= 10) return value.toFixed(4)
  return value.toFixed(4)
}

export function formatChange(value: number): string {
  const abs = Math.abs(value).toFixed(4)
  if (value > 0) return `+${abs}`
  if (value < 0) return `-${abs}`
  return '0.0000'
}

const SPREAD = 0.012

export function withSpread(mid: number) {
  return {
    surrender: mid * (1 + SPREAD),
    buy: mid * (1 - SPREAD),
    course: mid,
  }
}
