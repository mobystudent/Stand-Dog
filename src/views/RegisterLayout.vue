<template>
  <div v-if="isLoading" class="loading">
    <Spinner size="large" />
  </div>
  <div v-else class="container-inner">
    <div class="row">
      <div class="registration-block">
        <!--        {{activeStep}}-->
        <SidebarSteps
          v-if="!isSuccessScreen && !isEmailVerificationPending"
          @prev-step="prevStep"
          :sub-step="subStep"
        />
        <div
          class="step"
          :class="{
            center: isSuccessScreen || isEmailVerificationPending,
            'step--terms': activeStep === 2,
            'step--type': activeStep === 0
          }"
        >
          <AccountTypeStep v-if="activeStep === 0" @next-step="nextStep" />

          <EmailVerificationStep
            v-if="
              activeStep === 1 &&
              !isSuccessScreen &&
              !isEmailVerificationPending
            "
            @success="onSuccess"
            @prev-step="prevStep"
            :initial-error="errorFromPending"
          />

          <EmailVerificationPending
            v-if="isEmailVerificationPending"
            :email="successEmail"
            @success="onPendingSuccess"
            @error="onPendingError"
          />

          <EmailVerificationSuccess
            v-if="isSuccessScreen"
            :email="successEmail"
            @retry="onRetry"
          />

          <TermsAndConditions v-if="activeStep === 2" />

          <BasicInformation
            v-if="activeStep === 3"
            :sub-step="subStep"
            @update-sub-step="updateSubStep"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../store/userStore'
import { useLibraryStore } from '../store/libraryStore.js'
import { useRoute, useRouter } from 'vue-router'
import {
  getProfile,
  userLogout,
  getUserWithOneTimeToken
} from '../api/registration'
import AccountTypeStep from '../components/registration/AccountTypeStep.vue'
import BasicInformation from '../components/registration/BasicInformation.vue'
import EmailVerificationStep from '../components/registration/EmailVerificationStep.vue'
import EmailVerificationSuccess from '../components/registration/EmailVerificationSuccess.vue'
import EmailVerificationPending from '../components/registration/EmailVerificationPending.vue'
import TermsAndConditions from '../components/registration/TermsAndConditions.vue'
import SidebarSteps from '../components/registration/SidebarSteps.vue'
import Spinner from '../components/base/Spinner.vue'

export default {
  name: 'RegisterLayout',
  components: {
    SidebarSteps,
    AccountTypeStep,
    EmailVerificationStep,
    EmailVerificationSuccess,
    EmailVerificationPending,
    TermsAndConditions,
    BasicInformation,
    Spinner
  },

  setup() {
    const store = useUserStore()
    const libraryStore = useLibraryStore()
    const route = useRoute()
    const router = useRouter()
    const activeStep = computed(() => store.registrationStep)
    const subStep = ref(1)
    const isSuccessScreen = ref(false)
    const isEmailVerificationPending = ref(false)
    const successEmail = ref('')
    const isLoading = ref(true)
    const errorFromPending = ref('')

    const handleOneTimeToken = async (token) => {
      if (!token) return false
      try {
        const response = await getUserWithOneTimeToken(token)
        if (response.status === 200 && response.data?.data) {
          const { accessToken, userData } = response.data.data

          store.setUserData({
            token: accessToken,
            email: userData.email,
            accountType: userData.account_type
          })

          return true
        }
      } catch (err) {
        console.error('Error verifying one-time token:', err)
      }

      return false
    }

    const fetchUserProfile = async () => {
      if (!store.token) {
        isLoading.value = false
        return
      }

      try {
        const response = await getProfile()
        const profileData = response.data?.data

        if (!profileData) {
          console.log('!profileData', !profileData)
          return
        }

        if (profileData.first_password_set === false) {
          await userLogout()
          store.clearUserData()
          store.setRegistrationStep(1)
          return
        }

        if (profileData) {
          store.setUserEmail(profileData.email)
          store.setProfileData(profileData)
        }

        if (!profileData.registration_status.registrationFinished) {
          if (!profileData.registration_status.sdsAgreementValid) {
            store.setRegistrationStep(2)
          } else if (!profileData.registration_status.profileFieldsFilled) {
            store.setRegistrationStep(3)
            subStep.value = 1
          } else if (!profileData.registration_status.emergencyContactAdded) {
            store.setRegistrationStep(3)
            subStep.value = 3
          } else if (!profileData.registration_status.animalAdded) {
            store.setRegistrationStep(3)
            subStep.value = 4
          }
        } else {
          await router.push('/accountHome')
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      } finally {
        setTimeout(() => {
          isLoading.value = false
        }, 500)
      }
    }

    onMounted(async () => {
      const oneTimeData = route.query.token
      console.log('oneTimeData', oneTimeData)

      if (oneTimeData) {
        await handleOneTimeToken(oneTimeData)
        await router.push('/signup')
      }
      await libraryStore.loadOptions()
      await fetchUserProfile()
    })

    const nextStep = () => {
      store.setRegistrationStep(store.registrationStep + 1)
    }

    const prevStep = () => {
      store.setRegistrationStep(store.registrationStep - 1)
    }

    const onSuccess = (email) => {
      isEmailVerificationPending.value = true
      successEmail.value = email
    }

    const onPendingSuccess = (email) => {
      isEmailVerificationPending.value = false
      isSuccessScreen.value = true
      console.log('onPendingSuccess email', email)
    }

    const onPendingError = (message) => {
      isEmailVerificationPending.value = false
      errorFromPending.value = message
    }

    const onRetry = () => {
      isSuccessScreen.value = false
      store.setRegistrationStep(1)
      successEmail.value = ''
    }

    const updateSubStep = (newSubStep) => {
      subStep.value = newSubStep
    }

    return {
      activeStep,
      isSuccessScreen,
      isEmailVerificationPending,
      successEmail,
      errorFromPending,
      nextStep,
      prevStep,
      onSuccess,
      onRetry,
      updateSubStep,
      onPendingSuccess,
      onPendingError,
      subStep,
      isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.container-inner {
  margin: 0 auto;
  max-width: 1260px;
  padding: 100px 30px;
}

.registration-block {
  display: flex;
  column-gap: 10px;
  padding-top: 56px;
}

.step {
  width: 540px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 12px 40px 2px rgba(21, 27, 37, 0.3);
  padding: 56px;

  &.center {
    margin: 0 auto;
  }

  &.step--terms {
    padding: 24px;
  }

  &.step--type {
    width: auto;
    min-width: 540px;
  }
}

@media (max-width: 992px) {
  .step {
    &.step--type {
      min-width: 50%;
      padding: 32px;
    }
  }
}

@media (max-width: 768px) {
  .container-inner {
    padding: 100px 16px;

    .registration-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow:
        0px 5px 15px 0px #0000001f,
        0px 15px 35px 0px #3c425714;
      background-color: #ffffff;
      border-radius: 4px;
      padding: 16px 16px 56px;
    }
  }
  .step {
    width: 100%;
    border-radius: 0;
    box-shadow: none;
    padding: 32px 0 0 0;

    &.step--terms {
      padding: 32px 0 0;
    }
  }
}
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
