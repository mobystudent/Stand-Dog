<template>
  <div class="accordion">
    <div class="accordion-header" @click="toggleAccordion">
      <span>{{ category }}</span>
      <img
        class="accordion-arrow"
        :class="{ open: isOpen }"
        src="/static/icons/arrow-top-bottom.svg"
        alt="arrow icon"
      />
    </div>

    <div v-show="isOpen" class="accordion-content">
      <div
        v-for="condition in conditions"
        :key="condition.id"
        :class="['condition-card', { selected: isSelected(condition.id) }]"
      >
        <BaseCheckbox
          :model-value="isSelected(condition.id)"
          :label="condition.name"
          @change="() => toggleCondition(condition.id)"
        />
        <p class="text-description">{{ condition.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import BaseCheckbox from '../base/BaseCheckbox.vue'

export default {
  name: 'ConditionAccordion',
  components: { BaseCheckbox },
  props: {
    category: { type: String, required: true },
    conditions: { type: Array, required: true }
  },

  setup() {
    const isOpen = ref(false)
    const selectedConditions = ref([])

    const toggleAccordion = () => {
      isOpen.value = !isOpen.value
    }

    const toggleCondition = async (conditionId) => {
      console.log(
        'ConditionAccordion: toggleCondition: conditionId',
        conditionId
      )
      const isSelected = selectedConditions.value.includes(conditionId)
      console.log('ConditionAccordion: toggleCondition: isSelected', isSelected)
      try {
        if (isSelected) {
          selectedConditions.value = selectedConditions.value.filter(
            (id) => id !== conditionId
          )
        } else {
          selectedConditions.value.push(conditionId)
        }

        console.log(
          'ConditionAccordion: toggleCondition: selectedConditions: ',
          selectedConditions.value
        )
      } catch (error) {
        console.error(error)
      }
    }

    const isSelected = (conditionId) => {
      return selectedConditions.value.includes(conditionId)
    }

    return {
      toggleCondition,
      toggleAccordion,
      isOpen,
      isSelected,
      selectedConditions
    }
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  border: 1px solid #a4a4a9;
  border-radius: 12px;
  margin-bottom: 16px;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px 24px;
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
  padding: 12px 24px 24px;
}

.condition-card {
  background-color: #f5f5f7;
  border-radius: 12px;
  color: #1d1d1f;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.2px;
  padding: 16px 24px;
  transition: background-color 0.3s;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &:hover {
    background-color: #dbebff;
  }

  &.selected {
    background-color: #dbebff;
  }
}

.text-description {
  font-weight: 500;
  margin-top: 8px;
}
</style>

<style lang="scss">
.condition-card {
  .base-checkbox {
    padding: 10px 0;

    .checkbox-label {
      font-weight: 700;
    }
  }
}
</style>
