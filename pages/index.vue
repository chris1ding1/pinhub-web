<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-7xl text-center pt-32">
      <h1 class="text-4xl font-medium tracking-tight text-gray-900">
        {{ title }}
      </h1>
      <h2 v-if="!loggedIn || userPins?.data?.items?.length === 0" class="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl pt-6">
        Easily bookmark your favorite links, notes and images.
      </h2>
      <div v-if="!loggedIn" class="mt-10 flex justify-center">
        <a class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" href="/login">Log In / Sign Up</a>
      </div>
    </header>
    <main>
        <PinsAppCreateModal />
        <ul v-if="userPins?.data?.items?.length" role="list" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 xl:gap-x-8 my-10">
            <li v-for="pin in userPins.data.items" :key="pin.id">
                <div
                    v-if="isImageOnly(pin)"
                >
                    <img :src="pin.image_url" class="rounded-lg pointer-events-none aspect-10/7 object-cover group-hover:opacity-75">
                </div>
                <div v-else class="border border-gray-200 rounded-2xl shadow-sm p-6">
                    <div class="flex items-start gap-4">
                        <div class="flex-1 min-w-0">
                            <p
                                class="truncate text-sm font-medium text-gray-900 line-clamp-3"
                            >
                                {{ pin.content || (pin.url ? pin.url : "") }}
                            </p>
                            <a
                                v-if="pin.url"
                                :href="pin.url"
                                :title="pin.url"
                                target="_blank"
                                rel="nofollow noopener"
                                class="truncate text-sm text-gray-500"
                            >
                                {{ pin.url_host }}
                            </a>
                        </div>
                        <div v-if="pin.image_url" class="flex-none w-full sm:w-1/2">
                            <img
                                v-if="pin.image_url"
                                :src="pin.image_url"
                                class="rounded-lg pointer-events-none aspect-10/7 object-cover group-hover:opacity-75"
                            >
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </main>
  </div>
</template>
<script setup lang="ts">
const { loggedIn } = useUserSession()

const config = useRuntimeConfig()
const title = config.public.appName

useHead({
  title: title,
})

const pinsParamPage = ref(1)
const pinsParamSearch = ref("")

const { data: userPins, pending, refresh, error } = await useFetch('/users/pins', {
  query: {
    page: pinsParamPage,
    search: pinsParamSearch,
  },
  $fetch: useNuxtApp().$api as typeof $fetch,
  server: false,
  default: () => ({ data: { items: [] } }),
  skip: () => !loggedIn.value
})

watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    refresh()
  } else {
    clear()
  }
})

const isImageOnly = (pin: any) => {
  return pin.image_url && !pin.content && !pin.url
}
</script>
