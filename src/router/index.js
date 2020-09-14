import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/selectTopic',
    name: 'selectTopic',
    component: () => import(/* webpackChunkName: "selectTopic" */ '../pages/selectTopic.vue')
  },
  {
    path: '/result',
    name: 'result',
    component: () => import(/* webpackChunkName: "result" */ '../pages/result.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../pages/login.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../pages/home.vue')
  },
  {
    path: '/exam',
    name: 'exam',
    component: () => import(/* webpackChunkName: "exam" */ '../pages/exam.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
