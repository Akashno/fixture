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

const isDeleteDialogOpen = ref(false)

const { data: tournament } = useLazyAsyncData(
  'tournament',
  () => $fetch(`/api/tournaments/${route.params.id}`),
  {
    immediate: true,
    watch: [() => route.params.id]
  }
)

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


</script>

