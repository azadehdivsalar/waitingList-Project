<template>
  <q-card v-if="flight" class="flight-card q-pa-none" dir="rtl" style="overflow: visible">
    <div class="row q-pa-md items-center" style="min-height: 120px">
      <!-- اطلاعات پرواز و ظرفیت‌ها (وسط کارت) -->
      <div class="col">
        <!-- ردیف اول: اطلاعات پرواز -->
        <div class="row items-center justify-between">
          <!-- مبدا -->
          <div class="col-3 text-center">
            <div class="text-h6">
              ({{ getOriginCode(flight.origin) }}) {{ getOriginCity(flight.origin) }}
            </div>
            <div class="text-caption">{{ flight.originTime }}</div>
          </div>
          <!-- مسیر پرواز با خط افقی و آیکون -->
          <div class="col-6 text-center">
            <div class="row items-center justify-center no-wrap">
              <div class="horizontal-line"></div>
              <q-icon name="flight_takeoff" color="primary" size="md" class="q-mx-md" />
              <div class="horizontal-line"></div>
            </div>
            <div class="text-caption">{{ flight.date }}</div>
          </div>
          <!-- مقصد -->
          <div class="col-3 text-center">
            <div class="text-h6">
              ({{ getDestinationCode(flight.destination) }})
              {{ getDestinationCity(flight.destination) }}
            </div>
            <div class="text-caption">{{ flight.arrivalTime }}</div>
          </div>
        </div>
        <!-- ردیف دوم: ظرفیت‌ها -->
        <div class="row items-center justify-between q-mt-sm">
          <div class="col text-center">
            <span class="info-label">ظرفیت کل:</span>
            <span class="info-value">{{ flight.seats }}</span>
          </div>
          <div class="col text-center">
            <span class="info-label">تعداد رزروها:</span>
            <span class="info-value">{{ flight.reservedCount }}</span>
          </div>
          <div class="col text-center">
            <span class="info-label">درخواست‌های ستادی:</span>
            <span class="info-value">{{ flight.requestCount }}</span>
          </div>
        </div>
      </div>
      <!-- خط چین عمودی و ستون مدل هواپیما و دکمه انتخاب -->
      <div class="vertical-dashed mx-md"></div>
      <div class="col-auto column items-center justify-center">
        <div class="text-h5 q-mb-xs">{{ flight.plane }}</div>
        <div class="text-caption q-mb-md">مدل هواپیما</div>
        <q-btn
          v-if="showSelectButton"
          label="انتخاب پرواز"
          class="q-mt-md searchbutton"
          style="max-width: 180px"
          @click="gotoFlightSelected"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFlightStore } from 'src/stores/flightStore'

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
  margin: 0 16px;
  border-radius: 1px;
  align-self: stretch;
}
.flight-info-box {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 120px;
  text-align: center;
  margin-bottom: 8px;
}
.info-box {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
  justify-content: space-between;
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
