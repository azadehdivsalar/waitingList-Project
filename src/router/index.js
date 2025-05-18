import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Initialize auth state
    authStore.initializeAuth()

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
      return
    }

    // Check if route requires station manager role
    if (to.meta.requiresStationManager && !authStore.isStationManager) {
      next('/')
      return
    }

    // Prevent authenticated users from accessing login page
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/')
      return
    }

    next()
  })

  return Router
})
