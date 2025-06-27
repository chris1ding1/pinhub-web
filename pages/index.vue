<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-3xl flex items-center justify-center">
      <h1 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {{ title }}
      </h1>
    </header>
    <main>
        <ul v-if="pins?.items?.length" role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            <li v-for="pin in pins.items" :key="pin.uid">
                {{ pin.content }}
                {{ pin.image_url }}
                {{ pin.audio_url }}
                {{ pin.uid }}
                <a :href="pin.url" rel="UGC nofollow noopener noreferrer">{{ pin.url }}</a>
            </li>
        </ul>
    </main>
  </div>
</template>
<script setup lang="ts">
const { usersPinsIndex } = usePins()
const config = useRuntimeConfig()
const title = config.public.appName

const page = ref(1)
const search = ref("")
/*
const { data: pins, refresh } = await usersPinsIndex(page.value, search.value)
console.log('rrr: ',pins.value)

const pinsIndexMore = async () => {
  page.value++
  await refresh()
}
pinsIndexMore()
*/
</script>
