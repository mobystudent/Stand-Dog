<template>
  <div v-if="!isProfileLoaded" class="loading">
    <Spinner size="large" />
  </div>

  <div v-else class="account-layout" v-if="store.isAuthenticated">
    <AccountHeader :user-name="userName" :avatar="avatar" />
    <div class="page-wrapper">
      <Sidebar />
      <main class="account-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '../store/userStore.js'
import { getProfile } from '../api/registration.js'
import Sidebar from '../components/Sidebar.vue'
import AccountHeader from '../components/AccountHeader.vue'
import Spinner from '../components/base/Spinner.vue'

export default {
  name: 'AccountLayout',
  components: {
    Sidebar,
    Spinner,
    AccountHeader
  },
  setup() {
    const store = useUserStore()
    const isProfileLoaded = ref(false)
    const userName = ref('')
    const avatar = ref('')
    const defaultAvatar = '/static/img/avatar.png'

    watch(
      () => store.profileData?.profile_photo_url,
      (newAvatar) => {
        avatar.value = newAvatar || defaultAvatar
      }
    )

    onMounted(async () => {
      if (!store.token) return

      try {
        const dataProfile = await getProfile()
        const profileData = dataProfile.data.data

        console.log('profileData', profileData)
        store.setProfileData(profileData)

        userName.value = profileData.full_name || 'User'
        avatar.value = profileData.profile_photo_url || defaultAvatar

        isProfileLoaded.value = true
      } catch (err) {
        console.error('Error fetching profile data:', err)
      }
    })

    return { userName, isProfileLoaded, avatar, store }
  }
}
</script>

<style lang="scss" scoped>
.account-layout {
  margin: 0 auto;
  max-width: 1260px;
  padding: 100px 30px;
}

.page-wrapper {
  display: flex;
  column-gap: 16px;
}

.account-main {
  flex: 1 1 auto;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
