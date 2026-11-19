<template>
  <div class="radio-group">
    <p class="radio-group__label" :id="labelId">{{ label }}</p>
    <div class="radio-group__options">
      <label
        v-for="option in options"
        :key="option.value"
        class="radio-option"
        :class="{ 'radio-option--selected': modelValue === option.value }"
      >
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          :aria-labelledby="labelId"
          class="radio-input"
        />
        <span class="custom-radio"></span>
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseRadioGroup',
  props: {
    modelValue: { type: String, required: true },
    label: { type: String, required: true },
    options: { type: Array, required: true }
  },
  emits: ['update:modelValue'],
  setup() {
    const labelId = computed(
      () => `radio-group-${Math.random().toString(36).substr(2, 9)}`
    )
    return { labelId }
  }
}
</script>

<style lang="scss" scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    color: #1d1d1f;
    font-weight: 500;
    font-size: 17px;
    line-height: 1.3;
  }

  &__options {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d1d1f;
  font-weight: 500;
  font-size: 17px;
  padding: 2px 0;
  transition: color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: #616165;
  }
}

.radio-input {
  display: none;
}

.custom-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #616165;
  border-radius: 50%;
  position: relative;
  transition: border-color 0.2s ease-in-out;
}

.radio-input:checked + .custom-radio {
  border-color: #0066df;
}

.radio-input:checked + .custom-radio::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #0066df;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
