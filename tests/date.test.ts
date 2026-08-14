import { describe, expect, it } from 'vitest'
import { formatDate } from '../app/utils/date'

describe('formatDate', () => {
  it('formats date in long preset by default', () => {
    const res = formatDate('2026-08-14T00:00:00Z')
    expect(res).toBe('August 14, 2026')
  })

  it('formats date in short preset', () => {
    const res = formatDate('2026-08-14T00:00:00Z', 'short')
    expect(res).toBe('Aug 14, 2026')
  })

  it('formats date in yearMonth preset', () => {
    const res = formatDate('2026-08-14T00:00:00Z', 'yearMonth')
    expect(res).toBe('Aug 2026')
  })

  it('accepts custom Intl.DateTimeFormatOptions', () => {
    const res = formatDate('2026-08-14T00:00:00Z', { year: 'numeric' })
    expect(res).toBe('2026')
  })

  it('returns empty string fallback by default for null/undefined/invalid', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('invalid-date')).toBe('')
  })

  it('returns custom fallback when provided', () => {
    expect(formatDate(null, 'yearMonth', 'Present')).toBe('Present')
    expect(formatDate(undefined, 'short', '—')).toBe('—')
  })
})
