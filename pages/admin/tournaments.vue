<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-sm font-bold">Tournaments</h1>
      <Button @click="isDialogOpen = true">Create Tournament</Button>
    </div>
    <div class="space-y-4">
      <div v-for="tournament in tournaments" :key="tournament._id" class="border-b pb-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div class="col-span-1">
            <span class="text-gray-900 block text-center sm:text-left">{{ tournament.name }}</span>
          </div>
          <div class="col-span-1 text-center">
            <NuxtLink
              :to="`/fixtures/${tournament._id}`"
              class="text-blue-600 hover:text-blue-800 inline-block"
            >
              Fixtures & Results
            </NuxtLink>
          </div>
          <div class="col-span-1 text-right">
            <Button
              variant="outline"
              size="sm"
              @click="confirmDelete(tournament)"
            >
            <Icon name="lucide:trash"/>
            </Button>
          </div>
        </div>
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

const { data: teams } = await useLazyAsyncData('teams', () => $fetch('/api/teams'))
const { data: tournaments } = await useLazyAsyncData('tournaments', () => $fetch('/api/tournaments'))

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

const confirmDelete = (tournament) => {
  tournamentToDelete.value = tournament
  isDeleteDialogOpen.value = true
}

const deleteTournament = async () => {
  if (tournamentToDelete.value) {
    try {
      await $fetch(`/api/tournaments/${tournamentToDelete.value._id}`, {
        method: 'DELETE'
      })
      await refreshNuxtData('tournaments')
      isDeleteDialogOpen.value = false
      tournamentToDelete.value = null
    } catch (error) {
      console.error('Failed to delete tournament:', error)
    }
  }
}
</script>