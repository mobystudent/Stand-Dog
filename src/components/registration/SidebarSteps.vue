<template>
  <aside class="sidebar">
    <h1>Create your account</h1>
    <ul v-if="!isMobile" class="sidebar__steps">
      <li
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'sidebar__step',
          {
            'sidebar__step--active': index === store.registrationStep,
            'sidebar__step--completed': index < store.registrationStep
          }
        ]"
      >
        <span class="sidebar__number">{{ index + 1 }}</span>
        <span class="sidebar__text">{{ step }}</span>
      </li>
    </ul>

    <div v-else class="sidebar__mobile">
      <template v-if="store.registrationStep < 3">
        <div class="sidebar__mobile-content">
          <span class="sidebar__number">{{ store.registrationStep + 1 }}</span>
          <div class="sidebar__mobile-info">
            <span class="sidebar__progress"
              >Step {{ store.registrationStep + 1 }} / {{ steps.length }}</span
            >
            <span class="sidebar__text">{{
              steps[store.registrationStep]
            }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </template>

      <template v-else-if="subStep !== 6">
        <span class="sidebar-title">Basic Information</span>
      </template>
    </div>
  </aside>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../../store/userStore.js'

export default {
  name: 'SidebarSteps',
  props: {
    subStep: {
      type: Number,
      default: 1
    }
  },
  emits: ['prev-step'],

  setup(_, { emit }) {
    const store = useUserStore()
    const isMobile = ref(window.innerWidth <= 768)
    const steps = [
      'Account Type',
      'Email Verification',
      'Terms & Conditions',
      'Basic Information'
    ]

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    const progress = computed(
      () => ((store.registrationStep + 1) / steps.length) * 100
    )

    return {
      steps,
      store,
      progress,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  flex: 1 1 auto;

  h1 {
    color: #054896;
    font-weight: 700;
    font-size: 38px;
    letter-spacing: -0.2px;
    padding-bottom: 32px;
  }

  &__text {
    color: #616165;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    transition: color 0.25s ease-in-out;
  }

  &__number {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #616165;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
    margin-right: 8px;
    transition:
      background-color 0.25s ease-in-out,
      color 0.25s ease-in-out;
  }
}

.sidebar__step {
  display: flex;
  align-items: center;
  color: #616165;
  padding: 10px 0;
  transition: color 0.25s ease-in-out;

  &--active {
    .sidebar__text {
      color: #054896;
    }

    .sidebar__number {
      background-color: #0066df;
      color: #ffffff;
    }
  }

  &--completed {
    .sidebar__number {
      position: relative;
      color: transparent;
      background-color: #ffffff;
      border: 2px solid #0066df;
      transition: border 0.25s ease-in-out;

      &::before {
        content: '';
        position: absolute;
        width: 17px;
        height: 12px;
        background: url('/static/icons/completed.svg') center/cover no-repeat;
      }
    }
  }
}

.progress-bar {
  display: none;
  width: 100%;
  height: 4px;
  background-color: #a1cbff;
  border-radius: 100px;
  margin-top: 16px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: #0066df;
  border-radius: 100px;
  transition: width 0.3s ease-in-out;
}

@media (max-width: 768px) {
  .progress-bar {
    display: block;
  }

  .sidebar {
    width: 100%;
    padding: 0;

    h1 {
      color: #1d1d1f;
      font-size: 18px;
      letter-spacing: 0.2px;
      padding-bottom: 24px;
    }
  }

  .sidebar__steps {
    flex-direction: row;
    justify-content: space-between;
  }

  .sidebar__mobile {
    &-content {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }

    &-info {
      display: flex;
      flex-direction: column;
    }

    .sidebar__number {
      background-color: #0066df;
      color: #ffffff;
    }

    .sidebar__text {
      color: #2f2f31;
      font-size: 18px;
      font-weight: 700;
    }

    .sidebar__progress {
      color: #616165;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .sidebar-title {
      color: #2f2f31;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.6;
      letter-spacing: 0.2px;
    }
  }
}
</style>
