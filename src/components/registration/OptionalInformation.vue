<template>
  <form @submit.prevent="submitForm">
    <h2 class="title">Optional Information</h2>
    <p class="form-info">
      Responses to the following questions will be kept private and only shared
      with others in anonymized statistical form. You will not be identified.
    </p>

    <SelectBox
      v-model="optionalInfo.ethnicity"
      class="custom-margin"
      :options="libraryStore.options?.ethnicity || []"
      label="What is your race, ethnicity, or origin?"
    />

    <SelectBox
      v-model="optionalInfo.education_level"
      class="custom-margin"
      :options="libraryStore.options?.education_level || []"
      label="Highest level of education?"
    />

    <SelectBox
      v-model="optionalInfo.annual_income"
      class="custom-margin"
      :options="libraryStore.options?.annual_income || []"
      label="Approximate annual income"
    />

    <BaseRadioGroup
      v-model="optionalInfo.military_service"
      class="custom-margin"
      label="Have you or do you currently serve in the military?"
      :options="[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]"
    />

    <BaseRadioGroup
      v-model="optionalInfo.wartime_contractor"
      class="custom-margin"
      label="Have you or do you currently work as a civilian wartime contractor?"
      :options="[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]"
    />

    <BaseRadioGroup
      v-model="optionalInfo.service_dog_for_injury"
      class="custom-margin"
      label="Do you use your Service Dog to help with an injury which occurred while serving in the military or working as a civilian wartime contractor?"
      :options="[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]"
    />

    <div class="navigation-controls">
      <BaseButton @click="previousStep" button-class="go-back"
        >Go Back</BaseButton
      >

      <BaseButton type="submit">
        <Spinner v-if="isLoading" size="small" />
        {{ isLoading ? '' : 'Submit and finalize' }}
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
import { useLibraryStore } from '../../store/libraryStore.js'
import { getProfile, setProfile } from '../../api/registration.js'
import BaseButton from '../base/BaseButton.vue'
import InfoMessage from '../base/InfoMessage.vue'
import SelectBox from '../base/SelectBox.vue'
import BaseRadioGroup from '../base/BaseRadioGroup.vue'
import Spinner from '../base/Spinner.vue'

export default {
  name: 'OptionalInformation',
  components: { BaseButton, BaseRadioGroup, SelectBox, InfoMessage, Spinner },
  emits: ['finish', 'previous'],
  setup(_, { emit }) {
    const libraryStore = useLibraryStore()
    const isLoading = ref(false)

    const optionalInfo = ref({
      ethnicity: '',
      education_level: '',
      annual_income: '',
      military_service: 'no',
      wartime_contractor: 'no',
      service_dog_for_injury: 'no'
    })

    onMounted(async () => {
      try {
        const response = await getProfile()
        if (response?.status === 200) {
          const {
            ethnicity = '',
            education_level = '',
            annual_income = '',
            military_service = '',
            wartime_contractor = '',
            service_dog_for_injury = ''
          } = response.data.data

          optionalInfo.value = {
            ethnicity: ethnicity ?? '',
            education_level: education_level ?? '',
            annual_income: annual_income ?? '',
            military_service: military_service ? 'yes' : 'no',
            wartime_contractor: wartime_contractor ? 'yes' : 'no',
            service_dog_for_injury: service_dog_for_injury ? 'yes' : 'no'
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
      }
    })

    const submitForm = async () => {
      isLoading.value = true
      try {
        const payload = {
          ...optionalInfo.value,
          military_service: optionalInfo.value.military_service === 'yes',
          wartime_contractor: optionalInfo.value.wartime_contractor === 'yes',
          service_dog_for_injury:
            optionalInfo.value.service_dog_for_injury === 'yes'
        }

        const response = await setProfile(payload)
        if (response?.status === 200) {
          emit('finish')
        }
      } catch (err) {
        console.error('Optional information update failed:', err)
      } finally {
        isLoading.value = false
      }
    }

    const previousStep = () => {
      emit('previous')
    }

    return {
      submitForm,
      previousStep,
      libraryStore,
      isLoading,
      optionalInfo
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
  padding-bottom: 16px;
}
.custom-margin {
  margin-bottom: 40px;
}
</style>
