const EMAIL_REGEX =
  /^(?:[!#-'*+\-/0-9=?A-Z^-~]+(?:\.[!#-'*+\-/0-9=?A-Z^-~]+)*|"(?:[!#-[\]-~ \t]|(\\[\t -~]))+")@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,}$/i

// /^(?:[!#-'*+\/-9=?A-Z^-~]+(?:\.[!#-'*+\/-9=?A-Z^-~]+)*|"(?:[!#-[\]-~ \t]|(\\[\t -~]))+")@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,}$/i

const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/

const MICROCHIP_REGEX = /^[a-zA-Z0-9]*$/

export const isValidEmail = (email) => EMAIL_REGEX.test(email)
export const isValidPhone = (phone) => PHONE_REGEX.test(phone)
export const isValidPassword = (password) => PASSWORD_REGEX.test(password)
export const isValidMicrochip = (number) => MICROCHIP_REGEX.test(number)

export const hasLetter = (value) => /[a-zA-Z]/.test(value)
