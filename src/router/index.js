import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/revive',
  },
  {
    path: '/revive',
    name: 'Revive',
    component: () => import(/* webpackChunkName: "revive" */ '../components/ReviveDatabase.vue'),
    children: [
      {
        path: ':category',
        name: 'ReviveCategory',
        component: () => import(/* webpackChunkName: "revive" */ '../components/ReviveDatabase.vue'),
      },
    ],
  },
  {
    path: '/calculator',
    name: 'AdvacnedCalculator',
    component: () => import(/* webpackChunkName: "calculator" */ '../components/CalculatorContainer.vue'),
    children: [
      {
        path: ':data',
        name: 'AdvacnedCalculatorData',
        component: () => import(/* webpackChunkName: "calculator" */ '../components/CalculatorContainer.vue'),
      },
    ],
  },
  {
    path: '/machines',
    name: 'Machine',
    component: () => import(/* webpackChunkName: "machine" */ '../components/MachineDatabase.vue'),
    children: [
      {
        path: ':category',
        name: 'MachineModel',
        component: () => import(/* webpackChunkName: "machine" */ '../components/MachineDatabase.vue'),
      },
    ],
  },
  {
    path: '/pilots',
    name: 'Pilot',
    component: () => import(/* webpackChunkName: "pilot" */ '../components/PilotDatabase.vue'),
    children: [
      {
        path: ':category',
        name: 'PilotModel',
        component: () => import(/* webpackChunkName: "pilot" */ '../components/PilotDatabase.vue'),
      },
    ],
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
