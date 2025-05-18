<template>
  <q-page class="q-pa-md bg-grey-1" dir="rtl">
    <q-header
      class="bg-green-6 text-white q-py-sm q-px-lg flex items-center justify-end"
      style="min-height: 48px"
    >
      <q-icon name="person" class="q-ml-xs" size="sm" />
      <span class="text-body1">علی مقصودی</span>
    </q-header>
    <div class="flight-container q-mt-lg">
      <div class="row justify-start">
        <q-btn
          flat
          dense
          class="text-primary text-underline"
          icon="arrow_back"
          label="بازگشت به لیست پروازها"
          @click="router.push('/flights')"
          style="font-size: 15px"
        />
      </div>
      <q-card class="q-mt-md q-mb-md q-pa-lg">
        <div class="row items-stretch">
          <!-- Left: Model and Buttons (سمت چپ) -->
          <div class="col-auto flex flex-center q-pl-xl">
            <div class="column items-center q-gutter-y-md">
              <div class="text-h5">A340</div>
              <div class="text-caption">مدل هواپیما</div>
              <q-btn
                outline
                color="primary"
                icon="person_add"
                label="افزودن مسافر"
                class="full-width"
                @click="showAddPassengerDialog = true"
              />
              <q-btn
                outline
                color="primary"
                icon="list"
                label="ظرفیت لیست انتظار"
                class="full-width"
                @click="showCapacityDialog = true"
              />
            </div>
          </div>
          <!-- Vertical dashed divider -->
          <div class="col-auto flex flex-center">
            <div class="vertical-dashed mx-xl" />
          </div>
          <!-- Right: Flight Info (سه ستون صحیح RTL) -->
          <div class="col">
            <div class="row items-center justify-between">
              <!-- مبدا (سمت راست) -->
              <div class="col-3 text-center">
                <div class="text-h6">تهران (TEH)</div>
                <div class="text-caption">۰۲:۵۰</div>
                <q-icon name="eco" color="primary" size="md" />
              </div>
              <!-- مسیر پرواز (وسط) -->
              <div class="col-6 text-center">
                <div class="row items-center justify-center no-wrap">
                  <div
                    class="flight-line"
                    style="width: 40%; height: 2px; background: #cfd8dc"
                  ></div>
                  <q-icon name="flight" class="flight-icon q-mx-md" size="sm" color="primary" />
                  <div
                    class="flight-line"
                    style="width: 40%; height: 2px; background: #cfd8dc"
                  ></div>
                </div>
                <div class="text-caption">۲۰۲۴/۱۲/۰۵</div>
              </div>
              <!-- مقصد (سمت چپ) -->
              <div class="col-3 text-center">
                <div class="text-h6">دبی (DXB)</div>
                <div class="text-caption">۲۱:۰۵</div>
              </div>
            </div>
            <!-- ردیف ظرفیت‌ها -->
            <div class="row bg-grey-2 q-pa-sm rounded-borders items-center q-mt-md">
              <div class="col text-center text-caption">ظرفیت اکونومی: 120 از 130</div>
              <div class="col text-center text-caption">ظرفیت بیزینس: 5 از 10</div>
              <div class="col text-center text-caption">تعداد درخواست‌های ستادی: 15</div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card class="q-mt-md q-pa-md">
        <div class="text-h6 q-mb-md">لیست مسافران ستادی</div>
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="pagination"
          :rows-per-page-options="[5, 10, 15]"
          class="my-sticky-header-table"
        >
          <template v-slot:body-cell-stationPriority="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.stationPriority"
                :options="stationPriorityOptions"
                dense
                outlined
                style="min-width: 90px; font-size: 15px"
                emit-value
                map-options
                dropdown-icon="expand_more"
                options-dense
                hide-bottom-space
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-dropdown
                color="primary"
                flat
                label="تایید مسافر"
                v-if="props.row.status === 'در انتظار صدور بلیت'"
              >
                <q-list>
                  <q-item clickable v-close-popup @click="approvePassenger(props.row)">
                    <q-item-section>تایید مسافر</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="rejectPassenger(props.row)">
                    <q-item-section>عدم مراجعه</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn
                flat
                color="grey"
                label="تایید نشده"
                v-else-if="props.row.status === '-'"
                disable
              />
              <q-btn
                flat
                color="positive"
                label="تایید شده"
                v-else-if="props.row.status === 'تایید شده'"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.status === 'در انتظار صدور بلیت'"
                color="orange"
                label="در انتظار صدور بلیت"
              />
              <q-badge
                v-else-if="props.row.status === 'تایید شده'"
                color="green"
                label="صدور بلیت"
              />
              <q-badge v-else-if="props.row.status === '-'" color="grey" label="-" />
              <q-badge
                v-else-if="props.row.status === 'عدم مراجعه'"
                color="red"
                label="عدم مراجعه"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-details="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="more_vert"
                color="primary"
                @click="openDetailsDialog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
        <div class="row justify-end q-mt-md">
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(rows.length / pagination.rowsPerPage)"
            color="primary"
          />
          <span class="q-mr-md">تعداد نمایش در هر صفحه</span>
          <q-select
            v-model="pagination.rowsPerPage"
            :options="[5, 10, 15]"
            dense
            outlined
            style="width: 80px"
          />
        </div>
      </q-card>
    </div>
    <q-dialog v-model="showCapacityDialog" persistent>
      <q-card style="min-width: 340px; max-width: 400px; text-align: center">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6">ظرفیت لیست انتظار</div>
          <q-btn flat round icon="close" color="negative" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="capacity.economy" label="اکونومی" outlined dense class="q-mb-md" />
          <q-input v-model="capacity.business" label="بیزینس" outlined dense />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-right q-mb-sm">آخرین تغییرات:</div>
          <div class="text-caption text-right">
            علی مقصودی - بیزینس: {{ capacity.business }} - اکونومی: {{ capacity.economy }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="positive" label="ثبت" class="q-px-xl" @click="showCapacityDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAddPassengerDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px; text-align: center">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6">افزودن مسافر</div>
          <q-btn flat round icon="close" color="negative" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="onAddPassenger" class="q-gutter-md">
            <div class="row q-col-gutter-md q-mb-md">
              <q-input
                v-model="newPassenger.name"
                label="نام و نام خانوادگی *"
                outlined
                dense
                class="col-6"
                :rules="[(val) => !!val || 'نام و نام خانوادگی الزامی است']"
              />
              <q-select
                v-model="newPassenger.priority"
                :options="priorityOptions"
                label="اولویت"
                outlined
                dense
                class="col-3"
              />
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <q-input
                v-model="newPassenger.birthDate"
                label="تاریخ تولد"
                outlined
                dense
                class="col-3"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer" />
                </template>
              </q-input>
              <q-input
                v-model="newPassenger.phone"
                label="تلفن همراه"
                outlined
                dense
                class="col-3"
              />
              <q-input
                v-model="newPassenger.passportNo"
                label="کد ملی/ شماره پاسپورت"
                outlined
                dense
                class="col-3"
              />
            </div>
            <q-input
              v-model="newPassenger.description"
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
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 700px; max-width: 800px; text-align: center">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6">جزئیات</div>
          <q-btn flat round icon="close" color="negative" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <q-card flat bordered class="col-12 q-pa-md bg-grey-2">
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="col text-right">
                  <b>درخواست کننده</b><br />{{ selectedRow.requester || '-' }}
                </div>
                <div class="col text-right">
                  <b>نام مسافر</b><br />{{ selectedRow.passenger || '-' }}
                </div>
                <div class="col text-right"><b>کد ملی/شماره پاسپورت</b><br />05125867402</div>
                <div class="col text-right"><b>تلفن همراه</b><br />09125874313</div>
              </div>
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="col text-right"><b>اولویت</b><br />خیلی زیاد</div>
                <div class="col text-right"><b>زمان درخواست</b><br />13:52</div>
                <div class="col text-right"><b>تاریخ تولد</b><br />1374/12/08</div>
              </div>
              <div class="row q-mb-sm">
                <div class="col text-right">
                  <b>توضیحات</b><br />در صورت امکان صندلی بیزینس اختصاص داده شود.
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-col-gutter-md">
            <q-card flat bordered class="col-12 q-pa-md bg-grey-2">
              <div class="row q-col-gutter-md">
                <div class="col text-right">
                  <b>اولویت ایستگاه</b><br />{{ selectedRow.stationPriority || '-' }}
                </div>
                <div class="col text-right"><b>عملیات</b><br />تایید شده</div>
                <div class="col text-right"><b>وضعیت مسافر</b><br />در انتظار صدور بلیت</div>
              </div>
            </q-card>
          </div>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn color="positive" label="بستن" class="q-px-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const columns = [
  { name: 'requester', label: 'درخواست دهنده', align: 'center', field: 'requester' },
  { name: 'passenger', label: 'نام مسافر', align: 'center', field: 'passenger' },
  { name: 'stationPriority', label: 'اولویت ایستگاه', align: 'center', field: 'stationPriority' },
  { name: 'staffPriority', label: 'اولویت ستاد', align: 'center', field: 'staffPriority' },
  { name: 'actions', label: 'عملیات', align: 'center' },
  { name: 'status', label: 'وضعیت', align: 'center' },
  { name: 'details', label: 'جزئیات', align: 'center' },
]

const rows = ref([
  {
    id: 1,
    requester: 'حمید عرب‌نژاد',
    passenger: 'پروازه حیدری‌پور',
    stationPriority: '۱',
    staffPriority: 'بسیار زیاد',
    status: 'تایید شده',
  },
  {
    id: 2,
    requester: 'حمید عرب‌نژاد',
    passenger: 'پروازه حیدری‌پور',
    stationPriority: 'انتخاب نشده',
    staffPriority: 'بسیار زیاد',
    status: '-',
  },
  {
    id: 3,
    requester: 'حمید عرب‌نژاد',
    passenger: 'پروازه حیدری‌پور',
    stationPriority: '۲',
    staffPriority: 'بسیار زیاد',
    status: 'در انتظار صدور بلیت',
  },
  {
    id: 4,
    requester: 'حمید عرب‌نژاد',
    passenger: 'پروازه حیدری‌پور',
    stationPriority: '۳',
    staffPriority: 'بسیار زیاد',
    status: 'در انتظار صدور بلیت',
  },
  {
    id: 5,
    requester: 'حمید عرب‌نژاد',
    passenger: 'پروازه حیدری‌پور',
    stationPriority: '۳',
    staffPriority: 'بسیار زیاد',
    status: 'عدم مراجعه',
  },
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const showCapacityDialog = ref(false)
const capacity = ref({ economy: '', business: '' })
const showAddPassengerDialog = ref(false)
const newPassenger = ref({
  name: '',
  priority: '',
  birthDate: '',
  phone: '',
  passportNo: '',
  description: '',
})
const priorityOptions = [
  { label: 'کم', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'زیاد', value: 'high' },
  { label: 'بسیار زیاد', value: 'very_high' },
]

const showDetailsDialog = ref(false)
const selectedRow = ref({})

const stationPriorityOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: 'انتخاب نشده', value: 'انتخاب نشده' },
]

function approvePassenger(row) {
  row.status = 'تایید شده'
}
function rejectPassenger(row) {
  row.status = 'عدم مراجعه'
}
function onAddPassenger() {
  // ذخیره یا ارسال اطلاعات
  showAddPassengerDialog.value = false
}
function openDetailsDialog(row) {
  selectedRow.value = row
  showDetailsDialog.value = true
}
</script>

<style scoped>
.flight-container {
  max-width: 1100px;
  margin: 0 auto;
}
.q-header {
  border-radius: 0 0 8px 8px;
  margin-bottom: 16px;
}
.my-sticky-header-table thead tr th,
.my-sticky-header-table tbody tr td {
  text-align: center !important;
  font-size: 15px;
}
.my-sticky-header-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
}
.vertical-dashed {
  width: 2px;
  height: 120px;
  border-left: 2px dashed #cfd8dc;
}
.flight-route {
  position: relative;
  width: 100px;
  height: 24px;
  margin: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flight-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #cfd8dc;
  z-index: 1;
}

.flight-icon {
  position: relative;
  z-index: 2;
  background-color: white;
  padding: 0 4px;
}
</style>
