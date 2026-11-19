<template>
  <div class="form-group">
    <div class="label-group">
      <label class="form-label">
        {{ label }}
        <span v-if="required" class="required-asterisk" aria-hidden="true"
          >*</span
        >
      </label>
      <span
        v-if="showTooltip"
        class="tooltip-icon"
        tabindex="0"
        @focus="showTip"
        @blur="hideTip"
        @click="toggleTip"
        @mouseenter="showTip"
        @mouseleave="hideTip"
        @keydown.enter.prevent="toggleTip"
        @keydown.esc="hideTip"
        role="button"
        aria-label="Password information"
        :aria-describedby="isTooltipVisible ? 'tooltip-content' : null"
      >
        <img
          src="/static/icons/info-icon.svg"
          alt="information"
          aria-hidden="true"
        />
      </span>
      <div
        v-if="isTooltipVisible"
        id="tooltip-content"
        class="tooltip"
        role="tooltip"
        aria-live="polite"
      >
        <p>Password must:</p>
        <ul>
          <li>Be at least 8 characters long</li>
          <li>Have at least one uppercase letter</li>
          <li>Have at least one lowercase letter</li>
          <li>Have at least one number</li>
          <li>Have at least one special character (e.g., @, #, $)</li>
        </ul>
      </div>
    </div>
    <div class="input-wrapper">
      <input
        ref="inputElement"
        :value="modelValue"
        @input="updateValue"
        class="form-control"
        :class="{ error: isError }"
        :type="inputType"
        :placeholder="placeholder"
        @focus="handleFocus"
      />
      <div v-if="type === 'password'" class="icon" @click="toggleShowPassword">
        <span
          :class="{
            'show-pass': showPassword,
            'hide-pass': !showPassword
          }"
        ></span>
      </div>
    </div>

    <span v-if="isError" class="error-label">{{ errorMessages }}</span>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'BaseInput',
  emits: ['update:modelValue', 'focus'],
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    maxlength: { type: String, default: '255' },
    isError: { type: Boolean, default: false },
    errorMessages: { type: String, default: '' },
    showTooltip: { type: Boolean, default: false }
  },

  setup(props, { emit }) {
    const showPassword = ref(false)
    const isTooltipVisible = ref(false)
    const inputElement = ref(null)

    const inputType = computed(() => {
      return props.type === 'password' && showPassword.value
        ? 'text'
        : props.type
    })

    const updateValue = (event) => {
      emit('update:modelValue', event.target.value)
    }

    const handleFocus = (event) => {
      emit('focus', event)
    }

    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value
    }

    const showTip = () => {
      isTooltipVisible.value = true
    }

    const hideTip = () => {
      isTooltipVisible.value = false
    }

    const toggleTip = () => {
      isTooltipVisible.value = !isTooltipVisible.value
    }

    return {
      inputElement,
      inputType,
      showPassword,
      isTooltipVisible,
      updateValue,
      handleFocus,
      toggleShowPassword,
      showTip,
      hideTip,
      toggleTip
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  display: flex;
  flex-direction: column;

  .label-group {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .form-label {
    color: #1d1d1f;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
  }
}

.form-control {
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #a4a4a9;
  outline: 3px solid transparent;
  border-radius: 6px;
  padding: 9px 40px 9px 12px;
  color: #1d1d1f;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: 0.2px;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: transparent;
    outline-color: #a1cbff;
  }

  &:hover:not(:focus) {
    border-color: #a1cbff;
  }

  &.error {
    border-color: #ff3333;

    &:hover:not(:focus) {
      border-color: #ff3333;
    }
  }

  &::placeholder {
    color: #a4a4a9;
  }
}

.error-label {
  color: #ff3333;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
}

.input-wrapper {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 12px;

    span {
      display: inline-block;
      width: 22px;
      height: 22px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin-top: 4px;
      cursor: pointer;

      &.show-pass {
        background-image: url('/static/icons/show.svg');
        margin-top: 4px;
      }

      &.hide-pass {
        background-image: url('/static/icons/hide.svg');
      }
    }
  }
}

.tooltip-icon {
  display: flex;
  margin-left: 1px;
  cursor: pointer;
}

.tooltip {
  max-width: 300px;
  position: absolute;
  bottom: calc(100% + 10px);
  left: 61px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:
    0px 5px 15px 0px #0000001f,
    0px 15px 35px 0px #3c425714;
  padding: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #ffffff;
  }

  p {
    color: #000000;
    font-weight: 700;
    font-size: 12px;
    line-height: 15px;
    padding-bottom: 8px;
  }

  ul {
    color: #151b25;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    padding-left: 18px;

    li::marker {
      font-size: 10px;
    }
  }
}

@media (max-width: 768px) {
  .form-control {
    padding: 9px 33px 9px 12px;
    font-size: 16px;

    &::placeholder {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
