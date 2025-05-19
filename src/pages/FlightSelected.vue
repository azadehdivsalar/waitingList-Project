<template>
  <div>
    <div class="row justify-start q-mb-md">
      <q-btn
        flat
        label="بازگشت به لیست پروازها"
        @click="goToFlightsList"
        icon="arrow_back"
        color="primary"
      />
    </div>
    <FlightCard :flight="selectedFlight" :showSelectButton="false" />
    <div class="row q-mt-md">
      <q-btn
        color="primary"
        label="افزودن مسافر جدید"
        icon="person_add"
        class="q-px-xl"
        @click="showAddPassengerDialog = true"
      />
    </div>
    <q-dialog v-model="showAddPassengerDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px; text-align: center">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6">افزودن مسافر</div>
          <q-btn flat round icon="close" color="negative" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-md q-mb-md">
              <q-input
                v-model="passenger.name"
                label="نام و نام خانوادگی *"
                outlined
                dense
                class="col-6"
                :rules="[(val) => !!val || 'نام و نام خانوادگی الزامی است']"
              />
              <q-select
                v-model="passenger.priority"
                :options="priorityOptions"
                label="اولویت"
                outlined
                dense
                class="col-3"
              />
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <q-input
                v-model="passenger.birthDate"
                label="تاریخ تولد"
                outlined
                dense
                class="col-3"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="passenger.birthDate"
                        mask="YYYY/MM/DD"
                        today-btn
                        color="primary"
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup icon="close" color="negative" flat round dense />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                v-model="passenger.phone"
                label="تلفن همراه"
                outlined
                dense
                class="col-3"
                :rules="[
                  (val) => !!val || 'شماره تلفن الزامی است',
                  (val) => /^[0-9]{11}$/.test(val) || 'شماره تلفن باید 11 رقم باشد',
                ]"
              />
              <q-input
                v-model="passenger.passportNo"
                label="کد ملی/ شماره پاسپورت"
                outlined
                dense
                class="col-3"
                :rules="[
                  (val) => !!val || 'کد ملی/شماره پاسپورت الزامی است',
                  (val) => /^[0-9]{10}$/.test(val) || 'کد ملی باید 10 رقم باشد',
                ]"
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
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSuccessDialog" persistent>
      <q-card style="min-width: 300px; max-width: 350px; text-align: center">
        <q-card-section>
          <q-icon name="check_circle" color="positive" size="64px" />
        </q-card-section>
        <q-card-section>
          <div class="text-h6">درخواست شما با موفقیت ثبت شد.</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat icon="close" color="negative" round dense v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import FlightCard from '../components/FlightCard.vue'
import { useFlightStore } from '../stores/flightStore'

const $q = useQuasar()
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
const showAddPassengerDialog = ref(false)

function resetForm() {
  passenger.value = {
    name: '',
    priority: '',
    birthDate: '',
    phone: '',
    passportNo: '',
    description: '',
  }
}

function onSubmit() {
  // Validate required fields
  if (!passenger.value.name || !passenger.value.phone || !passenger.value.passportNo) {
    $q.notify({
      color: 'negative',
      message: 'لطفا تمام فیلدهای الزامی را پر کنید',
      icon: 'error',
      position: 'top',
    })
    return
  }

  // Show success dialog
  showSuccessDialog.value = true
  showAddPassengerDialog.value = false

  // Reset form after successful submission
  resetForm()
}

function goToFlightsList() {
  router.push({ name: 'flights' })
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
