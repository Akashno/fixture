<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MatchDialog from '@/components/MatchDialog.vue'

const route = useRoute()
const { data: tournament } = await useFetch(`/api/tournaments/${route.params.id}`)
const { data: fixtures } = await useLazyAsyncData('fixtures', () => 
  $fetch(`/api/tournaments/${route.params.id}/fixtures`).then(res => res.data)
)
const { data: points } = await useLazyAsyncData('points', () =>
  $fetch(`/api/tournaments/${route.params.id}/points`).then(res => res.data)
)

const isGenerating = ref(false)
const generateFixtures = async () => {
  isGenerating.value = true
  try {
    await $fetch(`/api/tournaments/${route.params.id}/fixtures`, {
      method: 'POST'
    })
    refreshNuxtData('tournaments')
    refreshNuxtData('fixtures')
  } catch (error) {
    console.error('Failed to generate fixtures:', error)
  } finally {
    isGenerating.value = false
  }
}

const selectedMatch = ref(null)
const isMatchDialogOpen = ref(false)

const handleMatchClick = (match) => {
  selectedMatch.value = match
  isMatchDialogOpen.value = true
}
</script>

<template>
  <div class="container mx-auto py-6">
    <div v-if="tournament" class="space-y-6">
      <Tabs defaultValue="fixtures" class="w-full">
        <TabsList>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="points">Points Table</TabsTrigger>
        </TabsList>
        <TabsContent value="points">
          <div class="rounded-lg border p-4">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="py-2 text-left">Team</th>
                  <th class="py-2 text-center">P</th>
                  <th class="py-2 text-center">W</th>
                  <th class="py-2 text-center">D</th>
                  <th class="py-2 text-center">L</th>
                  <th class="py-2 text-center">NRR</th>
                  <th class="py-2 text-center">Total Runs / Conceded</th>
                  <th class="py-2 text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="point in points" :key="point?._id" class="border-b">
                  <td class="py-2 flex items-center gap-x-2">
                    <div>
                      <img :src="point?.team.logo" alt="" class="size-10 object-contain">
                    </div>
                    <div>
                      <p>{{ point?.team.name }}</p>
                      <p class="text-sm text-gray-800">{{ point?.team.owner }}</p>
                    </div>
                  </td>
                  <td class="py-2 text-center">{{ point.matchesPlayed }}</td>
                  <td class="py-2 text-center">{{ point.matchesWon }}</td>
                  <td class="py-2 text-center">{{ point.matchesDrawn }}</td>
                  <td class="py-2 text-center">{{ point.matchesLost }}</td>

                  <td class="py-2 text-center" >{{ point.runsScored ?  ((point.runsScored / point.oversFaced) - (point.runsConceded / point.oversBowled))?.toFixed(2) : 0 }}</td>
                  <td class="py-2 text-center">{{ point.runsScored }} : {{point.runsConceded}}</td>
                  <td class="py-2 text-center">{{ point.points }}</td>

                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="fixtures">
          <div class="rounded-lg border p-4">
            <div v-if="fixtures && fixtures.length > 0" class="space-y-4">
              <template v-for="(match, index) in fixtures" :key="match._id" class="bg">
                <hr v-if="index !== 0 && fixtures[index - 1].round !== match.round" class="my-8">
                <h2 v-if="fixtures[index - 1]?.round !== match?.round" class="text-2xl font-bold text-gray-800 mb-4">Round {{ match?.round }}</h2>
                <div class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50" @click="handleMatchClick(match)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-x-3 flex-1">
                      <img :src="match.homeTeam.logo" :alt="match.homeTeam.name" class="size-10 object-contain">
                      <div>
                        <p class="font-medium">{{ match.homeTeam.name }}</p>
                        <p class="text-sm text-gray-600">{{ match.homeTeam.owner }}</p>
                        <p v-if="match.homeScore" class="text-sm font-medium text-gray-800">
                          {{ match.homeScore.runs }}/{{ match.homeScore.wickets }} 
                          ({{ match.homeScore.overs }} ov)
                        </p>
                      </div>
                    </div>
                    <div class="px-4">
                      <div v-if="match.winner" class="mt-2 text-sm text-center text-green-600">
                        <span>
                          Winner: {{ match.winner === match.homeTeam._id ? `${match.homeTeam.name} (${match.homeTeam.owner})` : `${match.awayTeam.name} (${match.awayTeam.owner})` }}
                        </span>
                      </div>
                      <div v-else-if="match.homeScore && match.awayScore" class="mt-2 text-sm text-center text-gray-600">
                        <span>Match Drawn</span>
                      </div>
                      <span v-else class="text-sm font-medium">vs</span>
                    </div>
                    <div class="flex items-center gap-x-3 flex-1 justify-end text-right">
                      <div>
                        <p class="font-medium">{{ match.awayTeam.name }}</p>
                        <p class="text-sm text-gray-600">{{ match.awayTeam.owner }}</p>
                        <p v-if="match.awayScore" class="text-sm font-medium text-gray-800">
                          {{ match.awayScore.runs }}/{{ match.awayScore.wickets }}
                          ({{ match.awayScore.overs }} ov)
                        </p>
                      </div>
                      <img :src="match.awayTeam.logo" :alt="match.awayTeam.name" class="size-10 object-contain">
                    </div>
                  </div>
                  
                  
                </div>
              </template>
            </div>
            <p v-else class="text-center text-gray-500">
              <Button @click="generateFixtures" size="sm" :loading="isGenerating" v-if="!tournament?.matches?.length">
                Generate Fixtures
              </Button>
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <MatchDialog
        :key="selectedMatch._id"
        
        v-if="selectedMatch"
        v-model:isOpen="isMatchDialogOpen"
        :match="selectedMatch"
      />
    </div>
    <div v-else class="text-center py-10">
      <p>Loading tournament details...</p>
    </div>
  </div>
</template>
