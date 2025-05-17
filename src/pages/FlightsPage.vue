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
        <div class="row items-center q-gutter-md q-mb-md" dir="rtl">
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
          <q-btn label="جستجو" icon="search" class="search-button" @click="applyFilters" />
          <q-btn
            flat
            label="پاک کردن فیلترها"
            color="secondary"
            icon="refresh"
            @click="clearFilters"
            class="clear-button"
          />
        </div>
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
      <div v-else>
        <!-- فیلترها -->
        <div class="filter-section q-gutter-md row items-center">
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
          <q-input v-model="date" label="تاریخ" class="col-12 col-md-2" dense outlined>
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
        <div class="filter-section row q-gutter-md items-center" dir="rtl">
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
          <div class="filter-buttons">
            <q-btn label="جستجو" @click="applyFilters" class="search-button" icon="search" />
            <q-btn
              flat
              label="پاک کردن فیلترها"
              color="secondary"
              icon="clear"
              @click="clearFilters"
              class="clear-button"
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
              <q-badge v-if="props.row.status === 'در انتظار بررسی'" class="status-badge pending" />
              <q-badge v-else-if="props.row.status === 'عدم پذیرش'" class="status-badge rejected" />
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
                  <q-item clickable v-close-popup @click="openCancelDialog(props.row.id)">
                    <q-item-section avatar>
                      <q-icon name="delete" color="red" />
                    </q-item-section>
                    <q-item-section class="text-red">لغو درخواست</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openEditDialog(props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" color="green" />
                    </q-item-section>
                    <q-item-section>ویرایش</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-td>
          </template>
        </q-table>

        <!-- دیالوگ ویرایش -->
        <q-dialog v-model="editDialog" class="q-gutter-md" dir="rtl">
          <q-card class="modal q-pa-md" dir="rtl">
            <div class="modal-header">
              <q-card-section class="text-h6">ویرایش اطلاعات مسافر</q-card-section>
              <q-btn flat label="بستن" v-close-popup color="negative" class="modal-close" />
            </div>
            <q-card-section class="q-gutter-md" dir="rtl">
              <div class="form-row">
                <q-input
                  v-model="editForm.passenger"
                  label="نام و نام خانوادگی"
                  dense
                  outlined
                  class="form-field"
                />
                <q-select
                  v-model="editForm.priority"
                  :options="priorityOptions"
                  label="اولویت"
                  dense
                  outlined
                  class="form-field"
                />
              </div>
              <div class="form-row">
                <q-input
                  v-model="editForm.passportNo"
                  label="کد ملی/شماره پاسپورت"
                  dense
                  outlined
                  class="form-field"
                />
                <q-input
                  v-model="editForm.phone"
                  label="تلفن همراه"
                  dense
                  outlined
                  class="form-field"
                />
                <q-input
                  v-model="editForm.birthDate"
                  label="تاریخ تولد"
                  dense
                  outlined
                  class="form-field"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="editForm.birthDate">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="بستن" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="form-row">
                <q-input
                  v-model="editForm.description"
                  type="textarea"
                  label="توضیحات"
                  dense
                  outlined
                  class="form-field"
                />
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat class="search-button" label="ذخیره" color="positive" @click="saveEdit" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px; max-width: 400px" dir="rtl">
        <div class="row items-center q-pa-sm" dir="rtl">
          <div class="col"></div>
          <div class="col-auto">
            <q-btn
              flat
              round
              dense
              icon="close"
              color="negative"
              v-close-popup
              style="font-size: 24px"
            />
          </div>
        </div>
        <q-card-section class="text-center">
          <div class="text-h6 q-mb-md">آیا از لغو این درخواست مطمئن هستید؟</div>
        </q-card-section>
        <q-card-actions vertical align="center" class="q-gutter-md">
          <q-btn
            flat
            label="خیر"
            color="custom-green"
            class="text-custom-green border-custom-green"
            style="width: 70%; height: 40px; font-weight: 500; font-size: 16px; border-radius: 8px"
            v-close-popup
          />
          <q-btn
            label="لغو درخواست"
            color="negative"
            style="width: 70%; height: 40px; font-weight: 500; font-size: 16px; border-radius: 8px"
            @click="doCancelRequest"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FlightCard from '../components/FlightCard.vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'

const tab = ref('requestSubmit')
const date = ref('')
const router = useRouter()
const route = useRoute()

// ست کردن تب با توجه به مسیر فعلی
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/history-request') {
      tab.value = 'requestHistory'
    } else if (newPath === '/') {
      tab.value = 'requestSubmit'
    }
  },
  { immediate: true },
)

// جلوگیری از تغییر مسیر مستقیم
onBeforeRouteUpdate((to, from, next) => {
  if (to.path === '/history-request') {
    tab.value = 'requestHistory'
  } else if (to.path === '/') {
    tab.value = 'requestSubmit'
  }
  next()
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
    field: (row) => `${getOriginCity(row.origin)}-${getDestinationCity(row.destination)}`,
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
    destination: 'دبی',
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
    passenger: 'میلاد وایانی',
    origin: 'تهران',
    destination: 'تبریز',
    flightTime: '1403/12/08 - 15:30',
    flightNo: 'W51344',
    requestTime: '1403/12/08 - 10:30',
    priority: 'متوسط',
    status: 'در انتظار بررسی',
    showMenu: false,
  },
  {
    id: 4,
    passenger: 'محمدرضا متقی',
    origin: 'تهران',
    destination: 'شیراز',
    flightTime: '1403/12/09 - 10:30',
    flightNo: 'W51344',
    requestTime: '1403/12/09 - 10:30',
    priority: 'کم',
    status: 'لغو درخواست',
    showMenu: false,
  },
  {
    id: 5,
    passenger: 'علی حلاجی',
    origin: 'تهران',
    destination: 'اصفهان',
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

const confirmDialog = ref(false)
const cancelId = ref(null)

const openCancelDialog = (id) => {
  cancelId.value = id
  confirmDialog.value = true
}

const doCancelRequest = () => {
  filteredRequests.value = filteredRequests.value.filter((r) => r.id !== cancelId.value)
  confirmDialog.value = false
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

const openEditDialog = (row) => {
  editForm.value = { ...row }
  editDialog.value = true
}

const saveEdit = () => {
  // Update the row in filteredRequests
  const idx = filteredRequests.value.findIndex((r) => r.id === editForm.value.id)
  if (idx !== -1) {
    filteredRequests.value[idx] = { ...editForm.value }
  }
  editDialog.value = false
}

const filteredFlights = computed(() => {
  return flights.value.filter((flight) => {
    const originMatch =
      !filters.value.origin ||
      flight.origin === filters.value.origin ||
      getOriginCity(flight.origin) === filters.value.origin

    const destinationMatch =
      !filters.value.destination ||
      flight.destination === filters.value.destination ||
      getDestinationCity(flight.destination) === filters.value.destination

    return originMatch && destinationMatch
  })
})

const getOriginCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}

const getDestinationCity = (code) => {
  const cities = { THR: 'تهران', MHD: 'مشهد', KER: 'کرمان', DXB: 'دبی' }
  return cities[code] || code
}
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

:deep(.text-custom-green) {
  color: #01986f !important;
}

:deep(.border-custom-green) {
  border: 1.5px solid #01986f !important;
}

/* استایل‌های جدید */
.status-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  padding: 0;
}

.status-badge.pending {
  background: #01986f;
}

.status-badge.rejected {
  background: #ff0000;
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-right: auto;
}

.search-button {
  min-width: 120px;
  height: 40px;
  background: #01986f;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
}

.search-button:hover {
  background: #018060;
}

.clear-button {
  min-width: 120px;
  height: 40px;
  color: #666;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
}

.clear-button:hover {
  background: #f5f5f5;
}

.modal {
  max-width: 800px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-close {
  font-size: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-field {
  flex: 1;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .filter-buttons {
    width: 100%;
    margin-top: 12px;
  }

  .search-button,
  .clear-button {
    flex: 1;
  }
}
</style>
