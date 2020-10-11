import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/examSelect',
    name: 'examSelect',
    component: () => import(/* webpackChunkName: "examSelect" */ '../pages/examSelect.vue')
  },
  {
    path: '/selectTopic',
    name: 'selectTopic',
    component: () => import(/* webpackChunkName: "selectTopic" */ '../pages/selectTopic.vue')
  },
  {
    path: '/testList',
    name: 'testList',
    component: () => import(/* webpackChunkName: "testList" */ '../pages/testList.vue')
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
  },
  {
    path: '/exam1',
    name: 'exam1',
    component: () => import(/* webpackChunkName: "exam1" */ '../pages/exam1.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
