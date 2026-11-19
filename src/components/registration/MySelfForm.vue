<template>
  <form @submit.prevent="submitForm">
    <div class="tab-description">
      <!--      <img src="/static/icons/star.svg" alt="star" />-->
      <slot name="note" />
    </div>

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

    <div class="valid-container">
      <h2 class="title">Valid forms of ID</h2>
      <p>
        To avoid confusion, please make sure that your name matches one of these
        forms of ID.
      </p>

      <div class="valid-content">
        <div class="valid-content__wrapper">
          <div v-html="validFormsID"></div>
        </div>
      </div>
    </div>

    <BaseButton type="submit">
      <Spinner v-if="isLoading" size="small" />
      {{ isLoading ? '' : 'Continue' }}
    </BaseButton>

    <InfoMessage
      message="Your progress is auto-saved, so you can continue filling out the form at
      your convenience."
    />
  </form>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getProfile, getValid, setProfile } from '../../api/registration.js'
import { hasLetter } from '../../utils/validation.js'
import BaseInput from '../base/BaseInput.vue'
import BaseButton from '../base/BaseButton.vue'
import InfoMessage from '../base/InfoMessage.vue'
import Spinner from '../base/Spinner.vue'
export default {
  name: 'MySelfForm',
  emits: ['continue'],
  components: { BaseInput, BaseButton, InfoMessage, Spinner },
  setup(_, { emit }) {
    const validFormsID = ref('')
    const isLoading = ref(false)
    const errorState = ref({ firstName: '', lastName: '', middleName: '' })
    const personalInfo = ref({
      firstName: '',
      middleName: '',
      lastName: ''
    })

    onMounted(async () => {
      try {
        const { data } = await getValid()
        validFormsID.value = data.content
      } catch (err) {
        console.error('Failed to fetch valid form IDs:', err)
      }

      try {
        const response = await getProfile()
        if (response?.status === 200) {
          const {
            first_name = '',
            middle_name = '',
            last_name = ''
          } = response.data.data

          personalInfo.value = {
            firstName: first_name ?? '',
            middleName: middle_name ?? '',
            lastName: last_name ?? ''
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
      }
    })

    const trimAndValidate = (value) => value.trim()

    const validateForm = () => {
      errorState.value = { firstName: '', lastName: '', middleName: '' }

      let isValid = true

      personalInfo.value.firstName = trimAndValidate(
        personalInfo.value.firstName
      )
      personalInfo.value.lastName = trimAndValidate(personalInfo.value.lastName)
      personalInfo.value.middleName = trimAndValidate(
        personalInfo.value.middleName
      )

      if (!hasLetter(personalInfo.value.firstName)) {
        errorState.value.firstName = 'Field must contain at least one letter'
        isValid = false
      }

      if (!hasLetter(personalInfo.value.lastName)) {
        errorState.value.lastName = 'Field must contain at least one letter'
        isValid = false
      }

      if (
        personalInfo.value.middleName &&
        !hasLetter(personalInfo.value.middleName)
      ) {
        errorState.value.middleName =
          'Middle name must have at least 1 letter or be empty'
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
        const payload = {
          first_name: personalInfo.value.firstName,
          middle_name: personalInfo.value.middleName,
          last_name: personalInfo.value.lastName
        }

        const response = await setProfile(payload)
        if (response?.status === 200) {
          emit('continue')
        }
      } catch (err) {
        console.error('Personal information (my self) update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      validFormsID,
      errorState,
      personalInfo,
      isLoading,
      submitForm
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-margin {
  margin-bottom: 40px;
}

.valid-container {
  margin-bottom: 56px;

  .title {
    color: #616165;
    font-size: 15px;
    line-height: 1.3;
    letter-spacing: 0;
    text-align: left;
    padding: 0 0 5px;
  }

  p {
    color: #616165;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.2px;
    padding-bottom: 16px;
  }

  .valid-content {
    height: 216px;
    background-color: #ffffff;
    border: 1px solid #a4a4a9;
    border-radius: 8px;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 8px;

    &__wrapper {
      height: 100%;
      padding: 0 8px 0 0;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 7px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #bbb;
        border-radius: 6px;
      }
    }

    p {
      color: #616165;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }
  }
}
</style>
<style lang="scss">
.valid-container {
  .valid-content {
    p,
    h3,
    ul {
      color: #616165;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }
    h3 {
      font-weight: 700;
      text-transform: uppercase;
      padding-top: 23px;
    }
    ul {
      padding-left: 25px;
    }
  }
}

.tab-description {
  //display: flex;
  //flex-direction: column;
  //row-gap: 24px;
  padding-bottom: 16px;

  img {
    width: 214px;
    height: 70px;
  }
  p {
    color: #616165;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
    padding-top: 24px;
    padding-bottom: 14px;
  }

  .link {
    position: relative;
    color: #0066df;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
    cursor: pointer;

    &::after {
      content: '';
      width: 100%;
      height: 1px;
      background-color: #0066df;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}

//.description {
//  display: flex;
//  flex-direction: column;
//  row-gap: 24px;
//  //align-items: center;
//  //justify-content: space-between;
//  //gap: 16px;
//  padding-bottom: 12px;
//
//  p {
//    color: #616165;
//    font-weight: 500;
//    font-size: 16px;
//    line-height: 1.5;
//    letter-spacing: 0.2px;
//  }
//}
</style>
