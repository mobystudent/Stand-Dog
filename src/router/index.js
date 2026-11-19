import { createRouter, createWebHistory } from 'vue-router'

import RegisterLayout from '../views/RegisterLayout.vue'
import CreatePassword from '../views/CreatePassword.vue'
import AccountLayout from '../layouts/AccountLayout.vue'
import AccountHomePage from '../views/AccountHomePage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import AddTeamPage from '../views/AddTeamPage.vue'
import TeamsPage from '../views/TeamsPage.vue'
import HandlerPage from '../views/HandlerPage.vue'
import OrdersHistoryPage from '../views/OrdersHistoryPage.vue'
import Login from '../views/Login.vue'
import LearnMorePage from '../views/LearnMorePage.vue'
import FindTrainersPage from '../views/FindTrainersPage.vue'
import ShopSupportPage from '../views/ShopSupportPage.vue'

const routes = [
  {
    path: '/signup',
    name: 'RegisterLayout',
    component: RegisterLayout
    // alias: '/'
  },
  {
    path: '/verify-email/:token',
    name: 'CreatePassword',
    component: CreatePassword
  },
  {
    path: '/',
    component: AccountLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/accountHome', component: AccountHomePage },
      { path: '/myProfile', component: ProfilePage },
      { path: '/addTeam', component: AddTeamPage },
      { path: '/teams', component: TeamsPage },
      { path: '/handler', component: HandlerPage },
      { path: '/ordersHistory', component: OrdersHistoryPage }
    ]
  },
  { path: '/sign-in', component: Login }, //, alias: '/'
  { path: '/learn', component: LearnMorePage },
  { path: '/findTrainers', component: FindTrainersPage },
  { path: '/store', component: ShopSupportPage }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  console.log('requiresAuth', requiresAuth)
  if (requiresAuth && (!token || token === 'null')) {
    return next('/sign-in')
  } else {
    next()
  }
})

export default router
