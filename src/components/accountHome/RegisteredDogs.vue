<template>
  <div class="registered-dogs">
    <div class="header-section">
      <h2>Registered Dogs</h2>
      <div class="icon-container">
        <img
          class="icon icon--search"
          src="/static/icons/search.svg"
          alt="search"
        />
        <img
          class="icon icon--arrows-sort"
          src="/static/icons/arrows-sort.svg"
          alt="sorting"
        />
        <img
          class="icon icon--archive"
          src="/static/icons/archive.svg"
          alt="archive"
        />
        <img
          class="icon icon--maximize"
          src="/static/icons/maximize.svg"
          alt="maximize"
        />
      </div>
    </div>
    <div class="dog-cards">
      <div v-for="dog in dogs" :key="dog.id" class="dog-card">
        <div class="dog-info">
          <img
            :src="dog.profile_photo_url || placeholderImage"
            :alt="dog.name"
            class="dog-avatar"
          />
          <div>
            <h3>{{ dog.name }}</h3>
            <p v-if="dog.owner">{{ dog.owner }}</p>
            <p>Registration #</p>
            <div class="actions">
              <a href="#" class="edit">Edit</a>
              <a href="#" class="order">Order</a>
            </div>
          </div>
        </div>
        <div class="dog-status">
          <div class="dropdown" @click="toggleDropdown(dog)" ref="dropdownBox">
            <div class="dropdown-selected" :class="statusClass(dog.status)">
              {{ getStatusLabel(dog.status) }}
              <img
                class="arrow-down"
                src="/static/icons/dropdown-arrow.svg"
                alt="arrow down"
              />
            </div>

            <div v-if="openDropdown === dog.id" class="dropdown-menu">
              <div
                v-for="status in statuses"
                :key="status.value"
                class="dropdown-item"
                :class="statusClass(status.value)"
                @click.stop="selectStatus(dog, status.value)"
              >
                {{ status.value }}
              </div>
            </div>
          </div>

          <div class="dog-status__action">
            <a
              v-if="['Washout', 'Retired', 'In Memoriam'].includes(dog.status)"
              href="#"
              class="archive"
              >Archive</a
            >
            <a v-if="dog.status === 'In Memoriam'" href="#" class="display"
              >Display</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { getProfileAnimals } from '../../api/registration.js'
import { useUserStore } from '../../store/userStore.js'
import { useLibraryStore } from '../../store/libraryStore.js'

export default {
  name: 'RegisteredDogs',
  setup() {
    const store = useUserStore()
    const libraryStore = useLibraryStore()
    const dogs = ref([])
    const statuses = ref([])
    const openDropdown = ref(null)
    const dropdownBox = ref(null)
    const placeholderImage = '/static/img/dog-no-image.png'

    const toggleDropdown = (dog) => {
      openDropdown.value = openDropdown.value === dog.id ? null : dog.id
    }

    const handleClickOutside = (event) => {
      // if (dropdownBox && !dropdownBox.contains(event.target)) {
      //   openDropdown.value = null
      // }
    }

    const selectStatus = (dog, newStatus) => {
      dog.status = newStatus
      openDropdown.value = null
    }

    const getStatusLabel = (status) => {
      const found = statuses.value.find(
        (s) => s.value.toLowerCase() === status.toLowerCase()
      )
      return found ? found.value : 'Unknown'
    }

    const statusClass = (status) => {
      return {
        'status-unregistered': status.toLowerCase() === 'unregistered',
        'status-active': status.toLowerCase() === 'active',
        'status-training': status.toLowerCase() === 'in training',
        'status-washout': status.toLowerCase() === 'washout',
        'status-retired': status.toLowerCase() === 'retired',
        'status-memoriam': status.toLowerCase() === 'in memoriam'
      }
    }

    onMounted(async () => {
      if (!store.token) return

      try {
        const dataProfileAnimals = await getProfileAnimals()
        const profileAnimalsData = dataProfileAnimals.data.animal_list

        if (profileAnimalsData.length === 0) return

        document.addEventListener('click', handleClickOutside)

        await libraryStore.loadOptions()
        statuses.value = libraryStore.options.animal_status || []

        dogs.value = profileAnimalsData.map((dog) => ({
          ...dog,
          profile_photo_url: dog.profile_photo_url || placeholderImage
        }))
      } catch (err) {
        console.error('Error fetching profile animals data:', err)
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      dogs,
      statuses,
      placeholderImage,
      openDropdown,
      dropdownBox,
      toggleDropdown,
      selectStatus,
      getStatusLabel,
      statusClass
    }
  }
}
</script>

<style lang="scss" scoped>
.registered-dogs {
  max-width: 600px;
  height: 100%;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 18px;

  h2 {
    color: #1d1d1f;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
    letter-spacing: 0.2px;
    margin-bottom: 16px;
  }

  .icon-container {
    display: flex;
    column-gap: 16px;

    .icon {
      width: 24px;
      height: 24px;
      transition: opacity 0.2s;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.dog-cards {
  min-height: calc(100% - 75px);
  max-height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb transparent;
}

.dog-cards::-webkit-scrollbar {
  width: 3px;
}

.dog-cards::-webkit-scrollbar-track {
  background: transparent;
}

.dog-cards::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 3px;
}

.dog-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d2d2d7;
  padding: 16px 24px;

  .dog-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .dog-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 1px solid #0066df;
      object-fit: cover;
    }

    h3 {
      color: #2f2f31;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.4;
      letter-spacing: -0.2px;
    }

    p {
      color: #616165;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
      letter-spacing: -0.2px;
    }

    .actions {
      display: flex;
      gap: 16px;

      a {
        color: #0066cc;
        font-weight: 500;
        font-size: 12px;
        line-height: 1.4;
      }
    }
  }
}
//

.dropdown {
  position: relative;
  display: inline-block;
  //width: 180px;
  cursor: pointer;

  .dropdown-selected {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 4px;
    color: #1d1d1f;
    font-size: 12px;
    font-weight: 500;
    border-radius: 15px;
    padding: 5px 12px;

    &.status-unregistered {
      background-color: #f39a5b;
    }
    &.status-active {
      background-color: #7fcc62;
    }
    &.status-training {
      background-color: #82b6fa;
    }
    &.status-washout,
    &.status-retired,
    &.status-memoriam {
      background-color: #d2d2d7;
    }
  }

  .arrow-down {
    padding: 5px 3px;
  }
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  row-gap: 13px;
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background-color: #ffffff;
  box-shadow:
    0px 3px 6px 0px #32325d1f,
    0px 7px 14px 0px #32325d14;
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 16px;
  z-index: 1000;

  .dropdown-item {
    width: fit-content;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    border-radius: 15px;
    text-align: center;
    padding: 5px 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &.status-unregistered {
      background-color: #f17218;
      color: #1d1d1f;
    }

    &.status-active {
      background-color: #54ab31;
      color: #1d1d1f;
    }

    &.status-training {
      background-color: #1350a0;
      color: #ffffff;
    }

    &.status-washout,
    &.status-retired,
    &.status-memoriam {
      background-color: #616165;
      color: #ffffff;
    }
  }
}

.dog-status {
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 16px;
  }

  .archive,
  .display {
    color: #0066cc;
    font-weight: 500;
    font-size: 12px;
    text-decoration: none;
  }
}
</style>
