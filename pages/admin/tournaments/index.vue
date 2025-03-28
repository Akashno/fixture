<template>
  <div class="py-8 px-4">
<div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tournaments</h1>
      <Button @click="isDialogOpen = true" :disabled="isLoading">Create Tournament</Button>
    </div>
    
    <div class="space-y-4 mt-10">
      <div v-if="isLoading" class="text-center py-10">
        <div class="text-gray-500">Loading tournaments...</div>
      </div>
      <div v-else-if="tournaments && tournaments.length > 0" class="grid gap-4">
        <div v-for="tournament in tournaments" :key="tournament._id" class="relative p-6 border rounded-lg shadow-sm group hover:shadow-md hover:border-gray-400 transition-all duration-200">
          <div class="flex flex-col space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ tournament.name }}</h3>
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" 
                      :class="{
                        'bg-green-100 text-green-800': tournament.status === 'active',
                        'bg-yellow-100 text-yellow-800': tournament.status === 'pending',
                        'bg-red-100 text-red-800': tournament.status === 'completed',
                        'bg-gray-100 text-gray-800': !tournament.status
                      }">
                  {{ tournament.status ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1) : 'Unknown' }}
                </span>
              </div>
              <div class="text-end">
                <p class="text-sm text-gray-500">{{ new Date(tournament.createdAt).toLocaleDateString() }}</p>
                <p class="text-sm text-gray-500">{{ new Date(tournament.createdAt).toLocaleTimeString() }}</p>
              </div>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{{ tournament.selectedTeams?.length || 0 }} Teams</span>
            </div>

            <div class="flex justify-end">
              <NuxtLink
                :to="`/admin/tournaments/${tournament._id}`"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <div class="text-gray-500 mb-4">No tournaments found</div>
        <Button @click="isDialogOpen = true" class="inline-flex items-center">
          <span class="mr-2">Create your first tournament</span>
          <span class="text-lg">+</span>
        </Button>
      </div>
    </div>

    <TournamentDialog
      v-model:isOpen="isDialogOpen"
      :teams="teams"
      @save="handleSaveTournament"
    />

    <Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tournament</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this tournament? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="deleteTournament"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const tournamentToDelete = ref(null)
const isLoading = ref(false)

const { data: teams } = await useLazyAsyncData('teams', () => $fetch('/api/teams'))
const { data: tournaments, pending } = await useLazyAsyncData('tournaments', () => $fetch('/api/tournaments'))

watchEffect(() => {
  isLoading.value = pending.value
})

const handleSaveTournament = async (tournament) => {
  try {
    await $fetch('/api/tournaments', {
      method: 'POST',
      body: tournament
    })
    
    await refreshNuxtData('tournaments')
    isDialogOpen.value = false
  } catch (error) {
    console.error('Failed to create tournament:', error)
  }
}

</script>