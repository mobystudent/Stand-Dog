<template>
  <form @submit.prevent="submitForm">
    <h2 class="title">Emergency Contact Information (optional)</h2>
    <BaseInput
      v-model="emergencyInfo.firstName"
      label="First name"
      type="text"
      class="custom-margin"
      :is-error="!!errorState.firstName"
      :error-messages="errorState.firstName"
      @focus="errorState.firstName = ''"
    />

    <BaseInput
      v-model="emergencyInfo.lastName"
      label="Last name"
      type="text"
      class="custom-margin"
      :is-error="!!errorState.lastName"
      :error-messages="errorState.lastName"
      @focus="errorState.lastName = ''"
    />

    <SelectBox
      v-model="emergencyInfo.relationshipToDisabledIndividual"
      class="custom-margin"
      :options="libraryStore.options?.relationship_to_disable || []"
      label="Relationship to disabled individual"
      :is-error="!!errorState.relationshipToDisabledIndividual"
      :error-messages="errorState.relationshipToDisabledIndividual"
      @focus="errorState.relationshipToDisabledIndividual = ''"
      @input="
        errorState.relationshipToDisabledIndividual =
          emergencyInfo.relationshipToDisabledIndividual
            ? ''
            : errorState.relationshipToDisabledIndividual
      "
    />

    <BaseInput
      v-model="emergencyInfo.primaryPhone"
      label="Primary phone"
      class="custom-margin"
      type="tel"
      :is-error="!!errorState.primaryPhone"
      :error-messages="errorState.primaryPhone"
      @focus="errorState.primaryPhone = ''"
      @input="(event) => formatPhoneNumber(event, 'primaryPhone')"
    />

    <BaseInput
      v-model="emergencyInfo.email"
      class="custom-margin"
      label="Email address"
      type="text"
      maxlength="254"
      :is-error="!!errorState.email"
      :error-messages="errorState.email"
      @focus="errorState.email = ''"
    />

    <h3 class="title header-local">Disability information</h3>
    <p class="subtitle">
      Which best describes your PRIMARY reason for using a Service Dog?
    </p>

    <SelectBox
      v-model="emergencyInfo.primaryDisability"
      class="custom-margin"
      :options="filteredPrimaryDisabilityOptions"
      label="Primary disability"
    />

    <BaseRadioGroup
      v-model="emergencyInfo.isSecondaryDisability"
      :class="
        emergencyInfo.isSecondaryDisability === 'yes'
          ? 'custom-margin'
          : 'custom-margin-56'
      "
      label="Do you have a secondary disability?"
      :options="[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]"
    />

    <SelectBox
      v-if="emergencyInfo.isSecondaryDisability === 'yes'"
      v-model="emergencyInfo.secondaryDisability"
      class="custom-margin-56"
      :options="filteredSecondaryDisabilityOptions"
      label="Secondary disability"
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
import { ref, watch, computed, onMounted } from 'vue'
import { useLibraryStore } from '../../store/libraryStore.js'
import {
  getEmergencyContacts,
  setEmergencyContacts
} from '../../api/registration.js'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseRadioGroup from '../base/BaseRadioGroup.vue'
import InfoMessage from '../base/InfoMessage.vue'
import SelectBox from '../base/SelectBox.vue'
import { useFormErrors } from '../../composables/useFormErrors.js'
import { formatPhone } from '../../utils/formatting.js'
import Spinner from '../base/Spinner.vue'
import {
  isValidEmail,
  isValidPhone,
  hasLetter
} from '../../utils/validation.js'

export default {
  name: 'EmergencyContactInformation',
  components: {
    BaseInput,
    BaseButton,
    BaseRadioGroup,
    SelectBox,
    InfoMessage,
    Spinner
  },
  emits: ['continue', 'previous'],
  setup(_, { emit }) {
    const libraryStore = useLibraryStore()
    const isLoading = ref(false)
    const { errorState, setError, clearErrors } = useFormErrors([
      'firstName',
      'lastName',
      'relationshipToDisabledIndividual',
      'primaryPhone',
      'email'
    ])

    const emergencyInfo = ref({
      firstName: '',
      lastName: '',
      relationshipToDisabledIndividual: '',
      primaryPhone: '',
      email: '',
      primaryDisability: '',
      secondaryDisability: '',
      isSecondaryDisability: 'no'
    })

    watch(
      () => emergencyInfo.value.isSecondaryDisability,
      (newValue) => {
        if (newValue === 'no') {
          emergencyInfo.value.secondaryDisability = ''
        }
      }
    )

    onMounted(async () => {
      try {
        const response = await getEmergencyContacts()
        if (response?.status === 200 && response.data?.data) {
          const {
            first_name = '',
            last_name = '',
            rel_to_disabled_individual = '',
            primary_phone = '',
            email = '',
            primary_disability = '',
            secondary_disability = ''
          } = response.data.data

          emergencyInfo.value = {
            firstName: first_name ?? '',
            lastName: last_name ?? '',
            relationshipToDisabledIndividual: rel_to_disabled_individual ?? '',
            primaryPhone: primary_phone ?? '',
            email: email ?? '',
            primaryDisability: primary_disability ?? '',
            secondaryDisability: secondary_disability ?? '',
            isSecondaryDisability: secondary_disability ? 'yes' : 'no'
          }
        }
      } catch (err) {
        console.error('Failed to fetch emergency contacts:', err)
      }
    })

    const filteredPrimaryDisabilityOptions = computed(() => {
      const options = libraryStore.options?.disability || []
      return options.filter(
        (option) => option.name !== emergencyInfo.value.secondaryDisability
      )
    })

    const filteredSecondaryDisabilityOptions = computed(() => {
      const options = libraryStore.options?.disability || []
      return options.filter(
        (option) => option.name !== emergencyInfo.value.primaryDisability
      )
    })

    const formatPhoneNumber = (event, fieldName) => {
      emergencyInfo.value[fieldName] = formatPhone(event.target.value)
    }

    const validateForm = () => {
      let isValid = true
      clearErrors()

      const requiredFields = [
        'firstName',
        'lastName',
        'relationshipToDisabledIndividual',
        'primaryPhone',
        'email'
      ]

      const isPartiallyFilled = requiredFields.some((field) =>
        emergencyInfo.value[field]?.trim()
      )

      if (isPartiallyFilled) {
        for (const field of requiredFields) {
          const value = emergencyInfo.value[field]?.trim() || ''

          if (!value) {
            setError(field, 'Field is required')
            isValid = false
            continue
          }

          if (
            (field === 'firstName' || field === 'lastName') &&
            !hasLetter(value)
          ) {
            setError(field, 'Field must contain at least one letter')
            isValid = false
          }

          if (field === 'primaryPhone' && !isValidPhone(value)) {
            setError(field, 'Must be in format ###-###-####')
            isValid = false
          }

          if (field === 'email') {
            if (value.length > 254) {
              setError(field, 'Email address cannot exceed 254 characters')
              isValid = false
            } else if (!isValidEmail(value)) {
              setError(field, 'Please enter a valid email address')
              isValid = false
            }
          }
        }
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
        const payload = {
          first_name: emergencyInfo.value.firstName,
          last_name: emergencyInfo.value.lastName,
          rel_to_disabled_individual:
            emergencyInfo.value.relationshipToDisabledIndividual,
          primary_phone: emergencyInfo.value.primaryPhone,
          email: emergencyInfo.value.email,
          primary_disability: emergencyInfo.value.primaryDisability,
          secondary_disability: emergencyInfo.value.secondaryDisability
        }

        const response = await setEmergencyContacts(payload)
        if (response?.status === 200) {
          emit('continue')
        }
      } catch (err) {
        console.error('Emergency contacts update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const previousStep = () => {
      emit('previous')
    }

    return {
      submitForm,
      formatPhoneNumber,
      previousStep,
      emergencyInfo,
      errorState,
      libraryStore,
      isLoading,
      filteredPrimaryDisabilityOptions,
      filteredSecondaryDisabilityOptions
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

.header-local {
  padding-bottom: 8px;
}

.subtitle {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 17px;
  line-height: 1.4;
  padding-bottom: 16px;
}

.custom-margin {
  margin-bottom: 40px;

  &-56 {
    margin-bottom: 56px;
  }
}
</style>
