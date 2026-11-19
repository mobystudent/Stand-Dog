<template>
  <div class="select-box" ref="selectBox">
    <label>
      {{ label }}
      <span v-if="required" class="required-asterisk" aria-hidden="true"
        >*</span
      >
    </label>
    <div
      class="dropdown"
      :class="{ open: isOpen, error: isError }"
      @click="toggleDropdown"
    >
      <div class="selected">
        <span v-if="selectedFormatted">{{ selectedFormatted }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <img
        src="/static/icons/down-arrow.svg"
        alt="arrow down"
        class="arrow-icon"
        @click.stop="toggleDropdown"
      />
      <ul v-if="isOpen" class="options">
        <li
          v-for="option in options"
          :key="option.name"
          @click.stop="selectOption(option)"
          :class="{ selected: isSelected(option) }"
        >
          <span
            v-if="multiple"
            class="custom-checkbox"
            :class="{ checked: isSelected(option) }"
          ></span>
          {{ option.value }}
        </li>
      </ul>
    </div>
    <span v-if="isError" class="error-label">{{ errorMessages }}</span>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SelectBox',
  emits: ['update:modelValue', 'focus'],
  props: {
    modelValue: { type: [String, Array], default: '' },
    options: { type: Array, required: true },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    isError: { type: Boolean, default: false },
    errorMessages: { type: String, default: '' }
  },

  setup(props, { emit }) {
    const isOpen = ref(false)
    const selectBox = ref(null)

    const selectedFormatted = computed(() => {
      if (props.multiple) {
        return Array.isArray(props.modelValue) && props.modelValue.length
          ? props.options
              .filter((option) => props.modelValue.includes(option.name))
              .map((option) => option.value)
              .join(', ')
          : ''
      }
      const selectedOption = props.options.find(
        (option) => option.name === props.modelValue
      )
      return selectedOption ? selectedOption.value : ''
    })

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
      emit('focus')
    }

    const selectOption = (option) => {
      if (props.multiple) {
        const newValues = Array.isArray(props.modelValue)
          ? props.modelValue.includes(option.name)
            ? props.modelValue.filter((item) => item !== option.name)
            : [...props.modelValue, option.name]
          : [option.name]

        emit('update:modelValue', newValues)
      } else {
        emit('update:modelValue', option.name)
        isOpen.value = false
      }
    }

    const isSelected = (option) => {
      return props.multiple
        ? Array.isArray(props.modelValue) &&
            props.modelValue.includes(option.name)
        : props.modelValue === option.name
    }

    const clickOutside = (event) => {
      if (selectBox.value && !selectBox.value.contains(event.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', clickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', clickOutside)
    })

    return {
      isOpen,
      selectedFormatted,
      selectBox,
      toggleDropdown,
      selectOption,
      isSelected
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    color: #1d1d1f;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
    margin-bottom: 12px;
  }
}

.dropdown {
  position: relative;
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #a4a4a9;
  outline: 3px solid transparent;
  border-radius: 6px;
  padding: 9px 12px;
  color: #1d1d1f;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: 0.2px;

  &.error {
    border-color: #ff3333;

    &:hover:not(:focus) {
      border-color: #ff3333;
    }
  }

  &.open {
    .arrow-icon {
      transform: rotate(180deg);
    }
  }

  & > .selected {
    height: 26px;
    overflow-y: auto;
  }
}

.selected {
  min-height: 24px;
}

.placeholder {
  color: #a4a4a9;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: 0.2px;
}

.arrow-icon {
  position: absolute;
  right: 12px;
  top: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.options {
  position: absolute;
  left: -1px;
  top: calc(100% + 5px);
  width: calc(100% + 2px);
  box-shadow:
    0px 7px 14px 0px #41455214,
    0px 3px 6px 0px #0000001f;
  background-color: #fff;
  border-radius: 4px;
  max-height: 188px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  z-index: 1;

  li {
    display: flex;
    color: #616165;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
    cursor: pointer;
    padding: 9px 16px;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;

    &:hover {
      background-color: #1d1d1d14;
      color: #1d1d1f;
    }

    &.selected {
      background: #f0f0f0;
    }
  }
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  border: 2px solid #151b25b3;
  display: inline-block;
  margin-right: 8px;
  position: relative;

  &.checked {
    background-color: #0066df;
    border-color: #0066df;

    &::after {
      content: '';
      background: url('/static/icons/check.svg') no-repeat center center;
      width: 14px;
      height: 10px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.error-label {
  color: #ff3333;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
}
</style>
