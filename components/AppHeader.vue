<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex flex-1 justify-end">
        <div v-if="isShowLogin" >
          <a href="/login" class="rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">Log in <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div v-if="loggedIn" class="space-x-4">
          <span class="text-sm/6 font-semibold text-gray-900">{{ user.name }}</span>
          <button @click="logout" class="text-sm/6 font-semibold text-gray-900">Logout</button>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
const { loggedIn, user, clear: clearSession } = useUserSession()
const route = useRoute()

const isShowLogin = computed(() => {
  return !loggedIn.value && route.path !== '/login'
})

async function logout() {
  await clearSession()
  await navigateTo('/')
}
</script>
