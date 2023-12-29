import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('~/pages/home.vue')
const Login = () => import('~/pages/login.vue')
const WriteOff = () => import('~/pages/writeOff.vue')
const Qr = () => import('~/pages/qr.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/writeOff',
        component: WriteOff,
      },
      {
        path: 'qr',
        component: Qr,
      },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
