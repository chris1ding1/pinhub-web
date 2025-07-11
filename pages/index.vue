<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="mx-auto max-w-7xl text-center pt-32">
      <h1 class="text-4xl font-medium tracking-tight text-gray-900">
        <span class="md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{{ title }}</span>
      </h1>
      <div class="mx-auto max-w-3xl">
        <AppSearch />
      </div>
      <h2 v-if="!loggedIn || userPins?.data?.items?.length === 0" class="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl pt-6">
        Easily save
        <span class="relative whitespace-nowrap text-blue-600">
            <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
            <span class="relative">your favorite</span>
        </span>
        URLs, images, notes, and voice memos.
      </h2>
      <p v-if="!loggedIn" class="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Keep all your favorite finds organized and at your fingertips in one simple, powerful space.
      </p>
      <div v-if="!loggedIn" class="mt-10 flex justify-center">
        <a class="items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900" variant="solid" color="slate" href="/login">Log In / Sign Up</a>
      </div>
    </header>
    <main>
        <PinsAppCreateModal v-if="loggedIn" @pin-created="handlePinCreated"/>
        <ul v-if="userPins?.data?.items?.length" role="list" class="columns-2 sm:columns-3 lg:columns-4 gap-x-6 xl:gap-x-8 mt-10 mb-30">
            <li
                v-for="pin in userPins.data.items"
                :key="pin.id"
                class="mb-8 break-inside-avoid"
            >
                <div :class="[
                    'relative',
                    isImageOnly(pin)? '': 'border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3',
                    ]">
                    <Menu as="div" class="absolute top-2 right-2 z-10 flex justify-end">
                        <MenuButton class="relative block text-gray-600 hover:text-gray-700">
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Open options</span>
                            <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />
                        </MenuButton>
                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <MenuItems class="absolute right-0 z-10 mt-5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden">
                            <MenuItem v-slot="{ active }">
                                <button
                                    @click="deletePin(pin.id)"
                                    type="button"
                                    :disabled="deletingPins.has(pin.id)"
                                    :class="[
                                    'text-red-600 w-full text-left',
                                    deletingPins.has(pin.id) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600',
                                    active ? 'bg-gray-50 outline-hidden' : '', 'block px-3 py-1 text-sm/6'
                                    ]"
                                >
                                    {{ deletingPins.has(pin.id) ? 'Delete...' : 'Delete' }}
                                </button>
                            </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                    <img
                        v-if="pin.image_url"
                        :src="pin.image_url"
                        @click="openImageModal(pin.image_url)"
                        class="rounded-lg aspect-10/7 object-cover group-hover:opacity-75"
                    >
                    <p
                        class="text-sm font-medium text-gray-900 line-clamp-3 break-words"
                    >
                        {{ pin.content || (pin.url ? pin.url : "") }}
                    </p>
                    <audio
                        v-if="pin.audio_url"
                        :src="pin.audio_url"
                        controls
                        class="w-full rounded"
                    />
                    <a
                        v-if="pin.url"
                        :href="pin.url"
                        :title="pin.url"
                        target="_blank"
                        rel="nofollow noopener"
                        class="block truncate text-sm text-gray-500"
                    >
                        {{ pin.url_host }}
                    </a>
                </div>
            </li>
        </ul>
    </main>
    <TransitionRoot appear :show="isImageModalOpen" as="template">
        <Dialog as="div" :open="isImageModalOpen" @close="closeImageModal" class="relative z-20">
            <button class="sr-only" @click="closeImageModal">Close</button>
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="w-full max-w-2xl transform overflow-hidden text-center align-middle transition-all flex items-center justify-center sm:p-6">
                            <div>
                                <img
                                    v-if="selectedImage"
                                    :src="selectedImage"

                                    class="max-w-full max-h-full object-contain"
                                >
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel,  TransitionRoot, TransitionChild } from '@headlessui/vue'
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/vue/20/solid'

const { loggedIn } = useUserSession()

const config = useRuntimeConfig()
const title = config.public.appName

useHead({
  title: title,
})

const pinsParamPage = ref(1)
const pinsParamSearch = ref("")
const userPins = ref({ data: { items: [] } })

const getUserPins = async () => {
  if (!loggedIn.value) {
    userPins.value = { data: { items: [] } }
    return
  }

  const response = await useNuxtApp().$api('/users/pins', {
      query: {
        page: pinsParamPage.value,
        search: pinsParamSearch.value,
      }
    })

  userPins.value = response
}

const deletingPins = ref(new Set<string>())
const deletePin = async (pinId: string) => {
  if (deletingPins.value.has(pinId)) {
    return
  }
  try {
    const response = await useNuxtApp().$api(`/pins/${pinId}`, {
        method: 'DELETE',
    })
    if (response.code !== 0) {
        return false
    }
    userPins.value.data.items = userPins.value.data.items.filter(pin => pin.id !== pinId)
  } catch (error) {
    return false
  } finally {
    deletingPins.value.delete(pinId)
  }
}

const clearUserPins = () => {
  userPins.value = { data: { items: [] } }
}

watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    getUserPins()
  } else {
    clearUserPins()
  }
})

onMounted(() => {
  if (loggedIn.value) {
    getUserPins()
  }
})

const isImageOnly = (pin: any) => {
  return pin.image_url && !pin.content && !pin.url
}

const handlePinCreated = (newPin: any) => {
  userPins.value.data.items.push(newPin)
}

const isImageModalOpen = ref(false)
const selectedImage = ref<string | null>(null)

const openImageModal = (imageUrl: string) => {
  isImageModalOpen.value = true
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  isImageModalOpen.value = false
  selectedImage.value = null
}
</script>
