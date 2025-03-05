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
  _id?: string
  name: string
  owner: string
  logo: string
}

const props = defineProps<{
  isOpen: boolean
  team?: Team
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'save': [team: Team]
}>()

const isEditing = computed(() => !!props.team)
const dialogTitle = computed(() => isEditing.value ? 'Edit Team' : 'Add New Team')
const buttonText = computed(() => isEditing.value ? 'Update Team' : 'Create Team')

const teamData = ref<Team>({
  name: '',
  owner: '',
  logo: ''
})

watchEffect(() => {
  if (props.team) {
    teamData.value = { ...props.team }
  } else {
    teamData.value = { name: '', owner: '', logo: '' }
  }
})

const handleSave = () => {
  emit('save', teamData.value)
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => emit('update:isOpen', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          Fill in the details to {{ isEditing ? 'update' : 'create' }} the team.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <label for="team-name">Team Name</label>
          <input
            id="team-name"
            v-model="teamData.name"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter team name"
          />
        </div>
        <div class="grid gap-2">
          <label for="owner-name">Owner Name</label>
          <input
            id="owner-name"
            v-model="teamData.owner"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter owner name"
          />
        </div>
        <div class="grid gap-2">
          <label for="logo-url">Logo URL</label>
          <input
            id="logo-url"
            v-model="teamData.logo"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Enter logo URL"
          />
        </div>
      </div>
      <DialogFooter>
        <Button @click="handleSave">{{ buttonText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>