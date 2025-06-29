<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <form method="POST">
      <input v-model="authEmailCodeForm.email" type="email" name="email" placeholder="Email" required maxlength="255">
      <input v-model="authEmailCodeForm.verifyCode" type="text" name="verify-code" placeholder="Verify Code" required maxlength="6">
      <button type="button" @click="handleAuthEmailSend">Send Code</button>
      <button type="button" @click="handleLoginFormSubmit">Login</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import * as v from 'valibot';

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string


const authEmailCodeForm = reactive({
  email: '',
  verifyCode: '',
})

const emailValidation = v.pipe(
  v.string('Your email must be a string.'),
  v.nonEmpty('Please enter your email.'),
  v.maxLength(255),
  v.email('The email address is badly formatted.'),
)

const verifyCodeValidation = v.pipe(
  v.string(),
  v.nonEmpty('Please enter verify code.'),
)

const SendAuthEmailCodeSchema = v.object({
  email: emailValidation
})

const AuthEmailCodeSchema = v.object({
  email: emailValidation,
  verifyCode: verifyCodeValidation
})

type SendAuthEmailCodeData = v.InferOutput<typeof SendAuthEmailCodeSchema>
type AuthEmailCodeData = v.InferOutput<typeof AuthEmailCodeSchema>

async function handleAuthEmailSend() {
  try {
    const validatedData = v.parse(SendAuthEmailCodeSchema, {
      email: authEmailCodeForm.email
    })

    const res = await $fetch('auth/email/send', {
      baseURL: apiBase,
      method: 'POST',
      body: validatedData
    })
    console.log(res)
  } catch (error) {
    console.log(error);
  }
}

async function handleLoginFormSubmit() {
  try {
    const validatedData = v.parse(AuthEmailCodeSchema, {
      email: authEmailCodeForm.email,
      verifyCode: authEmailCodeForm.verifyCode
    })

    const res = await $fetch('auth/email/verify', {
      baseURL: apiBase,
      method: 'POST',
      body: validatedData
    })
    console.log(res)
  } catch (error) {
    console.log(error);
  }
}
</script>
