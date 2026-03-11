import Decimal from 'break_eternity.js'

export { Decimal }

export function fromState(value: string): Decimal {
  return new Decimal(value || '0')
}

export function toState(d: Decimal): string {
  return d.toString()
}

export function formatShort(d: Decimal): string {
  const n = d.toNumber()
  if (!isFinite(n) || n >= 1e15) return typeof d.toFixed === 'function' ? d.toFixed(0) : d.toString()
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return typeof d.toFixed === 'function' ? d.toFixed(2) : d.toString()
}

export function parseDecimal(value: string | number | Decimal): Decimal {
  if (typeof value === 'object' && value !== null && 'toNumber' in value)
    return value as Decimal
  return new Decimal(value as string | number)
}
