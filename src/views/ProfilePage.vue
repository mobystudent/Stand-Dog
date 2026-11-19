<template>
  <div class="profile-page">
    <section class="profile-section">
      <AvatarUploader />
    </section>
    <section class="profile-section">
      <EmergencyContact />
    </section>
    <section class="profile-section">
      <DisabilityInfo />
    </section>
  </div>
</template>

<script>
import AvatarUploader from '../components/myProfile/AvatarUploader.vue'
import EmergencyContact from '../components/myProfile/EmergencyContact.vue'
import DisabilityInfo from '../components/myProfile/DisabilityInfo.vue'

export default {
  name: 'ProfilePage',
  components: {
    AvatarUploader,
    EmergencyContact,
    DisabilityInfo
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

.profile-section {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow:
    0px 8px 46px -18px #00000059,
    0px 36px 61px -54px #32325d1f;
  padding: 16px;
}
</style>
