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
        },
        {
          id: 1,
          origin: '(TEH)تهران',
          destination: 'مشهد',
          flightNumber: 'W5022',
          date: '1403/02/15',
          price: '5500000',
          seats: 236,
          plane: 'مدل هواپیما',
        },
        {
          id: 1,
          origin: 'تهران',
          destination: 'اصفهان',
          flightNumber: 'w52230',
          date: '1403/02/15',
          price: '78454500',
          seats: 236,
          plane: 'مدل هواپیما',
        },
        // پروازهای دیگر ...
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
  },
})
