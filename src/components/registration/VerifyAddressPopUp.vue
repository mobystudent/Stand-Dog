<template>
  <transition name="modal" appear>
    <div class="popup-wrapper">
      <div class="popup-container">
        <h2 class="title">Please verify your address</h2>
        <div class="container-box">
          <div class="box">
            <h3 class="box-title">
              Entered address
              <button class="edit-btn" @click="$emit('edit-address')">
                <img src="/static/icons/edit.svg" />
              </button>
            </h3>
            <p>{{ formattedEnteredAddress }}</p>
            <BaseButton
              class="custom-btn"
              @click="$emit('verify-address', enteredAddress)"
            >
              Use entered
            </BaseButton>
          </div>
          <div class="box">
            <h3 class="box-title">Suggested address</h3>
            <p>{{ formattedSuggestedAddress }}</p>
            <BaseButton
              class="custom-btn"
              @click="$emit('verify-address', suggestedAddress)"
            >
              Use suggested
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import Spinner from '../base/Spinner.vue'
export default {
  name: 'VerifyAddressPopUp',
  components: { BaseButton, Spinner },
  emits: ['verify-address', 'edit-address'],
  props: {
    enteredAddress: { type: Object, required: true },
    suggestedAddress: { type: Object, required: true }
  },
  setup(props) {
    const formattedAddress = (address) => {
      const { street1, street2, city, state, zip } = address
      const capitalize = (str) =>
        str
          .split(' ')
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ')

      return `${capitalize(street1)} ${street2 ? capitalize(street2) + ', ' : ''}${capitalize(city)}, ${state} ${zip}`
    }

    const formattedEnteredAddress = computed(() =>
      formattedAddress(props.enteredAddress)
    )
    const formattedSuggestedAddress = computed(() =>
      formattedAddress(props.suggestedAddress)
    )

    return {
      formattedEnteredAddress,
      formattedSuggestedAddress
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(193, 201, 210, 0.7);
  z-index: 9998;
  transition: opacity 0.3s ease;
}

.popup-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 680px;
  background-color: #ffffff;
  box-shadow: 0px 12px 40px 2px rgba(21, 27, 37, 0.3);
  border-radius: 6px;
  transition: all 0.3s ease;

  .title {
    width: 100%;
    color: #1d1d1f;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.2px;
    padding: 56px 56px 24px;
  }
}

.container-box {
  display: flex;
  align-items: stretch;
  gap: 32px;
  padding: 16px 56px 56px;

  .box {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    border-radius: 4px;
    border: 1px solid #d2d2d7;
    padding: 24px;

    &-title {
      display: flex;
      justify-content: space-between;
      color: #2f2f31;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0.2px;
      padding-bottom: 8px;
    }

    .edit-btn {
      width: 24px;
      height: 24px;
      background-color: transparent;
      cursor: pointer;
    }

    p {
      color: #1d1d1f;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      letter-spacing: 0.2px;
      padding-bottom: 32px;
    }

    .custom-btn {
      margin-top: auto;
    }
  }
}

@media (max-width: 768px) {
  .popup-container {
    max-width: 680px;
    width: calc(100% - 32px);
  }

  .container-box {
    flex-direction: column;
  }
}
</style>
