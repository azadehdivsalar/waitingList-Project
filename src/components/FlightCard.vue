<template>
  <q-card class="flight-card q-pa-none" dir="rtl" style="overflow: visible">
    <div class="row q-pa-md items-center" style="min-height: 120px">
      <!-- Origin (right) -->
      <div class="col-2 column items-center justify-center">
        <q-icon name="flight" size="32px" color="primary" class="q-mb-xs" />
        <div class="text-bold text-h6">({{ getOriginCode(flight.origin) }})</div>
        <div class="text-subtitle2">{{ getOriginCity(flight.origin) }}</div>
      </div>
      <!-- Center: Flight info -->
      <div class="col-8 column items-center justify-center">
        <div class="text-h6">{{ flight.flightNumber }}</div>
        <div class="text-caption text-grey-7 q-mb-xs">{{ flight.date }}</div>
        <div class="row q-mt-sm q-gutter-md justify-center">
          <div class="col-auto text-center">
            <div class="text-caption text-grey-7">ظرفیت کل</div>
            <div class="text-h6">{{ flight.seats }}</div>
          </div>
          <div class="col-auto text-center">
            <div class="text-caption text-grey-7">تعداد رزروها</div>
            <div class="text-h6">{{ flight.reservedCount ?? 130 }}</div>
          </div>
          <div class="col-auto text-center">
            <div class="text-caption text-grey-7">تعداد درخواست‌های ثبت‌شده</div>
            <div class="text-h6">{{ flight.requestCount ?? 15 }}</div>
          </div>
          <div class="col-auto text-center">
            <div class="text-caption text-grey-7">قیمت</div>
            <div class="text-h6">{{ flight.price }}</div>
          </div>
        </div>
      </div>
      <!-- Destination (left) -->
      <div class="col-2 column items-center justify-center">
        <q-icon
          name="flight"
          size="32px"
          color="primary"
          class="q-mb-xs"
          style="transform: scaleX(-1)"
        />
        <div class="text-bold text-h6">({{ getDestinationCode(flight.destination) }})</div>
        <div class="text-subtitle2">{{ getDestinationCity(flight.destination) }}</div>
      </div>
    </div>
    <div class="row items-center q-px-md q-pb-md">
      <div class="col-6 row items-center">
        <span class="text-caption text-grey-7 q-ml-xs">مدل هواپیما</span>
        <span class="text-h6">{{ flight.plane }}</span>
      </div>
      <div class="col-6 flex flex-center">
        <q-btn
          label="انتخاب پرواز"
          color="primary"
          class="full-width"
          style="max-width: 180px"
          @click="gotoFlightSelected"
        />
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

const gotoFlightSelected = () => {
  // flightStore.setSelectedFlight(props.flight) // استفاده درست از props
  console.log('first')
  router.push('/history-Request')
}

const getOriginCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}

const getOriginCode = (code) => code

const getDestinationCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}

const getDestinationCode = (code) => code
</script>

<style scoped>
.flight-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 8px;
}
</style>
