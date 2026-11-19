<template>
  <div class="success-container">
    <h2 class="title">Please verify your email address</h2>
    <p class="message">
      Thanks for enrolling in Service Dog Standards! Please verify your email to
      activate your account, begin your Training and Behavior Standards
      Agreement and create your Profile page.
    </p>

    <BaseButton @click="onVerifyEmail">
      <Spinner v-if="isLoading" size="small" />
      {{ isLoading ? '' : 'Verify my email' }}
    </BaseButton>

    <p class="footer">
      Service Dogs Standards is a cloud-based voluntary training and behavior
      standards and team management solutions for Service Dog Trainers and
      Handlers. Please note that unverified accounts are automatically deleted
      in 30 days after sign up.
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { registerUser } from '../../api/registration.js'
import BaseButton from '../base/BaseButton.vue'
import Spinner from '../base/Spinner.vue'

export default {
  name: 'EmailVerificationPending',
  components: { BaseButton, Spinner },
  emits: ['success', 'error'],
  props: {
    email: { type: String, required: true }
  },
  setup(props, { emit }) {
    const store = useUserStore()
    const isLoading = ref(false)
    const onVerifyEmail = async () => {
      isLoading.value = true

      const payload = {
        email: props.email,
        account_type: store.accountType,
        animal_type: store.animalType
      }

      try {
        const response = await registerUser(payload)
        if (response.status === 201) {
          console.log('response.status', response)
          emit('success', props.email)
        } else {
          emit('error', 'Something went wrong. Please try again.')
        }
      } catch (err) {
        const message =
          err.response?.status === 422
            ? err.response.data?.errors?.email?.[0] ||
              'Please enter a valid email address.'
            : 'Something went wrong. Please try again.'

        emit('error', message)
      } finally {
        isLoading.value = false
      }
    }

    return {
      onVerifyEmail,
      isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.success-container {
  .title {
    width: 100%;
    color: #1d1d1f;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.2px;
    padding-bottom: 40px;
  }

  .message {
    color: #1d1d1f;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.2px;
    padding-bottom: 32px;
  }

  .footer {
    color: #616165;
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    padding-top: 24px;
  }
}
</style>
