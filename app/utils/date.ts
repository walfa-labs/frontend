export type DateFormatPreset = 'long' | 'short' | 'yearMonth'

const PRESETS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  short: { year: 'numeric', month: 'short', day: 'numeric' },
  yearMonth: { year: 'numeric', month: 'short' },
}

/**
 * Formats an ISO date string, timestamp, or Date object with consistent locale (en-US).
 * Supports presets ('long', 'short', 'yearMonth') or custom Intl.DateTimeFormatOptions.
 * Returns the provided fallback string when date is null, undefined, or invalid.
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  presetOrOptions: DateFormatPreset | Intl.DateTimeFormatOptions = 'long',
  fallback = ''
): string {
  if (!date) return fallback
  const d = typeof date === 'object' && date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return fallback

  const options = typeof presetOrOptions === 'string'
    ? PRESETS[presetOrOptions] ?? PRESETS.long
    : presetOrOptions

  return d.toLocaleDateString('en-US', options)
}
