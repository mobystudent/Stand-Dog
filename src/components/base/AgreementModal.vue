<template>
  <Transition name="fade-scale">
    <div class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ modalTitle }}</h2>
          <button
            class="modal-close"
            aria-label="Close"
            @click="$emit('cancel')"
          >
            <img src="/static/icons/close-icon.svg" alt="Close" />
          </button>
        </div>

        <ProgressBar :step="currentPageIndex + 1" :total-steps="pages.length" />

        <img
          src="/static/icons/sds-logo.svg"
          alt="Agreement Logo"
          class="modal-logo"
        />

        <div
          class="modal-body"
          :class="{ 'has-scroll': hasScroll }"
          ref="modalTextRef"
        >
          <h3 class="page-title">{{ currentPage.title }}</h3>
          <div class="modal-text" v-html="currentPage.description" />
        </div>

        <p v-if="isLastPage" class="agreement-note">
          By continuing you agree to the Service Dog Standards Trainer Oath
        </p>

        <div class="modal-actions">
          <BaseButton @click="nextPage">Continue</BaseButton>
          <BaseButton @click="$emit('cancel')" button-class="go-back"
            >I’m not ready, exit agreement</BaseButton
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import ProgressBar from './ProgressBar.vue'

export default {
  name: 'AgreementModal',
  components: { BaseButton, ProgressBar },
  props: {
    modalTitle: {
      type: String,
      required: true
    },
    pages: {
      type: Array,
      required: true
    }
  },
  emits: ['confirm', 'cancel'],

  setup(props, { emit }) {
    const currentPageIndex = ref(0)
    const modalTextRef = ref(null)
    const hasScroll = ref(false)

    watch(
      () => props.pages,
      () => {
        currentPageIndex.value = 0
      },
      { immediate: true }
    )

    const checkScroll = () => {
      nextTick(() => {
        const el = modalTextRef.value
        hasScroll.value = el && el.scrollHeight > el.clientHeight
      })
    }

    onMounted(() => {
      checkScroll()
    })

    const currentPage = computed(
      () => props.pages[currentPageIndex.value] || {}
    )
    const isLastPage = computed(
      () => currentPageIndex.value === props.pages.length - 1
    )

    const nextPage = async () => {
      if (!isLastPage.value) {
        currentPageIndex.value++
        scrollToTop()
        checkScroll()
      } else {
        emit('confirm')
      }
    }

    const scrollToTop = () => {
      const modal = document.querySelector('.modal-content')
      if (modal) {
        modal.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    return {
      currentPage,
      currentPageIndex,
      isLastPage,
      nextPage,
      modalTextRef,
      hasScroll
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f8f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 24px;
}

.modal-content {
  width: calc(100% - 32px);
  max-width: 800px;
  max-height: calc(100vh - 48px);
  background-color: #ffffff;
  box-shadow: 0px 12px 40px 2px #151b254d;
  border-radius: 12px;
  padding: 56px;
  overflow: hidden;
}

.modal-body {
  max-height: calc(100vh - 468px);
  margin-top: 56px;
  margin-bottom: 56px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 6px;
  }

  &.has-scroll {
    padding-right: 8px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 5px;
  margin-bottom: 24px;
}

.modal-close {
  width: 40px;
  height: 40px;
  background-color: #fff;
  cursor: pointer;
}

.modal-title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: 0.2px;
}

.modal-logo {
  height: auto;
  width: 100%;
  max-width: 300px;
  object-fit: cover;
  margin-top: -6px;
}

.page-title {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 26px;
  line-height: 36px;
  letter-spacing: 0.2px;
  margin-bottom: 24px;
}

.modal-text {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 16px;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.2px;
}

.agreement-note {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 16px;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 992px) {
  .modal-actions .go-back {
    width: 100%;
    padding: 5px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 32px;
  }

  .modal-close {
    top: 32px;
    right: 32px;
  }

  .modal-body {
    max-height: calc(100vh - 536px);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>

<style lang="scss">
.modal-text {
  p:not(:first-child) {
    padding-top: 10px;
  }
  ul {
    padding-top: 10px;
    padding-left: 20px;

    li {
      &:not(:last-child) {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
