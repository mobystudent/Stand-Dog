<template>
  <ProgressBar v-if="subStep !== 5" :step="subStep" :total-steps="5" />

  <div v-if="subStep === 1 && !isMySelfFormVisible">
    <h2 class="title">Let’s begin!</h2>
    <p class="form-info">
      Are you filling out this form and signing this training and behavior
      standards agreement on behalf of for yourself or someone else?
    </p>
    <Tabs
      :labels="labelTabs"
      :tabs-components="tabsComponents"
      @update:is-my-self-form-visible="updateIsMySelfFormVisible"
      @continue="nextStep"
    />
  </div>
  <div v-if="subStep === 1 && isMySelfFormVisible">
    <MySelfForm @continue="nextStep">
      <template #note>
        <p>Please specify the name of the disabled person</p>
      </template>
    </MySelfForm>
  </div>
  <PersonalInformation
    v-if="subStep === 2"
    @continue="nextStep"
    @previous="previousStep"
  />

  <!--  <EmergencyContactInformation-->
  <!--    v-if="subStep === 3"-->
  <!--    @continue="nextStep"-->
  <!--    @previous="previousStep"-->
  <!--  />-->

  <DisabilityInformation
    v-if="subStep === 3"
    @continue="nextStep"
    @previous="previousStep"
  />

  <AboutTheDog
    v-if="subStep === 4"
    @finish="completeRegistration"
    @previous="previousStep"
  />
  <!--  <OptionalInformation-->
  <!--    v-if="subStep === 5"-->
  <!--    @finish="completeRegistration"-->
  <!--    @previous="previousStep"-->
  <!--  />-->
  <ProfileComplete v-if="subStep === 5" />
  <AgreementModal
    v-show="showAgreement"
    :pages="agreementPages"
    modal-title="Service Dog Standards Trainer Oath"
    @confirm="handleAgreementConfirm"
    @cancel="showAgreement = false"
  />
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { getPrivateAgreement } from '../../api/registration.js'
import Tabs from '../base/Tabs.vue'
import MySelfForm from './MySelfForm.vue'
import TabMyself from './tabs/TabMyself.vue'
import TabSomeoneElse from './tabs/TabSomeoneElse.vue'
import PersonalInformation from './PersonalInformation.vue'
import EmergencyContactInformation from './EmergencyContactInformation.vue'
import DisabilityInformation from './DisabilityInformation.vue'
import AboutTheDog from './AboutTheDog.vue'
import ProfileComplete from './ProfileComplete.vue'
import ProgressBar from '../base/ProgressBar.vue'
import AgreementModal from '../base/AgreementModal.vue'

export default {
  name: 'BasicInformation',
  components: {
    Tabs,
    TabMyself,
    MySelfForm,
    TabSomeoneElse,
    PersonalInformation,
    EmergencyContactInformation,
    DisabilityInformation,
    AboutTheDog,
    ProfileComplete,
    ProgressBar,
    AgreementModal
  },
  props: {
    subStep: {
      type: Number,
      default: 1
    }
  },
  emits: ['updateSubStep', 'update:isMySelfFormVisible'],

  setup(props, { emit }) {
    const store = useUserStore()
    const labelTabs = ['Myself', 'Someone Else']
    const tabsComponents = [TabMyself, TabSomeoneElse]
    const isMySelfFormVisible = ref(false)
    const showAgreement = ref(false)
    const agreementPages = ref([])

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    watch(showAgreement, (val) => {
      document.body.style.overflow = val ? 'hidden' : ''
    })

    const updateIsMySelfFormVisible = (value) => {
      isMySelfFormVisible.value = value
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const nextStep = () => {
      let subStep

      if (props.subStep === 3 && store.animalType === null) subStep = 5
      else subStep = props.subStep + 1

      emit('updateSubStep', subStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const previousStep = () => {
      let subStep
      isMySelfFormVisible.value = false

      if (props.subStep === 5 && store.animalType === null) subStep = 3
      else subStep = props.subStep - 1

      emit('updateSubStep', subStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const completeRegistration = async () => {
      if (store.accountType === 'trainer') {
        try {
          const response = await getPrivateAgreement(2)
          if (
            response.data?.agreements?.length > 0 &&
            response.status === 200
          ) {
            agreementPages.value = response.data.agreements
            showAgreement.value = true
          }
        } catch (error) {
          console.error('Failed to load agreement:', error)
        }
      } else {
        nextStep()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const handleAgreementConfirm = () => {
      showAgreement.value = false
      nextStep()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
      nextStep,
      previousStep,
      completeRegistration,
      handleAgreementConfirm,
      updateIsMySelfFormVisible,
      showAgreement,
      isMySelfFormVisible,
      agreementPages,
      labelTabs,
      tabsComponents
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
  padding-bottom: 24px;
}

.form-info {
  color: #616165;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  padding-bottom: 24px;
}
</style>
