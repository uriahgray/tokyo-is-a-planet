import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import BroadcastsView from '../views/BroadcastsView.vue'
import BroadcastView from '../views/BroadcastView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleView from '../views/ArticleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/broadcasts',
      name: 'broadcasts',
      component: BroadcastsView
    }
    ,
    {
      path: '/broadcast/:slug',
      name: 'broadcast',
      component: BroadcastView
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView
    }
    ,
    {
      path: '/article/:slug',
      name: 'article',
      component: ArticleView
    }        
  ]
})

export default router
