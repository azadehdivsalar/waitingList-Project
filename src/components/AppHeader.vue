<template>
  <div class="header">
    <div class="header-content">
      <div class="logo">
        <span class="logo-text"> سامانه ثبت درخواست لیست انتظار </span>
      </div>
      <div class="user-info">
        <q-btn-dropdown flat class="user-button">
          <template v-slot:label>
            <q-avatar size="32px" color="primary" text-color="white">
              <q-icon name="person" />
            </q-avatar>
            <span class="user-name">{{ username }}</span>
          </template>

          <q-list>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section>
                <q-item-label>خروج</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="logout" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.user?.username || 'کاربر')

const onLogout = async () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-button:hover {
  background-color: #f5f5f5;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .header {
    padding: 8px 16px;
  }

  .logo-text {
    font-size: 16px;
  }

  .user-name {
    display: none;
  }
}
</style>
