import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const getParsedStorage = (key) => {
    const value = localStorage.getItem(key)
    return value === 'null' ? null : value
  }

  const registrationStep = ref(0)
  const accountType = ref(getParsedStorage('accountType'))
  const animalType = ref(getParsedStorage('animalType'))
  const token = ref(getParsedStorage('token'))
  const userEmail = ref(getParsedStorage('userEmail'))
  const registrationStatus = ref(null)
  const profileData = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAccountType = (type) => {
    accountType.value = type
    localStorage.setItem('accountType', type)
  }

  const setAnimalType = (type) => {
    animalType.value = type
    localStorage.setItem('animalType', type)
  }

  const setRegistrationStatus = (status) => {
    registrationStatus.value = status
  }

  const setRegistrationStep = (step) => {
    registrationStep.value = step
  }

  const setToken = (accessToken) => {
    token.value = accessToken
    if (accessToken) {
      localStorage.setItem('token', accessToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUserEmail = (email) => {
    userEmail.value = email
    if (email) {
      localStorage.setItem('userEmail', email)
    } else {
      localStorage.removeItem('userEmail')
    }
  }

  const setUserData = ({ token, email, accountType }) => {
    setToken(token)
    setUserEmail(email)
    setAccountType(accountType)
  }

  const setProfileData = (data) => {
    profileData.value = data
  }

  const clearUserData = () => {
    setUserData({ token: null, email: '', accountType: '' })

    localStorage.removeItem('accountType')
    localStorage.removeItem('animalType')
    localStorage.removeItem('userEmail')
  }

  const resetStore = () => {
    registrationStep.value = 0
    accountType.value = null
    animalType.value = null
    token.value = null
    userEmail.value = null
    registrationStatus.value = null
    profileData.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('animalType')
    localStorage.removeItem('animalType')
    localStorage.removeItem('userEmail')
  }

  return {
    registrationStep,
    accountType,
    animalType,
    token,
    userEmail,
    profileData,
    registrationStatus,
    isAuthenticated,
    setToken,
    setUserEmail,
    setUserData,
    clearUserData,
    resetStore,
    setAccountType,
    setAnimalType,
    setRegistrationStep,
    setRegistrationStatus,
    setProfileData
  }
})
