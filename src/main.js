import { createApp } from 'vue'
import './assets/css/main.scss'
import Vue3Lottie from 'vue3-lottie'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import App from './App.vue'
import router from './router'
import pinia from './pinia'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// import axios from './plugins/axios'

createApp(App)
  .use(pinia)
  .use(router)
  .use(Vue3Lottie)
  .use(Vue3Toastify, {
    autoClose: 6000,
    position: 'top-right',
    hideProgressBar: true,
    transition: 'slide'
  })
  .component('Datepicker', VueDatePicker)
  .mount('#app')
