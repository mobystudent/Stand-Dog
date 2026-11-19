<template>
  <label :class="['base-checkbox', { disabled }]">
    <input
      v-model="modelValueProxy"
      type="checkbox"
      class="checkbox"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="checkbox-icon" />
    <span class="checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseCheckbox',
  props: {
    modelValue: { type: Boolean, required: true },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const modelValueProxy = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const handleChange = (event) => {
      emit('change', event)
    }

    return {
      modelValueProxy,
      handleChange
    }
  }
}
</script>

<style lang="scss" scoped>
.base-checkbox {
  display: inline-flex;
  align-items: flex-start;
  column-gap: 8px;
  cursor: pointer;

  .checkbox-icon {
    position: relative;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border: 2px solid #616165;
    border-radius: 2px;
    margin-top: 4px;
  }

  .checkbox-label {
    color: #1d1d1f;
    //font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.2px;
  }

  .checkbox {
    position: absolute;
    opacity: 0;
    //cursor: pointer;

    &:checked {
      & + .checkbox-icon {
        background-color: #0066df;
        border-color: #0066df;
      }

      & + .checkbox-icon::after {
        content: '';
        width: 20px;
        height: 20px;
        background: url('/static/icons/check.svg') no-repeat center center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: none;
      }
    }
  }
}
</style>
