<template>
  <h2 class="title">Create your account</h2>
  <SocialLogin />
  <p class="or">or</p>
  <form @submit.prevent="onSubmit()">
    <BaseInput
      v-model="email"
      label="Email address"
      type="text"
      :is-error="!!error"
      :error-messages="error"
      maxlength="254"
      @focus="error = ''"
      @keydown.enter="onSubmit"
    />

    <div class="navigation-controls">
      <BaseButton
        @click="goBack"
        button-class="go-back"
        aria-label="Go back to previous step"
        >Back</BaseButton
      >

      <BaseButton
        type="submit"
        class="custom-margin"
        aria-label="Continue to next step"
        >Continue</BaseButton
      >
    </div>

    <p class="link">
      Have an account? <router-link to="/signup">Sign in</router-link>
    </p>
  </form>
</template>

<script>
import { ref, watch } from 'vue'
import { isValidEmail } from '../../utils/validation.js'
import SocialLogin from '../login/SocialLogin.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'

export default {
  name: 'EmailVerificationStep',
  components: { SocialLogin, BaseButton, BaseInput },
  props: {
    initialError: { type: String }
  },
  emits: ['success', 'prev-step'],

  setup(props, { emit }) {
    const email = ref('')
    const error = ref('')

    watch(
      () => props.initialError,
      (newVal) => {
        if (newVal) {
          error.value = newVal
        }
      },
      { immediate: true }
    )

    const setError = (message) => {
      error.value = message
    }

    const goBack = () => {
      emit('prev-step')
    }

    const onSubmit = async () => {
      if (!email.value) {
        setError('Email address is required.')
        return
      }

      if (email.value.length > 254) {
        setError('Email address cannot exceed 254 characters.')
        return
      }

      if (!isValidEmail(email.value)) {
        setError('Please enter a valid email address.')
        return
      }

      emit('success', email.value)
    }

    return {
      email,
      error,
      onSubmit,
      goBack
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

.custom-margin {
  //margin-top: 32px;
}
</style>

<style lang="scss">
.step {
  .navigation-controls {
    margin: 52px 0 16px;
  }
}
</style>
