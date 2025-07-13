<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login in to your account</h1>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" method="POST">
        <div v-if="errorMsg">
            <p class="mt-2 text-sm text-red-600">
                {{ errorMsg }}
            </p>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="authEmailCodeForm.email" type="email" name="email" id="email" autocomplete="email" required maxlength="255" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            <p v-if="errorsFrom.email" class="mt-2 text-sm text-red-600" id="email-error">{{ errorsFrom.email }}</p>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="verify-code" class="block text-sm/6 font-medium text-gray-900">Verify Code</label>
            <div class="text-sm">
              <button
                @click="handleAuthEmailSend"
                type="button"
                :disabled="isSendCodeDisabled"
                :class="[
                  'font-semibold',
                  isSendCodeDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:text-indigo-500'
                ]"
              >
                Send verify code
              </button>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="authEmailCodeForm.verifyCode" type="text" name="verify-code" id="verify-code" autocomplete="current-password" required maxlength="6" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            <p v-if="errorsFrom.verifyCode" class="mt-2 text-sm text-red-600" id="verify-code-error">{{ errorsFrom.verifyCode }}</p>
          </div>
        </div>

        <div>
          <button
            type="button"
            :disabled="isLoginLoading"
            @click="handleLoginFormSubmit"
            :class="[
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              isLoginLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            ]"
          >
            {{ isLoginLoading ? 'Loading...' : 'Login in' }}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Continue with email. (No account? We'll create one.)
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as v from 'valibot';

const { loggedIn, fetch: refreshSession } = useUserSession()

if (loggedIn.value) {
  await navigateTo('/')
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

useHead({
  title: 'Login - ' + config.public.appName,
})

const errorMsg = ref('')

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

const errorsFrom = ref({
  email: '',
  verifyCode: '',
})

const isSendCodeDisabled = ref(false)
const sendCodeCountdown = ref(0)
const isLoginLoading = ref(false)
let sendCodeCountdownTimer: NodeJS.Timeout | null = null
const startCountdown = () => {
  sendCodeCountdown.value = 60
  isSendCodeDisabled.value = true

  sendCodeCountdownTimer = setInterval(() => {
    sendCodeCountdown.value--
    if (sendCodeCountdown.value <= 0) {
      clearInterval(sendCodeCountdownTimer!)
      sendCodeCountdownTimer = null
      isSendCodeDisabled.value = false
    }
  }, 1000)
}

const clearFormErrors = () => {
  errorsFrom.value = {
    email: '',
    verifyCode: '',
  }
}

type SendAuthEmailCodeData = v.InferOutput<typeof SendAuthEmailCodeSchema>
type AuthEmailCodeData = v.InferOutput<typeof AuthEmailCodeSchema>

async function handleAuthEmailSend() {
  isSendCodeDisabled.value = true
  clearFormErrors()
  errorMsg.value = ''

  let validatedData: SendAuthEmailCodeData

  try {
    validatedData = v.parse(SendAuthEmailCodeSchema,
      {
        email: authEmailCodeForm.email
      }
    )
  } catch (error) {
    if (error instanceof v.ValiError) {
      const emailError = error.issues.find(issue => issue.path?.[0].key === 'email');
      if (emailError) {
        errorsFrom.value.email = emailError.message;
      }
    }
    isSendCodeDisabled.value = false
    return
  }

  startCountdown()

  try {
    const res = await $fetch('auth/email/send', {
      baseURL: apiBase,
      method: 'POST',
      body: validatedData
    })

    if (res?.code !== 0) {
      errorMsg.value = 'Error.'
    }
  } catch (error) {
    errorMsg.value = 'Network error or server error.'
  }
}

async function handleLoginFormSubmit() {
  isLoginLoading.value = true
  clearFormErrors()
  errorMsg.value = ''

  let validatedData: AuthEmailCodeData

  try {
    validatedData = v.parse(AuthEmailCodeSchema, {
      email: authEmailCodeForm.email,
      verifyCode: authEmailCodeForm.verifyCode
    })
  } catch (error) {
    if (error instanceof v.ValiError) {
      const emailError = error.issues.find(issue => issue.path?.[0].key === 'email');
      if (emailError) {
        errorsFrom.value.email = emailError.message;
      }
      const verifyCodeError = error.issues.find(issue => issue.path?.[0].key === 'verifyCode');
      if (verifyCodeError) {
        errorsFrom.value.verifyCode = verifyCodeError.message;
      }
    }
    isLoginLoading.value = false
    return
  }

  $fetch('/api/auth/email-verify', {
    method: 'POST',
    body: validatedData
  })
  .then(async () => {
    await refreshSession()
    await navigateTo('/')
  })
  .catch(() => {
    errorMsg.value = 'Network error or server error.'
  })
  .finally(() => {
    isLoginLoading.value = false
  })
}

onUnmounted(() => {
  if (sendCodeCountdownTimer) {
    clearInterval(sendCodeCountdownTimer)
    sendCodeCountdownTimer = null
  }
})
</script>
