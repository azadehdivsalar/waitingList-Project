<template>
  <q-card class="flight-card q-pa-md" dir="rtl">
    <div class="row items-center justify-between">
      <!-- مسیر -->
      <div class="col-8">
        <div class="row items-center justify-around">
          <div class="text-center">
            <div class="text-subtitle2">{{ flight.origin }}</div>
            <div class="text-caption">{{ flight.departureTime }}</div>
          </div>

          <q-icon name="flight" size="32px" class="text-grey-7" />

          <div class="text-center">
            <div class="text-subtitle2">{{ flight.destination }}</div>
            <div class="text-caption">{{ flight.arrivalTime }}</div>
          </div>
        </div>

        <div class="row justify-between q-mt-sm text-grey-7 text-caption">
          <div>شماره پرواز: {{ flight.flightNumber }}</div>
          <div>مدت پرواز: {{ flight.duration }} دقیقه</div>
          <div>صندلی‌های باقی‌مانده: {{ flight.remainingSeats }}</div>
        </div>
      </div>

      <!-- لوگو شرکت هواپیمایی -->
      <div class="col-2 text-right">
        <q-img :src="flight.airlineLogo" style="width: 50px; height: 50px" fit="contain" />
      </div>

      <!-- قیمت و دکمه انتخاب -->
      <div class="col-2 text-center">
        <div class="text-h6 text-secondary">{{ flight.price.toLocaleString() }} تومان</div>
        <q-btn label="انتخاب پرواز" color="secondary" outlined @click="gotoHistoryRequest" />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
// import { useFlightStore } from 'stores/flightStore'
// import { date } from 'quasar'

// const newDate = new Date(2025, 4, 20)
const router = useRouter()
// const flightStore = useFlightStore()
defineProps({
  flight: {
    type: Object,
    required: true,
  },
})

const gotoHistoryRequest = () => {
  // flightStore.setSelectedFlight(props.flight) // استفاده درست از props
  console.log('first')
  router.push('/history-Request')
}
</script>
