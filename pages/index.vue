<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-3xl text-center items-center justify-center mt-14">
      <h1 class="text-5xl font-extrabold md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
        {{ title }}
      </h1>
      <p v-if="userPins?.data?.items?.length === 0" class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
        Pin Your Favorite Links, Notes, and Images Easily.
      </p>
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
