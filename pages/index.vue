<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-3xl flex items-center justify-center">
      <h1 class="text-3xl font-extrabold md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
        {{ title }}
      </h1>
    </header>
    <main>
        <PinsAppCreateModal />
        <ul v-if="userPins?.data?.items?.length" role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            <li v-for="pin in userPins.data.items" :key="pin.id">
                {{ pin.content }}
                {{ pin.image_url }}
                {{ pin.audio_url }}
                {{ pin.id }}
                <a :href="pin.url" rel="nofollow noopener">{{ pin.url }}</a>
            </li>
        </ul>
    </main>
  </div>
</template>
<script setup lang="ts">
const { loggedIn } = useUserSession()

const config = useRuntimeConfig()
const title = config.public.appName

const userPins = ref({})
const { userPinsIndex } = usePins()
const pinsParamPage = ref(1)
const pinsParamSearch = ref("")

watch(loggedIn, async (newLoggedIn, oldLoggedIn) => {
  if (newLoggedIn) {
    userPins.value = await userPinsIndex(1, '', {
      server: false,
      lazy: true
    })
  } else {
    userPins.value = null
  }
}, { immediate: true })
</script>
