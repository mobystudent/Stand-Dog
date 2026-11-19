<template>
  <div class="social-login">
    <a
      v-for="(url, provider) in socialAuthUrls"
      :key="provider"
      :href="url"
      :class="provider"
      target="_blank"
      :aria-label="
        'Login with ' + provider.charAt(0).toUpperCase() + provider.slice(1)
      "
    >
      <img
        :src="`/static/icons/social/${provider}.svg`"
        :alt="provider.charAt(0).toUpperCase() + provider.slice(1)"
      />
      <span>Sign Up with {{ capitalizeFirstLetter(provider) }}</span>
    </a>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../store/userStore.js'
import { getSocial } from '../../api/registration.js'

export default {
  name: 'SocialLogin',
  setup() {
    const store = useUserStore()
    const socialAuthUrls = ref({
      facebook: '#',
      google: '#',
      apple: '#'
    })

    const loadSocialAuthUrls = async () => {
      try {
        const accountType = store.accountType ? store.accountType : undefined
        const response = await getSocial(accountType)
        if (response.status === 200 && response.data?.providers?.items) {
          response.data.providers.items.forEach((provider) => {
            if (socialAuthUrls.value.hasOwnProperty(provider.name)) {
              socialAuthUrls.value[provider.name] = provider.login_url || '#'
            }
          })
        }
      } catch {
        console.error('Failed to fetch social login URLs')
      }
    }

    const capitalizeFirstLetter = (string) => {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    onMounted(() => {
      loadSocialAuthUrls()
    })

    return {
      socialAuthUrls,
      capitalizeFirstLetter
    }
  }
}
</script>

<style lang="scss" scoped>
.social-login {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-bottom: 16px;

  a {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 15px;
    border-radius: 6px;

    span {
      color: #ffffff;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.2px;
    }

    &.facebook {
      background-color: #1877f2;
    }
    &.google {
      background-color: #ffffff;
      box-shadow:
        0px 2px 3px 0px #0000002b,
        0px 0px 3px 0px #00000015;

      span {
        color: #535353;
      }
    }
    &.apple {
      background-color: #000000;
    }
  }

  img {
    border-radius: 12px;
    cursor: pointer;
    transition: box-shadow 0.25s ease-in-out;

    &:hover {
      box-shadow:
        0px 5px 15px 0px #0000001f,
        0px 15px 35px 0px #3c425714;
    }
  }
}
</style>
