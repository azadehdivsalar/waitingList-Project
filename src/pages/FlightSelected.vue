<template>
  <div>
    <FlightCard :flight="selectedFlight" :showSelectButton="false" />
    <div class="q-mt-lg" dir="rtl">
      <div class="text-h6 q-mb-md">اطلاعات مسافر</div>
      <div
        v-for="(passenger, idx) in passengers"
        :key="passenger.id"
        :ref="(el) => (passengerRefs[idx] = el)"
        class="q-mb-md"
      >
        <q-card class="q-pa-md">
          <div class="row items-center q-mb-md">
            <q-btn
              flat
              icon="delete"
              color="negative"
              class="q-ml-sm"
              @click="removePassenger(idx)"
            />
            <span class="text-negative">حذف مسافر</span>
          </div>
          <div class="row q-gutter-md q-mb-md" >
            <q-input
              v-model="passenger.name"
              label="نام و نام خانوادگی"
              class="col-4"
              outlined
              dense
            />
            <q-select
              v-model="passenger.priority"
              :options="priorityOptions"
              label="اولویت"
              class="col-4"
              outlined
              dense
            />
          </div>
          <div class="row q-gutter-md q-mb-md">
            <q-input v-model="passenger.birthDate" label="تاریخ تولد" class="col" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input v-model="passenger.phone" label="تلفن همراه" class="col" outlined dense />
            <q-input
              v-model="passenger.passportNo"
              label="کد ملی/ شماره پاسپورت"
              class="col"
              outlined
              dense
            />
          </div>
          <q-input v-model="passenger.description" label="توضیحات" type="textarea" outlined dense />
        </q-card>
      </div>
      <div class="row q-mt-md items-center">
        <q-btn
          outline
          color="primary"
          icon="person_add"
          label="افزودن مسافر جدید"
          class="q-ml-md"
          @click="addPassengerAndScroll"
        />
        <q-btn color="positive" label="ثبت" icon="check" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import FlightCard from 'src/components/FlightCard.vue'
import { useFlightStore } from 'src/stores/flightStore'

const flightStore = useFlightStore()
const selectedFlight = flightStore.selectedFlight

const priorityOptions = ['کم', 'متوسط', 'زیاد', 'بسیار زیاد']

const passengers = ref([
  {
    id: Date.now(),
    name: '',
    priority: '',
    birthDate: '',
    phone: '',
    passportNo: '',
    description: '',
  },
])

const passengerRefs = ref([])

const addPassengerAndScroll = () => {
  passengers.value.push({
    id: Date.now() + Math.random(),
    name: '',
    priority: '',
    birthDate: '',
    phone: '',
    passportNo: '',
    description: '',
  })
  nextTick(() => {
    const lastIdx = passengers.value.length - 1
    const el = passengerRefs.value[lastIdx]
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

const removePassenger = (idx) => {
  passengers.value.splice(idx, 1)
}
</script>
