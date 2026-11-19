<template>
  <div class="order-tracking">
    <h2>Order Tracking</h2>
    <p>You’re order has shipped. Click the link below to track your order.</p>

    <!--    <div class="order-card">-->
    <!--      <div class="order-card__body">-->
    <!--        <p class="order-date">{{ formattedDate }}</p>-->

    <!--        <p class="product-name">-->
    <!--          {{ order.productName }}({{ order.price }} x {{ order.quantity }})-->
    <!--        </p>-->

    <!--        <a :href="order.trackingLink" class="tracking-number">-->
    <!--          {{ order.trackingNumber }}-->
    <!--        </a>-->

    <!--        <div class="progress">-->
    <!--          <div v-for="(step, index) in steps" :key="index" class="step">-->
    <!--            <div class="circle" :class="{ active: index <= currentStep }">-->
    <!--              <img src="/static/icons/check-2.svg" alt="check" />-->
    <!--            </div>-->
    <!--            <span :class="{ activeText: index <= currentStep }">-->
    <!--              {{ step }}-->
    <!--            </span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div class="order-total">-->
    <!--        <p>Order Total:</p>-->
    <!--        <p class="total-price">{{ order.total }}</p>-->
    <!--      </div>-->
    <!--    </div>-->

    <a :href="order.trackingLink" class="track-package" target="_blank">
      Track Package
      <img src="/static/icons/track.svg" alt="track icon" class="track-icon" />
    </a>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const order = ref({
  date: '2023-07-25T10:58:00',
  productName: 'Service Dog Standards Kit',
  price: '$75.00',
  quantity: 1,
  trackingNumber: 'SDS-1242489',
  trackingLink: '#',
  total: '$83.20',
  status: 'Shipped'
})

const steps = ref(['Ordered', 'Shipped', 'Out for delivery', 'Delivered'])

const currentStep = computed(() => steps.value.indexOf(order.value.status))

const formattedDate = computed(() => {
  const date = new Date(order.value.date)
  return (
    date.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) +
    ' CDT'
  )
})
</script>

<style lang="scss" scoped>
.order-tracking {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  //max-width: 400px;

  h2 {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }

  p {
    color: #616165;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -0.2px;
  }
}

.order-card {
  border: 1px solid #a4a4a9;
  border-radius: 8px;
  margin-top: 8px;

  &__body {
    padding: 16px;
  }

  .order-date {
    color: #616165;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: -0.2px;
  }

  .product-name {
    color: #1d1d1f;
    font-weight: 500;
    font-size: 17px;
    line-height: 1.4;
    letter-spacing: -0.12px;
  }

  .tracking-number {
    color: #0066cc;
    font-weight: 500;
    font-size: 17px;
    line-height: 1.4;
    text-decoration: underline;
  }
}

.progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 10px;
    width: calc(100% - 20px);
    height: 4px;
    border-radius: 100px;
    background-color: #a1cbff;
    z-index: 0;
  }
}

.step {
  text-align: center;
  position: relative;
  margin-top: -8px;
  z-index: 1;

  span {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    color: #616165;
    margin-top: 8px;

    &.activeText {
      color: #2f2f31;
    }
  }
}

.circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #0066df;
}

.order-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f9fc;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 16px;

  p {
    color: #1d1d1f;
    font-size: 14px;
    font-weight: 500;
  }

  .total-price {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.22px;
  }
}

.track-package {
  display: flex;
  align-items: center;
  column-gap: 4px;
  color: #0066df;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  margin-top: auto;
  padding-top: 16px;
}

.track-package span {
  font-size: 16px;
}
</style>
