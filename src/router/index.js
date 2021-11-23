import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "revive" */ '../components/ReviveDatabase.vue'),
  },
  {
    path: '/revive',
    name: 'Revive',
    component: () => import(/* webpackChunkName: "revive" */ '../components/ReviveDatabase.vue'),
  },
  {
    path: '/legacy',
    name: 'Legacy',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "legacy" */ '../components/LegacyDatabase.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
