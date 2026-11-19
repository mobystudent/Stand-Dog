<template>
  <div class="accordion">
    <div class="accordion-header" @click="toggle">
      <span>Disability Information</span>
      <img
        class="accordion-arrow"
        :class="{ open: isOpen }"
        src="/static/icons/arrow-top-bottom.svg"
        alt="arrow icon"
      />
    </div>

    <transition name="accordion">
      <div v-show="isOpen" class="accordion-content"></div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DisabilityInfo',
  setup() {
    const isOpen = ref(false)

    const toggle = () => {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen,
      toggle
    }
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  padding: 0 8px;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  cursor: pointer;

  span {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }
}

.accordion-arrow {
  transform: rotate(180deg);
  transition: transform 0.3s ease;

  &.open {
    transform: rotate(0deg);
  }
}

.accordion-content {
  padding: 16px 0 24px;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease-in-out;
}

.accordion-enter,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
