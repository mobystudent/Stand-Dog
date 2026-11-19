import apiClient from '../plugins/axios'

export const fetchLibraryOptions = async () => {
  return apiClient.get('/library')
}
