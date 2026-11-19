export function formatPhone(value = '') {
  const digits = value.replace(/\D/g, '')

  if (digits.length > 3 && digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  } else if (digits.length > 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  return digits
}
