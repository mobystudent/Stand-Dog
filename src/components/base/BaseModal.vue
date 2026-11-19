<template>
  <Transition name="fade-scale">
    <div
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      @click.self="emitCancel"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button
            class="modal-close"
            aria-label="Close"
            @click="$emit('cancel')"
          >
            <img src="/static/icons/close-icon.svg" alt="Close" />
          </button>
        </div>
        <div class="modal-body">
          <slot name="body">
            <p>{{ body }}</p>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              @click="$emit('confirm')"
              :class="['modal-button', confirmType]"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { onBeforeUnmount, onMounted, watch, toRef } from 'vue'

export default {
  name: 'BaseModal',
  props: {
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    confirmText: { type: String, default: 'OK' },
    confirmType: { type: String, default: 'primary' },
    modelValue: { type: Boolean, default: false },
    escClosable: { type: Boolean, default: true }
  },
  emits: ['cancel', 'confirm', 'update:modelValue'],
  setup(props, { emit }) {
    const visible = toRef(props, 'modelValue')

    const emitCancel = () => {
      emit('update:modelValue', false)
      emit('cancel')
    }

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && props.escClosable) {
        emitCancel()
      }
    }

    const activateModal = () => {
      document.body.classList.add('overflow-hidden')
      window.addEventListener('keydown', handleKeydown)
    }

    const deactivateModal = () => {
      document.body.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', handleKeydown)
    }

    watch(visible, (newVal) => {
      if (newVal) {
        activateModal()
      } else {
        deactivateModal()
      }
    })

    onMounted(() => {
      if (visible.value) {
        activateModal()
      }
    })

    onBeforeUnmount(() => {
      deactivateModal()
    })

    return {
      emitCancel
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #ffffff;
  box-shadow: 0px 12px 40px 2px #151b254d;
  border-radius: 6px;
  width: calc(100% - 32px);
  max-width: 480px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 5px;
  padding: 32px;
}

.modal-title {
  color: #1d1d1f;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
}

.modal-close {
  width: 40px;
  height: 40px;
  background-color: #fff;
  cursor: pointer;
}

.modal-body {
  border-top: 1px solid #d2d2d7;
  border-bottom: 1px solid #d2d2d7;
  padding: 32px;

  p {
    color: #2f2f31;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
}

.modal-footer {
  padding: 24px 32px;
  display: flex;
}

.modal-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.2px;
  border-radius: 6px;
  margin-left: auto;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &.primary {
    background-color: #0066df;
    padding: 10px 16px;
  }

  &.danger {
    background-color: #e22718;
    padding: 8px 16px;
  }
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
</style>
