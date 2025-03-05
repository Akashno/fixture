<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Team {
  _id: string  // Add this line
  name: string
  owner: string
  logo: string
}


const { data: teams, error } = await useLazyAsyncData('teams', () => $fetch('/api/teams'))


const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const teamToDelete = ref<Team | null>(null)
const newTeam = ref<Team>({
  name: '',
  owner: '',
  logo: ''
})

const addTeam = async () => {
  try {
    await $fetch('/api/teams', {
      method: 'POST',
      body: newTeam.value
    })
    
    teams.value.push({ ...newTeam.value })
    newTeam.value = { name: '', owner: '', logo: '' }
    isDialogOpen.value = false
  } catch (error: any) {
    console.error('Failed to create team:', error)
    // Here you might want to add error handling UI feedback
  }
}

const confirmDelete = (team: Team) => {
  teamToDelete.value = team
  isDeleteDialogOpen.value = true
}

const deleteTeam = async () => {
  if (teamToDelete.value) {
    try {
      await $fetch(`/api/teams/${teamToDelete.value._id}`, {
        method: 'DELETE'
      })
      const index = teams.value.findIndex(t => t._id === teamToDelete.value?._id)
      if (index !== -1) {
        teams.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to delete team:', error)
    }
  }
  isDeleteDialogOpen.value = false
  teamToDelete.value = null
}

const selectedTeam = ref<Team | undefined>()

const handleTeamSave = async (team: Team) => {
  try {
    if (team._id) {
      // Update existing team
      const response = await $fetch(`/api/teams/${team._id}`, {
        method: 'PUT',
        body: team
      })
      const index = teams.value.findIndex(t => t._id === team._id)
      if (index !== -1) {
        teams.value[index] = response.data
      }
    } else {
      // Create new team
      const response = await $fetch('/api/teams', {
        method: 'POST',
        body: team
      })
      teams.value.push(response.data)
    }
    isDialogOpen.value = false
    selectedTeam.value = undefined
  } catch (error) {
    console.error('Failed to save team:', error)
  }
}

const editTeam = (team: Team) => {
  selectedTeam.value = { ...team }
  isDialogOpen.value = true
}
</script>

<template>
  <div class="container py-8 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Teams</h1>
      <Button @click="isDialogOpen = true">Add Team</Button>
    </div>

    <TeamDialog
      v-model:isOpen="isDialogOpen"
      :team="selectedTeam"
      @save="handleTeamSave"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="team in teams"
        :key="team._id"
        class="relative p-6 border rounded-lg shadow-sm group hover:shadow-md hover:border-gray-400 transition-all duration-200"
      >
        <div class="flex items-center gap-4">
          <img
            :src="team.logo"
            :alt="`${team.name} logo`"
            class="w-16 h-16 object-contain rounded-full"
          />
          <div>
            <h3 class="font-semibold text-lg">{{ team.name }}</h3>
            <p class="text-sm text-gray-600">Owner: {{ team.owner }}</p>
          </div>
        </div>
        <div class="absolute top-2 right-16 w-8 h-8 opacity-0 group-hover:opacity-100 flex gap-x-1">
          <Button
            variant="ghost"
            @click="editTeam(team)"
          >
            ✎
          </Button>
        <Button
          class=""
          variant="ghost" 
          @click="confirmDelete(team)"
        >
          ✕
        </Button>
        
          
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {{ teamToDelete?.name }}? This action cannot be undone.
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
            @click="deleteTeam"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
