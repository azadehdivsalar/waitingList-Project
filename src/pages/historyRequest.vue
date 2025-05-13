<template>
  <q-page class="q-pa-md">
    <div class="row" dir="rtl">
      <q-tabs v-model="tab" active-color="positive">
        <q-tab name="requestSubmit" label="ثبت درخواست" />
        <q-tab name="requestHistory" label="تاریخچه درخواست" />
      </q-tabs>
    </div>
    <q-card class="q-pa-md" dir="rtl">
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
        <q-input v-model="filters.passenger" label="مسافر" class="col-12 col-md-2" dense outlined />

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
      >
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
          <div class="q-gutter-md row items-center q-mb-md justify-between">
            <q-card-section class="text-h6">ویرایش اطلاعات مسافر</q-card-section>
            <q-btn flat label="بستن" v-close-popup color="negative" class="modalClose text-h6" />
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
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { watch } from 'vue'
// import { useRouter } from 'vue-router'

const tab = ref('requestHistory')
const date = ref('')
// const router = useRouter()

// watch(tab, (val) => {
//   if (val === 'requestHistory') {
//     router.push('/flights/history')
//   } else {
//     router.push('/flights')
//   }
// })
const filters = ref({
  passenger: '',
  origin: '',
  destination: '',
  status: '',
  priority: '',
})

const cities = ['تهران', 'مشهد', 'کرمان']
const statusOptions = ['در انتظار بررسی', 'عدم پذیرش']
const priorityOptions = ['کم', 'متوسط', 'زیاد', 'بالا', 'بسیار زیاد', 'بسیار بالا']

const requests = ref([
  {
    id: 1,
    passenger: 'آزاده دیوسالار',
    origin: 'تهران',
    destination: 'مشهد',
    flightNo: 'W51234',
    flightTime: '1403/12/08 - 15:30',
    requestTime: '1403/12/08 - 15:30',
    status: 'در انتظار بررسی',
    priority: 'بسیار زیاد',
    showMenu: false,
  },
  {
    id: 2,
    passenger: 'علی احمدی',
    origin: 'تهران',
    destination: 'کرمان',
    flightNo: 'W51234',
    flightTime: '1403/12/07 - 10:30',
    requestTime: '1403/12/08 - 15:30',
    status: 'عدم پذیرش',
    priority: 'کم',
    showMenu: false,
  },
])

const columns = [
  { name: 'passenger', label: 'نام مسافر', align: 'center', field: 'passenger' },
  { name: 'origin', label: 'مبدا', align: 'center', field: 'origin' },
  { name: 'destination', label: 'مقصد', align: 'center', field: 'destination' },
  { name: 'flightTime', label: 'زمان پرواز', align: 'center', field: 'flightTime' },
  { name: 'flightNo', label: 'شماره پرواز', align: 'center', field: 'flightNo' },
  { name: 'requestTime', label: 'زمان درخواست', align: 'center', field: 'requestTime' },
  { name: 'priority', label: 'اولویت', align: 'center', field: 'priority' },
  { name: 'status', label: 'وضعیت', align: 'center', field: 'status' },
  { name: 'action', label: '', align: 'center' },
]

const filteredRequests = computed(() => {
  return requests.value.filter((item) => {
    return (
      (!filters.value.passenger || item.passenger.includes(filters.value.passenger)) &&
      (!filters.value.origin || item.origin.includes(filters.value.origin)) &&
      (!filters.value.destination || item.destination.includes(filters.value.destination)) &&
      (!filters.value.status || item.status === filters.value.status) &&
      (!filters.value.priority || item.priority === filters.value.priority)
    )
  })
})

const applyFilters = () => {}

const clearFilters = () => {
  filters.value = {
    passenger: '',
    origin: '',
    destination: '',
    status: '',
    priority: '',
  }
  date.value = ''
}

const openMenu = (id) => {
  requests.value.forEach((req) => {
    req.showMenu = req.id === id ? !req.showMenu : false
  })
}

const cancelRequest = (id) => {
  requests.value = requests.value.filter((req) => req.id !== id)
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
  const index = requests.value.findIndex((r) => r.id === editForm.value.id)
  if (index !== -1) {
    requests.value[index] = { ...editForm.value }
  }
  editDialog.value = false
}
</script>
