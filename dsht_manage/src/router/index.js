import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/',
        redirect: '/home/userList'
      },
      {
        path: 'users',
        component: () => import('./../components/userList.vue')
      },
      {
        path: 'roles',
        component: () => import('./../components/addUser.vue')
      },
      {
        path: 'rights',
        component: () => import('./../components/removeUser.vue')
      },
      {
        path: 'goods',
        component: () => import('./../components/goods.vue')
      },{
        path: 'addGoods',
        component: () => import('./../components/addGoods.vue')
      },
      {
        path: 'params',
        component: () => import('./../components/params.vue')
      },
      {
        path: 'categories',
        component: () => import('./../components/categories.vue')
      },
      {
        path: 'orders',
        component: () => import('./../components/orders.vue')
      },
      {
        path: 'reports',
        component: () => import('./../components/reports.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "about" */ '../views/login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router