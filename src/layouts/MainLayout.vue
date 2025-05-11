<template>
  <q-layout view="lHh Lpr lFf">
    <AppHeader />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppHeader from 'components/AppHeader.vue'
</script>

<style>
.q-layout {
  background: #f5f5f5;
}
</style>
