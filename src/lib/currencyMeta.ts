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

export function flagImg(code: string): string {
  const emoji = FLAG_EMOJI[code]
  if (!emoji) return ''
  const points = [...emoji].map((char) => char.codePointAt(0)?.toString(16)).join('-')
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${points}.svg`
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
