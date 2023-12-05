// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        // Return home on 404
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/',
      },
      {
        path: '/new',
        name: 'AddBook',
        component: () => import('@/views/AddBook.vue'),
      },
      {
        path: '/:id',
        name: 'EditBook',
        component: () => import('@/views/EditBook.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
