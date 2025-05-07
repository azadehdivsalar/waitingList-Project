<template>
  <q-page class="q-pa-md flight-page" dir="rtl">
    <!-- فیلترها -->
    <div class="q-mb-md row q-col-gutter-md ">
      <q-select
        outlined
        v-model="store.filters.origin"
        :options="cities"
        label="مبدا"
        class="col-3 "
        dense
      />
      <q-select
        outlined
        v-model="store.filters.destination"
        :options="cities"
        label="مقصد"
        class="col-3 "
        dense
      />

      <q-input
        outlined
        v-model="store.filters.flightNumber"
        label="شماره پرواز"
        class="col-3"
        dense
      />
      <div class="auto">
        <q-btn
          label="جستجو"
          @click="store.fetchFlights"
          icon="search"
          class="q-mr-sm button"
        />
        <q-btn
          flat
          label="پاک کردن فیلترها"
          color="Secondary"
          icon="clear"
          @click="store.clearFilters"
        />
      </div>
    </div>

    <!-- لیست پروازها -->
    <div class="flight-list">
      <FlightCard v-for="flight in store.flights" :key="flight.id" :flight="flight" />
    </div>
  </q-page>
</template>

<script setup>
import { useFlightStore } from 'src/stores/flightStore'
import FlightCard from 'src/components/FlightCard.vue'

const store = useFlightStore()
const cities = ['تهران', 'دبی', 'مشهد', 'اصفهان']
</script>
