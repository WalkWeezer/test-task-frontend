export const FLAG_EMOJI: Record<string, string> = {
  AUD: '🇦🇺',
  BGN: '🇧🇬',
  BRL: '🇧🇷',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
}

export function formatRate(value: number): string {
  if (value >= 100) return value.toFixed(3)
  if (value >= 10) return value.toFixed(4)
  return value.toFixed(4)
}

const SPREAD = 0.012

export function withSpread(mid: number) {
  return {
    surrender: mid * (1 + SPREAD),
    buy: mid * (1 - SPREAD),
    course: mid,
  }
}
