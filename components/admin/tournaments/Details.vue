<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()
const { data: tournament } = await useFetch(`/api/tournaments/${route.params.id}`)
const { data: fixtures } = await useLazyAsyncData('fixtures', () => 
  $fetch(`/api/tournaments/${route.params.id}/fixtures`).then(res => res.data)
)

const isGenerating = ref(false)
const generateFixtures = async () => {
  isGenerating.value = true
  try {
    await $fetch(`/api/tournaments/${route.params.id}/fixtures`, {
      method: 'POST'
    })
    refreshNuxtData('tournament')
    refreshNuxtData('fixtures')
  } catch (error) {
    console.error('Failed to generate fixtures:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="container mx-auto py-6">
    <div v-if="tournament" class="space-y-6">
      <Tabs defaultValue="points" class="w-full">
        <TabsList>
          <TabsTrigger value="points">Points Table</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
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
                  <th class="py-2 text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in tournament.selectedTeams" :key="team._id" class="border-b">
                  <td class="py-2 flex items-center gap-x-2">
                    <div>
                      <img :src="team.logo" alt="" class="size-10 object-contain">
                    </div>
                    <div>
                      <p>{{ team.name }}</p>
                      <p class="text-sm text-gray-800">{{ team.owner }}</p>
                    </div>
                  </td>
                  <td class="py-2 text-center">0</td>
                  <td class="py-2 text-center">0</td>
                  <td class="py-2 text-center">0</td>
                  <td class="py-2 text-center">0</td>
                  <td class="py-2 text-center">0</td>
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
                <div class="border rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-x-3 flex-1">
                      <img :src="match.homeTeam.logo" :alt="match.homeTeam.name" class="size-10 object-contain">
                      <div>
                        <p class="font-medium">{{ match.homeTeam.name }}</p>
                        <p class="text-sm text-gray-600">{{ match.homeTeam.owner }}</p>
                      </div>
                    </div>
                    <div class="px-4">
                      <span class="text-sm font-medium">vs</span>
                    </div>
                    <div class="flex items-center gap-x-3 flex-1 justify-end text-right">
                      <div>
                        <p class="font-medium">{{ match.awayTeam.name }}</p>
                        <p class="text-sm text-gray-600">{{ match.awayTeam.owner }}</p>
                      </div>
                      <img :src="match.awayTeam.logo" :alt="match.awayTeam.name" class="size-10 object-contain">
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <p v-else class="text-center text-gray-500">

<Button @click="generateFixtures" size="sm" :loading="isGenerating" v-if="!tournament?.matches?.length" >
            Generate Fixtures
        </Button>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <div v-else class="text-center py-10">
      <p>Loading tournament details...</p>
    </div>
  </div>
</template>
