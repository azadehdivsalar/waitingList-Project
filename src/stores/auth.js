import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin',
    isStationManager: (state) => state.user?.role === 'station_manager',
  },

  actions: {
    async login(userData) {
      this.user = userData
      this.isAuthenticated = true
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData))
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
      }
    },
  },
})
