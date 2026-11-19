<template>
  <VerifyAddressPopUp
    v-if="isShowVerifyAddressPopUp"
    :entered-address="userAddress"
    :suggested-address="suggestedAddress"
    @verify-address="onVerifyAddress"
    @edit-address="onEditAddress"
  />

  <form @submit.prevent="submitForm">
    <h2 class="title">Personal Information</h2>
    <SelectBox
      v-model="personalInfo.gender"
      label="Gender"
      class="custom-margin-36"
      :required="true"
      :options="libraryStore.options?.gender || []"
      :is-error="!!errorState.gender"
      :error-messages="errorState.gender"
      @focus="errorState.gender = ''"
    />

    <!--    <h3 class="dob-title">-->
    <!--      Date of Birth-->
    <!--      <span class="required-asterisk" aria-hidden="true">*</span>-->
    <!--    </h3>-->
    <!--    <div class="dob-group custom-margin-36">-->
    <!--      <Datepicker-->
    <!--        v-model="personalInfo.date_of_birth"-->
    <!--        class="custom-datepicker"-->
    <!--        :class="{ error: !!errorState.date_of_birth }"-->
    <!--        :enable-time-picker="false"-->
    <!--        :max-date="new Date()"-->
    <!--        :format="customFormat"-->
    <!--        @open="errorState.date_of_birth = ''"-->
    <!--      />-->
    <!--      <span v-if="!!errorState.date_of_birth" class="error-label">{{-->
    <!--        errorState.date_of_birth-->
    <!--      }}</span>-->
    <!--    </div>-->

    <BaseInput
      v-model="personalInfo.mailing_address"
      label="Mailing address"
      type="text"
      class="custom-margin-36"
      :required="true"
      :is-error="!!errorState.mailing_address"
      :error-messages="errorState.mailing_address"
      @focus="errorState.mailing_address = ''"
      @blur="validateField()"
    />

    <BaseInput
      v-model="personalInfo.mailing_address_2"
      label="Mailing address 2"
      type="text"
      class="custom-margin-36"
      :is-error="!!errorState.mailing_address_2"
      :error-messages="errorState.mailing_address_2"
      @focus="errorState.mailing_address_2 = ''"
      @blur="validateField()"
    />

    <BaseInput
      v-model="personalInfo.city"
      label="City"
      type="text"
      class="custom-margin-36"
      :required="true"
      :is-error="!!errorState.city"
      :error-messages="errorState.city"
      @focus="errorState.city = ''"
      @input="errorState.city = personalInfo.city ? '' : errorState.city"
      @blur="validateField()"
    />

    <div class="state-zip">
      <SelectBox
        v-model="personalInfo.state"
        label="State"
        :required="true"
        :options="libraryStore.options?.us_states || []"
        :is-error="!!errorState.state"
        :error-messages="errorState.state"
        @focus="errorState.state = ''"
        @input="errorState.state = personalInfo.state ? '' : errorState.state"
      />

      <BaseInput
        v-model="personalInfo.zip"
        label="Zip"
        type="text"
        maxlength="10"
        :required="true"
        :is-error="!!errorState.zip"
        :error-messages="errorState.zip"
        @focus="errorState.zip = ''"
        @input="
          (e) => {
            e.target.value = e.target.value.replace(/[^0-9-]/g, '')
            errorState.zip = personalInfo.zip ? '' : errorState.zip
          }
        "
        @blur="validateZip"
      />
    </div>

    <BaseInput
      v-model="personalInfo.primary_phone"
      label="Primary phone"
      type="tel"
      class="custom-margin-36"
      :required="true"
      :is-error="!!errorState.primary_phone"
      :error-messages="errorState.primary_phone"
      @focus="errorState.primary_phone = ''"
      @input="(event) => formatPhoneNumber(event, 'primary_phone')"
    />

    <BaseInput
      v-model="personalInfo.secondary_phone"
      label="Secondary phone (if applicable)"
      type="tel"
      class="custom-margin-36"
      :is-error="!!errorState.secondary_phone"
      :error-messages="errorState.secondary_phone"
      @focus="errorState.secondary_phone = ''"
      @input="(event) => formatPhoneNumber(event, 'secondary_phone')"
    />

    <BaseInput
      v-model="personalInfo.alternate_email"
      label="Alternate email address"
      type="text"
      class="custom-margin-60"
      :is-error="!!errorState.alternate_email"
      :error-messages="errorState.alternate_email"
      maxlength="254"
      @focus="errorState.alternate_email = ''"
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
import { onMounted, ref, watch } from 'vue'
import { useLibraryStore } from '../../store/libraryStore.js'
import {
  setProfile,
  normalizeAddress,
  verifyAddress,
  getProfile
} from '../../api/registration.js'
import {
  isValidEmail,
  isValidPhone,
  hasLetter
} from '../../utils/validation.js'
import { formatPhone } from '../../utils/formatting.js'
import { useFormErrors } from '../../composables/useFormErrors.js'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import SelectBox from '../base/SelectBox.vue'
import InfoMessage from '../base/InfoMessage.vue'
import Spinner from '../base/Spinner.vue'
import VerifyAddressPopUp from './VerifyAddressPopUp.vue'

export default {
  name: 'PersonalInformation',
  emits: ['continue', 'previous'],
  components: {
    BaseInput,
    BaseButton,
    SelectBox,
    InfoMessage,
    VerifyAddressPopUp,
    Spinner
  },

  setup(_, { emit }) {
    const libraryStore = useLibraryStore()
    const isShowVerifyAddressPopUp = ref(false)
    const suggestedAddress = ref({})
    const userAddress = ref({})
    const isLoading = ref(false)

    const { errorState, setError, clearErrors } = useFormErrors([
      'gender',
      'mailing_address',
      'mailing_address_2',
      'city',
      'state',
      'zip',
      'primary_phone',
      'secondary_phone',
      'alternate_email'
    ])

    const personalInfo = ref({
      gender: '',
      mailing_address: '',
      mailing_address_2: '',
      city: '',
      state: '',
      zip: '',
      primary_phone: '',
      secondary_phone: '',
      alternate_email: ''
    })

    onMounted(async () => {
      try {
        const response = await getProfile()
        if (response?.status === 200) {
          const {
            gender = '',
            mailing_address = '',
            mailing_address_2 = '',
            city = '',
            state = '',
            zip = '',
            primary_phone = '',
            secondary_phone = '',
            alternate_email = ''
          } = response.data.data

          personalInfo.value = {
            gender: gender ?? '',
            mailing_address: mailing_address ?? '',
            mailing_address_2: mailing_address_2 ?? '',
            city: city ?? '',
            state: state ?? '',
            zip: zip ?? '',
            primary_phone: primary_phone ?? '',
            secondary_phone: secondary_phone ?? '',
            alternate_email: alternate_email ?? ''
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
      }
    })

    const trimAndValidate = (value) => value.trim()

    // const customFormat = (date) => {
    //   if (!date) return ''
    //   const day = String(date.getDate()).padStart(2, '0')
    //   const month = String(date.getMonth() + 1).padStart(2, '0')
    //   const year = date.getFullYear()
    //   return `${year}-${month}-${day}`
    // }

    const validateZip = () => {
      let zip = personalInfo.value.zip.trim()

      if (!/^\d{5}(-\d{1,4})?$/.test(zip)) {
        setError('zip', 'Invalid ZIP')
        return false
      }

      personalInfo.value.zip = zip
      setError('zip', '')
      return true
    }

    const validateField = () => {
      const city = personalInfo.value.city.trim()

      if (!city || city.length === 0) {
        setError('city', 'Field is required')
        return false
      }

      if (!/[a-zA-Zа-яА-Я]/.test(city)) {
        setError('city', 'Field must contain at least one letter')
        return false
      }

      if (/[^a-zA-Zа-яА-Я0-9\s]/.test(city)) {
        setError('city', 'Field cannot contain special characters')
        return false
      }

      setError('city', '')
      return true
    }

    const toggleScroll = (disable) => {
      document.body.style.overflow = disable ? 'hidden' : ''
    }

    watch(isShowVerifyAddressPopUp, toggleScroll)

    const formatPhoneNumber = (event, fieldName) => {
      personalInfo.value[fieldName] = formatPhone(event.target.value)
    }

    const validatePhone = (fieldName) => {
      const phoneValue = personalInfo.value[fieldName]?.trim() || ''

      if (phoneValue === '' && fieldName !== 'secondary_phone') {
        setError(fieldName, 'Field is required')
        return false
      }

      if (phoneValue !== '' && !isValidPhone(phoneValue)) {
        setError(fieldName, 'Must be in format ###-###-####')
        return false
      }

      setError(fieldName, '')
      return true
    }

    const validateEmail = () => {
      if (personalInfo.value.alternate_email) {
        if (personalInfo.value.alternate_email.length > 254) {
          setError(
            'alternate_email',
            'Email address cannot exceed 254 characters'
          )
          return false
        }

        if (!isValidEmail(personalInfo.value.alternate_email)) {
          setError('alternate_email', 'Please enter a valid email address')
          return false
        }
      }
      return true
    }

    const validateForm = () => {
      let isValid = true
      clearErrors()
      personalInfo.value.mailing_address = trimAndValidate(
        personalInfo.value.mailing_address
      )
      personalInfo.value.mailing_address_2 = trimAndValidate(
        personalInfo.value.mailing_address_2
      )
      personalInfo.value.city = trimAndValidate(personalInfo.value.city)
      personalInfo.value.alternate_email = trimAndValidate(
        personalInfo.value.alternate_email
      )

      if (!personalInfo.value.gender) {
        setError('gender', 'Please choose your gender')
        isValid = false
      }

      if (!validateZip()) isValid = false

      const requiredFields = [
        'mailing_address',
        'city',
        'state',
        'zip',
        'primary_phone'
      ]
      const addressFields = ['mailing_address', 'city']

      requiredFields.forEach((field) => {
        const value = personalInfo.value[field]

        if (!value) {
          setError(field, 'Field is required')
          isValid = false
        } else if (addressFields.includes(field) && !hasLetter(value)) {
          setError(field, 'Field must contain at least one letter')
          isValid = false
        }
      })

      if (
        personalInfo.value.mailing_address_2 &&
        !hasLetter(personalInfo.value.mailing_address_2)
      ) {
        setError('mailing_address_2', 'Field must contain at least one letter')
        isValid = false
      }

      if (!validateEmail()) isValid = false
      if (!validatePhone('secondary_phone')) isValid = false
      if (!validatePhone('primary_phone')) isValid = false

      return isValid
    }

    const mapAddress = (source) => ({
      street1: source.mailing_address,
      street2: source.mailing_address_2,
      city: source.city,
      state: source.state,
      zip: source.zip
    })

    const extractAddressFields = (address) => ({
      street1: address.street1,
      street2: address.street2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip
    })

    const isAddressDifferent = (addr1, addr2) =>
      ['street1', 'street2', 'city', 'state', 'zip'].some(
        (key) => addr1[key] !== addr2[key]
      )

    const submitForm = async () => {
      if (!validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      isLoading.value = true
      try {
        userAddress.value = mapAddress(personalInfo.value)

        const normalizeResponse = await normalizeAddress(userAddress.value)
        const normalizedAddress = extractAddressFields(
          normalizeResponse.data.address
        )

        if (isAddressDifferent(userAddress.value, normalizedAddress)) {
          const verifyResponse = await verifyAddress(
            userAddress.value,
            normalizedAddress
          )

          if (verifyResponse.data.address) {
            suggestedAddress.value = extractAddressFields(
              verifyResponse.data.address
            )
            isShowVerifyAddressPopUp.value = true
          }
        } else {
          isLoading.value = true
          try {
            const response = await setProfile(personalInfo.value)
            if (response?.status === 200) {
              emit('continue')
            }
          } catch (err) {
            console.error('Profile update failed:', err)
          } finally {
            isLoading.value = false
          }
        }
      } catch (err) {
        console.error('Address normalization/validation failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const onVerifyAddress = async (address) => {
      personalInfo.value.mailing_address = address.street1
      personalInfo.value.mailing_address_2 = address.street2 || ''
      personalInfo.value.city = address.city
      personalInfo.value.state = address.state
      personalInfo.value.zip = address.zip

      isLoading.value = true
      isShowVerifyAddressPopUp.value = false
      try {
        const response = await setProfile(personalInfo.value)
        if (response?.status === 200) {
          emit('continue')
        }
      } catch (err) {
        console.error('Profile update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const onEditAddress = () => {
      isShowVerifyAddressPopUp.value = false
    }

    const previousStep = () => {
      emit('previous')
    }

    return {
      isShowVerifyAddressPopUp,
      isLoading,
      errorState,
      suggestedAddress,
      userAddress,
      personalInfo,
      libraryStore,
      previousStep,
      onEditAddress,
      formatPhoneNumber,
      submitForm,
      onVerifyAddress,
      validateZip,
      validateField
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
  padding-bottom: 20px;
}

//.dob-title {
//  color: #1d1d1f;
//  font-weight: 500;
//  font-size: 14px;
//  line-height: 1.4;
//  padding-bottom: 12px;
//}

.state-zip {
  display: flex;
  gap: 32px;
  margin-bottom: 36px;

  & > * {
    flex: 1;
    min-width: 0;
  }
}

.error-label {
  color: #ff3333;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
}

.custom-margin {
  &-36 {
    margin-bottom: 36px;
  }
  &-60 {
    margin-bottom: 60px;
  }
}
</style>

<style lang="scss">
//.custom-datepicker {
//  .dp__input {
//    font-family: 'Montserrat', sans-serif;
//    font-size: 18px;
//    font-weight: 500;
//    border: 1px solid #a4a4a9;
//    border-radius: 6px;
//    padding: 9px 12px;
//  }
//  .dp__input_icon {
//    right: 0;
//    left: auto;
//  }
//  .dp--clear-btn {
//    right: 40px;
//  }
//
//  &.error {
//    .dp__input {
//      border-color: #ff3333;
//    }
//  }
//}
</style>
