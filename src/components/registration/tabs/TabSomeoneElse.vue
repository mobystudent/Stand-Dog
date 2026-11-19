<template>
  <form @submit.prevent="submitForm">
    <h2 class="tab-title">What’s your name?</h2>
    <!--    <div class="description">-->
    <!--      <img src="/static/icons/star.svg" alt="star" />-->
    <!--      <p>-->
    <!--        Since you are filling this form out for someone else, we need some of-->
    <!--        your information.-->
    <!--      </p>-->
    <!--    </div>-->
    <BaseInput
      v-model="personalInfo.firstName"
      label="First name"
      type="text"
      class="custom-margin"
      :required="true"
      :is-error="!!errorState.firstName"
      :error-messages="errorState.firstName"
      @focus="errorState.firstName = ''"
    />

    <BaseInput
      v-model="personalInfo.middleName"
      label="Middle name"
      type="text"
      class="custom-margin"
      :is-error="!!errorState.middleName"
      :error-messages="errorState.middleName"
      @focus="errorState.middleName = ''"
    />

    <BaseInput
      v-model="personalInfo.lastName"
      label="Last name"
      type="text"
      class="custom-margin"
      :required="true"
      :is-error="!!errorState.lastName"
      :error-messages="errorState.lastName"
      @focus="errorState.lastName = ''"
    />

    <BaseInput
      v-model="personalInfo.email"
      label="Email address"
      type="text"
      maxlength="254"
      class="custom-margin"
      :required="true"
      :is-error="!!errorState.email"
      :error-messages="errorState.email"
      @focus="errorState.email = ''"
    />

    <SelectBox
      v-model="personalInfo.relationship"
      label="What's your relationship to the disabled handler?"
      placeholder="Select one or type your own..."
      class="custom-margin"
      :required="true"
      :options="libraryStore.options?.relationship_to_handler || []"
      :is-error="!!errorState.relationship"
      :error-messages="errorState.relationship"
      @focus="errorState.relationship = ''"
    />

    <BaseInput
      v-if="personalInfo.relationship === 'other'"
      v-model="personalInfo.customRelationship"
      label="Relationship to Disabled Handler"
      type="text"
      class="custom-margin"
      :required="true"
      :is-error="!!errorState.customRelationship"
      :error-messages="errorState.customRelationship"
      @focus="errorState.customRelationship = ''"
    />

    <BaseButton type="submit" class="custom-margin-btn"> Next </BaseButton>

    <InfoMessage
      message="Your progress is auto-saved, so you can continue filling out the form at
      your convenience."
    />
  </form>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useLibraryStore } from '../../../store/libraryStore.js'
import { getProfile, setProfile } from '../../../api/registration.js'
import { isValidEmail, hasLetter } from '../../../utils/validation.js'
import { useFormErrors } from '../../../composables/useFormErrors.js'
import BaseInput from '../../base/BaseInput.vue'
import BaseButton from '../../base/BaseButton.vue'
import InfoMessage from '../../base/InfoMessage.vue'
import SelectBox from '../../base/SelectBox.vue'
import Spinner from '../../base/Spinner.vue'

export default {
  name: 'TabSomeoneElse',
  components: { BaseInput, BaseButton, SelectBox, InfoMessage, Spinner },
  emits: ['update:isMySelfFormVisible'],

  setup(_, { emit }) {
    const libraryStore = useLibraryStore()
    const isLoading = ref(false)

    const { errorState, setError, clearErrors } = useFormErrors([
      'firstName',
      'middleName',
      'lastName',
      'email',
      'relationship',
      'customRelationship'
    ])

    const personalInfo = ref({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      relationship: '',
      customRelationship: ''
    })

    onMounted(async () => {
      try {
        const response = await getProfile()

        if (response?.status === 200) {
          const {
            else_first_name = '',
            else_middle_name = '',
            else_last_name = '',
            else_email = '',
            relationship_to_handler = '',
            relationship_to_handler_custom = ''
          } = response.data.data

          personalInfo.value = {
            firstName: else_first_name ?? '',
            middleName: else_middle_name ?? '',
            lastName: else_last_name ?? '',
            email: else_email ?? '',
            relationship: relationship_to_handler ?? '',
            customRelationship: relationship_to_handler_custom ?? ''
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
      }
    })

    watch(
      () => personalInfo.value.relationship,
      (newValue) => {
        if (newValue !== 'other') {
          personalInfo.value.customRelationship = ''
          errorState.value.customRelationship = ''
        }
      }
    )

    const trimAndValidate = (value) => value.trim()

    const validateEmail = () => {
      if (!personalInfo.value.email) {
        setError('email', 'Field is required')
        return false
      }

      if (personalInfo.value.email.length > 254) {
        setError('email', 'Email address cannot exceed 254 characters')
        return false
      }

      if (!isValidEmail(personalInfo.value.email)) {
        setError('email', 'Please enter a valid email address')
        return false
      }

      return true
    }

    const validateForm = () => {
      let isValid = true

      clearErrors()

      personalInfo.value.firstName = trimAndValidate(
        personalInfo.value.firstName
      )
      personalInfo.value.middleName = trimAndValidate(
        personalInfo.value.middleName
      )
      personalInfo.value.lastName = trimAndValidate(personalInfo.value.lastName)

      personalInfo.value.customRelationship = trimAndValidate(
        personalInfo.value.customRelationship
      )

      if (!personalInfo.value.firstName) {
        setError('firstName', 'Field is required')
        isValid = false
      } else if (!hasLetter(personalInfo.value.firstName)) {
        setError('firstName', 'Field must contain at least one letter')
        isValid = false
      }

      if (!personalInfo.value.lastName) {
        setError('lastName', 'Field is required')
        isValid = false
      } else if (!hasLetter(personalInfo.value.lastName)) {
        setError('lastName', 'Field must contain at least one letter')
        isValid = false
      }

      if (
        personalInfo.value.middleName &&
        !hasLetter(personalInfo.value.middleName)
      ) {
        setError('middleName', 'Field must contain at least one letter')
        isValid = false
      }

      if (!validateEmail()) isValid = false

      if (!personalInfo.value.relationship) {
        setError('relationship', 'Field is required')
        isValid = false
      }

      if (personalInfo.value.relationship === 'other') {
        if (!personalInfo.value.customRelationship) {
          setError('customRelationship', 'Field is required')
          isValid = false
        } else if (!hasLetter(personalInfo.value.customRelationship)) {
          setError(
            'customRelationship',
            'Field must contain at least one letter'
          )
          isValid = false
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
          else_first_name: personalInfo.value.firstName,
          else_middle_name: personalInfo.value.middleName,
          else_last_name: personalInfo.value.lastName,
          else_email: personalInfo.value.email,
          relationship_to_handler: personalInfo.value.relationship,
          relationship_to_handler_custom: personalInfo.value.customRelationship
        }
        const response = await setProfile(payload)
        if (response?.status === 200) {
          emit('update:isMySelfFormVisible', true)
        }
      } catch (err) {
        console.error('Personal information (someone else) update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      errorState,
      libraryStore,
      personalInfo,
      isLoading,
      submitForm
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  padding-top: 24px;
  padding-bottom: 16px;
}

.custom-margin {
  margin-bottom: 40px;
}

.custom-margin-btn {
  margin-top: 92px;
}
</style>
