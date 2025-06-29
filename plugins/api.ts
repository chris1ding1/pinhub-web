export default defineNuxtPlugin((nuxtApp) => {
    const { session, clear: clearSession } = useUserSession()

    const api = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      onRequest({ request, options, error }) {
        if (session.value?.token) {
          options.headers.set('Authorization', `Bearer ${session.value?.token}`)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await clearSession()
          await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      }
    })

    return {
      provide: {
        api
      }
    }
  })
