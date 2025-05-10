// stores/flightStore.js
import { defineStore } from 'pinia'

export const useFlightStore = defineStore('flight', {
  state: () => ({
    filters: {
      origin: '',
      destination: '',
      flightNumber: '',
    },
    flights: [],
    selectedFlight: null,
    requestHistory: [],
  }),
  actions: {
    fetchFlights() {
      this.flights = [
        {
          id: 1,
          origin: '(TEH)تهران',
          flightNumber: 'W5633',
          date: '1403/02/15',
          destination: '(DXB)دبی',
          destinationTime: '21:50',
          price: '8450000',
          seats: 236,
          plane: 'مدل هواپیما',
          reservedCount: 120,
          requestCount: 15,
        },
        {
          id: 2,
          origin: '(TEH)تهران',
          destination: '(MHD)مشهد',
          flightNumber: 'W5022',
          date: '1403/02/15',
          price: '5500000',
          seats: 236,
          plane: 'مدل هواپیما',
          reservedCount: 180,
          requestCount: 25,
        },
        {
          id: 3,
          origin: '(TEH)تهران',
          destination: '(IFN)اصفهان',
          flightNumber: 'w52230',
          date: '1403/02/15',
          price: '78454500',
          seats: 236,
          plane: 'مدل هواپیما',
          reservedCount: 150,
          requestCount: 20,
        },
      ]
    },
    clearFilters() {
      this.filters = {
        origin: '',
        destination: '',
        flightNumber: '',
      }
    },
    setSelectedFlight(flight) {
      this.selectedFlight = flight
    },
    clearSelectedFlight() {
      this.selectedFlight = null
    },
    addToRequestHistory(request) {
      this.requestHistory.push({
        ...request,
        id: Date.now(),
        status: 'در انتظار بررسی',
        requestTime: new Date().toLocaleString('fa-IR'),
      })
    },
    updateRequestStatus(requestId, status) {
      const request = this.requestHistory.find((r) => r.id === requestId)
      if (request) {
        request.status = status
      }
    },
  },
  getters: {
    getRequestHistory: (state) => state.requestHistory,
    getSelectedFlight: (state) => state.selectedFlight,
  },
})
