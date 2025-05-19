<template>
  <q-card v-if="flight" class="flight-card q-pa-none" dir="rtl" style="overflow: visible">
    <div class="row q-pa-md items-center" style="min-height: 120px; position: relative">
      <!-- لوگوی مبدا (سمت راست) -->
      <div class="col-1 column items-center justify-center">
        <img
          src="../assets/icons/Vector.png"
          alt="logo"
          style="width: 32px; height: 32px; margin-bottom: 8px"
        />
      </div>
      <!-- خط چین عمودی -->
      <!-- <div class="vertical-dashed"></div> -->
      <!-- وسط: اطلاعات پرواز -->
      <div class="col-8 column items-center justify-center">
        <div class="row items-center justify-between full-width">
          <div class="text-bold text-h6">
            ({{ getOriginCode(flight.origin) }}) {{ getOriginCity(flight.origin) }}
          </div>
          <div class="horizontal-line"></div>
          <q-icon name="flight_takeoff" size="24px" color="grey-6" />
          <div class="horizontal-line"></div>
          <div class="text-bold text-h6 column items-center">
            ({{ getDestinationCode(flight.destination) }})
            {{ getDestinationCity(flight.destination) }}
            <div class="text-caption text-grey-7 q-mt-xs">{{ flight.arrivalTime }}</div>
          </div>
        </div>
        <div class="row items-center justify-between full-width q-mt-sm">
          <div class="info-box">
            <span class="info-label">ظرفیت کل:</span>
            <span class="info-value">{{ flight.seats }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">تعداد رزروها:</span>
            <span class="info-value">{{ flight.reservedCount }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">تعداد درخواست‌های ستادی:</span>
            <span class="info-value">{{ flight.requestCount }}</span>
          </div>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">{{ flight.date }}</div>
      </div>
      <div class="vertical-dashed"></div>
      <!-- خط چین عمودی -->
      <div class="col-2 column items-center justify-center">
        <div class="text-h6 q-mb-xs">{{ flight.plane }}</div>
        <q-btn
          v-if="showSelectButton"
          label="انتخاب پرواز"
          class="q-mt-md searchbutton"
          style="max-width: 180px"
          @click="gotoFlightSelected"
        />
      </div>

      <!-- ستون چپ: مدل هواپیما و باکس اطلاعات -->
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFlightStore } from 'src/stores/flightStore'
// import { useFlightStore } from 'stores/flightStore'
// import { date } from 'quasar'

const { flight, showSelectButton } = defineProps({
  flight: { type: Object, required: true },
  showSelectButton: { type: Boolean, default: true },
})

const router = useRouter()
const flightStore = useFlightStore()

const getOriginCode = (code) => code

const getDestinationCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}

const getDestinationCode = (code) => code

const getOriginCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}

const gotoFlightSelected = () => {
  flightStore.setSelectedFlight(flight)
  router.push('/flight-selected')
}
</script>

<style scoped>
.flight-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 8px;
  overflow: visible;
  position: relative;
}
.vertical-dashed {
  width: 2px;
  height: 100px;
  background: repeating-linear-gradient(
    to bottom,
    #d3d3d3,
    #d3d3d3 6px,
    transparent 6px,
    transparent 12px
  );
  margin: 0 8px;
  border-radius: 1px;
}
.info-boxes {
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.info-box {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
}
.info-label {
  color: #666;
  font-size: 13px;
}
.info-value {
  font-weight: bold;
  color: #222;
}
.horizontal-line {
  flex: 1 1 0;
  height: 2px;
  background: #e0e0e0;
  margin: 0 12px;
  border-radius: 1px;
}
</style>
