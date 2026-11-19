<template>
  <button
    :type="type"
    :class="['base-button', buttonClass]"
    :aria-pressed="ariaPressed"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  emits: ['click'],
  props: {
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    ariaPressed: { type: Boolean, default: null },
    buttonClass: { type: String, default: '' }
  },

  setup(props, { emit }) {
    const handleClick = (event) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return { handleClick }
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.2px;
  background-color: #0066df;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:not(:disabled):hover {
    background-color: #0054b2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &:disabled {
    color: #a4a4a9;
    background-color: #ffffff;
    border: 2px solid #a4a4a9;
    cursor: default;
  }

  &.go-back {
    background-color: #ffffff;
    border: 2px solid #0066df;
    color: #0066df;

    &:not(:disabled):hover {
      background-color: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
  }
}

@media (max-width: 992px) {
  .base-button.go-back {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .base-button.go-back {
    width: 100%;
  }
}
</style>
