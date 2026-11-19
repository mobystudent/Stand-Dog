<template>
  <form @submit.prevent="submitForm">
    <h2 class="title">Disability Information</h2>
    <p class="form-info">
      Which best describes your PRIMARY reason for using a Service Dog?
    </p>

    <div v-for="cat in categories" :key="cat.category">
      <ConditionAccordion
        :category="cat.category"
        :conditions="cat.conditions"
      />
    </div>

    <NotListedBlock @custom-condition-updated="updateCustomCondition" />

    <div class="navigation-controls">
      <BaseButton @click="previousStep" button-class="go-back"
        >Go Back</BaseButton
      >

      <BaseButton type="submit">
        <Spinner v-if="isLoading" size="small" />
        {{ isLoading ? '' : 'Continue' }}
      </BaseButton>
    </div>

    <InfoMessage
      message="Your progress is auto-saved, so you can continue filling out the form at
      your convenience."
    />
  </form>
</template>

<script>
import { onMounted, ref } from 'vue'
import ConditionAccordion from './ConditionAccordion.vue'
import NotListedBlock from './NotListedBlock.vue'
import BaseButton from '../base/BaseButton.vue'
import Spinner from '../base/Spinner.vue'
import InfoMessage from '../base/InfoMessage.vue'

export default {
  name: 'DisabilityInformation',
  components: {
    ConditionAccordion,
    NotListedBlock,
    BaseButton,
    Spinner,
    InfoMessage
  },
  emits: ['continue', 'previous'],
  setup(_, { emit }) {
    const isLoading = ref(false)
    const categories = ref([])
    const customConditionData = ref(null)

    onMounted(async () => {
      categories.value = [
        {
          category: 'Physical, Mobility or Movement',
          conditions: [
            {
              id: 1,
              name: 'Spinal Cord Injuries',
              description:
                'Damage to the spinal cord that affects movement or feeling.'
            },
            {
              id: 2,
              name: 'Multiple Sclerosis (MS)',
              description:
                'A chronic autoimmune disease in which the immune system attacks the protective covering of nerves.'
            },
            {
              id: 3,
              name: 'Muscular Dystrophy',
              description:
                'A group of conditions that cause muscles to get weaker over time.'
            },
            {
              id: 4,
              name: 'Arthritis',
              description: 'Joint pain or stiffness that makes it hard to move.'
            }
          ]
        },
        {
          category: 'Seizure Disorders',
          conditions: [
            {
              id: 5,
              name: 'Chronic Pain',
              description:
                'Damage to the spinal cord that affects movement or feeling.'
            },
            {
              id: 6,
              name: 'MSpeech Impairments (Mobility Related)',
              description:
                'A chronic autoimmune disease in which the immune system attacks the protective covering of nerves.'
            },
            {
              id: 7,
              name: 'Muscular Dystrophy',
              description:
                'A group of conditions that cause muscles to get weaker over time.'
            },
            {
              id: 8,
              name: 'Arthritis',
              description: 'Joint pain or stiffness that makes it hard to move.'
            }
          ]
        }
      ]
    })

    const updateCustomCondition = (data) => {
      customConditionData.value = data
    }

    const submitForm = async () => {
      isLoading.value = true
      emit('continue')
      try {
        if (customConditionData.value?.isValid) {
          console.log(customConditionData.value.condition)
          emit('continue')
        }
      } catch (err) {
        console.error('Disability Information update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const previousStep = () => {
      emit('previous')
    }

    return {
      submitForm,
      categories,
      isLoading,
      updateCustomCondition,
      previousStep
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  padding-bottom: 8px;
}

.form-info {
  color: #616165;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  padding-bottom: 32px;
}

.navigation-controls {
  margin-top: 56px;
}
</style>
