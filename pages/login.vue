<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <form @submit="handleLoginFormSubmit">
      <input v-model="email" type="email" name="email" placeholder="Email" required maxlength="255">
      <button type="button" @click="handleAuthEmailSend">Send Code</button>
    </form>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const email = ref('')

async function handleAuthEmailSend() {
  const res = await $fetch('auth/email/send', {
    baseURL: apiBase,
    method: 'POST',
    body: {
      email: email.value,
    }
  })
  console.log(res)
}

async function handleLoginFormSubmit() {
  const res = await $fetch('/api/submit', {
    method: 'POST',
    body: {
      // My form data
    }
  })
}
</script>
