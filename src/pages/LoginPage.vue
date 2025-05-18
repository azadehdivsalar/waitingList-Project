<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="login-card q-pa-lg">
          <q-card-section class="text-center">
            <div class="text-h4 q-mb-md">ورود به سیستم</div>
            <q-avatar size="100px" class="q-mb-md">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="username"
                outlined
                label="نام کاربری"
                :rules="[(val) => !!val || 'نام کاربری الزامی است']"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="password"
                outlined
                type="password"
                label="رمز عبور"
                :rules="[(val) => !!val || 'رمز عبور الزامی است']"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div class="row q-mt-lg">
                <q-btn
                  label="ورود"
                  type="submit"
                  color="primary"
                  class="full-width"
                  size="lg"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center text-grey-8">
            <div class="text-caption">
              برای ورود به سیستم از نام کاربری و رمز عبور خود استفاده کنید
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async () => {
  loading.value = true

  try {
    // Here we'll implement the actual authentication logic
    if (username.value === 'Admin' && password.value === 'admin123') {
      await authStore.login({ username: username.value, role: 'admin' })
      router.push('/flights')
    } else if (username.value === 'StationMg' && password.value === 'station123') {
      await authStore.login({ username: username.value, role: 'station_manager' })
      router.push('/station-manager')
    } else {
      $q.notify({
        color: 'negative',
        message: 'نام کاربری یا رمز عبور اشتباه است',
        icon: 'error',
        position: 'top',
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    $q.notify({
      color: 'negative',
      message: 'خطا در ورود به سیستم',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-page {
  min-height: 100vh;
}
</style>
