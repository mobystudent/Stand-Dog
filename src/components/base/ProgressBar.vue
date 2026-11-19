<template>
  <div class="progress-bar-wrapper">
    <div class="progress-bar-background">
      <div
        class="progress-bar-fill"
        :style="{ width: progressPercentage + '%' }"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ProgressBar',
  props: {
    step: { type: Number, required: true },
    totalSteps: { type: Number, default: 5 }
  },
  setup(props) {
    const progressPercentage = computed(() => {
      return ((props.step - 1) / (props.totalSteps - 1)) * 100
    })
    return { progressPercentage }
  }
}
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
  margin-bottom: 16px;
}

.progress-bar-background {
  height: 4px;
  background-color: #a1cbff;
  border-radius: 100px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 4px;
  background-color: #0066df;
  border-radius: 100px;
  transition: width 0.3s ease;
}
</style>
