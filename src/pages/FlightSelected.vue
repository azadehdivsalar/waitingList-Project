<template>
  <div>
    <FlightCard :flight="selectedFlight" :showSelectButton="false" />
    <div class="q-mt-lg" dir="rtl">
      <div class="text-h6 q-mb-md">اطلاعات مسافر</div>
      <q-card class="q-pa-md">
        <div class="row q-gutter-md q-mb-md">
          <q-input
            v-model="passengers[0].name"
            label="نام و نام خانوادگی"
            class="col-3"
            outlined
            dense
          />
          <q-select
            v-model="passengers[0].priority"
            :options="priorityOptions"
            label="اولویت"
            class="col-3"
            outlined
            dense
          />
        </div>
        <div class="row q-gutter-md q-mb-md" dir="rtl">
          <q-input v-model="passengers[0].birthDate" label="تاریخ تولد" class="col-3" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input v-model="passengers[0].phone" label="تلفن همراه" class="col-3" outlined dense />
          <q-input
            v-model="passengers[0].passportNo"
            label="کد ملی/ شماره پاسپورت"
            class="col-3"
            outlined
            dense
          />
        </div>
        <q-input
          v-model="passengers[0].description"
          label="توضیحات"
          type="textarea"
          outlined
          dense
        />
      </q-card>
      <div class="row q-mt-md items-center justify-between" dir="rtl">
        <q-btn color="positive" label="ثبت" icon="check" />

        <q-btn
          outline
          icon="person_add"
          label="افزودن مسافر جدید"
          class="q-ml-md "
          @click="addPassenger"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const addPassenger = () => {
  passengers.value.push({
    id: Date.now() + Math.random(),
    name: '',
    priority: '',
    birthDate: '',
    phone: '',
    passportNo: '',
    description: '',
  })
}

const removePassenger = (idx) => {
  passengers.value.splice(idx, 1)
}
</script>
