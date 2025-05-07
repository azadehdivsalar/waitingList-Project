<template>
  <div class="q-pa-md">
    <!-- کارت اطلاعات پرواز انتخاب‌شده -->
    <flight-card :flight="selectedFlight" />

    <!-- اطلاعات مسافر -->
    <div class="q-mt-lg bg-grey-1 q-pa-lg" style="border-radius: 12px">
      <div class="text-subtitle1 q-mb-md">اطلاعات مسافر</div>
      <q-form @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            v-model="form.passenger"
            label="نام و نام خانوادگی"
            dense
            outlined
            class="col-6"
            :rules="[(val) => !!val || 'ضروری']"
            required
          />
          <q-select
            v-model="form.priority"
            :options="['عادی', 'مهم', 'فوری']"
            label="اولویت"
            dense
            outlined
            class="col-3"
          />
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <q-input
            v-model="form.passportNo"
            label="کد ملی / شماره پاسپورت"
            dense
            outlined
            class="col-6"
          />
          <q-input v-model="form.phone" label="تلفن همراه" dense outlined class="col-6" />
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <q-input
            v-model="form.birthDate"
            label="تاریخ تولد"
            dense
            outlined
            class="col-6"
            readonly
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.birthDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="بستن" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-input
          v-model="form.description"
          type="textarea"
          label="توضیحات"
          dense
          outlined
          class="q-mt-md"
        />
        <div class="row items-center q-mt-md">
          <q-btn type="submit" color="positive" label="ثبت" class="q-ml-sm" />
          <q-btn flat color="primary" label="افزودن مسافر جدید" class="q-ml-auto" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFlightStore } from 'stores/flightStore'
import FlightCard from 'components/FlightCard.vue' // مسیر صحیح را وارد کنید

const flightStore = useFlightStore()
const selectedFlight = flightStore.selectedFlight

const form = ref({
  passenger: '',
  priority: '',
  passportNo: '',
  phone: '',
  birthDate: '',
  description: '',
})

const onSubmit = () => {
  // ارسال اطلاعات فرم
  // ...
}
</script>
