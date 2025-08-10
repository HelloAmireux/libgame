// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
import GameCover from '../components/GameCover.vue'
import ProgressGame from '../components/ProgressGame.vue'

const routes = [
  {
    path: '/',
    name: 'Cover',
    component: GameCover,
    meta: {
      title: '逃离图书馆 - 封面'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: ProgressGame,
    meta: {
      title: '逃离图书馆 - 游戏进行中'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 切换路由时滚动到顶部
    return { top: 0 }
  }
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
  next()
})

export default router