<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MatchScore {
  runs: number
  wickets: number
  overs: number
}

const props = defineProps<{
  isOpen: boolean
  match: {
    _id: string
    round: number
    homeTeam: {
      name: string
      owner: string
      logo: string
    }
    awayTeam: {
      name: string
      owner: string
      logo: string
    }
    homeScore?: MatchScore
    awayScore?: MatchScore
  }
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'saveResult', matchId: string, homeScore: MatchScore, awayScore: MatchScore): void
}>()

const homeScore = ref<MatchScore>(props.match.homeScore || { runs: 0, wickets: 0, overs: 0 })
const awayScore = ref<MatchScore>(props.match.awayScore || { runs: 0, wickets: 0, overs: 0 })
const isLoading = ref(false)

const winner = computed(() => {
  if (homeScore.value.runs > awayScore.value.runs) {
    return props.match.homeTeam.name
  } else if (awayScore.value.runs > homeScore.value.runs) {
    return props.match.awayTeam.name
  }
  return  null
})

const runDifference = computed(() => {
  return Math.abs(homeScore.value.runs - awayScore.value.runs)
})

const validateOvers = (overs: number): boolean => {
  if (overs < 0) return false
  const [wholePart, decimalPart] = overs.toString().split('.')
  if (decimalPart && parseInt(decimalPart) >= 6) return false
  return true
}

const handleSubmit = async () => {
  if (homeScore.value.wickets > 10 || awayScore.value.wickets > 10) {
    return
  }

  if (!validateOvers(homeScore.value.overs) || !validateOvers(awayScore.value.overs)) {
    return
  }

  try {
    isLoading.value = true
    const { data } = await useFetch(`/api/matches/${props.match._id}/score`, {
      method: 'PUT',
      body: {
        homeScore: homeScore.value,
        awayScore: awayScore.value
      }
    })

    if (data.value) {
      emit('saveResult', props.match._id, homeScore.value, awayScore.value)
      emit('update:isOpen', false)
      refreshNuxtData('fixtures')
      refreshNuxtData('points')
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)" c>
    <DialogContent class="sm:max-w-[825px] py-10">
      <DialogHeader>
        <DialogTitle>Match Details</DialogTitle>
      </DialogHeader>
      <div class="py-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-start gap-x-3 flex-1">
            <img :src="match.homeTeam.logo" :alt="match.homeTeam.name" class="size-10 object-contain">
            <div>
              <p class="font-medium">{{ match.homeTeam.name }}</p>
              <p class="text-sm text-gray-600">{{ match.homeTeam.owner }}</p>
              <div class="mt-2 space-y-2">
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="homeScore.runs"
                    type="number"
                    min="0"
                    placeholder="Runs"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span class="text-gray-500">/</span>
                  <input
                    v-model.number="homeScore.wickets"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Wickets"
                    class="w-20 px-2 py-1 border rounded"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="homeScore.overs"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Overs"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span class="text-xs text-gray-500">overs</span>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4">
            <span class="text-sm font-medium">vs</span>
          </div>
          <div class="flex items-start gap-x-3 flex-1 justify-end text-start md:text-end">
            <img :src="match.awayTeam.logo" :alt="match.awayTeam.name" class="size-10  object-contain order-first md:order-last">
            <div>
              <p class="font-medium">{{ match.awayTeam.name }}</p>
              <p class="text-sm text-gray-600">{{ match.awayTeam.owner }}</p>
              <div class="mt-2 space-y-2">
                <div class="flex items-center gap-2 justify-end">
                  <input
                    v-model.number="awayScore.runs"
                    type="number"
                    min="0"
                    placeholder="Runs"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span class="text-gray-500">/</span>
                  <input
                    v-model.number="awayScore.wickets"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Wickets"
                    class="w-20 px-2 py-1 border rounded"
                  >
                </div>
                <div class="flex items-center gap-2 justify-end">
                  <input
                    v-model.number="awayScore.overs"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Overs"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span class="text-xs text-gray-500">overs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">Round {{ match.round }}</p>
          <div v-if="winner" class="mt-4 p-3" :class="winner === 'Draw' ? 'bg-gray-50' : 'bg-green-50'">
            <template v-if="winner === 'Draw'">
              <p class="font-medium text-gray-700">Match Drawn</p>
            </template>
            <template v-else >
                <img 
                  :src="winner === match.homeTeam.name ? match.homeTeam.logo : match.awayTeam.logo" 
                  :alt="winner"
                  class="size-8 object-contain mx-auto"
                >
              <div>
                  <p class="font-medium text-green-700 ">{{ winner }} won by {{ runDifference }} runs</p>
                  <p class="text-sm text-green-600">
                    Owner: {{ winner === match.homeTeam.name ? match.homeTeam.owner : match.awayTeam.owner }}
                  </p>
                </div>
            </template>
          </div>
        </div>
        <div class="mt-6 flex justify-center w-full md:justify-end">
          <Button :disabled="isLoading || !winner" @click="handleSubmit">
            {{ isLoading ? 'Saving...' : 'Save Result' }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>