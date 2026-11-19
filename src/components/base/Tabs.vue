<template>
  <div class="tabs-container">
    <div class="tabs">
      <button
        v-for="(tab, index) in labels"
        :key="index"
        class="tab"
        :class="{ active: index === selected }"
        @click="updateRegistrationType(index)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <component
        :is="tabsComponents[selected]"
        @continue="$emit('continue')"
        @update:is-my-self-form-visible="
          $emit('update:isMySelfFormVisible', true)
        "
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Tabs',
  emits: ['continue', 'update:isMySelfFormVisible'],
  props: {
    labels: { type: Array, required: true },
    tabsComponents: { type: Array, required: true }
  },

  setup() {
    const selected = ref(0)

    const updateRegistrationType = (index) => {
      selected.value = index
    }

    return {
      selected,
      updateRegistrationType
    }
  }
}
</script>

<style scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  border-radius: 25px;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 8px 20px;
  border: none;
  background-color: #d7e9ff;
  color: #0066cc;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab.active {
  background: #0066df;
  color: #ffffff;
}

@media (max-width: 768px) {
  .tab {
    padding: 8px 15px;
  }
}
</style>
