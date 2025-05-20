<template>
  <q-page class="q-pa-md">
    <div class="row" dir="rtl">
      <q-tabs v-model="tab" active-color="positive" class="full-width">
        <q-tab name="requestSubmit" label="ثبت درخواست" />
        <q-tab name="requestHistory" label="تاریخچه درخواست" />
      </q-tabs>
    </div>
    <q-card class="q-pa-md" dir="rtl">
      <div v-if="tab === 'requestSubmit'">
        <q-form @submit="applyFilters" class="q-gutter-md">
          <div class="row items-center q-gutter-md q-mb-md" dir="rtl">
            <q-select
              v-model="filters.origin"
              :options="cities"
              label="مبدا"
              outlined
              dense
              class="col-3"
              emit-value
              map-options
              :rules="[(val) => !!val || 'لطفا مبدا را انتخاب کنید']"
            />
            <q-select
              v-model="filters.destination"
              :options="cities"
              label="مقصد"
              outlined
              dense
              class="col-3"
              emit-value
              map-options
              :rules="[(val) => !!val || 'لطفا مقصد را انتخاب کنید']"
            />
            <q-input
              v-model="filters.flightNumber"
              label="شماره پرواز"
              outlined
              dense
              class="col-3"
              :rules="[(val) => !!val || 'لطفا شماره پرواز را وارد کنید']"
            />
            <div class="col-3 row q-gutter-sm">
              <q-btn
                type="submit"
                label="جستجو"
                icon="search"
                class="search-button"
                color="positive"
              />
              <q-btn
                flat
                label="پاک کردن فیلترها"
                color="secondary"
                icon="refresh"
                @click="clearFilters"
                class="clear-button"
              />
            </div>
          </div>
        </q-form>
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
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
        <q-banner v-else class="bg-grey-2 text-center text-grey q-mt-md">
          پروازی با این مشخصات یافت نشد.
        </q-banner>
      </div>
      <div v-else>
        <q-form @submit="applyFilters" class="q-gutter-md">
          <div class="q-gutter-md row items-center q-mb-md">
            <q-select
              v-model="filters.origin"
              :options="cities"
              label="مبدا"
              class="col-12 col-md-2"
              dense
              outlined
              emit-value
              map-options
            />
            <q-select
              v-model="filters.destination"
              :options="cities"
              label="مقصد"
              class="col-12 col-md-2"
              dense
              outlined
              emit-value
              map-options
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
                    <q-date v-model="date" mask="YYYY/MM/DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup dense color="primary" flat label="بستن" />
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
              emit-value
              map-options
            />
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="وضعیت درخواست"
              dense
              outlined
              class="col-12 col-md-2"
              emit-value
              map-options
            />
            <div class="start-end">
              <q-btn
                type="submit"
                label="جستجو"
                class="search-button"
                icon="search"
                color="positive"
              />
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
        </q-form>
        <!-- جدول -->
        <q-table
          :rows="allRequests"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
          flat
          bordered
          class="my-sticky-header-table"
        >
          <template v-slot:top-right>
            <q-input
              v-model="filter"
              placeholder="جستجو"
              dense
              debounce="300"
              outlined
              class="q-ml-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="origin" :props="props">
                {{ getOriginCity(props.row.origin) }}
              </q-td>
              <q-td key="destination" :props="props">
                {{ getDestinationCity(props.row.destination) }}
              </q-td>
              <q-td key="passenger" :props="props">
                {{ props.row.passenger }}
              </q-td>
              <q-td key="date" :props="props">
                {{ props.row.date }}
              </q-td>
              <q-td key="priority" :props="props">
                <q-chip
                  :color="getPriorityColor(props.row.priority)"
                  text-color="white"
                  dense
                  class="q-ml-sm"
                >
                  {{ getPriorityLabel(props.row.priority) }}
                </q-chip>
              </q-td>
              <q-td key="status" :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  class="q-ml-sm"
                >
                  {{ getStatusLabel(props.row.status) }}
                </q-chip>
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn-group flat>
                  <q-btn flat round color="primary" icon="edit" @click="editRequest(props.row)">
                    <q-tooltip>ویرایش</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="confirmDelete(props.row)"
                  >
                    <q-tooltip>حذف</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-py-lg">
              <q-icon name="sentiment_dissatisfied" size="2em" />
              <span class="q-ml-sm">داده‌ای یافت نشد</span>
            </div>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>

        <!-- دیالوگ ویرایش -->
        <q-dialog v-model="editDialog" class="q-gutter-md" dir="rtl">
          <q-card class="modal q-pa-md" style="max-width: 800px" dir="rtl">
            <div class="q-gutter-md row items-center q-mb-md justify-between">
              <q-card-section class="text-h6">ویرایش اطلاعات مسافر</q-card-section>
              <q-btn
                flat
                icon="close"
                color="negative"
                round
                dense
                v-close-popup
                class="modalClose"
              />
            </div>

            <q-card-section class="q-gutter-sm" dir="rtl">
              <div class="row q-gutter-sm q-mb-sm">
                <q-input
                  v-model="editForm.passenger"
                  label="نام و نام خانوادگی"
                  dense
                  outlined
                  class="col"
                />
                <q-select
                  v-model="editForm.priority"
                  :options="priorityOptions"
                  label="اولویت"
                  dense
                  outlined
                  class="col"
                />
              </div>
              <div class="row q-gutter-sm q-mb-sm">
                <q-input v-model="editForm.birthDate" label="تاریخ تولد" dense outlined class="col">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" />
                  </template>
                </q-input>
                <q-input v-model="editForm.phone" label="تلفن همراه" dense outlined class="col" />
                <q-input
                  v-model="editForm.passportNo"
                  label="کد ملی/شماره پاسپورت"
                  dense
                  outlined
                  class="col"
                />
              </div>
              <q-input
                v-model="editForm.description"
                type="textarea"
                label="توضیحات"
                dense
                outlined
                class="q-mb-sm"
              />
            </q-card-section>

            <q-card-actions align="right" class="q-mt-sm">
              <q-btn flat class="saveBtn" label="ذخیره" color="positive" @click="saveEdit" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import FlightCard from '../components/FlightCard.vue'

const $q = useQuasar()
const router = useRouter()

const tab = ref('requestSubmit')
const loading = ref(false)
const filter = ref('')
const date = ref('')

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const filters = ref({
  origin: null,
  destination: null,
  passenger: '',
  priority: null,
  status: null,
  flightNumber: '',
})

const cities = [
  { label: 'تهران', value: 'THR' },
  { label: 'مشهد', value: 'MHD' },
  { label: 'شیراز', value: 'SYZ' },
  { label: 'اصفهان', value: 'IFN' },
  { label: 'تبریز', value: 'TBZ' },
]

const priorityOptions = [
  { label: 'عادی', value: 'normal' },
  { label: 'فوری', value: 'urgent' },
  { label: 'خیلی فوری', value: 'very_urgent' },
]

const statusOptions = [
  { label: 'در انتظار', value: 'pending' },
  { label: 'تایید شده', value: 'approved' },
  { label: 'رد شده', value: 'rejected' },
]

const columns = [
  {
    name: 'origin',
    required: true,
    label: 'مبدا',
    align: 'right',
    field: (row) => row.origin,
    sortable: true,
  },
  {
    name: 'destination',
    required: true,
    label: 'مقصد',
    align: 'right',
    field: (row) => row.destination,
    sortable: true,
  },
  {
    name: 'passenger',
    required: true,
    label: 'مسافر',
    align: 'right',
    field: (row) => row.passenger,
    sortable: true,
  },
  {
    name: 'date',
    required: true,
    label: 'تاریخ',
    align: 'right',
    field: (row) => row.date,
    sortable: true,
  },
  {
    name: 'priority',
    required: true,
    label: 'اولویت',
    align: 'right',
    field: (row) => row.priority,
    sortable: true,
  },
  {
    name: 'status',
    required: true,
    label: 'وضعیت',
    align: 'right',
    field: (row) => row.status,
    sortable: true,
  },
  {
    name: 'actions',
    required: true,
    label: 'عملیات',
    align: 'center',
    field: (row) => row.id,
  },
]

const filteredRequests = ref([])
const filteredFlights = ref([])
const allRequests = ref([])

const getOriginCity = (code) => {
  const city = cities.find((c) => c.value === code)
  return city ? city.label : code
}

const getDestinationCity = (code) => {
  const city = cities.find((c) => c.value === code)
  return city ? city.label : code
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'normal':
      return 'blue'
    case 'urgent':
      return 'orange'
    case 'very_urgent':
      return 'red'
    default:
      return 'grey'
  }
}

const getPriorityLabel = (priority) => {
  const option = priorityOptions.find((opt) => opt.value === priority)
  return option ? option.label : priority
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return 'grey'
  }
}

const getStatusLabel = (status) => {
  const option = statusOptions.find((opt) => opt.value === status)
  return option ? option.label : status
}

const clearFilters = () => {
  filters.value = {
    origin: null,
    destination: null,
    passenger: '',
    priority: null,
    status: null,
    flightNumber: '',
  }
  date.value = ''
  applyFilters()
}

const applyFilters = async () => {
  loading.value = true
  try {
    // اینجا می‌توانید درخواست API را برای فیلتر کردن داده‌ها ارسال کنید
    // فعلاً از داده‌های نمونه استفاده می‌کنیم
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (tab.value === 'requestSubmit') {
      filteredFlights.value = [
        {
          flightNumber: 'IR101',
          origin: 'THR',
          destination: 'MHD',
          departureTime: '08:00',
          arrivalTime: '09:30',
          date: '1403/01/01',
        },
      ]
    } else {
      filteredRequests.value = [
        {
          id: 1,
          origin: 'THR',
          destination: 'MHD',
          passenger: 'علی محمدی',
          date: '1403/01/01',
          priority: 'urgent',
          status: 'pending',
        },
      ]
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'خطا در دریافت اطلاعات',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

const onRequest = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  pagination.value = { page, rowsPerPage, sortBy, descending }
  await applyFilters()
}

const editRequest = (row) => {
  router.push(`/edit-request/${row.id}`)
}

const confirmDelete = (row) => {
  $q.dialog({
    title: 'تایید حذف',
    message: 'آیا از حذف این درخواست اطمینان دارید؟',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      // اینجا می‌توانید درخواست API را برای حذف ارسال کنید
      await new Promise((resolve) => setTimeout(resolve, 1000))
      $q.notify({
        type: 'positive',
        message: 'درخواست با موفقیت حذف شد',
        position: 'top',
      })
      await applyFilters()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'خطا در حذف درخواست',
        position: 'top',
      })
    }
  })
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

const saveEdit = () => {
  const index = allRequests.value.findIndex((r) => r.id === editForm.value.id)
  if (index !== -1) {
    allRequests.value[index] = { ...editForm.value }
    // ذخیره در localStorage
    localStorage.setItem('passengers', JSON.stringify(allRequests.value))
  }
  editDialog.value = false
}

onMounted(() => {
  const saved = localStorage.getItem('passengers')
  if (saved) {
    allRequests.value = JSON.parse(saved)
  }
  applyFilters()
})
</script>

<style lang="scss" scoped>
.my-sticky-header-table {
  height: calc(100vh - 200px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #f5f5f5;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }
}

.search-button {
  min-width: 100px;
}

.clear-button {
  min-width: 150px;
}

.start-end {
  display: flex;
  gap: 8px;
  margin-right: auto;
}

@media (max-width: 600px) {
  .start-end {
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
