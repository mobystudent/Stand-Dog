<template>
  <div
    class="card"
    :class="cardSize"
    role="button"
    :aria-label="title"
    @click.stop="$emit('card-click')"
  >
    <img
      :src="`/static/icons/cards/${icon}`"
      aria-hidden="true"
      class="card__icon"
    />
    <p v-html="title" class="card__title"></p>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'StepCard',
  emits: ['card-click'],
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    size: { type: String, default: 'default' }
  },
  setup(props) {
    const cardSize = computed(() => ({
      'card--large': props.size === 'large',
      'card--default': props.size !== 'large'
    }))

    return {
      cardSize
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  min-height: 148px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  padding: 16px 10px;
  cursor: pointer;
  transition: box-shadow 0.25s ease-in-out;

  &:hover,
  &:focus {
    box-shadow:
      0px 5px 15px 0px #0000001f,
      0px 15px 35px 0px #3c425714;
  }

  &--default {
    width: 120px;
  }

  &--large {
    width: 160px;
  }

  &__icon {
    align-self: center;
  }

  &__title {
    color: #0066df;
    font-weight: 500;
    font-size: 15px;
    line-height: 22px;
    letter-spacing: 0.15px;
    padding-top: 4px;
    text-align: center;
  }
}
</style>
