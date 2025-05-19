// import { name } from '@vue/eslint-config-prettier/skip-formatting'

import { useFlightStore } from '../stores/flightStore'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: (to) => {
          const authStore = useAuthStore()
          if (!authStore.isAuthenticated) {
            return '/login'
          }
          return authStore.isAdmin ? '/flights' : '/station-manager'
        },
        meta: { requiresAuth: true },
      },
      {
        path: 'flights',
        name: 'flights',
        component: () => import('pages/FlightsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'history-request',
        name: 'historyRequest',
        component: () => import('pages/historyRequest.vue'),
        beforeEnter: (to, from, next) => {
          const flightStore = useFlightStore()
          if (!flightStore.selectedFlight) {
            next('/')
          } else {
            next()
          }
        },
      },
      {
        path: 'flight-selected',
        name: 'flightSelected',
        component: () => import('pages/FlightSelected.vue'),
      },
      {
        path: 'station-manager',
        component: () => import('pages/StationManagerPanel.vue'),
        meta: { requiresAuth: true, requiresStationManager: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  // Always leave this as last one,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
