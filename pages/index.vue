<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-3xl flex items-center justify-center mt-14">
      <h1 class="text-5xl font-extrabold md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
        {{ title }}
      </h1>
    </header>
    <main>
        <PinsAppCreateModal />
        <ul v-if="userPins?.data?.items?.length" role="list" class="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 xl:gap-x-8 my-10">
            <li v-for="pin in userPins.data.items" :key="pin.id" class="h-full">
                <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-full">
                    <p class="mb-3 font-normal text-gray-500 line-clamp-3 overflow-hidden text-ellipsis">
                        {{ pin.content || (pin.url ? pin.url : "") }}
                    </p>
                    <a
                        v-if="pin.url"
                        :href="pin.url"
                        target="_blank"
                        rel="nofollow noopener"
                        class="inline-flex font-medium items-center text-blue-600 hover:underline"
                    >
                        Link
                        <svg class="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                        </svg>
                    </a>
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


const { userPinsIndex } = usePins()
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
</script>
