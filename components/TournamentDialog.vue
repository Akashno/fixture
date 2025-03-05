<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Tournament {
  name: string
  selectedTeams: string[]
}

const props = defineProps<{
  isOpen: boolean
  teams: any[]
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  save: [tournament: Tournament]
}>()

const tournament = ref<Tournament>({
  name: '',
  selectedTeams: []
})

const handleSave = () => {
  emit('save', tournament.value)
  tournament.value = {
    name: '',
    selectedTeams: []
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Create Tournament</DialogTitle>
        <DialogDescription>
          Add a new tournament with selected teams.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label class="text-left">Name</label>
          <input
            v-model="tournament.name"
            class="col-span-4 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            placeholder="Tournament name"
          />
        </div>
        <div class="grid gap-4">
          <label class="text-sm font-medium">Select Teams</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
            <div
              v-for="team in teams"
              :key="team._id"
              class="relative border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
              :class="{ 'border-primary bg-primary/5': tournament.selectedTeams.includes(team._id) }"
              @click="
                tournament.selectedTeams = tournament.selectedTeams.includes(team._id)
                  ? tournament.selectedTeams.filter(id => id !== team._id)
                  : [...tournament.selectedTeams, team._id]
              "
            >
              <input
                type="checkbox"
                :checked="tournament.selectedTeams.includes(team._id)"
                class="absolute top-2 right-2"
                @click.stop
              >

                <img
                  :src="team.logo"
                  :alt="team.name"
                  class="w-4 h-4 md:size-12 object-contain rounded-full"
                >
              <div class="flex items-center gap-3">
                <div>
                  <h3 class="font-medium text-sm">{{ team.name }}</h3>
                  <p class="text-sm text-gray-500">{{ team.owner }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

<span class="text-sm text-gray-500">Selected Teams: {{ tournament.selectedTeams.length }}</span>
      <DialogFooter>
        <Button @click="handleSave">Create Tournament</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>