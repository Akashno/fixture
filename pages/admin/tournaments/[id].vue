<template>
  <div class="p-6">
    <div v-if="tournament" class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ tournament.name }}</h1>
          <p class="text-sm text-gray-500">Created {{ new Date(tournament.createdAt).toLocaleDateString() }}</p>
        </div>
        <div class="flex items-center gap-x-2">

        <Button variant="outline" size="sm" @click="confirmDelete(tournament)">
          <Icon name="lucide:trash" class="mr-2" />
          Delete Tournament
        </Button>
        <Button @click="generateFixtures" size="sm" >
            Generate Fixtures
        </Button>
        </div>
<!-- Delete Confirmation Dialog -->
<Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Tournament</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this tournament? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" @click="isDeleteDialogOpen = false">Cancel</Button>
      <Button variant="destructive" @click="handleDelete">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>

      
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading tournament details...</p>
    </div>
    <AdminTournamentsDetails/>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const tournament = ref(null)
const isDeleteDialogOpen = ref(false)
const isGenerating = ref(false)

async function fetchTournament() {
  try {
    const { data } = await useFetch(`/api/tournaments/${route.params.id}`)
    tournament.value = data.value
  } catch (error) {
    console.error('Error fetching tournament:', error)
  }
}

const confirmDelete = () => {
  isDeleteDialogOpen.value = true
}

const handleDelete = async () => {
  try {
    await $fetch(`/api/tournaments/${route.params.id}`, {
      method: 'DELETE'
    })
    router.push('/admin/tournaments')
  } catch (error) {
    console.error('Failed to delete tournament:', error)
  }
}

const generateFixtures = async () => {
  isGenerating.value = true
  try {
    await $fetch(`/api/tournaments/${route.params.id}/fixtures`, {
      method: 'POST'
    })
    await fetchTournament()
  } catch (error) {
    console.error('Failed to generate fixtures:', error)
  } finally {
    isGenerating.value = false
  }
}

onMounted(() => {
  fetchTournament()
})
</script>

