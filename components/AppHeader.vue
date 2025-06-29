<template>
  <div>
    Header
    <button @click="logout">Logout</button>
  </div>
</template>
<script setup lang="ts">
const { loggedIn, user, clear: clearSession } = useUserSession()

async function logout() {
  await clearSession()
}
</script>
