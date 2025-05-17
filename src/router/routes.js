// import { name } from '@vue/eslint-config-prettier/skip-formatting'

import { useFlightStore } from 'stores/flightStore'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'flights',
        component: () => import('pages/FlightsPage.vue'),
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
        path: '/station-manager-panel',
        component: () => import('pages/StationManagerPanel.vue')
      }
    ],
  },

  // Always leave this as last one,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
