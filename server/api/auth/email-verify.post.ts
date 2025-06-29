export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const response = await $fetch('auth/email/verify', {
      baseURL: apiBase,
      method: 'POST',
      body: body
  })

  if (response?.code === 0) {
    await setUserSession(event, {
        user: {
          id: response.data.id,
          username: response.data.username,
          name: response.data.name,
          email: response.data.email,
          avatar_path: response.data.avatar_path,
          bio: response.data.bio,
          locale: response.data.locale,
          timezone: response.data.timezone,
        },
        token: response.data.token,
    })

    return {}
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'
  })
})
