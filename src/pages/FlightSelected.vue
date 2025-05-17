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
          <div class="row q-gutter-md q-mb-md" dir="rtl">
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
          <div class="row q-gutter-md q-mb-md" dir="rtl">
            <q-input
              v-model="passenger.passportNo"
              label="کد ملی/ شماره پاسپورت"
              class="col"
              outlined
              dense
            />
            <q-input v-model="passenger.phone" label="تلفن همراه" class="col-4" outlined dense />

            <q-input v-model="passenger.birthDate" label="تاریخ تولد" class="col-4" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <q-input v-model="passenger.description" label="توضیحات" type="textarea" outlined dense />
        </q-card>
      </div>
      <div class="row q-mt-md items-center justify-between" dir="rtl">
        <q-btn
          outline
          color="primary"
          icon="person_add"
          label="افزودن مسافر جدید"
          class="q-ml-md"
          @click="addPassengerAndScroll"
        />
        <q-btn class="searchbutton" label="ثبت" icon="check" @click="submit" />
      </div>
    </div>
    <q-dialog v-model="showSuccessDialog" persistent>
      <q-card style="min-width: 300px; max-width: 350px; text-align: center">
        <q-card-section>
          <q-icon name="check_circle" color="positive" size="64px" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6">درخواست شما با موفقیت ثبت شد.</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="تایید" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

const showSuccessDialog = ref(false)

const submit = () => {
  // اعتبارسنجی یا ارسال اطلاعات
  showSuccessDialog.value = true
}

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
