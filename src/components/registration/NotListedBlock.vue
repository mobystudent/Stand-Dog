<template>
  <div class="not-listed">
    <div :class="['not-listed__header', { selected: isChecked }]">
      <BaseCheckbox v-model="isChecked" label="Not listed" />
      <p class="not-listed__description">My disability is not on the list.</p>
    </div>

    <div v-if="isChecked" class="not-listed__custom">
      <BaseInput
        v-model="customCondition"
        label="Please enter your disability"
        type="text"
        :is-error="!!inputError"
        :error-messages="inputError"
        @focus="inputError = ''"
      />

      <p class="not-listed__hint">
        Please describe your condition in your own words. You can say “I have…”
        or just name it.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import BaseInput from '../base/BaseInput.vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'

export default {
  name: 'NotListedBlock',
  components: {
    BaseInput,
    BaseCheckbox
  },
  emits: ['custom-condition-updated'],
  setup(_, { emit }) {
    const customCondition = ref('')
    const isChecked = ref(false)
    const inputError = ref('')

    const validateInput = (value) => {
      const trimmed = value.trim()
      if (trimmed.length === 0) {
        return 'Please enter a valid condition.'
      }
      return ''
    }

    watch(customCondition, (newValue) => {
      inputError.value = validateInput(newValue)
    })

    watch([isChecked, customCondition], () => {
      if (isChecked.value) {
        const trimmed = customCondition.value.trim()
        emit('custom-condition-updated', {
          condition: trimmed,
          isValid: trimmed.length > 0
        })
      } else {
        emit('custom-condition-updated', null)
      }
    })

    return {
      isChecked,
      customCondition,
      inputError
    }
  }
}
</script>

<style lang="scss" scoped>
.not-listed {
  &__header {
    color: #1d1d1f;
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.2px;
    border-radius: 12px;
    background-color: #f5f5f7;
    padding: 16px 24px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #dbebff;
    }

    &.selected {
      background-color: #dbebff;
    }
  }

  &__description {
    font-weight: 500;
    margin-top: 8px;
  }

  &__custom {
    margin-top: 16px;
  }

  &__hint {
    color: #616165;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.2px;
    padding-top: 12px;
  }
}
</style>

<style lang="scss">
.not-listed {
  .base-checkbox {
    padding: 10px 0;

    .checkbox-label {
      font-weight: 700;
    }
  }
}
</style>
