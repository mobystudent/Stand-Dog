<template>
  <section class="avatar-section">
    <img
      :src="preview || defaultAvatar"
      class="avatar-image"
      alt="User avatar"
    />

    <div class="avatar-info">
      <h3>User's Avatar</h3>
      <p>
        If the image size exceeds 1000x1000 px, it will be automatically
        reduced. The image size must not exceed 4MB.
      </p>
    </div>

    <div class="avatar-actions">
      <button
        @click="openDeleteModal"
        class="avatar-button"
        title="Delete"
        :disabled="!hasAvatar"
      >
        <img class="icon" src="/static/icons/delete-icon.svg" alt="delete" />
      </button>
      <button @click="triggerFileInput" class="avatar-button" title="Upload">
        <img class="icon" src="/static/icons/upload-icon.svg" alt="upload" />
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="visually-hidden"
        @change="handleFileChange"
      />
    </div>
  </section>

  <BaseModal
    v-show="showDeleteProfileModal"
    v-model="showDeleteProfileModal"
    title="Delete Profile Picture"
    body="Are you sure you want to delete your profile photo? This action cannot be undone."
    confirm-text="Delete Picture"
    confirm-type="danger"
    :esc-closable="true"
    @cancel="closeDeleteModal"
    @confirm="handleDelete"
  />
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { toast } from 'vue3-toastify'
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  getProfile
} from '../../api/registration.js'
import BaseModal from '../base/BaseModal.vue'

export default {
  name: 'AvatarUploader',
  components: { BaseModal },
  setup() {
    const store = useUserStore()
    const fileInputRef = ref(null)
    const preview = ref(store.profileData.profile_photo_url || null)
    const defaultAvatar = '/static/img/avatar.png'
    const showDeleteProfileModal = ref(false)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxFileSize = 4 * 1024 * 1024

    const hasAvatar = computed(() => {
      return !!store.profileData.profile_photo_url
    })

    const resetFileInput = () => {
      if (fileInputRef.value) fileInputRef.value.value = ''
    }

    const updateProfileData = async () => {
      try {
        const { data } = await getProfile()
        store.setProfileData(data.data)
      } catch (err) {
        console.error('Error fetching profile data:', err)
      }
    }

    const handleDelete = async () => {
      try {
        await deleteProfilePhoto()
        await updateProfileData()
        closeDeleteModal()
      } catch (err) {
        console.error('Error deleting photo:', err)
      }
    }

    watch(
      () => store.profileData.profile_photo_url,
      (newAvatar) => {
        preview.value = newAvatar || defaultAvatar
      }
    )

    const triggerFileInput = () => {
      fileInputRef.value?.click()
    }

    const handleFileChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      const showError = (message) => {
        toast.error(message)
        resetFileInput()
      }

      if (!allowedTypes.includes(file.type)) {
        return showError('Allowed file types: JPG, JPEG, PNG, GIF, or WEBP.')
      }

      if (file.size > maxFileSize) {
        return showError('File must be smaller than 4MB.')
      }

      try {
        await uploadProfilePhoto(file)
        await updateProfileData()
      } catch (err) {
        console.error('Error uploading photo:', err)
        showError(err.response?.data?.message || 'Error uploading photo')
      } finally {
        resetFileInput()
      }
    }

    const openDeleteModal = () => {
      showDeleteProfileModal.value = true
    }

    const closeDeleteModal = () => {
      showDeleteProfileModal.value = false
    }

    return {
      preview,
      defaultAvatar,
      fileInputRef,
      showDeleteProfileModal,
      hasAvatar,
      openDeleteModal,
      handleDelete,
      triggerFileInput,
      handleFileChange,
      closeDeleteModal
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 8px;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.avatar-info {
  margin-left: 8px;

  h3 {
    color: #1d1d1f;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }

  p {
    color: #616165;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
  }
}

.avatar-actions {
  display: flex;
}

.avatar-button {
  background: none;
  border: none;
  cursor: pointer;

  icon {
    width: 40px;
    height: 40px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.visually-hidden {
  display: none;
}
</style>
