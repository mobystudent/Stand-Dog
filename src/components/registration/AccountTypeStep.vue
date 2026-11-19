<template>
  <h2 class="title" aria-live="polite">{{ stepTitle }}</h2>
  <div class="options" :class="step === 1 ? 'large' : 'default'">
    <StepCard
      v-for="option in currentOptions"
      :key="option.title"
      :title="option.title"
      :icon="option.icon"
      :size="step === 1 ? 'large' : 'default'"
      :class="{ 'additional-margin': step > 1 }"
      role="button"
      tabindex="0"
      @click="option.action"
      @keydown.enter="option.action"
      @keydown.space.prevent="option.action"
    />
  </div>

  <div v-if="step === 1" class="option-descriptions">
    <div class="option-descriptions__item">
      <h3>Trainer or Professional</h3>
      <p>
        I'm a service dog trainer, doctor, therapist, support professional, or
        caregiver helping a handler.
      </p>
    </div>
    <div class="option-descriptions__item">
      <h3>Handler or Supporter</h3>
      <p>
        I have a service dog, I’m training one for myself, I’m in the process of
        getting one, or I’m a friend or family member helping someone who is.
      </p>
    </div>
  </div>

  <BaseButton
    v-if="step > 1"
    @click="goBack"
    button-class="go-back"
    aria-label="Go back to previous step"
    >Back</BaseButton
  >

  <AgreementModal
    v-show="showAgreement"
    :modal-title="agreementTitle"
    :pages="agreementPages"
    @confirm="handleAgreementConfirm"
    @cancel="handleAgreementCancel"
  />
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { getPublicAgreement } from '../../api/registration.js'
import StepCard from './StepCard.vue'
import AgreementModal from '../base/AgreementModal.vue'
import BaseButton from '../base/BaseButton.vue'

export default {
  name: 'AccountTypeStep',
  components: { StepCard, AgreementModal, BaseButton },
  emits: ['next-step'],

  setup(_, { emit }) {
    const store = useUserStore()
    const step = ref(1)
    const showAgreement = ref(false)
    const accountType = ref(null)
    const agreementPages = ref([])
    const agreementTitle = ref('')
    const agreementTitles = {
      trainer: 'Trainer Agreement',
      caregiver: 'Caregivers & Professionals Agreement',
      family: 'Friends, Family & Allies Agreement'
    }

    watch(showAgreement, (val) => {
      document.body.style.overflow = val ? 'hidden' : ''
    })

    const stepTitle = computed(() => {
      if (step.value === 1) return 'Which Best Describes You?'
      if (step.value === 2)
        return 'Are you a Trainer, Caregiver or Family Member?'
      return 'What type of animal are you registering?'
    })

    const loadAgreement = async (type) => {
      try {
        accountType.value = type
        const response = await getPublicAgreement(type, 1)
        if (response.data?.agreements?.length > 0 && response.status === 200) {
          agreementPages.value = response.data?.agreements
          agreementTitle.value = agreementTitles[type]
          showAgreement.value = true
        }
      } catch (error) {
        console.error('Failed to load agreement:', error)
      }
    }

    const handleAgreementConfirm = () => {
      store.setAccountType(accountType.value)
      showAgreement.value = false
      step.value = 3
    }

    const handleAgreementCancel = () => {
      showAgreement.value = false
    }
    const currentOptions = computed(() => {
      if (step.value === 1) {
        return [
          {
            title: 'Trainer or Professional',
            icon: 'trainer.svg',
            action: () => {
              step.value = 2
            }
          },
          {
            title: 'Handler or Supporter',
            icon: 'handler.svg',
            action: () => {
              store.setAccountType('handler')
              step.value = 3
            }
          }
        ]
      } else if (step.value === 2) {
        return [
          {
            title: 'I’m a Service Dog Trainer',
            icon: 'trainer.svg',
            action: () => loadAgreement('trainer')
          },
          {
            title: 'I’m a Caregiver',
            icon: 'caregiver.svg',
            action: () => loadAgreement('caregiver')
          },
          {
            title: 'I’m a Family Member',
            icon: 'family.svg',
            action: () => loadAgreement('family')
          }
        ]
      } else {
        const options = [
          {
            title: 'Service Dog',
            icon: 'service_dog.svg',
            action: () => selectAnimalType('service_dog')
          },
          {
            title: 'Emotional Support Animal',
            icon: 'emotional_support.svg',
            action: () => selectAnimalType('emotional_support')
          },
          {
            title: 'Therapy Dog',
            icon: 'therapy_dog.svg',
            action: () => selectAnimalType('therapy_dog')
          }
        ]
        if (store.accountType !== 'handler') {
          options.push({
            title: 'I don’t currently have a dog.',
            icon: 'no_dog.svg',
            action: () => selectAnimalType(null)
          })
        }

        return options
      }
    })

    const selectAnimalType = (type) => {
      store.setAnimalType(type)
      emit('next-step')
    }

    const goBack = () => {
      console.log('before', store.accountType)
      if (step.value === 3 && store.accountType === 'handler') {
        step.value = 1
        store.setAccountType(null)
      } else if (step.value > 1) {
        step.value--
      }

      console.log('after', store.accountType)
    }

    return {
      step,
      stepTitle,
      currentOptions,
      showAgreement,
      agreementPages,
      agreementTitle,
      handleAgreementConfirm,
      handleAgreementCancel,
      goBack
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #4a4a4c;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  text-align: center;
  padding-bottom: 32px;
}

.options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;

  &.default {
    justify-content: space-between;
  }
}

.option-descriptions {
  max-width: 428px;
  margin-top: 32px;

  &__item {
    h3 {
      color: #4a4a4c;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.2px;
      padding-bottom: 4px;
    }

    p {
      color: #4a4a4c;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.2px;
    }

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.additional-margin {
  margin-bottom: 32px;
}
</style>
