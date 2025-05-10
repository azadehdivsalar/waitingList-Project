<template>
  <q-card class="flight-card q-pa-none" dir="rtl" style="overflow: visible">
    <div
      class="row q-col-gutter-md q-pa-md items-start q-gutter-sm"
      :class="$q.screen.lt.sm ? 'column' : 'row'"
    >
      <!-- اطلاعات پرواز -->
      <div class="col">
        <div class="row items-center justify-between">
          <!-- مبدا -->
          <div class="column items-center">
            <div class="text-h6">{{ getOriginCity(flight.origin) }}</div>
            <div class="text-caption text-grey-7">{{ getOriginCode(flight.origin) }}</div>
          </div>

          <!-- مسیر و شماره پرواز -->
          <div class="column items-center" style="min-width: 220px">
            <div class="text-center text-caption text-grey-7 q-mb-xs">
              {{ flight.flightNumber }}///
            </div>
            <div class="row items-center justify-center">
              <q-separator color="grey-4" style="width: 80px" />
              <q-icon name="flight" size="24px" class="q-mx-md text-grey-7" />
              <q-separator color="grey-4" style="width: 80px" />
            </div>
            <div class="text-center text-caption text-grey-7 q-mt-xs">{{ flight.date }}</div>
          </div>

          <!-- مقصد -->
          <div class="column items-center">
            <div class="text-h6">{{ getDestinationCity(flight.destination) }}</div>
            <div class="text-caption text-grey-7">{{ getDestinationCode(flight.destination) }}</div>
          </div>
        </div>

        <!-- اطلاعات ظرفیت و قیمت -->
        <div
          class="row bg-grey-2 q-mt-md q-pa-sm items-center justify-between"
          style="border-radius: 8px"
        >
          <div class="col text-center">
            <div class="text-caption text-grey-7">ظرفیت کل</div>
            <div class="text-h6">{{ flight.seats }}</div>
          </div>
          <div class="col text-center">
            <div class="text-caption text-grey-7">قیمت</div>
            <div class="text-h6">{{ flight.price }}</div>
          </div>
        </div>
      </div>

      <!-- جداکننده در دسکتاپ -->
      <div v-if="$q.screen.gt.xs" class="col-auto flex flex-center" style="height: 100%">
        <div style="border-left: 2px dashed #e0e0e0; height: 90px"></div>
      </div>

      <!-- انتخاب پرواز -->
      <div class="col-auto column items-center justify-between" style="min-width: 170px">
        <div class="row items-center justify-end q-mb-md" style="width: 100%">
          <span class="text-caption text-grey-7 q-ml-xs">مدل هواپیما</span>
          <span class="text-h6">{{ flight.plane }}</span>
        </div>
        <q-btn
          label="انتخاب پرواز"
          class="full-width searchbutton"
          style="min-width: 140px"
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
</script>
