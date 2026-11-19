import { ref } from 'vue'

export function useFormErrors(initialFields = []) {
  const errorState = ref({})

  initialFields.forEach((field) => {
    errorState.value[field] = ''
  })

  const setError = (field, message) => {
    errorState.value[field] = message
  }

  const clearErrors = () => {
    Object.keys(errorState.value).forEach((key) => {
      errorState.value[key] = ''
    })
  }

  return {
    errorState,
    setError,
    clearErrors
  }
}
