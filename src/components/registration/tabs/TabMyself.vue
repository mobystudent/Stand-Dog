<template>
  <h2 class="tab-title">What’s your name?</h2>
  <MySelfForm @continue="$emit('continue')">
    <template #note>
      <img src="/static/img/realId-logo.png" alt="real Id logo" />
      <p>
        Please enter your name exactly as it appears on your government-issued
        ID, travel document, or other valid form of identification.
      </p>
      <span class="link" @click="showInfoModal = true"
        >Learn more about REAL ID</span
      >
    </template>
  </MySelfForm>

  <BaseModal
    v-show="showInfoModal"
    v-model="showInfoModal"
    title="About REAL ID"
    body="REAL ID is a federally mandated identification standard in the United States designed to enhance security and prevent fraud. It establishes minimum requirements for state-issued driver's licenses and ID cards to be accepted for certain federal purposes, such as boarding domestic flights and entering secure federal facilities. To get a REAL ID, individuals must provide documentation proving their identity, Social Security number, and residency."
    confirm-text="Got it"
    confirm-type="primary"
    :esc-closable="true"
    @cancel="showInfoModal = false"
    @confirm="showInfoModal = false"
  />
</template>

<script>
import { ref } from 'vue'
import MySelfForm from '../MySelfForm.vue'
import BaseModal from '../../base/BaseModal.vue'

export default {
  name: 'TabMyself',
  emits: ['continue'],
  components: { MySelfForm, BaseModal },
  setup() {
    const showInfoModal = ref(false)

    return {
      showInfoModal
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  padding: 24px 0;
}
</style>
