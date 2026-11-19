import apiClient from '../plugins/axios'

export const registerUser = (payload) => {
  return apiClient.post('/register', payload)
}

export const getUserWithOneTimeToken = (token) => {
  return apiClient.get(`one-time-data/${token}`)
}

export const verifyEmail = (token) => {
  return apiClient.get(`/verify-email/${token}`)
}

export const userLogin = (payload) => {
  return apiClient.post('/login', payload)
}

export const userLogout = () => {
  return apiClient.post('/logout')
}

export const setPassword = (payload) => {
  return apiClient.put('/set-password', payload)
}

export const setProfile = (payload) => {
  return apiClient.put('/profile', payload)
}

export const sdsAgreement = () => {
  return apiClient.post('/profile/sds-agreement')
}

export const getPublicAgreement = (accountType, step = 1) => {
  return apiClient.get(`/agreements?account_type=${accountType}&step=${step}`)
}

export const getPrivateAgreement = (step = 1) => {
  return apiClient.get(`/profile/agreements?step=${step}`)
}

export const getProfile = (payload) => {
  return apiClient.get('/profile', payload)
}

export const uploadProfilePhoto = (file) => {
  const formData = new FormData()
  formData.append('photo', file)
  return apiClient.post('/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteProfilePhoto = () => {
  return apiClient.delete('/profile/photo', {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getProfileAnimals = () => {
  return apiClient.get('/profile/animals')
}

export const setEmergencyContacts = (payload) => {
  return apiClient.put('/profile/emergency-contacts/primary', payload)
}

export const getEmergencyContacts = () => {
  return apiClient.get('/profile/emergency-contacts/primary')
}

export const setAnimals = (payload) => {
  return apiClient.post('/profile/animals', payload)
}

export const updateAnimals = (animal_id, payload) => {
  return apiClient.put(`/profile/animals/${animal_id}`, payload)
}

export const getTerms = () => {
  return apiClient.get('/terms')
}

export const getValid = () => {
  return apiClient.get('/valid')
}

export const getSocial = (type) => {
  return apiClient.get('/auth-social/links', {
    params: type ? { account_type: type } : {}
  })
}

export const normalizeAddress = (address) => {
  return apiClient.post('/addresses/normalize', { address })
}

export const verifyAddress = (oldAddress, newAddress) => {
  return apiClient.post('/addresses/verify', {
    oldAddress,
    newAddress
  })
}
