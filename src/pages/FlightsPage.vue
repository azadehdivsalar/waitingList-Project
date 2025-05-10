<template>
  <q-page class="q-pa-md">
    <div class="row" dir="rtl">
      <q-tabs v-model="tab" active-color="custom-green">
        <q-tab name="requestSubmit" label="ثبت درخواست" />
        <q-tab name="requestHistory" label="تاریخچه درخواست" />
      </q-tabs>
    </div>
    <q-card class="q-pa-md" dir="rtl">
      <div v-if="tab === 'requestSubmit'">
        <div class="row items-center q-gutter-md q-mb-md justify-between" dir="rtl">
          <q-select
            v-model="filters.origin"
            :options="cities"
            label="مبدا"
            outlined
            dense
            class="col-3"
          />
          <q-select
            v-model="filters.destination"
            :options="cities"
            label="مقصد"
            outlined
            dense
            class="col-3"
          />
          <q-input
            v-model="filters.flightNumber"
            label="شماره پرواز"
            outlined
            dense
            class="col-3"
          />
          <q-btn
            label="جستجو"
            icon="search"
            class="q-ml-sm searchbutton"
            @click="applyFilters"
            style="min-width: 100px"
          />
          <q-btn
            flat
            label="پاک کردن فیلترها"
            color="secondary"
            icon="refresh"
            @click="clearFilters"
            class="q-ml-md"
          />
        </div>
        <div v-if="isFormComplete" class="q-mt-lg">
          <div v-if="filteredFlights.length > 0">
            <div v-for="(flight, idx) in filteredFlights" :key="flight.flightNumber">
              <FlightCard :flight="flight" />
              <q-separator
                v-if="idx < filteredFlights.length - 1"
                spaced="md"
                color="grey-4"
                style="border-style: dashed"
              />
            </div>
          </div>
          <div v-else class="text-center text-grey q-mt-md">پروازی با این مشخصات یافت نشد.</div>
        </div>
      </div>
      <div v-else>
        <!-- فیلترها -->
        <div class="q-gutter-md row items-center q-mb-md">
          <q-select
            v-model="filters.origin"
            :options="cities"
            label="مبدا"
            class="col-12 col-md-2"
            dense
            outlined
          />
          <q-select
            v-model="filters.destination"
            :options="cities"
            label="مقصد"
            class="col-12 col-md-2"
            dense
            outlined
          />
          <q-input
            v-model="filters.passenger"
            label="مسافر"
            class="col-12 col-md-2"
            dense
            outlined
          />

          <q-input outlined v-model="date" class="col-12 col-md-2">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="بستن" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-md q-mb-md items-center flex" dir="rtl">
          <q-select
            v-model="filters.priority"
            :options="priorityOptions"
            label="اولویت"
            dense
            class="col-12 col-md-2"
            outlined
          />

          <q-select
            v-model="filters.status"
            :options="statusOptions"
            label="وضعیت درخواست"
            dense
            outlined
            class="col-12 col-md-2"
          />
          <div class="start-end">
            <q-btn label="جستجو" @click="applyFilters" class="col-2 searchButton" icon="search" />
            <q-btn
              flat
              label="پاک کردن فیلترها"
              color="secondary"
              icon="clear"
              @click="clearFilters"
              class="clrbutton"
            />
          </div>
        </div>

        <!-- جدول -->
        <q-table
          flat
          bordered
          title="تاریخچه درخواست‌ها"
          :rows="filteredRequests"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          class="q-mt-md"
        >
          <template v-slot:body-cell-badge="props">
            <q-td align="center">
              <q-badge
                v-if="props.row.status === 'در انتظار بررسی'"
                style="
                  background: #01986f;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  padding: 0;
                "
              />
              <q-badge
                v-else-if="props.row.status === 'عدم پذیرش'"
                style="
                  background: #ff0000;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  padding: 0;
                "
              />
            </q-td>
          </template>
          <div class="q-pa-lg flex flex-center">
            <q-pagination v-model="current" :max="5" direction-links />
          </div>
          <template v-slot:body-cell-action="props">
            <q-td align="center">
              <q-btn flat round icon="more_vert" @click.stop="openMenu(props.row.id)" />
              <q-menu v-model="props.row.showMenu" anchor="top end" self="top start" fit>
                <q-list dense>
                  <q-item clickable v-close-popup @click="cancelRequest(props.row.id)">
                    <q-item-section avatar><q-icon name="delete" color="red" /></q-item-section>
                    <q-item-section class="text-red">لغو درخواست</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openEditDialog(props.row)">
                    <q-item-section avatar><q-icon name="edit" color="green" /></q-item-section>
                    <q-item-section>ویرایش</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-td>
          </template>
        </q-table>

        <!-- دیالوگ ویرایش -->
        <q-dialog v-model="editDialog" class="q-gutter-md" dir="rtl">
          <q-card class="modal q-pa-md" style="max-width: 800px" dir="rtl">
            <div class="q-gutter-md row items-center q-mb-md">
              <q-card-section class="text-h6">ویرایش اطلاعات مسافر</q-card-section>
              <q-btn flat label="بستن" v-close-popup color="negative" class="modalClose text-h6" />
            </div>

            <q-card-section class="q-gutter-md" dir="rtl">
              <div class="row col flex inputmodal justify-between">
                <q-input v-model="editForm.passenger" label="نام و نام خانوادگی" dense outlined />
                <q-select
                  v-model="editForm.priority"
                  :options="priorityOptions"
                  label="اولویت"
                  dense
                  class="col"
                  outlined
                />
              </div>

              <div class="row col flex inputmodal justify-between" dir="rtl">
                <div class="col">
                  <q-input
                    v-model="editForm.passportNo"
                    label="کد ملی/شماره پاسپورت"
                    dense
                    outlined
                  />
                </div>
                <div class="col">
                  <q-input v-model="editForm.phone" label="تلفن همراه" dense outlined />
                </div>
                <div class="col">
                  <q-input filled v-model="editForm.birthDate" dense outlined>
                    <template>
                      <div class="q-pa-md" style="max-width: 300px" outlined>
                        <q-input filled v-model="date" mask="date" :rules="['date']">
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="col" dir="rtl">
                <q-input
                  v-model="editForm.description"
                  type="textarea"
                  label="توضیحات"
                  dense
                  outlined
                />
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat class="saveBtn" label="ذخیره" color="positive" @click="saveEdit" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FlightCard from '../components/FlightCard.vue'
import { useRouter, useRoute } from 'vue-router'

const tab = ref('requestSubmit')
const date = ref('')
const router = useRouter()
const route = useRoute()

// تنظیم تب بر اساس مسیر فعلی
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/history-Request') {
      tab.value = 'requestHistory'
    } else {
      tab.value = 'requestSubmit'
    }
  },
  { immediate: true },
)

// تغییر مسیر بر اساس تغییر تب
watch(tab, (newTab) => {
  if (newTab === 'requestHistory') {
    router.push('/history-Request')
  } else {
    router.push('/')
  }
})

const filters = ref({
  passenger: '',
  origin: '',
  destination: '',
  status: '',
  priority: '',
  flightNumber: '',
})

const cities = ['تهران', 'مشهد', 'کرمان']
const statusOptions = ['در انتظار بررسی', 'عدم پذیرش']
const priorityOptions = ['کم', 'متوسط', 'زیاد', 'بالا', 'بسیار زیاد', 'بسیار بالا']

const flights = ref([
  {
    origin: 'THR',
    destination: 'MHD',
    flightNumber: 'W51234',
    date: '1403/12/08 - 15:30',
    seats: 120,
    price: '2,500,000',
    plane: 'Airbus A320',
    reservedCount: 85,
    requestCount: 12,
  },
  {
    origin: 'THR',
    destination: 'KER',
    flightNumber: 'W51235',
    date: '1403/12/09 - 10:30',
    seats: 100,
    price: '2,200,000',
    plane: 'Boeing 737',
    reservedCount: 65,
    requestCount: 8,
  },
  // ... پروازهای دیگر
])

const columns = [
  { name: 'badge', label: '', align: 'center', field: 'status', style: 'width: 32px' },
  { name: 'passenger', label: 'نام', align: 'center', field: 'passenger' },
  {
    name: 'route',
    label: 'مسیر پرواز',
    align: 'center',
    field: (row) => `${row.origin} - ${row.destination}`,
  },
  { name: 'flightTime', label: 'زمان پرواز', align: 'center', field: 'flightTime' },
  { name: 'flightNo', label: 'شماره پرواز', align: 'center', field: 'flightNo' },
  { name: 'requestTime', label: 'زمان درخواست', align: 'center', field: 'requestTime' },
  { name: 'priority', label: 'اولویت', align: 'center', field: 'priority' },
  { name: 'status', label: 'وضعیت درخواست', align: 'center', field: 'status' },
  { name: 'action', label: '', align: 'center' },
]

const filteredRequests = ref([
  {
    id: 1,
    passenger: 'آزاده دیوسالار',
    origin: 'تهران',
    destination: 'مشهد',
    flightTime: '1403/12/08 - 15:30',
    flightNo: 'W51344',
    requestTime: '1403/12/08 - 10:30',
    priority: 'بسیار زیاد',
    status: 'در انتظار بررسی',
    showMenu: false,
  },
  {
    id: 2,
    passenger: 'پروانه حیدرپور',
    origin: 'تهران',
    destination: 'مشهد',
    flightTime: '1403/12/08 - 15:30',
    flightNo: 'W51344',
    requestTime: '1403/12/08 - 10:30',
    priority: 'زیاد',
    status: 'در انتظار بررسی',
    showMenu: false,
  },
  {
    id: 3,
    passenger: 'پروانه خیبرپور',
    origin: 'تهران',
    destination: 'مشهد',
    flightTime: '1403/12/08 - 15:30',
    flightNo: 'W51344',
    requestTime: '1403/12/08 - 10:30',
    priority: 'متوسط',
    status: 'در انتظار بررسی',
    showMenu: false,
  },
  {
    id: 4,
    passenger: 'سیدمحمد احمدی',
    origin: 'تهران',
    destination: 'کرمان',
    flightTime: '1403/12/09 - 10:30',
    flightNo: 'W51344',
    requestTime: '1403/12/09 - 10:30',
    priority: 'کم',
    status: 'لغو درخواست',
    showMenu: false,
  },
  {
    id: 5,
    passenger: 'سیدمحمد احمدی',
    origin: 'تهران',
    destination: 'کرمان',
    flightTime: '1403/12/09 - 10:30',
    flightNo: 'W51344',
    requestTime: '1403/12/09 - 10:30',
    priority: 'بسیار بالا',
    status: 'عدم پذیرش',
    showMenu: false,
  },
  {
    id: 6,
    passenger: 'سیدمحمد احمدی',
    origin: 'تهران',
    destination: 'کرمان',
    flightTime: '1403/12/09 - 10:30',
    flightNo: 'W51344',
    requestTime: '1403/12/09 - 10:30',
    priority: 'بالا',
    status: 'عدم پذیرش',
    showMenu: false,
  },
  {
    id: 7,
    passenger: 'سیدمحمد احمدی',
    origin: 'تهران',
    destination: 'کرمان',
    flightTime: '1403/12/09 - 10:30',
    flightNo: 'W51344',
    requestTime: '1403/12/09 - 10:30',
    priority: 'کم',
    status: 'عدم پذیرش',
    showMenu: false,
  },
])

const applyFilters = () => {}

const clearFilters = () => {
  filters.value = {
    passenger: '',
    origin: '',
    destination: '',
    status: '',
    priority: '',
    flightNumber: '',
  }
  date.value = ''
}

const openMenu = (id) => {
  filteredRequests.value.forEach((row) => {
    row.showMenu = row.id === id ? !row.showMenu : false
  })
}

const cancelRequest = () => {
  // منطق لغو درخواست
}

const editDialog = ref(false)

const editForm = ref({
  id: null,
  passenger: '',
  priority: '',
  passportNo: '',
  phone: '',
  birthDate: '',
  description: '',
})

const openEditDialog = () => {
  // منطق ویرایش
}

const saveEdit = () => {
  const index = flights.value.findIndex((r) => r.id === editForm.value.id)
  if (index !== -1) {
    flights.value[index] = { ...editForm.value }
  }
  editDialog.value = false
}

const isFormComplete = computed(() => {
  return (
    filters.value.origin &&
    filters.value.destination &&
    filters.value.passenger &&
    date.value &&
    filters.value.priority &&
    filters.value.status
  )
})

const filteredFlights = computed(() => {
  return flights.value.filter((flight) => {
    return (
      (!filters.value.origin || flight.origin === filters.value.origin) &&
      (!filters.value.destination || flight.destination === filters.value.destination)
    )
  })
})
</script>

<style scoped>
.q-table td {
  vertical-align: middle;
}

:deep(.q-tabs__indicator.text-custom-green),
:deep(.q-tab--active .q-tab__label),
:deep(.q-tab--active) {
  color: #01986f !important;
  border-color: #01986f !important;
}
:deep(.q-tabs__indicator.text-custom-green) {
  background: #01986f !important;
}
</style>
