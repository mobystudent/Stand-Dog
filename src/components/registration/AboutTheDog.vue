<template>
  <form @submit.prevent="submitForm">
    <h2 class="title">About the Dog</h2>

    <BaseInput
      v-model="animalInfo.name"
      label="What is the dog's name?"
      type="text"
      class="custom-margin"
      :is-error="!!errorState.name"
      :error-messages="errorState.name"
      @focus="errorState.name = ''"
    />

    <SelectBox
      v-model="animalInfo.gender"
      class="custom-margin"
      :options="libraryStore.options?.gender_animal || []"
      label="What is the dog's gender?"
      :is-error="!!errorState.gender"
      :error-messages="errorState.gender"
      @focus="errorState.gender = ''"
      @input="errorState.gender = animalInfo.gender ? '' : errorState.gender"
    />

    <SelectBox
      v-model="animalInfo.birth_year"
      class="custom-margin"
      :options="years"
      label="What year was your dog born?"
      :is-error="!!errorState.birth_year"
      :error-messages="errorState.birth_year"
      @focus="errorState.birth_year = ''"
    />

    <BaseInput
      v-model="animalInfo.breed"
      label="What is your dog's breed?"
      type="text"
      class="custom-margin"
      :is-error="!!errorState.breed"
      :error-messages="errorState.breed"
      @focus="errorState.breed = ''"
    />

    <SelectBox
      v-model="animalInfo.size"
      class="custom-margin"
      :options="libraryStore.options?.animal_size || []"
      label="How big is your dog?"
      :is-error="!!errorState.size"
      :error-messages="errorState.size"
      @focus="errorState.size = ''"
    />

    <BaseInput
      v-model="animalInfo.microchip_number"
      label="Microchip number (if applicable)"
      type="text"
      maxlength="30"
      class="custom-margin"
      :is-error="!!errorState.microchip_number"
      :error-messages="errorState.microchip_number"
      @focus="errorState.microchip_number = ''"
    />

    <BaseRadioGroup
      v-model="animalInfo.status"
      class="custom-margin"
      label="Is your dog currently in training?"
      :options="[
        { value: 'in_training', label: 'Yes' },
        { value: 'unregistered', label: 'No' }
      ]"
    />

    <div class="navigation-controls">
      <BaseButton @click="previousStep" button-class="go-back"
        >Go Back</BaseButton
      >

      <BaseButton type="submit">
        <Spinner v-if="isLoading" size="small" />
        {{ isLoading ? '' : 'Continue' }}
      </BaseButton>
    </div>

    <InfoMessage
      message="Your progress is auto-saved, so you can continue filling out the form at
      your convenience."
    />
  </form>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useLibraryStore } from '../../store/libraryStore.js'
import {
  setAnimals,
  updateAnimals,
  getProfileAnimals
} from '../../api/registration.js'
import { useFormErrors } from '../../composables/useFormErrors.js'
import { isValidMicrochip, hasLetter } from '../../utils/validation.js'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseRadioGroup from '../base/BaseRadioGroup.vue'
import InfoMessage from '../base/InfoMessage.vue'
import SelectBox from '../base/SelectBox.vue'
import Spinner from '../base/Spinner.vue'

export default {
  name: 'AboutTheDog',
  components: {
    BaseInput,
    BaseButton,
    BaseRadioGroup,
    SelectBox,
    InfoMessage,
    Spinner
  },
  emits: ['finish', 'previous'],
  setup(_, { emit }) {
    const libraryStore = useLibraryStore()
    const isLoading = ref(false)
    const animalList = ref([])
    const currentAnimalId = ref(null)
    const currentYear = new Date().getFullYear()
    const years = computed(() =>
      Array.from({ length: 31 }, (_, i) => {
        const year = currentYear - i
        return { name: year.toString(), value: year }
      })
    )

    const { errorState, setError, clearErrors } = useFormErrors([
      'name',
      'gender',
      'birth_year',
      'breed',
      'size',
      'microchip_number'
    ])

    const animalInfo = ref({
      name: '',
      gender: '',
      birth_year: '',
      breed: '',
      size: '',
      microchip_number: '',
      status: 'unregistered'
    })

    onMounted(async () => {
      try {
        const response = await getProfileAnimals()
        if (response?.status === 200 && response.data.animal_list.length > 0) {
          animalList.value = response.data.animal_list
          const animal = animalList.value[0]

          const {
            id,
            name = '',
            gender = '',
            birth_year = '',
            breed = '',
            size = '',
            microchip_number = '',
            status = ''
          } = animal

          currentAnimalId.value = id

          animalInfo.value = {
            name: name ?? '',
            gender: gender ?? '',
            birth_year: birth_year ?? '',
            breed: breed ?? '',
            size: size ?? '',
            microchip_number: microchip_number ?? '',
            status: status === 'in_training' ? 'in_training' : 'unregistered'
          }
        }
      } catch (err) {
        console.error('Failed to fetch information about the dog:', err)
      }
    })

    const validateMicrochip = () => {
      const value = animalInfo.value.microchip_number.trim()
      animalInfo.value.microchip_number = value

      if (!value) return true

      if (value.length > 30) {
        errorState.value.microchip_number =
          'Microchip number cannot exceed 30 characters'
        return false
      }

      if (!isValidMicrochip(value)) {
        errorState.value.microchip_number =
          'Only letters and numbers are allowed'
        return false
      }

      return true
    }

    const validateForm = () => {
      let isValid = true
      clearErrors()

      const requiredFields = ['name', 'gender', 'birth_year', 'breed', 'size']

      for (const field of requiredFields) {
        const value = animalInfo.value[field]?.trim() || ''
        animalInfo.value[field] = value

        if (!value) {
          setError(field, 'Field is required')
          isValid = false
          continue
        }

        if ((field === 'name' || field === 'breed') && !hasLetter(value)) {
          setError(field, 'Field must contain at least one letter')
          isValid = false
        }
      }

      if (!validateMicrochip()) {
        isValid = false
      }

      return isValid
    }

    const submitForm = async () => {
      if (!validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      isLoading.value = true

      try {
        const animalType = localStorage.getItem('animalType')
        const payload = {
          ...animalInfo.value,
          animal_type: animalType
        }

        let response

        if (currentAnimalId.value) {
          response = await updateAnimals(currentAnimalId.value, payload)
        } else {
          response = await setAnimals(payload)
        }

        if (response?.status === 201 || response?.status === 200) {
          emit('finish')
        }
      } catch (err) {
        console.error('About the dog update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const previousStep = () => {
      emit('previous')
    }

    return {
      submitForm,
      previousStep,
      animalInfo,
      errorState,
      libraryStore,
      years,
      isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  padding-bottom: 16px;
}

.custom-margin {
  margin-bottom: 40px;
}
</style>
