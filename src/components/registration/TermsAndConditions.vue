<template>
  <div class="content">
    <h2 class="title">
      In order to continue, you must accept the following...
    </h2>
    <ul>
      <li>I am at least 18 years of age.</li>
      <li>
        I am enrolling myself. If I am enrolling for someone else I have their
        permission to do so.
      </li>
      <li>
        I agree that I will not intentionally or unintentionally violate any
        applicable local, state, national or international law, including but
        not limited to the Americans with Disabilities Act and its implementing
        regulations.
      </li>
      <li>
        I understand that it is against the law to intentionally misrepresent an
        animal as a Service or Assistance Dog.
      </li>
      <li>I, or the person being enrolled, has a qualifying disability.</li>
      <li>
        This dog is either a fully trained Service or Assistance Dog, or is in
        the process of being trained to help perform specific tasks related to
        the owner's disability. Please note that not all states recognize
        Service or Assistance Dogs in Training. I understand that it is my
        responsibility to understand and obey all applicable laws in my area.
      </li>
      <li>
        I understand that membership is not a substitute for proper training.
      </li>
      <li>
        I understand that aggressive behavior constitutes an immediate
        forfeiture of membership.
      </li>
      <li>
        I understand that misrepresenting myself or my service animal, behaving
        in an unbecoming manner, misquoting the law or the purpose of our
        service can result in immediate forfeiture of membership.
      </li>
      <li>
        I will do my very best to leave an excellent impression with others with
        my behavior and that of my Service Dog.
      </li>
    </ul>

    <div class="terms-container">
      <h2 class="title">Terms of Service</h2>
      <div class="terms-content">
        <div class="terms-content__wrapper">
          <div v-html="termsOfService"></div>
        </div>
      </div>

      <BaseCheckbox
        v-model="agreeTerms"
        label="I agree to the statements above and the Service Dog Standards Terms of Service"
      />
    </div>

    <BaseButton :disabled="!agreeTerms" @click="nextStep">Continue</BaseButton>
    <InfoMessage
      message="Your progress is auto-saved, so you can continue filling out the form at
      your convenience."
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { getTerms, sdsAgreement } from '../../api/registration.js'
import BaseButton from '../base/BaseButton.vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'
import InfoMessage from '../base/InfoMessage.vue'

export default {
  name: 'TermsAndConditions',
  components: { BaseButton, BaseCheckbox, InfoMessage },

  setup() {
    const store = useUserStore()
    const agreeTerms = ref(false)
    const termsOfService = ref('')

    onMounted(async () => {
      try {
        const { data } = await getTerms()
        termsOfService.value = data.content
      } catch (err) {
        console.error('Error fetching terms:', err)
      }
    })

    const nextStep = async () => {
      try {
        const response = await sdsAgreement()
        if (response.status === 200) {
          store.setRegistrationStep(3)
        } else {
          console.error('Agreement failed', response.data.message)
        }
      } catch (err) {
        console.error('Error during agreement confirmation:', err)
      }
    }

    return {
      agreeTerms,
      termsOfService,
      nextStep
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  border-radius: 6px;
  background-color: #f6f9fc;
  padding: 24px;
}

.title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  padding-bottom: 16px;
}

ul {
  list-style: none;

  li {
    position: relative;
    color: #2f2f31;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.2px;
    padding-left: 32px;
    margin-bottom: 16px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      background: url('/static/icons/circle-check.svg') center/contain no-repeat;
    }
  }
}

.terms-container {
  margin-bottom: 64px;

  .title {
    text-align: center;
  }

  .terms-content {
    height: 300px;
    background-color: #ffffff;
    border: 1px solid #a4a4a9;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 32px;

    &__wrapper {
      height: 100%;
      padding: 0 8px 0 0;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 7px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #bbb;
        border-radius: 6px;
      }
    }
  }
}
</style>

<style lang="scss">
.terms-container {
  .base-checkbox {
    .checkbox-label {
      font-weight: 500;
    }
  }

  .terms-content {
    p,
    ol {
      color: #616165;
      font-weight: 500;
      font-size: 15px;
      line-height: 1.3;
      letter-spacing: 0;
    }
    h3 {
      color: #616165;
      font-weight: 700;
      font-size: 18px;
      line-height: 1.4;
      letter-spacing: 0.2px;
    }

    p {
      margin-left: -20px;
    }

    ol {
      padding-left: 20px;

      li {
        &::marker {
          font-weight: 700;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
