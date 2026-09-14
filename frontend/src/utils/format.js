export const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

export const groupThousands = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, "'")

export const formatAmount = (value) => {
  const [intPart, decPart] = Math.abs(value).toFixed(2).split('.')
  return `${groupThousands(intPart)}.${decPart}`
}

export const formatCurrency = (value) => `${formatAmount(value)} €`

// Formats a raw numeric string ("1000.5") as the user types it ("1'000.5"),
// without rounding or forcing decimals, so it stays editable.
export const formatInputAmount = (raw) => {
  const [intPart, ...rest] = raw.split('.')
  const grouped = groupThousands(intPart)
  return rest.length ? `${grouped}.${rest.join('')}` : grouped
}

// Strips a formatted amount back to a plain numeric string ("1'000.5" -> "1000.5").
export const parseInputAmount = (formatted) => {
  const cleaned = formatted.replace(/[^0-9.]/g, '')
  const [intPart, ...rest] = cleaned.split('.')
  return rest.length ? `${intPart}.${rest.join('')}` : intPart
}
