<template>
  <div>
    <q-tabs
      v-model="tab"
      align="justify"
      class="bg-white q-mb-md"
      active-color="primary"
      indicator-color="primary"
      dir="rtl"
    >
      <q-tab
        name="back"
        label="بازگشت به لیست پروازها"
        @click="goToFlightsList"
        icon="arrow_back"
      />
      <q-tab name="add" label="افزودن مسافر جدید" icon="person_add" />
    </q-tabs>
    <FlightCard :flight="selectedFlight" :showSelectButton="false" />
    <q-card v-if="tab === 'add'" class="q-pa-lg q-mt-md" dir="rtl">
      <div class="text-h6 q-mb-md">اطلاعات مسافر</div>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md q-mb-md">
          <q-input
            v-model="passenger.name"
            label="نام و نام خانوادگی *"
            outlined
            dense
            class="col-12 col-md-3"
            :rules="[(val) => !!val || 'نام و نام خانوادگی الزامی است']"
          />
          <q-select
            v-model="passenger.priority"
            :options="priorityOptions"
            label="اولویت"
            outlined
            dense
            class="col-12 col-md-3"
          />
        </div>
        <div class="row q-col-gutter-md q-mb-md">
          <q-input
            v-model="passenger.birthDate"
            label="تاریخ تولد"
            outlined
            dense
            class="col-12 col-md-3"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input
            v-model="passenger.phone"
            label="تلفن همراه"
            outlined
            dense
            class="col-12 col-md-3"
          />
          <q-input
            v-model="passenger.passportNo"
            label="کد ملی/ شماره پاسپورت"
            outlined
            dense
            class="col-12 col-md-3"
          />
        </div>
        <q-input
          v-model="passenger.description"
          label="توضیحات"
          type="textarea"
          outlined
          dense
          class="q-mb-md"
        />
        <div class="row justify-start q-mt-md">
          <q-btn type="submit" color="positive" label="ثبت" icon="check" class="q-px-xl" />
        </div>
      </q-form>
    </q-card>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FlightCard from 'src/components/FlightCard.vue'
import { useFlightStore } from 'src/stores/flightStore'

const router = useRouter()
const tab = ref('add')

const flightStore = useFlightStore()
const selectedFlight = flightStore.selectedFlight

const priorityOptions = [
  { label: 'کم', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'زیاد', value: 'high' },
  { label: 'بسیار زیاد', value: 'very_high' },
]

const passenger = ref({
  name: '',
  priority: '',
  birthDate: '',
  phone: '',
  passportNo: '',
  description: '',
})

const showSuccessDialog = ref(false)

function onSubmit() {
  showSuccessDialog.value = true
}

function goToFlightsList() {
  router.push({ name: 'flights-list' }) // change route name as needed
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
.q-btn.q-px-xl {
  min-width: 100px;
}
</style>
