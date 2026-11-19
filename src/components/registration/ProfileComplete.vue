<template>
  <div class="profile-complete">
    <div class="lottie-wrapper">
      <Vue3Lottie
        animation-link="/static/animations/Service_Dog_Standards_Checkmark.json"
        class="checkmark"
        :loop="false"
      />
    </div>
    <div class="profile-complete__controls">
      <h2 class="profile-complete__title">Woohoo!</h2>
      <p class="profile-complete__message">
        Congratulations! You’re profile is complete.
      </p>

      <div class="profile-complete__info">
        <p>{{ userName }}</p>
        <div v-for="(animal, index) in animalList" :key="index">
          <p>{{ animal.name }}</p>
          <p>{{ animal.teamCode }}</p>
        </div>
      </div>

      <BaseButton @click="handleClick">Go to my account</BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import { onMounted, ref } from 'vue'
import { getProfile, getProfileAnimals } from '../../api/registration.js'

export default {
  name: 'ProfileComplete',
  components: { BaseButton, Vue3Lottie },
  setup() {
    const router = useRouter()
    const userName = ref('')
    const animalList = ref([])

    onMounted(async () => {
      try {
        const dataProfile = await getProfile()
        if (dataProfile.status !== 200 || !dataProfile.data?.data) {
          console.log('Failed to load profile. ')
          return
        }
        const profileData = dataProfile.data.data
        userName.value = profileData.full_name || 'User'

        const dataProfileAnimals = await getProfileAnimals()
        if (
          dataProfileAnimals.status !== 200 ||
          !dataProfileAnimals.data?.animal_list
        ) {
          console.log('Failed to load profile. ')
          return
        }
        const profileAnimalsData = dataProfileAnimals.data.animal_list
        animalList.value = profileAnimalsData.map((animal) => ({
          name: animal.name,
          teamCode: animal.team?.team_code || ' '
        }))
        console.log('dataProfileAnimals ', dataProfileAnimals)
      } catch (err) {
        console.error('Error fetching profile data:', err)
      }
    })

    const handleClick = () => {
      router.push('/accountHome')
    }

    return { handleClick, userName, animalList }
  }
}
</script>

<style lang="scss" scoped>
.profile-complete {
  margin: -56px;

  &__controls {
    padding: 32px 72px 56px;
  }

  &__title {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: -0.2px;
    text-align: center;
    padding-bottom: 16px;
  }

  &__message {
    color: #616165;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.2px;
    text-align: center;
    padding-bottom: 16px;
  }

  &__info {
    margin-bottom: 32px;

    p {
      color: #616165;
      font-weight: 500;
      font-size: 16px;
      line-height: 27px;
      letter-spacing: -0.2px;
      text-align: center;
    }
  }
}

.lottie-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    transform: scale(1.5);
    transform-origin: center;
    pointer-events: none;
    z-index: 1;
  }
}
</style>
