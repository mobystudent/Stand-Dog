<template>
  <div class="home-page">
    <div class="card--progress card" data-type="agreement">
      <h3 class="card__title">SDS Agreement</h3>
      <div class="card--progress-body">
        <div class="progress-circle-container">
          <div class="outer">
            <svg
              class="progress-circle"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="circle-background"
                cx="60"
                cy="60"
                r="54"
                stroke-width="10"
              />
              <circle
                class="circle-progress"
                cx="60"
                cy="60"
                r="54"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="subscriptionProgressOffset"
              />
            </svg>
            <div class="inner">
              <div class="value">3yrs</div>
            </div>
          </div>
        </div>

        <div v-if="sdsExpirationDate" class="card--progress-valid">
          <div>
            <p class="title">Valid until</p>
            <p class="expiration-date">{{ sdsExpirationDate }}</p>
          </div>

          <button type="button" class="card--button">Continue</button>
        </div>
      </div>
    </div>
    <div class="card--progress card" data-type="completion">
      <h3 class="card__title">Account Completion</h3>
      <div class="card--progress-body">
        <div class="progress-circle-container account-color">
          <div class="outer">
            <svg
              class="progress-circle"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="circle-background"
                cx="60"
                cy="60"
                r="54"
                stroke-width="10"
              />
              <circle
                class="circle-progress"
                cx="60"
                cy="60"
                r="54"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="completionProgressOffset"
              />
            </svg>
            <div class="inner">
              <div class="value">{{ percentage }}%</div>
            </div>
          </div>
        </div>
        <button type="button" class="card--button">Update</button>
      </div>
    </div>

    <div class="grid-main">
      <div class="card card--registered">
        <RegisteredDogs />
      </div>
      <div class="card card--tracking-order">
        <OrderTracking />
      </div>
      <div class="card card--support">
        <Donation />
      </div>
      <div class="card card--training-behavior">
        <CardComponent
          title="Training & Behavior Standards"
          description="Download the Service Dog Standards Training & Behavior Standards (SDSTBS) Agreement"
          link-url="#"
        />
      </div>
      <div class="card card--public-access">
        <CardComponent
          title="Public Access Test"
          description="Download the Service Dog Standards Public Access Test (SDSPAT)"
          link-url="#"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
// import { getProfile } from '../api/registration.js'
import { useUserStore } from '../store/userStore'
import Donation from '../components/accountHome/Donation.vue'
import CardComponent from '../components/accountHome/CardComponent.vue'
import RegisteredDogs from '../components/accountHome/RegisteredDogs.vue'
import OrderTracking from '../components/accountHome/OrderTracking.vue'

export default {
  name: 'AccountHomePage',
  components: {
    Donation,
    CardComponent,
    RegisteredDogs,
    OrderTracking
  },
  setup() {
    const store = useUserStore()
    const userName = ref('')
    const percentage = ref(0)
    const targetPercentage = ref(0)
    const sdsExpirationDate = ref('')
    const circumference = computed(() => 2 * Math.PI * 54)

    const subscriptionProgress = ref(0)
    const subscriptionProgressOffset = computed(() => {
      return (
        circumference.value -
        (subscriptionProgress.value / 100) * circumference.value
      )
    })

    const completionProgressOffset = computed(() => {
      return (
        circumference.value - (percentage.value / 100) * circumference.value
      )
    })

    const animateProgress = (start, end, duration = 800, callback) => {
      const startTime = performance.now()

      const update = (currentTime) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)
        const easedProgress = easeInOutQuad(progress)

        const currentProgress = Math.round(
          start + (end - start) * easedProgress
        )
        callback(currentProgress)

        if (progress < 1) {
          requestAnimationFrame(update)
        }
      }

      requestAnimationFrame(update)
    }

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    }

    const calculateSubscriptionProgress = (expirationDate) => {
      const currentDate = new Date()
      const endDate = new Date(expirationDate)
      const startDate = new Date(endDate)
      startDate.setFullYear(endDate.getFullYear() - 3)

      const totalDuration = endDate - startDate
      const remainingTime = endDate - currentDate
      return Math.max(0, Math.min(100, (remainingTime / totalDuration) * 100))
    }

    onMounted(async () => {
      try {
        const profileData = store.profileData

        if (profileData?.registration_status?.sdsExpirationDate) {
          sdsExpirationDate.value = formatDate(
            profileData.registration_status.sdsExpirationDate
          )
          const progress = calculateSubscriptionProgress(
            profileData.registration_status.sdsExpirationDate
          )
          subscriptionProgress.value = progress

          animateProgress(0, progress, 800, (currentProgress) => {
            subscriptionProgress.value = currentProgress
          })
        }

        if (profileData?.first_name) {
          userName.value = profileData.first_name
        }

        if (profileData?.registration_status?.overallCompletionPercentage) {
          targetPercentage.value =
            profileData.registration_status.overallCompletionPercentage

          animateProgress(0, targetPercentage.value, 800, (currentProgress) => {
            percentage.value = currentProgress
          })
        }
      } catch (err) {
        console.error('Error fetching profile data:', err)
      }
    })

    return {
      circumference,
      completionProgressOffset,
      percentage,
      sdsExpirationDate,
      userName,
      subscriptionProgressOffset
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: 16px;
  align-items: start;

  .grid-main {
    display: grid;
    grid-template-columns: 0.6fr 0.4fr;
    grid-template-rows: auto auto;
    grid-gap: 16px;
    grid-column: 1 / 3;
    align-items: stretch;
  }

  .card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow:
      0px 8px 46px -18px #00000059,
      0px 36px 61px -54px #32325d1f;

    &--progress {
      padding: 24px;

      &-body {
        display: flex;
        justify-content: space-between;
        column-gap: 24px;
        padding: 16px 26px 0;
      }

      &-valid {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        flex: 1 1 auto;

        .card--button {
          margin-left: auto;
        }

        .title {
          color: #616165;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
          letter-spacing: 0.2px;
          text-transform: uppercase;
        }

        .expiration-date {
          color: #2f2f31;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.2px;
          padding-top: 4px;
        }
      }
    }

    &__title {
      color: #1d1d1f;
      font-weight: 700;
      font-size: 18px;
      line-height: 1.4;
      letter-spacing: 0.2px;
    }

    &--button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 26px;
      color: #0066df;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.2px;
      background-color: #fff;
      border: 2px solid #0066df;
      border-radius: 99px;
      padding: 4px 8px;
      margin-top: auto;
      cursor: pointer;
    }
  }

  .card--progress[data-type='agreement'] {
    grid-column: 1 / 2;
    grid-row: 1;
    min-height: 100px;
  }
  .card--progress[data-type='completion'] {
    grid-column: 2 / 3;
    grid-row: 1;
    min-height: 100px;
  }
  .card--registered {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
  }
  .card--tracking-order {
    grid-column: 2 / 3;
    grid-row: 1;
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }
  .card--support {
    grid-column: 2 / 3;
    grid-row: 2;
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }
  .card--training-behavior {
    grid-column: 1 / 3;
  }
  .card--public-access {
    grid-column: 1 / 3;
  }

  .progress-circle-container {
    position: relative;
    width: 120px;
    height: 120px;

    &.account-color {
      .inner {
        background-color: #00cccc;
      }

      .circle-progress {
        stroke: #00cccc;
      }
    }

    .outer {
      position: relative;
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }

    .inner {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 68px;
      height: 68px;
      background-color: #0db2fa;
      box-shadow: 1.71px 3.43px 10.29px 0px #00000014;
      border-radius: 50%;
      color: #2f2f31;

      .value {
        font-weight: 700;
        font-size: 20px;
      }
    }

    .circle-background {
      fill: none;
      stroke: #f6f9fc;
    }

    .circle-progress {
      fill: none;
      stroke: #0db2fa;
      stroke-linecap: round;
      transform-origin: center;
      transform: rotate(-90deg);
      transition: stroke-dashoffset 0.5s ease-out;
    }
  }
}
</style>
