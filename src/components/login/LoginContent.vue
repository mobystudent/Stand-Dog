<template>
  <div class="login-content">
    <h2 class="title">Sign in to your account</h2>
    <SocialLogin />
    <p class="or">or</p>
    <form @submit.prevent="onSubmit()">
      {{ errorState.email }}
      <BaseInput
        v-model="email"
        label="Email address"
        type="text"
        class="custom-margin"
        :is-error="!!errorState.email"
        :error-messages="errorState.email"
        maxlength="254"
        @focus="errorState.email = ''"
      />

      <BaseInput
        v-model="password"
        label="Password"
        type="password"
        :is-error="!!errorState.password"
        :error-messages="errorState.password"
        @focus="errorState.password = ''"
      />

      <router-link class="form-link" to="/reset"
        >Forgot your password?</router-link
      >

      <BaseButton type="submit" class="custom-margin-btn">
        <Spinner v-if="isLoading" size="small" />
        {{ isLoading ? '' : 'Continue' }}
      </BaseButton>
      <p class="link">
        Don’t have an account? <router-link to="/signup">Sign up</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/userStore.js'
import { isValidEmail, isValidPassword } from '../../utils/validation.js'
import { userLogin } from '../../api/registration'
import SocialLogin from './SocialLogin.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import Spinner from '../base/Spinner.vue'

export default {
  name: 'LoginContent',
  components: {
    SocialLogin,
    BaseButton,
    BaseInput,
    Spinner
  },
  setup() {
    const store = useUserStore()
    const router = useRouter()
    const isLoading = ref(false)
    const email = ref('')
    const password = ref('')
    const errorState = ref({ email: '', password: '' })

    onMounted(async () => {
      store.clearUserData()
    })

    const onSubmit = async () => {
      if (email.value.length > 254) {
        errorState.value.email = 'Email address cannot exceed 254 characters.'
        return false
      }

      if (!isValidEmail(email.value)) {
        errorState.value.email = 'Please enter a valid email address.'
        return
      }

      if (!isValidPassword(password.value)) {
        errorState.value.password =
          'Password must be at least 8 characters and contain uppercase, lowercase, a number, and a special character.'
        return
      }

      isLoading.value = true

      try {
        const response = await userLogin({
          email: email.value,
          password: password.value
        })

        if (response.status === 200) {
          const { access_token, user } = response.data
          store.setUserData({
            token: access_token,
            email: user.email,
            accountType: user.account_type
          })

          await router.push('/accountHome')
        }
      } catch (err) {
        if (err.response?.status === 401) {
          errorState.value.email =
            err.response?.data?.message || 'Invalid email or password.'
          errorState.value.password =
            err.response?.data?.message || 'Invalid email or password.'
        } else {
          console.error('Login error:', err)
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      email,
      password,
      errorState,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.login-content {
  width: 540px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow:
    0px 5px 15px 0px rgba(0, 0, 0, 0.12),
    0px 15px 35px 0px rgba(60, 66, 87, 0.09);
  padding: 56px;
  margin: 156px auto;

  .title {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 0.2px;
    padding-bottom: 24px;
  }

  .or {
    color: #616165;
    font-weight: 700;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: 0.2px;
    text-align: center;
    padding-bottom: 16px;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 17px;
      width: calc(50% - 18px);
      height: 1px;
      background-color: #d2d2d7;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
}

.link {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.2px;
  text-align: center;

  a {
    color: #0066df;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #0066df;
    }
  }
}

.form-link {
  display: inline-block;
  color: #0066df;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.2px;
  margin-top: 8px;
}

.custom-margin {
  margin-bottom: 36px;
}
.custom-margin-btn {
  margin: 30px 0 16px;
}

@media (max-width: 768px) {
  .login-content {
    width: calc(100% - 32px);
    max-width: 540px;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 16px 16px 56px;
  }
}
</style>
