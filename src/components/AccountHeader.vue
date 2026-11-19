<template>
  <div class="account">
    <img class="account-icon" :src="avatar" alt="avatar" aria-hidden="true" />
    <div class="account-info">
      <span>Member Center</span>
      <div class="account-name">Hi, {{ userName }}!</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountHeader',
  props: {
    userName: { type: String, required: true },
    avatar: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.account {
  display: flex;
  align-items: center;
  column-gap: 24px;
  padding: 16px 0 24px;

  .account-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }

  .account-info {
    span {
      color: #616165;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }

    .account-name {
      color: #1d1d1f;
      font-weight: 700;
      font-size: 38px;
      line-height: 1.3;
      letter-spacing: -0.2px;
    }
  }
}
</style>
