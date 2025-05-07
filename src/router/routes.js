// import { name } from '@vue/eslint-config-prettier/skip-formatting'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FlightsPage.vue') },
      {
        path: 'history-Request',
        name: 'historyRequest',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'flight-seleted',
        name: 'FlightSelected',
        component: () => import('pages/FlightSelected.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

// import { useFlightStore } from 'stores/flightStore' // استور پرواز را ایمپورت می‌کنیم

// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [{ path: '', component: () => import('pages/FlightsPage.vue') }],
//   },

//   {
//     path: '/historyRequest',
//     name: 'historyRequest',
//     component: () => import('pages/historyRequest.vue'),
//     beforeEnter: (to, from, next) => {
//       const flightStore = useFlightStore()

//       // اگر پروازی انتخاب نشده باشد، به صفحه اصلی هدایت می‌شود
//       if (!flightStore.selectedFlight) {
//         next('/') // هدایت به صفحه پروازها
//       } else {
//         next() // اجازه ورود به صفحه تاریخچه درخواست‌ها
//       }
//     },
//   },

//   // Always leave this as last one,
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue'),
//   },
// ]

// export default routes
