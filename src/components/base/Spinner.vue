<template>
  <img
    class="spinner rotating"
    :class="size"
    :src="imageSrc"
    alt="Loading..."
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['small', 'large'].includes(value)
  }
})

const imageSrc = computed(() =>
  props.size === 'large'
    ? '/static/icons/spinner-blue.svg'
    : '/static/icons/spinner.svg'
)
</script>

<style lang="scss" scoped>
.spinner {
  &.small {
    width: 24px;
    height: 24px;
  }

  &.large {
    width: 48px;
    height: 48px;
  }
}

.rotating {
  -webkit-animation: rotating 1s linear infinite;
  -moz-animation: rotating 1s linear infinite;
  -ms-animation: rotating 1s linear infinite;
  -o-animation: rotating 1s linear infinite;
  animation: rotating 1s linear infinite;
}

@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  to {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

@keyframes rotating {
  from {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  to {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}
</style>
