<template>
  <div class="accordion">
    <div class="accordion-header" @click="toggle">
      <span>Emergency Contact Information</span>
      <img
        class="accordion-arrow"
        :class="{ open: isOpen }"
        src="/static/icons/arrow-top-bottom.svg"
        alt="arrow icon"
      />
    </div>

    <transition name="accordion">
      <div v-show="isOpen" class="accordion-content">
        <form @submit.prevent="submitForm" class="form-grid">
          <BaseInput
            v-model="emergencyContact.firstName"
            label="First name"
            type="text"
            :is-error="!!errorState.firstName"
            :error-messages="errorState.firstName"
            @focus="errorState.firstName = ''"
          />
          <BaseInput
            v-model="emergencyContact.lastName"
            label="Last name"
            type="text"
            :is-error="!!errorState.lastName"
            :error-messages="errorState.lastName"
            @focus="errorState.lastName = ''"
          />
          <SelectBox
            v-model="emergencyContact.relationshipToDisabledHandler"
            :options="libraryStore.options?.relationship_to_disable || []"
            label="Relationship to disabled handler"
            :is-error="!!errorState.relationshipToDisabledHandler"
            :error-messages="errorState.relationshipToDisabledHandler"
            @focus="errorState.relationshipToDisabledHandler = ''"
            @input="
              errorState.relationshipToDisabledHandler =
                emergencyContact.relationshipToDisabledHandler
                  ? ''
                  : errorState.relationshipToDisabledHandler
            "
          />
          <BaseInput
            v-model="emergencyContact.email"
            label="Email Address"
            type="text"
            maxlength="254"
            :is-error="!!errorState.email"
            :error-messages="errorState.email"
            @focus="errorState.email = ''"
          />

          <BaseInput
            v-model="emergencyContact.phone"
            label="Phone"
            type="tel"
            :is-error="!!errorState.phone"
            :error-messages="errorState.phone"
            @focus="errorState.phone = ''"
            @input="(event) => formatPhoneNumber(event, 'phone')"
          />
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useLibraryStore } from '../../store/libraryStore.js'
import { useFormErrors } from '../../composables/useFormErrors.js'
import { formatPhone } from '../../utils/formatting.js'
import BaseInput from '../base/BaseInput.vue'
import SelectBox from '../base/SelectBox.vue'

export default {
  name: 'EmergencyContact',
  components: {
    BaseInput,
    SelectBox
  },
  setup() {
    const isOpen = ref(false)
    const libraryStore = useLibraryStore()
    const { errorState, setError, clearErrors } = useFormErrors([
      'firstName',
      'lastName',
      'relationshipToDisabledHandler',
      'email',
      'phone'
    ])
    const emergencyContact = ref({
      firstName: '',
      lastName: '',
      relationshipToDisabledHandler: '',
      email: '',
      phone: ''
    })

    const formatPhoneNumber = (event, fieldName) => {
      emergencyContact.value[fieldName] = formatPhone(event.target.value)
    }

    const submitForm = async () => {}

    const toggle = () => {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen,
      toggle,
      emergencyContact,
      errorState,
      libraryStore,
      submitForm,
      formatPhoneNumber
    }
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  padding: 0 8px;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;

  span {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }
}

.accordion-arrow {
  transform: rotate(180deg);
  transition: transform 0.3s ease;

  &.open {
    transform: rotate(0deg);
  }
}

.accordion-content {
  padding: 16px 0 8px;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease-in-out;
}

.accordion-enter,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 24px;
}
</style>
