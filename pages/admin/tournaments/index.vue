<template>
  <div class="py-8">
<div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tournaments</h1>
      <Button @click="isDialogOpen = true" :disabled="isLoading">Create Tournament</Button>
    </div>
    
    <div class="space-y-4 mt-10">
      <div v-if="isLoading" class="text-center py-10">
        <div class="text-gray-500">Loading tournaments...</div>
      </div>
      <div v-else-if="tournaments && tournaments.length > 0">
        <div v-for="tournament in tournaments" :key="tournament._id" class="bg-gray-100 rounded-lg p-3">
          <div class="flex justify-between gap-4 items-center">
            <div class="col-span-1">
              <span class="text-gray-900 block text-center sm:text-left">{{ tournament.name }}</span>
            </div>
            <div class="col-span-1 text-center">
              <NuxtLink
                :to="`/admin/tournaments/${tournament._id}`"
                class="text-blue-600 hover:text-blue-800 inline-block"
              >
                Fixtures & Results
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