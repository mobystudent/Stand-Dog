<template>
  <header class="header">
    <div class="wrapper">
      <div class="wrapper__container">
        <router-link to="/" class="header__logo" aria-label="Home">
          <img
            src="../assets/logo.svg"
            alt="Service Dog Standards logo"
            aria-label="Service Dog Standards logo"
          />
        </router-link>

        <nav class="menu" role="navigation" aria-label="Main navigation">
          <router-link
            v-for="(link, index) in navLinks"
            :key="index"
            :to="link.to"
            class="menu__item"
          >
            <span class="menu__title"> {{ link.text }}</span>
          </router-link>
        </nav>

        <div class="navigation">
          <!--          <router-link to="/cart" class="cart-link" aria-label="Shopping cart">-->
          <router-link to="#" class="cart-link" aria-label="Shopping cart">
            <img
              src="/static/icons/basket.svg"
              alt="cart"
              aria-hidden="true"
              class="cart-icon"
            />
            <span class="cart-badge">{{ cartCount }}</span>
          </router-link>

          <div
            v-if="store.isAuthenticated"
            class="navigation-menu"
            ref="dropdownRef"
          >
            <div
              class="user-trigger"
              @click="toggleMenu"
              role="button"
              tabindex="0"
              aria-label="User menu"
              :aria-expanded="isDropdownMenuOpen.toString()"
              aria-haspopup="true"
              aria-controls="user-menu-dropdown"
              @keydown.enter="toggleMenu"
              @keydown.space.prevent="toggleMenu"
            >
              <img src="/static/icons/avatar-icon.svg" alt="user avatar" />
            </div>

            <transition name="fade-slide">
              <div
                v-if="isDropdownMenuOpen"
                id="user-menu-dropdown"
                class="dropdown-menu"
                role="menu"
              >
                <div
                  v-if="store.userEmail"
                  class="dropdown-menu__item email-item"
                >
                  <p class="item-label">Email:</p>
                  <p class="item-value">{{ store.userEmail }}</p>
                </div>
                <button
                  @click="logout"
                  class="logout-btn dropdown-menu__item"
                  role="button"
                  tabindex="0"
                  aria-label="Log out"
                >
                  <img
                    src="/static/icons/log-out.svg"
                    alt="log-out icon"
                    aria-hidden="true"
                  />
                  Log out
                </button>
              </div>
            </transition>
          </div>

          <div v-else class="auth-links">
            <router-link
              to="/signup"
              @click="isDropdownMenuOpen = false"
              class="auth-link"
            >
              Sign Up
            </router-link>
            <router-link
              to="/sign-in"
              @click="isDropdownMenuOpen = false"
              class="auth-link"
            >
              Sign In
            </router-link>
          </div>

          <button
            class="burger"
            :class="{ active: isMenuOpen }"
            @click="isMenuOpen = !isMenuOpen"
            role="button"
            tabindex="0"
            aria-label="Toggle main menu"
            :aria-expanded="isMenuOpen.toString()"
            aria-controls="mobile-navigation"
            @keydown.enter="isMenuOpen = !isMenuOpen"
            @keydown.space.prevent="isMenuOpen = !isMenuOpen"
          >
            <span />
          </button>
        </div>
      </div>
      <transition name="slide">
        <nav
          v-if="isMenuOpen"
          class="mobile-slide-menu"
          role="navigation"
          aria-label="Mobile navigation"
          id="mobile-navigation"
        >
          <span class="mobile-menu__title">Menu</span>
          <router-link
            v-for="(link, index) in navLinks"
            :key="index"
            :to="link.to"
            class="mobile-menu__item"
            @click="isMenuOpen = false"
          >
            {{ link.text }}
          </router-link>
        </nav>
      </transition>

      <transition name="fade">
        <div v-if="isMenuOpen" class="overlay" @click="isMenuOpen = false" />
      </transition>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useUserStore } from '../store/userStore.js'
import { userLogout } from '../api/registration'
import { useRouter } from 'vue-router'

export default {
  name: 'GlobalHeader',
  setup() {
    const store = useUserStore()
    const router = useRouter()
    const dropdownRef = ref(null)
    const isDropdownMenuOpen = ref(false)
    const isMenuOpen = ref(false)
    const cartCount = ref(0)
    const navLinks = [
      { to: '/learn', text: 'Learn More' },
      { to: '/findTrainers', text: 'Find Trainer' },
      { to: '/store', text: 'Shop & Support' },
      { to: '/accountHome', text: 'Membership Center' }
    ]

    watch(isMenuOpen, (newVal) => {
      document.body.style.overflow = newVal ? 'hidden' : ''
    })

    const userEmail = computed(() => store.userEmail)

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownMenuOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const logout = async () => {
      try {
        const response = await userLogout()
        if (response?.status === 200) {
          await router.push('/sign-in')
          // await router.push('/')
          toggleMenu()
        }
      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        store.resetStore()
      }
    }

    const toggleMenu = () => {
      isDropdownMenuOpen.value = !isDropdownMenuOpen.value
    }

    return {
      isMenuOpen,
      dropdownRef,
      isDropdownMenuOpen,
      toggleMenu,
      cartCount,
      navLinks,
      userEmail,
      store,
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 1260px;
  padding: 0 30px;
  margin: 0 auto;

  &__container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    column-gap: 20px;
  }
}

.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-width: 320px;
  background: transparent;
  padding: 19px 0;
  z-index: 110;

  &__logo {
    display: flex;
    max-width: 108px;
    max-height: 62px;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
}

.menu {
  display: flex;
  align-items: center;
  padding: 5px 0;
  margin-right: auto;

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-radius: 999px;
    padding: 10px 15px;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: rgba(29, 29, 29, 0.08);
    }
  }

  &__title {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }
}

.navigation {
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 5px 0;
}

.navigation-menu {
  position: relative;
  display: flex;
  cursor: pointer;

  .user-trigger {
    display: flex;
    align-items: center;
    border-radius: 99px;
    background-color: #004eac;
    padding: 6px 8px;
  }
}

.cart-link {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .cart-badge {
    position: absolute;
    top: 4px;
    left: calc(50% + 2px);
    transform: translateX(-50%);
    font-size: 14px;
    font-weight: 700;
    color: #0066cc;
    line-height: 12px;
  }
}

.auth-links {
  display: flex;
  align-items: center;

  .auth-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: #1d1d1f;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.2;
    letter-spacing: -0.2px;
    border-radius: 999px;
    padding: 10px 15px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(29, 29, 29, 0.08);
    }
  }
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: absolute;
  top: 40px;
  right: 0;
  border-radius: 4px;
  background-color: #fff;
  box-shadow:
    0px 3px 6px 0px #32325d1f,
    0px 7px 14px 0px #32325d14;
  width: 250px;
  padding: 16px 0;
  cursor: initial;
  z-index: 1000;

  &__item {
    color: #1d1d1f;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: -0.2px;
    padding: 8px 16px;
    transition: background-color 0.25s ease-in-out;

    &:not(.email-item):hover {
      background-color: rgba(29, 29, 29, 0.08);
    }

    &.email-item {
      padding: 0 16px;
    }

    &.logout-btn {
      display: flex;
      align-items: center;
      column-gap: 8px;
      font-weight: 500;
      background-color: #fff;
      cursor: pointer;

      &:hover {
        background-color: rgba(29, 29, 29, 0.08);
      }
    }
  }

  .item-label {
    font-weight: 600;
    padding-bottom: 4px;
  }

  .item-value {
    font-weight: 400;
  }
}

.fade-slide {
  &-enter-active,
  &-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
}

.burger,
.mobile-slide-menu {
  display: none;
}

:focus,
:focus-visible {
  border-radius: 999px !important;
}

@media (max-width: 992px) {
  .menu {
    display: none;
  }

  .burger {
    display: inline-flex;
    position: relative;
    width: 40px;
    height: 40px;
    align-items: center;
    background: none;
    cursor: pointer;
    z-index: 1001;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      transition: transform 0.25s ease-in-out;
    }

    &::before {
      top: 13px;
    }

    &::after {
      bottom: 13px;
    }

    span,
    &::before,
    &::after {
      height: 2px;
      width: 18px;
      background: #616165;
      margin: 0 auto;
    }

    &.active {
      span {
        opacity: 0;
      }

      &::before {
        transform: translateX(-50%) rotate(45deg);
        top: 19px;
      }

      &::after {
        transform: translateX(-50%) rotate(-45deg);
        bottom: 19px;
      }
    }

    &.hide {
      display: none;
    }
  }

  .mobile-slide-menu {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    position: fixed;
    top: 0;
    right: 0;
    width: 230px;
    height: 100vh;
    background-color: #ffffff;
    padding: 35px 0;
    z-index: 1000;
  }

  .mobile-menu__title {
    color: #1d1d1f;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.2px;
    padding: 12px 16px;
  }

  .mobile-menu__item {
    color: #1d1d1f;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.2px;
    padding: 12px 16px;
  }

  .slide {
    &-enter-active,
    &-leave-active {
      transition: transform 0.3s ease;
    }

    &-enter-from,
    &-leave-to {
      transform: translateX(100%);
    }

    &-enter-to,
    &-leave-from {
      transform: translateX(0);
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: #0000004d;
    z-index: 900;
  }

  .fade {
    &-enter-active,
    &-leave-active {
      transition: opacity 0.3s ease;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }

    &-enter-to,
    &-leave-from {
      opacity: 1;
    }
  }
}

@media (max-width: 768px) {
  .wrapper {
    padding: 0 16px;

    &__container {
      align-items: center;
      column-gap: 10px;
    }
  }

  .header {
    &__logo {
      max-width: 54px;
      max-height: 32px;
    }
  }

  .mobile-slide-menu {
    padding: 17px 0;
  }

  .navigation {
    column-gap: 10px;
    padding: 0;
  }
}

@media (max-width: 370px) {
  .cart-link {
    width: 30px;
    height: 30px;
  }

  .auth-links .auth-link {
    padding: 10px 5px;
  }
}
</style>
