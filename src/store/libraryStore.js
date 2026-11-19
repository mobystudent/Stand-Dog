import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchLibraryOptions } from '../api/library.js'

export const useLibraryStore = defineStore('library', () => {
  const options = ref(null)

  const loadOptions = async () => {
    try {
      const response = await fetchLibraryOptions()
      options.value = response.data.options
    } catch (err) {
      console.error('Failed to load options:', err)
    }
  }

  return { options, loadOptions }
})
