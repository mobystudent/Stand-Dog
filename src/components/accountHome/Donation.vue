<template>
  <div class="donation-container">
    <img src="/static/icons/heart.svg" alt="heart icon" />
    <div class="grid-container">
      <button
        v-for="amount in presetAmounts"
        :key="amount"
        :class="{ selected: selectedAmount === amount }"
        @click="selectAmount(amount)"
      >
        ${{ amount }}
      </button>
      <div class="custom-amount">
        <span>$</span>
        <input
          type="number"
          v-model.number="customAmount"
          @input="handleCustomInput"
          placeholder="0"
        />
      </div>
    </div>
    <h2>Please Help Support Voluntary Service Dog Standards</h2>
    <p>
      Help us improve and provide more free tools for Service Dog Standards for
      trainers and handlers.
    </p>
    <button
      type="button"
      class="contribute-btn"
      :disabled="!isValid"
      @click="contribute"
    >
      Contribute
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Donation',
  setup() {
    const presetAmounts = ref([5, 10, 15, 25, 50, 100, 250])
    const selectedAmount = ref(null)
    const customAmount = ref(null)

    const selectAmount = (amount) => {
      selectedAmount.value = amount
      customAmount.value = null
    }

    const handleCustomInput = () => {
      selectedAmount.value = null
    }

    const isValid = computed(
      () =>
        selectedAmount.value || (customAmount.value && customAmount.value > 0)
    )

    const contribute = () => {
      const amount = selectedAmount.value || customAmount.value
      console.log(amount)
    }

    return {
      presetAmounts,
      selectedAmount,
      selectAmount,
      customAmount,
      handleCustomInput,
      isValid,
      contribute
    }
  }
}
</script>

<style lang="scss" scoped>
.donation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;

  img {
    width: 56px;
    height: 56px;
    padding-bottom: 8px;
    margin: 0 auto;
  }

  h2 {
    color: #2f2f31;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
    letter-spacing: 0.2px;
    text-align: center;
  }

  p {
    color: #616165;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -0.2px;
    text-align: center;
  }
}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
}

button {
  width: 100%;
  color: #2f2f31;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background-color: #d2d2d7;
  text-align: center;
  padding: 8px;
  cursor: pointer;
  transition: 0.2s;

  &.selected {
    background-color: #007bff;
    color: #fff;
  }
}

.custom-amount {
  display: flex;
  align-items: center;
  column-gap: 4px;
  background-color: #d2d2d7;
  padding: 4px 4px 4px 16px;
  border-radius: 8px;
  color: #2f2f31;
  font-size: 16px;
  font-weight: 600;
  grid-column: span 2;
}

.custom-amount input {
  width: 100%;
  height: 100%;
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #a4a4a9;
  flex-grow: 1;
  padding: 4px 8px;
  outline: none;

  &::placeholder {
    color: #1d1d1f;
    font-size: 16px;
    font-weight: 600;
  }
}

.contribute-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
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
  transition: 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
