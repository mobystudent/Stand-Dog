<template>
  <div class="success-container">
    <h2 class="title">Please check your email</h2>
    <p>
      A verification email has been sent to <span>{{ email }}</span>
    </p>
    <p>
      If you did not receive an email, please check your mail filter or use a
      <a href="#" @click.prevent="goBack">different email</a>.
      <!--Link 'different email' goes back to the first screen where they enter their address-->
    </p>
  </div>
</template>

<script>
export default {
  name: 'EmailVerificationSuccess',
  emits: ['retry'],
  props: {
    email: { type: String, required: true }
  },

  setup(_, { emit }) {
    const goBack = () => {
      emit('retry')
    }
    return { goBack }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  padding-bottom: 24px;
}

p {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  word-wrap: break-word;

  &:not(:last-child) {
    padding-bottom: 24px;
  }

  a {
    color: #0066cc;
  }
}
</style>
