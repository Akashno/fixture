<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">fixture</NuxtLink>
        </div>
        <div class="flex items-center space-x-8">
          <NuxtLink
            to="/admin/tournaments"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Tournaments
          </NuxtLink>
          <NuxtLink
            to="/teams"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Teams
          </NuxtLink>
          <NuxtLink
            to="/owners"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
          >
            Owners
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>