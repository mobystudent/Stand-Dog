<template>
  <nav class="sidebar">
    <div class="menu-bar">
      <ul class="menu-links">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="nav-link"
          :class="{ active: route.path === item.link }"
          @click="handleClick(item)"
        >
          <router-link :to="item.link">
            <component class="icon" :is="getIconComponent(item.img)" />
            <span class="link-text">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import HomeIcon from '../assets/icons/sidebar/home.svg?component'
import ProfileIcon from '../assets/icons/sidebar/profile.svg?component'
import DogIcon from '../assets/icons/sidebar/dog.svg?component'
import OrdersIcon from '../assets/icons/sidebar/orders.svg?component'

export default {
  name: 'Sidebar',
  setup() {
    const route = useRoute()
    const menuItems = ref([
      { title: 'Account Home', img: 'home', link: '/accountHome' },
      { title: 'My Profile', img: 'profile', link: '/myProfile' },
      { title: 'Add a Team', img: 'dog', link: '/addTeam' },
      { title: 'Manage Teams (Teams)', img: 'dog', link: '/teams' },
      { title: 'Manage Dogs (Handler)', img: 'dog', link: '/handler' },
      { title: 'Orders History', img: 'orders', link: '/ordersHistory' }
    ])

    const handleClick = (item) => {
      console.log(item)
    }

    const getIconComponent = (name) => {
      switch (name) {
        case 'home':
          return HomeIcon
        case 'profile':
          return ProfileIcon
        case 'dog':
          return DogIcon
        case 'orders':
          return OrdersIcon
        default:
          return null
      }
    }

    return {
      menuItems,
      route,
      handleClick,
      getIconComponent
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  flex: 0 0 280px;

  .nav-link {
    list-style-type: none;
    margin-bottom: 8px;

    a {
      display: flex;
      align-items: center;
      column-gap: 8px;
      height: 48px;
      padding: 12px;
      cursor: pointer;
    }

    .icon {
      width: 28px;
      height: 24px;
    }

    .link-text {
      color: #1d1d1f;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.2;
      letter-spacing: -0.2px;
      transition: all 0.3s ease;
    }

    &:hover,
    &.active {
      .link-text {
        color: #0066cc;
      }
    }
  }
}
</style>

<style lang="scss">
.sidebar {
  .nav-link {
    svg path {
      fill: #1d1d1f;
      transition: all 0.3s ease;
    }
    &:hover,
    &.active {
      svg path {
        fill: #0066cc;
      }
    }
  }
}
</style>
