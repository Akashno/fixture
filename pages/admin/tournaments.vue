<template>
  <div class="p-6">
    <h1 class="text-sm font-bold mb-6">Tournaments</h1>
    <div class="space-y-4">
      <div v-for="tournament in tournaments" :key="tournament.id" class="border-b pb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <div class="col-span-1">
            <span class="text-gray-900 block text-center sm:text-left">{{ tournament.team1 }} vs {{ tournament.team2 }}</span>
          </div>
          <div class="col-span-1 text-center text-gray-600 text-sm">
            {{ tournament.startDate }} - {{ tournament.endDate }}
          </div>
          <div class="col-span-1 text-center sm:text-right">
            <NuxtLink
              :to="`/fixtures/${tournament.id}`"
              class="text-blue-600 hover:text-blue-800 inline-block"
            >
              Fixtures & Results
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tournaments = ref([
  {
    id: 1,
    team1: 'Zimbabwe',
    team2: 'Canada',
    team1Flag: '/flags/zw.png',
    team2Flag: '/flags/ca.png',
    startDate: 'Feb 20, 2025',
    endDate: 'Mar 01, 2025',
    hasSquads: false
  },
  {
    id: 2,
    team1: 'NZ Women',
    team2: 'SL Women',
    team1Flag: '/flags/nz.png',
    team2Flag: '/flags/sl.png',
    startDate: 'Mar 04, 2025',
    endDate: 'Mar 18, 2025',
    hasSquads: true
  }
]);
</script>