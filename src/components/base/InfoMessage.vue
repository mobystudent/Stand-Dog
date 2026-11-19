<template>
  <div class="info">
    <img src="/static/icons/info-circle-blue.svg" alt="information" />
    <p>
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'InfoMessage',
  props: {
    message: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  gap: 24px;
  background-color: #dbebff;
  border-radius: 8px;
  padding: 8px;
  margin-top: 16px;

  img {
    flex-shrink: 0;
  }

  p {
    color: #151b25;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }
}
</style>
