<template>
  <div v-if="loading" class="loading">
    <Spinner size="large" />
  </div>
  <div v-else>
    <div v-if="showPage" class="create-password-page">
      <p class="text">Welcome back!</p>
      <h2 class="title">Create your password</h2>
      <div>
        <form @submit.prevent="onSubmitPassword">
          <BaseInput
            v-model="password"
            label="Password"
            type="password"
            class="custom-margin"
            :is-error="!!errorState.password"
            :error-messages="errorState.password"
            :show-tooltip="true"
            @focus="errorState.password = ''"
          />

          <BaseInput
            v-model="confirmPassword"
            label="Please re-enter your password"
            type="password"
            :is-error="!!errorState.confirm_password"
            :error-messages="errorState.confirm_password"
            @focus="errorState.confirm_password = ''"
          />

          <BaseButton type="submit" class="custom-margin-btn">
            <Spinner v-if="isLoading" size="small" />
            {{ isLoading ? '' : 'Continue' }}
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyEmail, setPassword } from '../api/registration'
import { isValidPassword } from '../utils/validation.js'
import { useUserStore } from '../store/userStore'
import { useLibraryStore } from '../store/libraryStore'
import { toast } from 'vue3-toastify'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import Spinner from '../components/base/Spinner.vue'

export default {
  name: 'CreatePassword',
  components: { BaseButton, BaseInput, Spinner },

  setup() {
    const loading = ref(true)
    const isLoading = ref(false)
    const showPage = ref(false)
    const errorState = ref({ password: '', confirm_password: '' })
    const password = ref('')
    const confirmPassword = ref('')
    const route = useRoute()
    const router = useRouter()
    const store = useUserStore()
    const libraryStore = useLibraryStore()

    onMounted(async () => {
      try {
        const response = await verifyEmail(route.params.token)

        if (response.status === 200) {
          const { access_token, user } = response.data

          store.setToken(access_token)
          store.setUserEmail(user.email)
          store.setAccountType(user.account_type)

          await libraryStore.loadOptions()

          showPage.value = true
        } else {
          //GoTo Error page
          store.clearUserData()
          toast.error(response.data.message || 'Verification failed.')
        }
      } catch (err) {
        console.error('Verification error:', err)
        store.clearUserData()
        toast.error(
          err.response?.data?.message ||
            'An error occurred during verification.'
        )
      } finally {
        loading.value = false
      }
    })

    const validatePasswords = () => {
      if (!isValidPassword(password.value)) {
        errorState.value.password =
          'Password must be at least 8 characters and contain uppercase, lowercase, a number, and a special character.'
        return false
      }

      if (confirmPassword.value !== password.value) {
        errorState.value.confirm_password = 'Passwords do not match.'
        return false
      }

      return true
    }

    const onSubmitPassword = async () => {
      if (!validatePasswords()) return

      isLoading.value = true

      try {
        const response = await setPassword({
          password: password.value,
          password_confirmation: confirmPassword.value
        })

        if (response.status === 200) {
          store.setRegistrationStep(2)
          await router.push('/signup')
        }
      } catch (err) {
        console.error('Set password error:', err)

        if (err.response?.status === 422) {
          errorState.value.password =
            err.response.data.errors.password?.[0] || 'Password error'
        } else {
          toast.error(
            err.response?.data?.message ||
              'An error occurred while setting the password.'
          )
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      loading,
      isLoading,
      password,
      confirmPassword,
      errorState,
      showPage,
      onSubmitPassword
    }
  }
}
</script>

<style lang="scss" scoped>
.create-password-page {
  width: 540px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 12px 40px 2px rgba(21, 27, 37, 0.3);
  padding: 56px;
  margin: 156px auto 0;

  .text {
    color: #1d1d1f;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }

  .title {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.2px;
    padding-bottom: 24px;
  }
}

.custom-margin {
  margin-bottom: 40px;
}

.custom-margin-btn {
  margin-top: 48px;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .create-password-page {
    width: calc(100% - 32px);
    max-width: 540px;
  }
}

@media (max-width: 480px) {
  .create-password-page {
    padding: 16px 16px 56px;
  }
}
</style>
