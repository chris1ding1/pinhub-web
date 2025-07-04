<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-7xl text-center pt-32">
      <h1 class="text-4xl font-medium tracking-tight text-gray-900">
        <span class="md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{{ title }}</span>
      </h1>
      <h2 v-if="!loggedIn || userPins?.data?.items?.length === 0" class="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl pt-6">
        Easily bookmark
        <span class="relative whitespace-nowrap text-blue-600">
            <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
            <span class="relative">your favorite</span>
        </span>
        links, notes and images.
      </h2>
      <p v-if="!loggedIn" class="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Keep all your favorite finds organized and at your fingertips in one simple, powerful space.
      </p>
      <div v-if="!loggedIn" class="mt-10 flex justify-center">
        <a class="items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900" variant="solid" color="slate" href="/login">Log In / Sign Up</a>
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
